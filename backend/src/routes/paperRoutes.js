import express from "express";
import { uploadPaper } from "../controllers/paperController.js";
import { protect} from "../middleware/authMiddleware.js";
import { uploadPDF } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/upload",
  protect,
  uploadPDF.single("pdf"),
  uploadPaper
);

export default router;
