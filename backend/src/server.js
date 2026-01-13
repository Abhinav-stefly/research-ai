import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { ENV } from "./config/env.js";

import authRoutes from "./routes/authRoutes.js";
import paperRoutes from "./routes/paperRoutes.js";
//import aiRoutes from "./routes/aiRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
const { PORT } = ENV;
const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/papers", paperRoutes);
//app.use("/api/ai", aiRoutes);

app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
