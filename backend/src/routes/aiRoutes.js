import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { summarizePaper, explain, explainMath, getSimilarPapers } from "../controllers/aiController.js";

const router = express.Router();

// GET /api/ai/summarize/:id?mode=short|detailed
router.get('/summarize/:id', protect, summarizePaper);

// POST /api/ai/explain  { text, level }
router.post('/explain', protect, express.json(), explain);

// POST /api/ai/math-explain { text, level }
router.post('/math-explain', protect, express.json(), explainMath);

// GET /api/ai/similar/:id?topN=5
router.get('/similar/:id', protect, getSimilarPapers);

export default router;
