import express from "express";
import { uploadPaper, getCitations, getPaper, reprocessPaper, getPapers } from "../controllers/paperController.js";
import { protect} from "../middleware/authMiddleware.js";
import { uploadPDF } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/upload",
  protect,
  uploadPDF.single("pdf"),
  uploadPaper
);

router.get('/', protect, getPapers);
router.post('/:id/reprocess', protect, reprocessPaper);
router.get('/:id', protect, getPaper);
router.get('/:id/citations', protect, getCitations);

export default router;
