import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send } from "lucide-react";
import { chatMessageSchema } from "@/lib/validations";
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  onSend: (message: string) => Promise<void>;
  isLoading: boolean;
}

export const ChatInput = ({ onSend, isLoading }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const handleSend = async () => {
    const trimmedInput = input.trim();
    
    // Validate input
    const validation = chatMessageSchema.safeParse({ content: trimmedInput });
    
    if (!validation.success) {
      toast({
        title: "Invalid message",
        description: validation.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }

    if (!isLoading && trimmedInput) {
      await onSend(trimmedInput);
      setInput("");
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSend();
      }}
      className="flex gap-2"
    >
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your question here..."
        className="flex-1"
        disabled={isLoading}
        maxLength={5000}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />
      <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
};
