import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Scale, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
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
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your ENACT legal assistant. I'm here to help you understand your legal rights and guide you through the justice system. What legal issue can I help you with today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
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
        toast({
          title: "Error",
          description: "Failed to start conversation. Please refresh.",
          variant: "destructive",
        });
        return;
      }

      setConversationId(data.id);
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

  const streamChat = async (userMessages: Message[]) => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/legal-chat`;
    
    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ 
          messages: userMessages.map(m => ({ role: m.role, content: m.content }))
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

      // Finalize the streaming message with a proper ID and save to database
      setMessages((prev) => {
        return prev.map((m) =>
          m.id === "streaming" ? { ...m, id: Date.now().toString() } : m
        );
      });

      // Save assistant response to database
      if (assistantContent) {
        await saveMessage("assistant", assistantContent);
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSend = async (messageContent: string) => {
    if (!messageContent.trim() || isLoading || !conversationId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Save user message to database
    await saveMessage("user", userMessage.content);

    const allMessages = [...messages, userMessage];
    await streamChat(allMessages);
    
    setIsLoading(false);
  };

  const handleQuickQuestion = (question: string) => {
    handleSend(question);
  };

  if (authLoading) {
    return (
      <div className="container max-w-5xl py-8 flex items-center justify-center h-[calc(100vh-12rem)]">
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
            <Badge variant="secondary" role="status">Online</Badge>
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
