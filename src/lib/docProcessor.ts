
import { pipeline, env } from '@xenova/transformers';

// Configure for browser environment
env.allowLocalModels = false;
env.useBrowserCache = true;

/**
 * Singleton to manage model loading
 */
class DocumentModel {
    private static extractor: any = null;
    private static qa: any = null;
    private static isLoading = false;

    static async getExtractor() {
        if (this.extractor) return this.extractor;
        if (this.isLoading) {
            console.log("Model is already loading, waiting...");
            while (this.isLoading) await new Promise(r => setTimeout(r, 100));
            return this.extractor;
        }

        this.isLoading = true;
        try {
            console.log("Initializing Embedding Model (~30MB)...");
            this.extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
                progress_callback: (p: any) => {
                    if (p.status === 'progress') {
                        console.log(`Loading Extractor: ${p.file} - ${p.progress.toFixed(1)}%`);
                    }
                }
            });
            console.log("Embedding Model Ready.");
        } finally {
            this.isLoading = false;
        }
        return this.extractor;
    }

    static async getQA() {
        if (this.qa) return this.qa;
        console.log("Initializing QA Model (~100MB)...");
        this.qa = await pipeline('question-answering', 'Xenova/distilbert-base-cased-distilled-squad', {
            progress_callback: (p: any) => {
                if (p.status === 'progress') {
                    console.log(`Loading QA: ${p.file} - ${p.progress.toFixed(1)}%`);
                }
            }
        });
        console.log("QA Model Ready.");
        return this.qa;
    }
}

export interface SearchResult {
    content: string;
    score: number;
    index: number;
}

const STOP_WORDS = new Set(["the", "is", "at", "which", "on", "and", "a", "an", "of", "for", "with", "in", "to", "it", "this", "that", "by", "from", "up", "out", "into", "over", "after", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "but", "or", "so", "if", "then", "else", "when", "where", "why", "how"]);

export function preprocessDocument(content: string): string[] {
    if (!content) return [];

    const normalized = content.replace(/\r\n/g, '\n').replace(/\t/g, ' ');
    const parts = normalized.match(/[^.!?\n]+[.!?\n]+/g) || [normalized];

    const chunks: string[] = [];
    let currentChunk = "";

    for (const part of parts) {
        const trimmed = part.trim();
        if (!trimmed) continue;

        if (currentChunk.length + trimmed.length > 500) {
            if (currentChunk) chunks.push(currentChunk.trim());
            const words = currentChunk.split(' ');
            const overlap = words.slice(Math.max(0, words.length - 12)).join(' ');
            currentChunk = overlap + " " + trimmed;
        } else {
            currentChunk += (currentChunk ? " " : "") + trimmed;
        }
    }

    if (currentChunk.trim()) chunks.push(currentChunk.trim());
    return chunks.filter(c => c.length > 20);
}

function dotProduct(a: number[], b: number[]): number {
    return a.reduce((sum, val, i) => sum + val * (b[i] || 0), 0);
}

function cosineSimilarity(a: number[], b: number[]): number {
    const dot = dotProduct(a, b);
    const normA = Math.sqrt(dotProduct(a, a));
    const normB = Math.sqrt(dotProduct(b, b));
    return dot / (normA * normB || 1);
}

export async function searchDocument(query: string, blocks: string[]): Promise<SearchResult[]> {
    console.log(`Searching for: "${query}" across ${blocks.length} blocks`);

    // Pre-filter with keyword search to avoid embedding too many blocks
    const terms = query.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(t => t.length > 2 && !STOP_WORDS.has(t));
    if (terms.length === 0) terms.push(...query.toLowerCase().split(/\s+/).filter(t => t.length > 0));

    const keywordScored = blocks.map((block, index) => {
        const lower = block.toLowerCase();
        let score = 0;
        terms.forEach(t => {
            if (lower.includes(t)) score += 1;
            if (new RegExp(`\\b${t}\\b`).test(lower)) score += 2;
        });
        return { content: block, score, index };
    }).filter(r => r.score > 0).sort((a, b) => b.score - a.score);

    // Limit semantic search to top 15 keyword matches or first 30 blocks if no matches
    const candidates = keywordScored.length > 0
        ? keywordScored.slice(0, 15)
        : blocks.slice(0, 30).map((b, i) => ({ content: b, score: 0, index: i }));

    if (candidates.length === 0) return [];

    try {
        console.log(`Running semantic analysis on ${candidates.length} candidates...`);
        const extractor = await DocumentModel.getExtractor();

        const queryOut = await extractor(query, { pooling: 'mean', normalize: true });
        const queryEmbedding = Array.from(queryOut.data) as number[];

        const results: SearchResult[] = [];
        // Sequential processing to prevent browser freeze
        for (const [i, cand] of candidates.entries()) {
            console.log(`Semantic pass ${i + 1}/${candidates.length}...`);
            const blockOut = await extractor(cand.content, { pooling: 'mean', normalize: true });
            const blockEmbedding = Array.from(blockOut.data) as number[];
            const semanticScore = cosineSimilarity(queryEmbedding, blockEmbedding);
            results.push({
                content: cand.content,
                score: semanticScore + (cand.score * 0.1),
                index: cand.index
            });
        }

        console.log("Analysis complete.");
        return results.filter(r => r.score > 0.15).sort((a, b) => b.score - a.score);
    } catch (err) {
        console.warn("Semantic search failed, returning keyword matches:", err);
        return keywordScored;
    }
}

export async function askLocalDoc(query: string, content: string): Promise<string> {
    console.time("analysis");
    try {
        const blocks = preprocessDocument(content);
        if (blocks.length === 0) return "I couldn't extract any readable text.";

        const relevant = await searchDocument(query, blocks);
        if (relevant.length === 0) {
            console.timeEnd("analysis");
            return "No relevant sections found. Try rephrasing your question.";
        }

        const topBlocks = relevant.slice(0, 2);

        console.log("Extracting specific answer...");
        const qa = await DocumentModel.getQA();
        const context = topBlocks[0].content;
        const result = await qa(query, context);

        console.timeEnd("analysis");
        if (result && result.score > 0.01) {
            let answer = `**Answer:** ${result.answer.charAt(0).toUpperCase() + result.answer.slice(1)}\n\n`;
            answer += `### Evidence\n> "${context}"\n\n*(Section ${topBlocks[0].index + 1})*`;

            if (relevant.length > 1) {
                answer += `\n\n### Context\n> "${topBlocks[1].content}"\n\n*(Section ${topBlocks[1].index + 1})*`;
            }
            return answer;
        }

        // Fallback to snippets
        let response = "Based on the document context, here is what I found:\n\n";
        topBlocks.forEach((res, i) => {
            response += `### Finding ${i + 1}\n> "${res.content}"\n\n*(Section ${res.index + 1})*\n\n`;
        });
        return response;

    } catch (err) {
        console.error("AI Analysis failed:", err);
        console.timeEnd("analysis");
        return "The AI engine is taking longer than expected. This usually means it's still downloading the models (approx 130MB total). Please check your connection or wait a few more moments.";
    }
}
