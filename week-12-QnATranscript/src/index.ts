import express from "express";
import { pipeline } from "@xenova/transformers";

interface Chunk {
  id: number;
  text: string;
  vector: number[];
}

const app = express();
app.use(express.json());

// In-memory store simulating vector DB
const store: { chunks: Chunk[] } = { chunks: [] };

// Local embedding model
let embeddingModel: any;

async function initModel() {
  console.log("Loading local embedding model...");
  embeddingModel = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  console.log("Embedding model ready.");
}

// Simple transcript chunking
function chunkTranscript(text: string): string[] {
  return text.split(/[.?!]\s+/).filter(Boolean);
}

// Convert token embeddings to a single averaged vector
function meanVector(tokenVectors: number[][] | number[][][]): number[] {
  // Flatten if there's an extra nesting
  const tokens = Array.isArray(tokenVectors[0][0])
    ? (tokenVectors[0] as number[][])  // nested batch dimension
    : (tokenVectors as number[][]);    // already flat

  const length = tokens[0].length;
  const avg: number[] = new Array(length).fill(0);

  for (const tokenVec of tokens) {
    for (let i = 0; i < length; i++) {
      avg[i] += tokenVec[i];
    }
  }

  return avg.map(x => x / tokens.length);
}


// Cosine similarity
function cosine(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (normA * normB);
}

// Insert transcript endpoint
app.post("/insert", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).send({ error: "text required" });

  const chunksText = chunkTranscript(text);
  const chunksWithVectors: Chunk[] = [];

  for (let i = 0; i < chunksText.length; i++) {
    const vecRaw = await embeddingModel(chunksText[i]); // token vectors
    const vector = meanVector(vecRaw[0]); // flatten to single vector
    chunksWithVectors.push({ id: i, text: chunksText[i], vector });
  }

  store.chunks = chunksWithVectors;

  res.send({
    inserted: true,
    totalChunks: chunksWithVectors.length,
    chunks: chunksWithVectors.map(c => ({ id: c.id, text: c.text }))
  });
});

// Ask question endpoint
app.post("/ask", async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).send({ error: "question required" });

  // Embed question
  const qVecRaw = await embeddingModel(question);
  const qVec = meanVector(qVecRaw[0]);

  // Find best matching chunk
  let bestScore = -Infinity;
  let bestChunk: Chunk | null = null;

  for (const c of store.chunks) {
    const score = cosine(qVec, c.vector);
    if (score > bestScore) {
      bestScore = score;
      bestChunk = c;
    }
  }

  if (!bestChunk) {
    return res.send({ answer: null, similarity: -999 });
  }

  // Extractive QA: pick most similar sub-sentence
  const subChunks = bestChunk.text.split(/[,.\n]/).map(s => s.trim()).filter(Boolean);
  let bestSubScore = -Infinity;
  let bestSubChunk = bestChunk.text;

  for (const sub of subChunks) {
    const vecRaw = await embeddingModel(sub);
    const vec = meanVector(vecRaw[0]);
    const score = cosine(qVec, vec);
    if (score > bestSubScore) {
      bestSubScore = score;
      bestSubChunk = sub;
    }
  }

  res.send({
    answer: bestSubChunk,
    similarity: bestSubScore
  });
});

// Health check
app.get("/health", (_req, res) => {
  res.send({ status: "ok", message: "Local server running" });
});

// Start server after model initialization
initModel().then(() => {
  app.listen(3000, () =>
    console.log("Local QA server running at http://localhost:3000")
  );
});
