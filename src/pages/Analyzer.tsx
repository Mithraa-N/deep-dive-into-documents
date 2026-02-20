import { useState } from "react";
import { ArrowLeft, FileText, Clock, HardDrive, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/ChatInterface";

interface Document {
  name: string;
  size: number;
  type: string;
  content: string;
}

interface AnalyzerProps {
  document: Document;
  onBack: () => void;
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileTypeLabel = (type: string, name: string) => {
  if (type.includes("pdf")) return "PDF";
  if (type.includes("word") || name.endsWith(".docx")) return "DOCX";
  if (name.endsWith(".md")) return "Markdown";
  return "Text";
};

const countWords = (text: string) =>
  text.trim().split(/\s+/).filter(Boolean).length;

export default function Analyzer({ document, onBack }: AnalyzerProps) {
  const wordCount = countWords(document.content);
  const fileType = getFileTypeLabel(document.type, document.name);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {/* Sidebar */}
      <aside className="w-80 flex-shrink-0 border-r border-white/5 flex flex-col bg-slate-900/40 backdrop-blur-3xl shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-white/5">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-primary transition-all mb-6"
          >
            <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
            New Extraction
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center flex-shrink-0 text-white shadow-xl shadow-primary/20">
              <FileText className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-base text-white truncate tracking-tight">{document.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Live Context</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-6 grid grid-cols-2 gap-3 border-b border-white/5 bg-white/[0.01]">
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Capacity</p>
            <p className="text-sm font-mono text-white">{formatSize(document.size)}</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tokens</p>
            <p className="text-sm font-mono text-white">{(wordCount * 1.3).toFixed(0)}</p>
          </div>
        </div>

        {/* Intelligence Config */}
        <div className="p-6 flex-1 overflow-y-auto scrollbar-premium">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-5">Intelligence Protocol</p>
          <div className="space-y-4">
            {[
              "Semantic Embedding Matrix",
              "Hybrid Literal Retrieval",
              "Source-Grounded Extraction",
              "Contextual Overlap Logic",
              "Verification via Citations",
            ].map((rule, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors duration-500" />
                <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200 transition-colors">{rule}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Deep Data Preview */}
        <div className="p-6 border-t border-white/5 bg-slate-950/60">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Raw Data Flow</p>
            <span className="text-[9px] font-mono text-primary/60 px-2 py-0.5 rounded bg-primary/5 border border-primary/20 animate-pulse">HEX_RAW</span>
          </div>
          <div className="rounded-xl p-3 bg-black/40 border border-white/5 h-32 overflow-hidden relative">
            <p className="text-[10px] text-slate-500 font-mono leading-relaxed break-all opacity-80">
              {document.content.slice(0, 800)}
            </p>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
          </div>
        </div>
      </aside>

      {/* Main Analysis Engine */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <div className="nav-blur px-8 py-5 flex items-center justify-between z-20">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(124,58,237,0.8)]" />
            <h1 className="font-bold text-lg text-white tracking-tight">Documentation Intelligence</h1>
          </div>
          <p className="text-xs font-bold font-mono tracking-tighter text-slate-500 select-none">
            SESSION_V0.1.AI · <span className="text-primary/60">ACTIVE</span>
          </p>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <ChatInterface document={document} />
        </div>
      </main>
    </div>
  );
}
