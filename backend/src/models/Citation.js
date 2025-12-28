import mongoose from "mongoose";

const citationSchema = new mongoose.Schema({
  paper: { type: mongoose.Schema.Types.ObjectId, ref: "Paper" },
  citedPaper: String
});

export default mongoose.model("Citation", citationSchema);
