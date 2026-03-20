"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Car, Headset } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatWidgetProps {
  mode?: "driver" | "support";
  initialMessage?: string;
  driverName?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatWidget({ mode = "support", initialMessage, driverName }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      setMessages([{ role: "assistant", content: initialMessage }]);
      // Only show preview for support mode to avoid cluttering driver booking flow, 
      // or if specifically requested (checking initialMessage existence implied)
      if (initialMessage) {
        // Short delay to make it "pop" after load
        setTimeout(() => setShowPreview(true), 1000);
      }
    }
  }, [initialMessage, messages.length]);

  useEffect(() => {
    if (isOpen) {
      setShowPreview(false);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = { role: "user" as const, content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const apiMessages = [...messages, userMessage];
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, mode }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const data = await res.json();
      const botMessage = { role: "assistant" as const, content: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev, 
        { role: "assistant", content: "Sorry, something went wrong. Please try again." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isDriver = mode === "driver";
  const headerColor = isDriver ? "bg-green-600" : "bg-black dark:bg-zinc-800";
  const positionClass = isDriver ? "bottom-24 right-4" : "bottom-4 right-4";
  const icon = isDriver ? <Car className="h-6 w-6" /> : <Headset className="h-6 w-6" />;
  const title = isDriver ? "Driver Chat" : "Support";
  const description = isDriver 
    ? (driverName || "Your Driver") 
    : "We're here to help";

  return (
    <div className={cn("fixed z-50 flex flex-col items-end", positionClass)}>
      {isOpen && (
        <Card className="p-0 gap-0 w-[350px] h-[450px] flex flex-col shadow-2xl overflow-hidden mb-4 animate-in slide-in-from-bottom-5 fade-in duration-300 border-0 ring-1 ring-black/5">
          <div className={cn("p-4 flex items-center justify-between text-white shadow-md", headerColor)}>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                {icon}
              </div>
              <div>
                <h3 className="font-bold text-sm">{title}</h3>
                <p className="text-xs opacity-90">{description}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 dark:bg-zinc-950/50">
            {messages.length === 0 && (
               <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-400">
                  <MessageCircle className="h-12 w-12 mb-3 opacity-20" />
                  <p className="text-sm">Start a conversation with {isDriver ? "your driver" : "support"}.</p>
               </div>
            )}
            
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex w-full",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] px-4 py-2.5 rounded-2xl text-sm shadow-sm",
                    msg.role === "user"
                      ? "bg-black text-white rounded-tr-none dark:bg-zinc-200 dark:text-zinc-900"
                      : "bg-white text-zinc-800 border border-zinc-200 rounded-tl-none dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-800"
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-zinc-100 dark:bg-zinc-900 px-4 py-3 rounded-2xl rounded-tl-none border border-zinc-200 dark:border-zinc-800">
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
            <div className="relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={isDriver ? "Message driver..." : "Type your message..."}
                className="pr-12 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus-visible:ring-offset-0 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-400"
              />
              <Button
                size="icon"
                className={cn("absolute right-1 top-1 h-8 w-8 rounded-md transition-colors", 
                    inputValue.trim() ? "bg-black hover:bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900" : "bg-transparent text-zinc-300 hover:bg-transparent cursor-default"
                )}
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {!isOpen && showPreview && initialMessage && (
        <div className="mb-2 mr-6 bg-zinc-200 dark:bg-zinc-800 p-4 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700 max-w-[260px] relative animate-in slide-in-from-right-5 fade-in duration-500">
           <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">
             {initialMessage}
           </p>
           <Button 
              variant="ghost" 
              size="icon" 
              className="absolute -top-3 -left-3 h-6 w-6 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:bg-zinc-200 hover:text-red-500"
              onClick={(e) => { e.stopPropagation(); setShowPreview(false); }}
           >
              <X className="h-3 w-3" />
           </Button>
        </div>
      )}

      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className={cn(
            "h-14 w-14 rounded-full shadow-lg transition-transform hover:scale-110 text-white dark:text-gray-400",
            headerColor
          )}
        >
          {icon}
        </Button>
      )}
    </div>
  );
}
