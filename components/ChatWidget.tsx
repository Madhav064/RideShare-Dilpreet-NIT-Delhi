"use client";

import * as React from "react";
import { MessageCircle, X, Send, User, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'driver';
  timestamp: Date;
}

const DRIVER_RESPONSES = [
  'I am on my way!',
  'Stuck in traffic, be there in 5.',
  'Ok, see you soon.',
  'I have arrived at the pickup point.',
  'Hello! I am your driver today.',
  'Please wait a moment.'
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");

    // Simulate driver response
    setTimeout(() => {
      const responseText = DRIVER_RESPONSES[Math.floor(Math.random() * DRIVER_RESPONSES.length)];
      const driverMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'driver',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, driverMessage]);
      
      // Optional: Play sound
      // const audio = new Audio('/message-pop.mp3');
      // audio.play().catch(e => console.log('Audio play failed', e));

    }, 1500);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {isOpen && (
        <Card className="w-80 shadow-2xl border-primary/20 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <CardHeader className="p-4 border-b bg-primary/5 flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/driver-avatar.png" />
                <AvatarFallback><Car className="h-4 w-4" /></AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-sm font-medium">Driver Support</CardTitle>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Online
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="p-0">
            {/* Using a div instead of ScrollArea since it wasn't installed, mimicking behavior */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-background">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-8 space-y-2">
                  <MessageCircle className="h-8 w-8 mx-auto opacity-20" />
                  <p>Start a conversation with your driver</p>
                </div>
              )}
              
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col max-w-[85%] text-sm rounded-lg p-2.5",
                    msg.sender === 'user' 
                      ? "ml-auto bg-primary text-primary-foreground rounded-br-none" 
                      : "mr-auto bg-muted text-foreground rounded-bl-none"
                  )}
                >
                  <p>{msg.text}</p>
                  <span className={cn(
                    "text-[10px] opacity-70 mt-1 block",
                     msg.sender === 'user' ? "text-primary-foreground/70 text-right" : "text-muted-foreground text-left"
                  )}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          <CardFooter className="p-3 border-t">
            <form onSubmit={handleSend} className="flex w-full gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 focus-visible:ring-1"
              />
              <Button type="submit" size="icon" disabled={!inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>
    </div>
  );
}
