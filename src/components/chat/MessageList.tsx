import { motion, AnimatePresence } from "framer-motion";
import { User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "model";
  text: string;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <ScrollArea className="h-full pr-4" role="log" aria-live="polite" aria-label="Conversation history">
      <div className="flex flex-col gap-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[400px] text-center text-muted-foreground">
            <Bot className="w-12 h-12 mb-4 opacity-20" />
            <p>Ask me anything about the election process!</p>
            <p className="text-sm">Try: "How do I register to vote in Texas?" or "What is the electoral college?"</p>
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {message.role === "user" ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className={`flex flex-col gap-1 max-w-[80%] ${message.role === "user" ? "items-end" : "items-start"}`}>
                <div className={`rounded-lg px-4 py-2 border ${message.role === "user" ? "bg-primary text-primary-foreground shadow-sm" : "bg-card text-card-foreground shadow-sm"}`}>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3 flex-row"
            role="status"
            aria-label="Thinking"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border shadow bg-muted">
              <Bot size={18} />
            </div>
            <div className="flex gap-1 items-center bg-card border rounded-lg px-4 py-2 shadow-sm">
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-1.5 h-1.5 bg-foreground rounded-full"
              />
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                className="w-1.5 h-1.5 bg-foreground rounded-full"
              />
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                className="w-1.5 h-1.5 bg-foreground rounded-full"
              />
            </div>
          </motion.div>
        )}
      </div>
    </ScrollArea>
  );
}
