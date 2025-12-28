import mongoose from "mongoose";

const paperSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  text: String,
  sections: Array,
  summary: String,
  embeddings: Array
}, { timestamps: true });

export default mongoose.model("Paper", paperSchema);
