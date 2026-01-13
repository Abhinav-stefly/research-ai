import mongoose from "mongoose";

const paperSchema = new mongoose.Schema(
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  filePath: String,
  rawText: String,
  cleanedText: String,
  sections: Object,
  citations: Array
},
{ timestamps: true }
);

export default mongoose.model("Paper", paperSchema);
