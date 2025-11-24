import express from "express";
import { pipeline } from "@xenova/transformers";
import { Client } from "pg";

/** ----------------------
* CONFIG
* ---------------------- */
const PG_CONFIG = {
  user: "postgres",
  host: "localhost",
  database: "ragdb",
  password: "yourpassword", // Use your postgres password
  port: 5432,
};

const HTTP_PORT = 3000;

/** ----------------------
* Utilities
* ---------------------- */

/** Simple character-based chunker */
function chunkText(text: string, maxLen: number = 800): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += maxLen) {
    chunks.push(text.slice(i, i + maxLen));
  }
  return chunks;
}

/** Normalize embeddings (mean pooling over tokens) */
function normalizeEmbedding(emb: any): number[] {
  // Case 1: flat Float32Array with dims info (handle 2D or 3D shapes)
  if (emb.data && emb.dims) {
    const shape = emb.dims;
    let tokens: number, hidden: number;
    if (shape.length === 2) {
      [tokens, hidden] = shape;
    } else if (shape.length === 3) {
      const [batch, seq, h] = shape;
      if (batch !== 1) throw new Error("Batch size >1 not supported");
      tokens = seq;
      hidden = h;
    } else {
      throw new Error(`Unsupported shape: [${shape.join(', ')}]`);
    }
    if (hidden !== 384) throw new Error(`Expected 384 dims, got ${hidden}. Wrong model loaded.`);
    const out = new Array(hidden).fill(0);
    for (let t = 0; t < tokens; t++) {
      for (let d = 0; d < hidden; d++) {
        out[d] += emb.data[t * hidden + d];
      }
    }
    return out.map(v => v / tokens);
  }

  // Case 2: nested array [[...], [...]]
  if (Array.isArray(emb) && Array.isArray(emb[0])) {
    const tokens = emb.length;
    const dims = emb[0].length;
    if (dims !== 384) throw new Error(`Expected 384 dims, got ${dims}. Wrong model loaded.`);
    const out = new Array(dims).fill(0);
    for (let t = 0; t < tokens; t++) {
      for (let d = 0; d < dims; d++) {
        out[d] += emb[t][d];
      }
    }
    return out.map(v => v / tokens);
  }

  // Anything else: fail
  throw new Error("Unknown embedding format");
}

/** Convert number[] to pgvector literal */
function toPgVectorLiteral(arr: number[]): string {
  return "[" + arr.join(",") + "]";
}

