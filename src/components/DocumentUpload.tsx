import { useState, useRef, useCallback } from "react";
import { Upload, FileText, File, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadedDocument {
  name: string;
  size: number;
  type: string;
  content: string;
  file: File;
}

interface DocumentUploadProps {
  onDocumentLoaded: (doc: UploadedDocument) => void;
}

import { extractTextFromPDF, extractTextFromDocx } from "@/lib/extractors";

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/markdown",
];

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (type: string) => {
  if (type.includes("pdf")) return "PDF";
  if (type.includes("word") || type.includes("docx")) return "DOC";
  return "TXT";
};

export function DocumentUpload({ onDocumentLoaded }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedFile, setLoadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const readFile = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      let content = "";

      if (file.type === "text/plain" || file.type === "text/markdown" || file.name.endsWith(".md")) {
        content = await file.text();
      } else if (file.type === "application/pdf") {
        content = await extractTextFromPDF(file);
      } else if (file.type.includes("word") || file.name.endsWith(".docx")) {
        content = await extractTextFromDocx(file);
      } else {
        try {
          content = await file.text();
        } catch {
          content = `[Binary Document: ${file.name}]`;
        }
      }

      if (!content || content.trim().length === 0) {
        throw new Error("The document appears to be empty or could not be read.");
      }

      setLoadedFile(file);
      onDocumentLoaded({ name: file.name, size: file.size, type: file.type, content, file });
    } catch (err: any) {
      setError(err.message || "Failed to read the file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [onDocumentLoaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) readFile(file);
  }, [readFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFile(file);
  };

  return (
    <div
      className={`upload-zone relative overflow-hidden rounded-[2.5rem] p-16 flex flex-col items-center justify-center gap-8 cursor-pointer glass-panel ${isDragging ? "dragging" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.docx,.txt,.md"
        onChange={handleFileChange}
      />

      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

      {isLoading ? (
        <div className="flex flex-col items-center gap-6 relative z-10">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl border-2 border-primary/20" />
            <div className="absolute inset-0 w-16 h-16 rounded-2xl border-t-2 border-primary animate-spin" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-lg font-semibold text-white">Indexing Content</p>
            <p className="text-muted-foreground text-sm">Building local vector context...</p>
          </div>
        </div>
      ) : loadedFile ? (
        <div className="flex flex-col items-center gap-6 relative z-10 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 rounded-3xl gradient-brand flex items-center justify-center shadow-2xl shadow-primary/40 transition-transform hover:scale-105">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <div className="text-center space-y-1">
            <p className="font-bold text-xl text-white tracking-tight">{loadedFile.name}</p>
            <p className="text-primary/60 text-xs font-bold uppercase tracking-widest">{formatSize(loadedFile.size)} · COMPLETE</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-8 relative z-10">
          <div className="w-24 h-24 rounded-3xl surface-elevated border border-white/5 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
            <Upload className="w-10 h-10 text-primary" strokeWidth={1.5} />
          </div>

          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Deep Dive Docs
            </h2>
            <p className="text-slate-400 text-lg max-w-[280px]">
              Drop a heavy document to start local AI analysis
            </p>
          </div>

          <div className="flex items-center gap-3">
            {["PDF", "DOCX", "TXT", "MD"].map((fmt) => (
              <span key={fmt} className="citation-badge font-bold">{fmt}</span>
            ))}
          </div>

          <div className="flex items-center gap-2 text-slate-500">
            <div className="w-1 h-1 rounded-full bg-slate-700" />
            <p className="text-xs font-bold uppercase tracking-widest">Enhanced for large files</p>
            <div className="w-1 h-1 rounded-full bg-slate-700" />
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 px-4 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 relative z-10">
          <p className="text-rose-400 text-xs font-bold text-center">{error}</p>
        </div>
      )}
    </div>
  );
}
