import mongoose from "mongoose";

const citationSchema = new mongoose.Schema({
  paper: { type: mongoose.Schema.Types.ObjectId, ref: "Paper", required: true },
  referenceIndex: Number,
  referenceText: String,
  inlineRaw: String,
  context: String
}, { timestamps: true });

export default mongoose.models.Citation || mongoose.model("Citation", citationSchema);
