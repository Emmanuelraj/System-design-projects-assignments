// Import pipeline from Transformers.js – used for embedding chunks to vectors (feature-extraction)
import { pipeline } from '@xenova/transformers';  // For embedding pipeline

// Import Express types – Request/Response for HTTP handling
import express, { Request, Response } from 'express';

// Import ollama – for local LLM generation (answer from retrieved chunks)
import ollama from 'ollama';  // npm i ollama

// Create Express app – the server to handle HTTP requests
const app = express();

// Middleware to parse JSON bodies – if POST requests come later (not needed for GET /qa-transcript)
app.use(express.json());

// Hardcoded transcript – this is your starting point, a single string from Graph API (joined utterances)
const transcript: string = `[Meeting Transcript - Project Alpha Kickoff - Oct 15, 2025 - 10:00 AM]

[10:00] Alice (Project Lead): Good morning, team. Welcome to the Project Alpha kickoff. Today’s agenda: Review goals, assign roles, discuss timeline, and Q&A. Let's start with goals. Our main objective is to launch a new AI chatbot by Q1 2026. Budget: $500K. Key milestones: Prototype by Nov 30, beta test Dec 15.

[10:02] Bob (Dev Lead): Sounds good, Alice. On tech stack – we’re sticking with Node.js for the backend, React for frontend, and PostgreSQL for data. But for the AI part, should we use Ollama locally or something cloud-based? Privacy is key here.

[10:04] Alice: Local all the way – no data leaving our servers. Ollama with Phi-3 model fits perfect. Budget allows for a small GPU server if needed.

[10:06] Carol (Designer): Great. For UX, I’ve mocked up wireframes: Simple chat interface with Adaptive Cards for Teams integration. Agenda item 2: Roles. Alice leads overall, Bob on dev, me on design, Dave on testing.

[10:08] Dave (QA): Yep, testing. I'll focus on edge cases like long transcripts causing memory issues. Timeline: We need to chunk data early to avoid that.

[10:10] Bob: Timeline breakdown – Week 1: Setup repo and DB schema. Include pgvector for vector storage. Week 2: Implement chunking and embeddings. Use Transformers.js locally.

[10:12] Alice: Agreed. Risks: Delays in model downloads. Mitigation: Pre-pull Ollama models. Q&A time – any questions on goals?

[10:14] Eve (Stakeholder): One: How does this tie to company OKRs? Answer: Directly supports Objective 3: Innovate internal tools.

[10:16] Bob: Tech Q: For embeddings, all-MiniLM-L6-v2 – 384 dimensions, right? Output as arrays for pgvector.

[10:18] Carol: Design Q: Colors? Match Teams blue.

[10:20] Alice: Noted. Moving to timeline deep-dive. Gantt chart shared in chat. Critical path: Embeddings by end of Week 2, or we slip beta.

[10:22] Dave: Testing plan: Unit tests for cosine similarity in retrieval. Threshold 0.5 for relevance.

[10:24] Eve: Budget approval? Yes, from finance last week.

[10:26] Alice: Wrap-up. Action items: Bob – setup pgvector table by Friday. Carol – finalize wireframes. All – review transcript summary via bot. Meeting adjourned at 10:30.`;

// Global "store" – in-memory array for embeddings (dev alternative to DB)
let vectorStore: { chunk: string; embedding: number[] }[] = [];

// Step 1: Chunking function – takes transcript string, breaks into array of strings (chunks)
function chunkTranscript(transcript: string, chunkSize: number = 400, overlap: number = 50): string[] {
  // Split transcript into array of words – /\s+/ matches spaces/newlines, filter removes empty
  const words: string[] = transcript.split(/\s+/).filter(word => word.length > 0);
  // Initialize empty array for chunks
  const chunks: string[] = [];
  // Start index for first chunk – 0 (beginning of words array)
  let chunkStart = 0;
  // Start index for chunk numbering – 1
  let chunkIndex = 1;

  // Loop while there are words left to chunk – keeps slicing until end
  while (chunkStart < words.length) {
    // Calculate end index for this chunk – min of (start + size, total words) to avoid overflow
    const chunkEnd = Math.min(chunkStart + chunkSize, words.length);
    // Slice words array from start to end – gets the words for this chunk
    const chunkWords = words.slice(chunkStart, chunkEnd);
    // Join words back to string – reconstructs the chunk text
    const rawChunkText = chunkWords.join(' ');
    // Count words in this chunk – length of chunkWords array
    const wordCount = chunkWords.length;

    // Find first timestamp in chunk text – regex matches [HH:MM]
    const timeMatch = rawChunkText.match(/\[(\d{2}:\d{2})\]/);
    // Set time tag – if match, use time + '-approx', else 'General'
    const timeTag = timeMatch ? timeMatch[1] + '-approx' : 'General';
    // Build full chunk string – tag + word count + raw text
    const fullChunk = `[Chunk ${chunkIndex}: ${timeTag}, ${wordCount} words] ${rawChunkText.trim()}`;
    
    // Add full chunk to array
    chunks.push(fullChunk);
    // Increment chunk number for next
    chunkIndex++;

    // Advance start for next chunk – size minus overlap (slides forward)
    chunkStart += chunkSize - overlap;
  }

  // Return the array of all chunks – dynamic count based on transcript length
  return chunks;
}

