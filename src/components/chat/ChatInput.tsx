import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-1 bg-muted/30 rounded-xl border">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask a question about voting..."
        className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none disabled:opacity-50"
        disabled={disabled}
      />
      <Button type="submit" size="icon" disabled={!input.trim() || disabled} className="rounded-lg h-9 w-9">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
