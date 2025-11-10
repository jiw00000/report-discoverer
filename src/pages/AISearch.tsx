import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AISearch = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: query };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ query: userMessage.content }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          toast({
            title: "요청 한도 초과",
            description: "잠시 후 다시 시도해주세요.",
            variant: "destructive",
          });
          return;
        }
        if (response.status === 402) {
          toast({
            title: "크레딧 부족",
            description: "워크스페이스 설정에서 크레딧을 추가해주세요.",
            variant: "destructive",
          });
          return;
        }
        throw new Error("AI 검색 실패");
      }

      if (!response.body) throw new Error("응답 본문이 없습니다");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      // Add empty assistant message
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      let textBuffer = "";

      while (true) {
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
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as
              | string
              | undefined;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: "assistant",
                  content: assistantContent,
                };
                return newMessages;
              });
            }
          } catch {
            // Incomplete JSON, continue
            continue;
          }
        }
      }
    } catch (error) {
      console.error("AI 검색 오류:", error);
      toast({
        title: "오류",
        description: "AI 검색 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      // Remove the empty assistant message on error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">AI 검색 도우미</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              학습자료와 논문을 AI가 찾아서 요약해드립니다
            </p>
          </div>

          {/* Chat Messages */}
          <div className="mb-6 space-y-4 min-h-[400px] max-h-[600px] overflow-y-auto p-4 bg-card rounded-lg border border-border">
            {messages.length === 0 ? (
              <div className="text-center py-16">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-semibold mb-2 text-foreground">
                  무엇을 찾아드릴까요?
                </h2>
                <p className="text-muted-foreground">
                  주제, 개념, 키워드를 입력하면 AI가 관련 자료를 찾아드립니다
                </p>
              </div>
            ) : (
              messages.map((message, index) => (
                <Card
                  key={index}
                  className={`${
                    message.role === "user"
                      ? "bg-primary/10 ml-auto"
                      : "bg-muted"
                  } max-w-[85%] ${message.role === "user" ? "ml-auto" : "mr-auto"}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {message.role === "assistant" && (
                        <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1 whitespace-pre-wrap text-foreground">
                        {message.content}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI가 검색 중입니다...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="예: 머신러닝의 기초 개념, 양자역학 논문 등"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isLoading}
                className="pl-10 h-14 text-base"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !query.trim()}
              size="lg"
              className="h-14 px-8"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "검색"
              )}
            </Button>
          </form>

          {/* Info */}
          <div className="mt-4 text-center text-sm text-muted-foreground">
            💡 AI가 데이터베이스와 웹에서 최신 자료를 찾아드립니다
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AISearch;
