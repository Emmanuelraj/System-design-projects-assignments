import express from 'express';
import fileUpload from 'express-fileupload';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const UPLOAD_BASE = process.env.UPLOAD_BASE || './uploads';

import cors from 'cors';

// Configure CORS (allow specific origins)
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],  // React Vite dev + prod if same domain
  credentials: true,  // If using cookies/auth
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization']  // e.g., for FormData uploads
}));

// In-memory store: Map<postId, attachments[]>
const attachmentsStore = new Map();  // Simple array-like for metadata (replace with DB later)

app.use(express.json());
app.use(fileUpload({
    limits: { fileSize: 2 * 1024 * 1024 * 1024 },  // 2GB for videos
    safeFileNames: true
}));

// Ensure base dir exists
fs.mkdir(UPLOAD_BASE, { recursive: true }).catch(console.error);

// POST: Upload (adds to store)
app.post('/api/challenges', async (req, res) => {
    try {
        const postId = req.body.postId || 'general';
        const dir = path.join(UPLOAD_BASE, postId.toString());
        await fs.mkdir(dir, { recursive: true });

        // Your existing logic (runs always)
        console.log("other existing logic");  // e.g., handle raw message

        const newAttachments = [];
        if (req.files && req.files.files) {
            const uploadedFiles = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
            for (const file of uploadedFiles) {
                const fileName = `${Date.now()}-${file.name}`;
                const filePath = path.join(dir, fileName);
                await file.mv(filePath);
                const att = {
                    name: fileName,
                    url: `http://localhost:3000/uploads/${postId}/${fileName}`,  // Full URL
                    type: file.mimetype,  // e.g., 'image/jpeg', 'video/mp4', 'application/pdf'
                    size: file.size
                };
                newAttachments.push(att);
            }
        }

        // Store metadata (documents/images/videos uniform)
        if (!attachmentsStore.has(postId)) {
            attachmentsStore.set(postId, []);
        }
        attachmentsStore.get(postId).push(...newAttachments);  // Append to array

        res.json({ success: true, postId, attachments: newAttachments });  // Recent uploads
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
});

// GET: Fetch attachments for post (from store)
app.get('/api/challenges/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        const atts = attachmentsStore.get(postId) || [];
        res.json({ postId, attachments: atts });  // All for this post
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve files (images/docs/videos)
app.use('/uploads', express.static(UPLOAD_BASE));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));