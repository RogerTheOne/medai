import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router";
import { Activity, Plus, Send, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { UserMenu } from "../components/UserMenu";
import { useAuth } from "../context/AuthContext";

interface ApiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  title: string | null;
  updatedAt: string;
  lastMessagePreview: string | null;
}

const WELCOME_MESSAGE: ApiMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello! I'm your AI health assistant. Please describe your symptoms or health concerns, and I'll do my best to provide helpful information. Remember, I'm here for guidance only and cannot replace professional medical advice.",
  createdAt: new Date().toISOString(),
};

function parseMarkdownSections(content: string) {
  const sections: { heading: string; body: string[]; isDisclaimer: boolean }[] = [];
  const lines = content.split("\n");
  let current: { heading: string; body: string[]; isDisclaimer: boolean } | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("### ")) {
      if (current) sections.push(current);
      const heading = trimmed.slice(4);
      current = { heading, body: [], isDisclaimer: heading.toLowerCase().includes("disclaimer") };
    } else if (current && (trimmed.startsWith("- ") || trimmed.startsWith("* "))) {
      current.body.push(trimmed.slice(2));
    } else if (current && trimmed && !trimmed.startsWith("#")) {
      current.body.push(trimmed);
    }
  }
  if (current) sections.push(current);
  return sections;
}

function AssistantMessage({ content, streaming }: { content: string; streaming?: boolean }) {
  const sections = parseMarkdownSections(content);

  if (sections.length === 0 || streaming) {
    return (
      <p className="text-[15px] text-gray-800 leading-relaxed whitespace-pre-wrap">
        {content}
        {streaming && (
          <span className="inline-block w-1 h-4 bg-primary animate-pulse ml-0.5 align-middle" />
        )}
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {sections.map((section, idx) => {
        const isWarning =
          section.heading.toLowerCase().includes("seek") ||
          section.heading.toLowerCase().includes("attention");

        if (section.isDisclaimer) {
          return (
            <div key={idx} className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
              <p className="text-xs text-amber-800 leading-relaxed">
                <span className="font-semibold">Disclaimer: </span>
                {section.body.join(" ")}
              </p>
            </div>
          );
        }

        return (
          <div key={idx}>
            <h4
              className={`font-semibold mb-2.5 flex items-center gap-2 ${
                isWarning ? "text-red-700" : "text-gray-900"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isWarning ? "bg-red-600" : idx === 2 ? "bg-accent" : "bg-primary"
                }`}
              />
              {section.heading}
            </h4>
            <ul className="space-y-2 ml-3.5">
              {section.body.map((item, i) => (
                <li
                  key={i}
                  className={`text-[15px] leading-relaxed ${
                    isWarning ? "text-red-700" : "text-gray-700"
                  }`}
                >
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export function ChatPage() {
  const { accessToken } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ApiMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/conversations?limit=20", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setConversations(data.items);
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    }
  }, [accessToken]);

  const fetchMessages = useCallback(
    async (conversationId: string) => {
      try {
        const res = await fetch(
          `/api/v1/conversations/${conversationId}/messages?limit=50`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (!res.ok) return;
        const data = await res.json();
        setMessages(data.items);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    },
    [accessToken]
  );

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (activeConversationId) {
      fetchMessages(activeConversationId);
    } else {
      setMessages([WELCOME_MESSAGE]);
    }
  }, [activeConversationId, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userContent = input.trim();
    setInput("");

    setMessages((prev) => {
      const filtered = prev.filter((m) => m.id !== "welcome");
      return [
        ...filtered,
        { id: `temp-${Date.now()}`, role: "user", content: userContent, createdAt: new Date().toISOString() },
      ];
    });

    setIsStreaming(true);
    setStreamingContent("");

    let accumulated = "";

    try {
      const response = await fetch("/api/v1/chat/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          conversationId: activeConversationId ?? undefined,
          message: userContent,
        }),
      });

      if (!response.ok) {
        const body = await response.text().catch(() => "");
        throw new Error(`HTTP ${response.status}: ${body}`);
      }

      if (!response.body) throw new Error("No response body from server");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let currentEvent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("event: ")) {
            currentEvent = line.slice(7).trim();
          } else if (line.startsWith("data: ")) {
            let data: Record<string, string>;
            try {
              data = JSON.parse(line.slice(6));
            } catch {
              continue;
            }

            if (currentEvent === "conversation") {
              setActiveConversationId(data.conversationId);
            } else if (currentEvent === "delta") {
              accumulated += data.text;
              setStreamingContent(accumulated);
            } else if (currentEvent === "done") {
              setMessages((prev) => [
                ...prev,
                {
                  id: `ai-${Date.now()}`,
                  role: "assistant",
                  content: accumulated,
                  createdAt: new Date().toISOString(),
                },
              ]);
              setStreamingContent("");
              setIsStreaming(false);
              fetchConversations();
            } else if (currentEvent === "error") {
              throw new Error(data.message);
            }
          }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Stream error:", msg);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: `Error: ${msg}`,
          createdAt: new Date().toISOString(),
        },
      ]);
      setStreamingContent("");
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewConsultation = () => {
    setActiveConversationId(null);
    setMessages([WELCOME_MESSAGE]);
    setStreamingContent("");
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Top Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">MedAI Advisor</span>
            </Link>

            <div className="flex items-center gap-6">
              <Link to="/chat" className="text-sm font-medium text-primary">
                Chat
              </Link>
              <Link
                to="/pharmacy"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Pharmacy
              </Link>
            </div>
          </div>

          <UserMenu />
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 border-r border-gray-200 bg-muted/50 flex flex-col">
          <div className="p-4">
            <Button
              onClick={handleNewConsultation}
              className="w-full rounded-lg bg-primary hover:bg-primary/90 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Consultation
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-4">
            <div className="space-y-1">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`w-full text-left px-3 py-3 rounded-lg transition-colors group ${
                    activeConversationId === conv.id
                      ? "bg-white shadow-sm"
                      : "hover:bg-white/60"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {conv.title || "New consultation"}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {conv.lastMessagePreview || "No messages yet"}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
              {conversations.length === 0 && (
                <p className="text-xs text-gray-400 text-center mt-4 px-2">
                  No previous consultations
                </p>
              )}
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "user" ? (
                    <div className="bg-primary text-white rounded-2xl px-5 py-3 max-w-2xl shadow-sm">
                      <p className="text-[15px] leading-relaxed">{message.content}</p>
                    </div>
                  ) : (
                    <div className="bg-muted/60 rounded-2xl px-6 py-4 max-w-2xl shadow-sm border border-gray-100">
                      <AssistantMessage content={message.content} />
                    </div>
                  )}
                </div>
              ))}

              {isStreaming && streamingContent && (
                <div className="flex justify-start">
                  <div className="bg-muted/60 rounded-2xl px-6 py-4 max-w-2xl shadow-sm border border-gray-100">
                    <AssistantMessage content={streamingContent} streaming />
                  </div>
                </div>
              )}

              {isStreaming && !streamingContent && (
                <div className="flex justify-start">
                  <div className="bg-muted/60 rounded-2xl px-6 py-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      <span className="text-sm text-gray-600">Analyzing your symptoms...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white px-6 py-4">
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Describe your symptoms or ask a health question..."
                  className="min-h-[80px] pr-12 rounded-xl resize-none border-gray-300 focus-visible:ring-primary"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isStreaming}
                  size="icon"
                  className="absolute right-2 bottom-2 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