// Step 2: Embedding function – takes chunks array, converts each to vector (384 numbers)
async function embedChunks(chunks: string[]): Promise<{ chunk: string; embedding: number[] }[]> {
  // Load the embedding model – 'feature-extraction' extracts meaning as numbers, 'all-MiniLM-L6-v2' is small/fast (384-dim)
  const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  // Initialize empty array for embedding objects
  const embeddings: { chunk: string; embedding: number[] }[] = [];

  // Loop through each chunk
  for (const chunk of chunks) {
    // Run extractor on chunk – pooling='mean' averages word vectors, normalize=true scales for similarity math
    const output = await extractor(chunk, { pooling: 'mean', normalize: true });
    // Convert output.data (Float32Array) to regular array of numbers – 384 floats (-1 to 1)
    const embedding = Array.from(output.data) as number[];
    // Add object with original chunk + its vector to array
    embeddings.push({ chunk, embedding });
  }

  // Log completion – shows how many chunks were embedded
  console.log(`Embedded ${chunks.length} chunks (384-dim vectors each).`);
  // Return array of embedding objects
  return embeddings;
}

// Step 3: "Store" embeddings in-memory – takes embeddings array, adds to global array
function storeEmbeddings(embeddings: { chunk: string; embedding: number[] }[]): number[] {
  // Clear old for fresh start – vectorStore = [] (dev reset)
  vectorStore = [];
  // Add new embeddings to array – each object with chunk text + vector
  embeddings.forEach((e) => {
    vectorStore.push(e);
  });
  // Return "IDs" as indices (0-based for dev)
  const insertedIds = embeddings.map((_, i) => i);
  // Log completion
  console.log(`Stored ${insertedIds.length} embeddings in-memory. Total in store: ${vectorStore.length}`);
  // Return indices for reference
  return insertedIds;
}

// Step 4: Retrieve – embed question, find top matching chunks from store
async function retrieveChunks(question: string, topK: number = 2): Promise<{ chunk: string; score: number }[]> {
  // Load extractor for question vector – same model as embed
  const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  // Extract question embedding – mean pooling, normalize
  const output = await extractor(question, { pooling: 'mean', normalize: true });
  const queryEmbedding = Array.from(output.data) as number[];

  // Cosine similarity function – math to score how close vectors are (0-1, 1 = identical meaning)
  function cosineSimilarity(vecA: number[], vecB: number[]): number {
    const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);  // Dot product
    const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));  // Magnitude A
    const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));  // Magnitude B
    return dot / (magA * magB);  // Cosine = dot / (magA * magB)
  }

  // Map store to scores – loop vectorStore, compute similarity for each
  const scored = vectorStore.map(item => ({
    chunk: item.chunk,
    score: cosineSimilarity(queryEmbedding, item.embedding)
  }));

  // DEBUG: Log all scores to see what's happening
  console.log(`Scores for "${question}":`, scored.map(s => ({ preview: s.chunk.substring(0, 50) + '...', score: s.score.toFixed(3) })));

  // FIXED: Filter >0.2 (lenient for short samples – catches 0.201), sort descending, slice topK
  // Fallback: If no matches >0.2, take top 1 anyway for testing
  let filtered = scored.filter(item => item.score > 0.2)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
  if (filtered.length === 0) {
    filtered = scored.sort((a, b) => b.score - a.score).slice(0, topK);  // Fallback to top even if low
    console.log('Fallback: No matches >0.2, using top scores');
  }
  return filtered;
}
// Step 5: Generate answer – stuff retrieved chunks into Ollama prompt
async function generateAnswer(question: string, retrieved: { chunk: string; score: number }[]): Promise<string> {
  if (retrieved.length === 0) return 'No relevant info in transcript.';

  // Join chunks as context – separator for clarity
  const context = retrieved.map(r => r.chunk).join('\n\n---\n\n');
  // Build prompt – instruct Ollama to answer based on context only
  const prompt = `Based on this meeting transcript excerpts:\n${context}\n\nQuestion: ${question}\n\nAnswer concisely, citing chunks if possible.`;

  // Call Ollama chat – model 'phi-3-mini' for local gen, user message with prompt
  const response = await ollama.chat({
    model: 'microsoft/phi-3-mini-4k-instruct',
    messages: [{ role: 'user', content: prompt }],
  });

  // Trim and return the generated answer
  return response.message.content.trim();
}

// Single API endpoint – GET /qa-transcript?question=What is the agenda? (chains all steps: chunk → embed → store → retrieve → generate)
app.get('/qa-transcript', async (req: Request, res: Response) => {
  try {
    const { question = "What is the agenda?" } = req.query;  // Get question from query param (default sample)
    // Chain Step 1: Get chunks from transcript
    const chunks = chunkTranscript(transcript);
    // Chain Step 2: Embed chunks to vectors
    const embeddings = await embedChunks(chunks);
    // Chain Step 3: Store embeddings in-memory
    storeEmbeddings(embeddings);
    // Chain Step 4: Retrieve top matching chunks for question
    const retrieved = await retrieveChunks(question as string);
    // Chain Step 5: Generate answer from retrieved chunks
    const answer = await generateAnswer(question as string, retrieved);
    // Send JSON response – success true, question, retrieved count, final answer
    res.json({
      success: true,
      question,  // Echo question
      retrievedChunks: retrieved.length,  // Number of matches
      answer  // Generated text from Ollama
    });
  } catch (error) {
    // If error, log it and send 500 JSON
    console.error('QA-transcript error:', error);
    res.status(500).json({ success: false, error: 'QA failed' });
  }
});

// Start server on port 3000 – listens for requests
app.listen(3000, () => {
  // Log server start – with test command
  console.log('RAG Q&A Server on http://localhost:3000');
  console.log('Test: GET /qa-transcript?question=What%20is%20the%20agenda?');
});