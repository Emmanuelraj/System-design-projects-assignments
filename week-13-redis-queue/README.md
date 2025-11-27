# Redis Queue Recap Guide

## Quick Overview
Redis acts as a fast, in-memory queue for async tasks (e.g., offload heavy processing like meeting transcription/summarization). Use it over DBs for speed; supports TTL for cache-like expiry. Scenario: UI acknowledges instantly → Queue job → Workers process in background.

**Why Redis?** RAM-based (faster than persistent queues like RabbitMQ), simple lists for FIFO, blocking pops for efficient workers.

## Setup Recap
1. **Start Redis:** `redis-server` (or Docker: `docker run -p 6379:6379 redis`).
2. **CLI Test:** `redis-cli` → `PING` → `PONG`.
3. **Project Folders:** `teams-bot/` (API queues jobs) + `worker/` (processes queue).
4. **Deps:** `npm i redis express body-parser` (API); `npm i redis` (worker).
5. **Run:** API: `npm start` (:3000). Workers: Multiple terminals `npm start` for scaling.

## Core Commands Table
| Category | Command | Example | Purpose | Notes |
|----------|---------|---------|---------|-------|
| **Cache Basics** | `SET key value [EX secs]` | `SET mykey "Hello" EX 60` | Store with optional TTL | In-memory, fast retrieval. |
| | `GET key` | `GET mykey` | Retrieve value | Returns `nil` if expired/missing. |
| | `DEL key` | `DEL mykey` | Remove key | For cleanup. |
| | `KEYS *` | `KEYS *` | List all keys | Debug only (slow in prod). |
| **Queue Push** | `LPUSH key value` | `LPUSH jobs '{"task":"summarize"}'` | Enqueue to head (left) | FIFO setup; value as JSON string. |
| | `RPUSH key value` | `RPUSH jobs '{"task":"summarize"}'` | Enqueue to tail (right) | Alternative FIFO. |
| **Queue Pop** | `RPOP key` | `RPOP jobs` | Dequeue from tail | Non-blocking; `nil` if empty. |
| | `LPOP key` | `LPOP jobs` | Dequeue from head | Non-blocking. |
| **Blocking Pop** | `BRPOP key timeout` | `BRPOP jobs 0` | Wait for dequeue | `0` = forever; use in workers. |
| **Queue Info** | `LLEN key` | `LLEN jobs` | Queue length | e.g., `5` items pending. |

## Code Snippets Recap
### API (teams-bot/src/index.ts) - Queue on Submit
```typescript
import express from 'express';
import { createClient } from 'redis';
const app = express(); app.use(express.json());
const client = createClient(); client.connect();

app.post('/submit', async (req, res) => {
  const job = JSON.stringify(req.body); // e.g., {meetingCode: "..."}
  await client.lPush('jobs', job);
  res.json({ message: 'Acknowledged! Processing...' });
});
app.listen(3000);
```

### Worker (worker/src/worker.ts) - Process Queue
```typescript
import { createClient } from 'redis';
const client = createClient(); client.connect();

async function worker() {
  while (true) {
    const [_, jobStr] = await client.brPop('jobs', 0);
    if (jobStr) {
      const job = JSON.parse(jobStr);
      console.log('Processing:', job);
      // Simulate heavy work (e.g., OpenAI call)
      await new Promise(r => setTimeout(r, 2000));
      console.log('Done:', job.userId);
    }
  }
}
worker();
```

## Running & Testing Table
| Step | Action | Expected Outcome | Tips |
|------|--------|------------------|------|
| **1. Redis Up** | `redis-server` | Server logs: "Ready to accept connections" | Check: `redis-cli PING`. |
| **2. Start API** | `cd teams-bot && npm start` | "API on 3000" | POST `/submit` via Postman with JSON payload. |
| **3. Start Worker(s)** | `cd worker && npm start` (x4 terminals) | Loops: "Processing job..." | Scale for load; watches queue. |
| **4. Test Load** | Hit `/submit` 5x in Postman | API: "Acknowledged"; Workers: Sequential logs. | Monitor: `redis-cli LLEN jobs`. |
| **5. Debug** | `redis-cli` → `KEYS *` or `RPOP jobs` | Keys/jobs listed | Clear: `DEL jobs`. Stop: `SHUTDOWN`. |

## Scaling & Best Practices
- **Multiple Workers:** Run N instances; each `BRPOP` grabs next job (no locks needed).
- **Error Handling:** Add try-catch + reconnect in prod.
- **Extend:** Add pub/sub for notifications (e.g., `client.publish('done', jobId)`).
- **Limits:** Use TTL on jobs (`client.expire('jobs', 3600)`); monitor memory.

To add this to your repo:  
1. Open your project root folder in a text editor (e.g., VS Code).  
2. Create a new file named `README.md` (ensure .md extension).  
3. Copy-paste the entire content above into it.  
4. Save and commit: `git add README.md && git commit -m "Add Redis queue recap"`.  

If it's a GitHub repo, you can also edit directly online: Go to your repo → "Add file" → "Create new file" → Name it `README.md` → Paste content → Commit. If you still can't find/see it, check your file explorer (hidden files? Wrong folder?) or share a screenshot for more help! 🚀