/** ----------------------
* Main
* ---------------------- */
async function startServer() {
  // Connect to PostgreSQL
  const client = new Client(PG_CONFIG);
  await client.connect();
  console.log("Connected to PostgreSQL");

  // Ensure table exists
  await client.query(`CREATE EXTENSION IF NOT EXISTS vector;`);
  await client.query(`CREATE TABLE IF NOT EXISTS transcript_chunks (
      id SERIAL PRIMARY KEY,
      chunk_text TEXT NOT NULL,
      embedding VECTOR(384)
    );`);
  console.log("Ensured table exists");

  // Load models
  const embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  console.log("Embedder dims:", embedder.model.config.hidden_size);

  const answerer = await pipeline("question-answering", "Xenova/distilbert-base-cased-distilled-squad");
  console.log("Models loaded ✔");

  // Your transcript
  const transcript = `[Project Alpha – Full Kickoff Meeting Transcript – Oct 15, 2025 – 10:00 AM]

[10:00 AM] Alice: Good morning, everyone. Thank you for joining the Project Alpha kickoff meeting. I'm Alice Johnson, the project manager, and I'll be guiding us through today's agenda. We have a full house today—let's do a quick roll call to make sure we're all here. Bob from engineering? 

[10:01 AM] Bob: Here, Alice. Ready to dive in.

[10:01 AM] Alice: Great. Carol from design?

[10:01 AM] Carol: Present.

[10:01 AM] Alice: Dana from marketing?

[10:02 AM] Dana: Yep, all set.

[10:02 AM] Alice: And Eve from finance?

[10:02 AM] Eve: Here.

[10:02 AM] Alice: Perfect. Also, we have Frank as our external consultant joining remotely. Frank, can you hear us?

[10:02 AM] Frank: Loud and clear from Seattle.

[10:03 AM] Alice: Excellent. Alright, let's get started. Project Alpha is our new initiative to develop an AI-powered analytics platform for small businesses. The goal is to democratize data insights, making advanced analytics accessible without needing a data science team. Budget is set at $500K for the first phase, with a timeline of 6 months to MVP.

[10:04 AM] Bob: Quick question on budget—does that include hardware for the dev servers?

[10:04 AM] Alice: Good catch, Bob. Yes, $50K is allocated for infrastructure, including cloud credits and any on-prem needs. Eve, want to expand on the financials?

[10:05 AM] Eve: Absolutely. Total budget: $500,000. Breakdown: 40% engineering ($200K), 20% design/UI ($100K), 15% marketing ($75K), 10% ops/legal ($50K), 10% contingency ($50K), and 5% for consulting like Frank's input. We'll track via monthly burn rate reports in Asana.

[10:06 AM] Alice: Thanks, Eve. Now, high-level timeline: Kickoff today, requirements gathering through end of October. Design sprint in November, dev starts December. Beta testing in March, launch April 2026. Any red flags on that?

[10:07 AM] Carol: From design's side, November sprint sounds tight if we need user research. Can we push prototypes to early December?

[10:07 AM] Alice: Noted—let's flag that for the first standup. Frank, your thoughts on feasibility from a consulting perspective?

[10:08 AM] Frank: Based on similar projects, 6 months to MVP is aggressive but doable if we prioritize core features: dashboard, basic ML models for forecasting, and export tools. Avoid scope creep on advanced viz.

[10:09 AM] Alice: Agreed. Speaking of features, Dana, walk us through the market positioning.

[10:09 AM] Dana: Sure. Target: SMBs in e-commerce and retail, 10-50 employees. Key differentiator: Plug-and-play integration with Shopify and QuickBooks. We'll launch with a freemium model—basic free, premium at $49/month. Early buzz via LinkedIn campaigns and a webinar series starting January.

[10:11 AM] Bob: Integration sounds great, but engineering-wise, Shopify API limits could bite us. We might need to batch requests.

[10:11 AM] Dana: Understood—let's loop in their dev relations if needed.

[10:12 AM] Alice: Solid. Now, roles and responsibilities. Bob, your team owns backend and ML pipeline. Carol's on frontend and UX. Dana handles go-to-market. Eve, you're our budget hawk. Frank, advisory on best practices. I'll coordinate and report to execs. Everyone cool with that?

[All]: Yes.

[10:13 AM] Alice: Great. Risks: Tech debt from rushed dev, market shifts in AI regs, team bandwidth with holidays. Mitigation: Bi-weekly check-ins, legal review in Q1, and cross-training sessions.

[10:15 AM] Bob: One more—hiring. Do we need a junior dev for the ML side?

[10:15 AM] Eve: Budget allows for one contractor at $8K/month. Post the req on Upwork by Friday?

[10:16 AM] Alice: Yes, please. Q&A time—who's got questions?

[10:16 AM] Carol: How do we handle feedback loops? User testing budget?

[10:16 AM] Eve: $10K carved out—tools like UserTesting.com.

[10:17 AM] Dana: Branding—colors? We thinking blue for trust, or green for growth?

[10:17 AM] Carol: Green vibes with analytics "growth."

[10:18 AM] Frank: On AI ethics—bias audits mandatory. Recommend Fairlearn library.

[10:18 AM] Bob: Noted, we'll integrate.

[10:19 AM] Alice: All good points. Any last items?

[10:19 AM] Eve: Just confirm Slack channel #project-alpha for async updates.

[10:20 AM] Alice: Done. Meeting adjourned—next standup Friday 10 AM. Thanks, team!

[End of Transcript – Total Duration: 20 minutes]`; // Replace with full transcript

  // Only insert if table empty
  const countRes = await client.query(`SELECT COUNT(*) FROM transcript_chunks;`);
  const count = parseInt(countRes.rows[0].count, 10);
  if (count === 0) {
    console.log("Indexing transcript into pgvector...");
    const chunks = chunkText(transcript, 800);
    for (const chunk of chunks) {
      const embRaw = await embedder(chunk);
      const emb = normalizeEmbedding(embRaw);
      const pgvec = toPgVectorLiteral(emb);
      await client.query(
        `INSERT INTO transcript_chunks (chunk_text, embedding) VALUES ($1, $2::vector);`,
        [chunk, pgvec]
      );
    }
    console.log("Indexing complete ✔");
  } else {
    console.log("Transcript already indexed, skipping indexing step.");
  }

  // Express API
  const app = express();

  app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/ask", async (req, res) => {
  try {
    const question = (req.query.question as string) || "";
    if (!question.trim()) return res.status(400).json({ error: "Missing ?question=" });

    const qEmbRaw = await embedder(question);
    const qEmbArr = normalizeEmbedding(qEmbRaw);
    const qPgVec = toPgVectorLiteral(qEmbArr);

    // Retrieve top 3 similar chunks *with* their similarity scores
    const searchRes = await client.query(
      `SELECT id, chunk_text, 1 - (embedding <=> $1::vector) AS similarity_score
       FROM transcript_chunks
       ORDER BY embedding <=> $1::vector
       LIMIT 3;`,
      [qPgVec]
    );

    if (!searchRes.rows || searchRes.rows.length === 0) {
      return res.json({ question, answer: null, score: 0, source_chunk: null });
    }

    // NEW: Filter for relevant chunks (similarity > 0.3 threshold)
    const relevantRows = searchRes.rows.filter(row => (row.similarity_score ?? 0) > 0.3);
    if (relevantRows.length === 0) {
      return res.json({ question, answer: null, score: 0, source_chunk: null, note: "No relevant context found" });
    }

    // Run QA on top relevant chunk (or loop if you want multi-context)
    let bestAnswer: { answer: string; score: number; source_chunk: string } | null = null;
    // For simplicity, just use the highest-similarity one (extend to loop over relevantRows if needed)
    const topRow = relevantRows[0]; // Or sort by similarity_score descending
    const result: any = await answerer(question, topRow.chunk_text);
    const ansText = (result.answer ?? "").trim(); // Trim for cleanliness
    const ansScore = typeof result.score === "number" ? result.score : 0;

    // NEW: Also gate on QA score (e.g., >0.5 for "good enough")
    if (ansScore > 0.5) {
      bestAnswer = { answer: ansText, score: ansScore, source_chunk: topRow.chunk_text };
    }

    return res.json({
      question,
      answer: bestAnswer?.answer ?? null,
      score: bestAnswer?.score ?? 0,
      source_chunk: bestAnswer?.source_chunk ?? null,
      similarity: topRow.similarity_score ?? 0, // Bonus: Expose retrieval score for debugging
    });
  } catch (err: any) {
    console.error("API error:", err);
    return res.status(500).json({ error: err.message || String(err) });
  }
});

  app.listen(HTTP_PORT, () => {
    console.log(`Server running → http://localhost:${HTTP_PORT}`);
    console.log(`Example question: http://localhost:${HTTP_PORT}/ask?question=Weather today?`);
  });
}

startServer().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});