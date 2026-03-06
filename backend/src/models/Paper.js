import mongoose from "mongoose";

const paperSchema = new mongoose.Schema(
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  filePath: String,
  rawText: String,
  cleanedText: String,
  sections: Object,
  summaries: Object,
  citations: Array,
  embeddings: [Number]
},
{ timestamps: true }
);

export default mongoose.models.Paper || mongoose.model("Paper", paperSchema);
