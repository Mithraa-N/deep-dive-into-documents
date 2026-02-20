import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, AlertCircle, BookOpen, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { askLocalDoc } from "@/lib/docProcessor";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface DocumentInfo {
  name: string;
  content: string;
  type: string;
}

interface ChatInterfaceProps {
  document: DocumentInfo;
}



function MessageBubble({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-4 group ${isUser ? "flex-row-reverse" : "flex-row"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-lg ${isUser ? "gradient-brand" : "bg-slate-800/80 border border-white/10"
        }`}>
        {isUser
          ? <User className="w-4.5 h-4.5 text-white" />
          : <Bot className="w-4.5 h-4.5 text-primary" />
        }
      </div>

      <div className={`relative max-w-[85%] rounded-2xl px-5 py-3.5 ${isUser ? "message-user" : "message-ai"
        }`}>
        <div className="text-[14px] leading-relaxed whitespace-pre-wrap text-slate-100 font-medium tracking-tight">
          {message.content}
        </div>
        <div className="flex items-center justify-between mt-3 gap-3 border-t border-white/5 pt-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white"
          >
            {copied
              ? <Check className="w-3.5 h-3.5 text-emerald-400" />
              : <Copy className="w-3.5 h-3.5" />
            }
          </button>
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-4 animate-pulse">
      <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center flex-shrink-0">
        <Bot className="w-4.5 h-4.5 text-primary" />
      </div>
      <div className="message-ai rounded-2xl px-5 py-3.5 flex items-center gap-1.5 h-12">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-2">Analyzing</span>
      </div>
    </div>
  );
}

const STARTER_QUESTIONS = [
  "What is the core message of this document?",
  "Extract the most important technical findings.",
  "Are there any specific dates or deadlines mentioned?",
  "Give me a high-level executive summary.",
];

export function ChatInterface({ document }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Document analyzed: **${document.name}**\n\nI've indexed this file using local hybrid semantic retrieval. You can now ask complex questions—I'll synthesize answers directly from the text with section references.\n\nHow can I help you explore this data?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setError(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const assistantContent = await askLocalDoc(text.trim(), document.content);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: assistantContent,
          timestamp: new Date(),
        },
      ]);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/20">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-premium p-6 space-y-6">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input & Starters */}
      <div className="p-6 bg-slate-950/40 border-t border-white/5 backdrop-blur-xl">
        {messages.length === 1 && (
          <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <p className="text-[10px] text-slate-500 mb-3 font-bold uppercase tracking-[0.2em] ml-1">Suggested Deep Dives</p>
            <div className="flex flex-wrap gap-2">
              {STARTER_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-left text-xs px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-primary/40 hover:bg-primary/5 hover:text-white transition-all text-slate-300 font-medium"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-start gap-3 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-rose-200">{error}</p>
          </div>
        )}

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-blue-500/50 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
          <div className="relative flex gap-3 items-end p-2 rounded-2xl bg-slate-900/80 border border-white/10 glass-panel">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Query the document data..."
              className="flex-1 resize-none min-h-[48px] max-h-[160px] bg-transparent border-0 focus-visible:ring-0 text-[15px] scrollbar-premium py-3 px-3 placeholder:text-slate-600"
              rows={1}
            />
            <Button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-10 w-10 rounded-xl gradient-brand shrink-0 mb-1"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 mt-4 opacity-40">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            Press <span className="text-slate-300 px-1">Enter</span> to query
          </p>
          <div className="w-1 h-1 rounded-full bg-slate-700" />
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            Local AI processing
          </p>
        </div>
      </div>
    </div>
  );
}
