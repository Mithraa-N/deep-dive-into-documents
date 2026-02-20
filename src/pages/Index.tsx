import { useState } from "react";
import { FileSearch, Shield, Quote, AlertTriangle, Zap, ArrowRight, Cpu, Lock, Search } from "lucide-react";
import { DocumentUpload } from "@/components/DocumentUpload";
import Analyzer from "@/pages/Analyzer";
import heroBg from "@/assets/hero-bg.jpg";

interface UploadedDocument {
  name: string;
  size: number;
  type: string;
  content: string;
  file: File;
}

const FEATURES = [
  {
    icon: Search,
    title: "Semantic Analysis",
    desc: "Uses Transformers.js to understand context beyond simple keywords.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    desc: "100% in-browser processing. Your data never leaves your device.",
  },
  {
    icon: Cpu,
    title: "Hybrid Engine",
    desc: "Fast keyword filtering combined with deep vector search.",
  },
  {
    icon: Quote,
    title: "Source Citations",
    desc: "Every answer comes with precise section references and evidence.",
  },
];

export default function Index() {
  const [document, setDocument] = useState<UploadedDocument | null>(null);

  const handleDocumentLoaded = (doc: UploadedDocument) => {
    setDocument(doc);
  };

  const handleBack = () => {
    setDocument(null);
  };

  if (document) {
    return (
      <Analyzer document={document} onBack={handleBack} />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col selection:bg-primary/30 selection:text-white">
      {/* Hero Section */}
      <header className="relative flex flex-col items-center justify-center px-6 pt-32 pb-24 overflow-hidden border-b border-white/5">
        {/* Background Effects */}
        <div
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-10 scale-105"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/20 blur-[120px] rounded-full -translate-y-1/2" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-1000">
            <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Next-Gen Document Intelligence</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
            Analyze Deeply. <br />
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">Search Semantically.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed mb-12 font-medium">
            A state-of-the-art AI analysis engine that runs entirely in your browser.
            Identify insights in seconds with zero data leakage.
          </p>

          <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <DocumentUpload onDocumentLoaded={handleDocumentLoaded} />
          </div>
        </div>
      </header>

      {/* Feature Grid */}
      <section className="py-24 px-6 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="group p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-white/[0.04] transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                <f.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2 tracking-tight">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 px-6 border-t border-white/5 bg-black/20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg gradient-brand" />
            <p className="font-bold text-white tracking-tight">Deep Dive Docs</p>
          </div>

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
            Powered by Local Transformers.js · No API Required
          </p>

          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Docs</a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
