import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Send, Bot, User, Loader2, Mic, Keyboard } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { chatMockData } from "@/data/mockData";

type Message = { role: "user" | "assistant"; content: string };

const AIChat = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  
  // Initialize messages with localized mock data
  const [messages, setMessages] = useState<Message[]>(() => 
    chatMockData.map(msg => ({
      role: msg.role,
      content: msg.content[language]
    }))
  );
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

  // Update messages when language changes
  useEffect(() => {
    setMessages(chatMockData.map(msg => ({
      role: msg.role,
      content: msg.content[language]
    })));
  }, [language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = async (userMessage: Message) => {
    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!resp.ok) {
        if (resp.status === 429) {
          toast.error(t("chat.rate_limit"));
          return;
        }
        if (resp.status === 402) {
          toast.error(t("chat.quota_exceeded"));
          return;
        }
        throw new Error("Failed to start stream");
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
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => 
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  );
                }
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Stream error:", error);
      toast.error(t("chat.error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    await streamChat(userMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceStart = () => {
    setIsRecording(true);
    toast.success(t("chat.voice_start"));
  };

  const handleVoiceEnd = () => {
    setIsRecording(false);
    toast.success(t("chat.voice_end"));
    // TODO: Integrate voice recognition API
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex flex-col">
      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-6" ref={scrollRef}>
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 && (
            <Card className="p-8 text-center border-dashed">
              <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground mb-2">{t("chat.start")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("chat.start_desc")}
              </p>
            </Card>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <Avatar className="h-8 w-8 bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </Avatar>
              )}
              
              <Card
                className={`max-w-[80%] p-4 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </p>
              </Card>

              {msg.role === "user" && (
                <Avatar className="h-8 w-8 bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center">
                  <User className="h-5 w-5 text-secondary-foreground" />
                </Avatar>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </Avatar>
              <Card className="p-4 bg-card">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="sticky bottom-0 bg-card/95 backdrop-blur-sm border-t border-border shadow-lg">
        <div className="max-w-3xl mx-auto px-4 py-4">
          {!isVoiceMode ? (
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t("chat.input_placeholder")}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
              <Button
                onClick={() => setIsVoiceMode(true)}
                size="icon"
                variant="outline"
              >
                <Mic className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <Button
                onMouseDown={handleVoiceStart}
                onMouseUp={handleVoiceEnd}
                onMouseLeave={handleVoiceEnd}
                onTouchStart={handleVoiceStart}
                onTouchEnd={handleVoiceEnd}
                className={`flex-1 h-14 text-base font-medium transition-all ${
                  isRecording
                    ? "bg-gradient-to-br from-green-500 to-green-600 shadow-green-500/50 shadow-xl"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <Mic className="h-5 w-5 mr-2" />
                {isRecording ? t("chat.voice_release") : t("chat.voice_hold")}
              </Button>
              <Button
                onClick={() => setIsVoiceMode(false)}
                size="icon"
                variant="outline"
              >
                <Keyboard className="h-5 w-5" />
              </Button>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {t("chat.disclaimer")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
