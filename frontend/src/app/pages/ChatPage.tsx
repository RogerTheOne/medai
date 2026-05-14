import { useState } from "react";
import { Link } from "react-router";
import { Activity, Plus, Send, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { UserMenu } from "../components/UserMenu";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string | {
    possibleCauses?: string[];
    followUpQuestions?: string[];
    generalAdvice?: string[];
    whenToSeekHelp?: string[];
    disclaimer?: string;
  };
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
}

const mockConversations: Conversation[] = [
  { id: "1", title: "Persistent headache concerns", lastMessage: "2 days ago" },
  { id: "2", title: "Lower back pain inquiry", lastMessage: "1 week ago" },
  { id: "3", title: "Flu-like symptoms", lastMessage: "2 weeks ago" },
];

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI health assistant. Please describe your symptoms or health concerns, and I'll do my best to provide helpful information. Remember, I'm here for guidance only and cannot replace professional medical advice.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: {
          possibleCauses: [
            "Tension headaches from stress or poor posture",
            "Dehydration or lack of sleep",
            "Eye strain from extended screen time",
            "Migraine or cluster headaches",
          ],
          followUpQuestions: [
            "How long have you been experiencing these symptoms?",
            "On a scale of 1-10, how would you rate the pain?",
            "Have you noticed any triggers, such as certain foods or activities?",
            "Do you experience any other symptoms like nausea or sensitivity to light?",
          ],
          generalAdvice: [
            "Stay well-hydrated by drinking plenty of water throughout the day",
            "Ensure you're getting adequate sleep (7-9 hours per night)",
            "Take regular breaks from screens and practice the 20-20-20 rule",
            "Try relaxation techniques like deep breathing or meditation",
            "Consider over-the-counter pain relievers if appropriate",
          ],
          whenToSeekHelp: [
            "If the headache is sudden and severe (\"worst headache of your life\")",
            "If accompanied by fever, stiff neck, confusion, or vision changes",
            "If symptoms persist for more than a few days despite self-care",
            "If headaches are becoming more frequent or severe over time",
            "If you experience weakness, numbness, or difficulty speaking",
          ],
          disclaimer:
            "This information is for educational purposes only. Always consult with a healthcare professional for proper diagnosis and treatment.",
        },
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
              <Link to="/pharmacy" className="text-sm font-medium text-gray-600 hover:text-gray-900">
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
            <Button className="w-full rounded-lg bg-primary hover:bg-primary/90 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Consultation
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-4">
            <div className="space-y-1">
              {mockConversations.map((conv) => (
                <button
                  key={conv.id}
                  className="w-full text-left px-3 py-3 rounded-lg hover:bg-white/60 transition-colors group"
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {conv.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{conv.lastMessage}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "user" ? (
                    <div className="bg-primary text-white rounded-2xl px-5 py-3 max-w-2xl shadow-sm">
                      <p className="text-[15px] leading-relaxed">{message.content as string}</p>
                    </div>
                  ) : (
                    <div className="bg-muted/60 rounded-2xl px-6 py-4 max-w-2xl shadow-sm border border-gray-100">
                      {typeof message.content === "string" ? (
                        <p className="text-[15px] text-gray-800 leading-relaxed">
                          {message.content}
                        </p>
                      ) : (
                        <div className="space-y-5">
                          {message.content.possibleCauses && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2.5 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                Possible Causes
                              </h4>
                              <ul className="space-y-2 ml-3.5">
                                {message.content.possibleCauses.map((cause, idx) => (
                                  <li key={idx} className="text-[15px] text-gray-700 leading-relaxed">
                                    • {cause}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {message.content.followUpQuestions && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2.5 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                Follow-up Questions
                              </h4>
                              <ul className="space-y-2 ml-3.5">
                                {message.content.followUpQuestions.map((question, idx) => (
                                  <li key={idx} className="text-[15px] text-gray-700 leading-relaxed">
                                    • {question}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {message.content.generalAdvice && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2.5 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                                General Advice
                              </h4>
                              <ul className="space-y-2 ml-3.5">
                                {message.content.generalAdvice.map((advice, idx) => (
                                  <li key={idx} className="text-[15px] text-gray-700 leading-relaxed">
                                    • {advice}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {message.content.whenToSeekHelp && (
                            <div>
                              <h4 className="font-semibold text-red-700 mb-2.5 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                                When to Seek Medical Attention
                              </h4>
                              <ul className="space-y-2 ml-3.5">
                                {message.content.whenToSeekHelp.map((item, idx) => (
                                  <li key={idx} className="text-[15px] text-red-700 leading-relaxed">
                                    • {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {message.content.disclaimer && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
                              <p className="text-xs text-amber-800 leading-relaxed">
                                <span className="font-semibold">Disclaimer: </span>
                                {message.content.disclaimer}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted/60 rounded-2xl px-6 py-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      <span className="text-sm text-gray-600">Analyzing your symptoms...</span>
                    </div>
                  </div>
                </div>
              )}
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
                  disabled={!input.trim() || isTyping}
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