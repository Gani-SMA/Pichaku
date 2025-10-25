import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Scale, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useRateLimit } from "@/hooks/use-rate-limit";
import { sanitizeInput } from "@/lib/security";
import { validateResponse, needsRegeneration, logValidation } from "@/utils/responseValidator";
import {
  analyzeComplexity,
  getLawyerRecommendation,
  isEmergency,
} from "@/utils/complexityDetector";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { QuickQuestions } from "@/components/chat/QuickQuestions";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const Chat = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { isAllowed, getRemainingRequests } = useRateLimit(10, 60000); // 10 requests per minute
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your ENACT legal assistant. I'm here to help you understand your legal rights and guide you through the justice system. What legal issue can I help you with today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const quickQuestions = [
    "How do I file an FIR?",
    "What documents do I need for court?",
    "Can I get free legal aid?",
    "How long does a case take?",
  ];

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use the chat assistant.",
      });
      navigate("/auth");
    }
  }, [user, authLoading, navigate, toast]);

  // Create or load conversation
  useEffect(() => {
    const initConversation = async () => {
      if (!user) return;

      try {
        // Create new conversation
        const { data, error } = await supabase
          .from("conversations")
          .insert({
            user_id: user.id,
            title: "New Legal Consultation",
          })
          .select()
          .single();

        if (error) {
          console.error("Error creating conversation:", error);

          // Provide more specific error messages
          let errorMessage = "Failed to start conversation. ";

          if (error.code === "42P01") {
            errorMessage += "Database tables not found. Please run migrations.";
          } else if (error.code === "42501") {
            errorMessage += "Permission denied. Please check RLS policies.";
          } else if (error.message.includes("JWT")) {
            errorMessage += "Authentication error. Please sign in again.";
          } else {
            errorMessage += "Please refresh and try again.";
          }

          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
          return;
        }

        if (data) {
          setConversationId(data.id);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please refresh.",
          variant: "destructive",
        });
      }
    };

    initConversation();
  }, [user, toast]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Save message to database
  const saveMessage = async (role: "user" | "assistant", content: string) => {
    if (!conversationId) return;

    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      role,
      content,
    });

    if (error) {
      console.error("Error saving message:", error);
    }
  };

  const streamChat = async (userMessages: Message[], userQuery: string) => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/legal-chat`;

    // Analyze complexity for lawyer recommendation
    const complexityAnalysis = analyzeComplexity(userQuery);

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: userMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!resp.ok) {
        if (resp.status === 429) {
          toast({
            title: "Rate Limit Exceeded",
            description: "Too many requests. Please try again in a moment.",
            variant: "destructive",
          });
          return;
        }
        if (resp.status === 402) {
          toast({
            title: "Service Unavailable",
            description: "AI service requires additional credits. Please contact support.",
            variant: "destructive",
          });
          return;
        }
        throw new Error("Failed to start chat stream");
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;
      let assistantContent = "";

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            // Gemini API format: candidates[0].content.parts[0].text
            const content = parsed.candidates?.[0]?.content?.parts?.[0]?.text as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && last.id === "streaming") {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  );
                }
                return [
                  ...prev,
                  {
                    id: "streaming",
                    role: "assistant",
                    content: assistantContent,
                    timestamp: new Date(),
                  },
                ];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Validate response quality
      const validation = validateResponse(assistantContent);
      logValidation(conversationId || "unknown", validation);

      // Add lawyer recommendation if case is complex
      const lawyerRec = getLawyerRecommendation(complexityAnalysis);
      const finalContent = lawyerRec ? assistantContent + lawyerRec : assistantContent;

      // Finalize the streaming message with a proper ID and save to database
      setMessages((prev) => {
        return prev.map((m) =>
          m.id === "streaming" ? { ...m, id: Date.now().toString(), content: finalContent } : m
        );
      });

      // Save assistant response to database
      if (finalContent) {
        await saveMessage("assistant", finalContent);
      }

      // Show warning if response quality is low
      if (!validation.isValid && needsRegeneration(validation)) {
        toast({
          title: "Response Quality Notice",
          description: "The AI response may need improvement. Please verify the information.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Chat error:", error);

      let errorMessage = "Failed to get response. ";

      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          errorMessage += "Network error. Check your internet connection.";
        } else if (error.message.includes("GEMINI_API_KEY")) {
          errorMessage += "AI service not configured. Please contact support.";
        } else {
          errorMessage += error.message;
        }
      } else {
        errorMessage += "Please try again.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleSend = async (messageContent: string) => {
    if (!messageContent.trim() || isLoading || !conversationId) return;

    // Check rate limit
    const userId = user?.id || "anonymous";
    if (!isAllowed(userId)) {
      const remaining = getRemainingRequests(userId);
      toast({
        title: "Rate Limit Exceeded",
        description: `Please wait before sending more messages. ${remaining} requests remaining.`,
        variant: "destructive",
      });
      return;
    }

    // Sanitize user input to prevent XSS
    const sanitizedContent = sanitizeInput(messageContent.trim());

    // Analyze complexity and check for emergency
    const complexityAnalysis = analyzeComplexity(sanitizedContent);

    // Show emergency warning if detected
    if (isEmergency(complexityAnalysis)) {
      toast({
        title: "🚨 Emergency Detected",
        description:
          "Please call emergency services immediately: Police 112, Women 181, Child 1098",
        variant: "destructive",
      });
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: sanitizedContent,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Save user message to database
    await saveMessage("user", userMessage.content);

    const allMessages = [...messages, userMessage];
    await streamChat(allMessages, sanitizedContent);

    setIsLoading(false);
  };

  const handleQuickQuestion = (question: string) => {
    handleSend(question);
  };

  if (authLoading) {
    return (
      <div className="container flex h-[calc(100vh-12rem)] max-w-5xl items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container max-w-5xl py-8">
      <Card className="h-[calc(100vh-12rem)]">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Scale className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <CardTitle>Legal Assistant Chat</CardTitle>
                <p className="text-sm text-muted-foreground">Ask anything about Indian law</p>
              </div>
            </div>
            <Badge variant="secondary" role="status">
              Online
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col p-0">
          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            <div className="space-y-6" role="log" aria-live="polite" aria-label="Chat messages">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex gap-3" role="status" aria-label="AI is thinking">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  </div>
                  <div className="max-w-[80%] rounded-lg bg-muted px-4 py-3">
                    <p className="text-sm text-muted-foreground">Thinking...</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {messages.length === 1 && (
            <QuickQuestions questions={quickQuestions} onSelect={handleQuickQuestion} />
          )}

          <div className="border-t p-4">
            <ChatInput onSend={handleSend} isLoading={isLoading} />
            <p className="mt-2 text-xs text-muted-foreground">
              Powered by AI. Legal guidance based on BNS, BSA, and BNSS 2023.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
