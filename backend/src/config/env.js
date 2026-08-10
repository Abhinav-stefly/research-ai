import dotenv from "dotenv";
dotenv.config();

const requiredEnv = ["MONGO_URI", "JWT_SECRET", "HF_API_KEY"];
const requiredProdEnv = [...requiredEnv, "FRONTEND_URL"];

const missing = (process.env.NODE_ENV === "production" ? requiredProdEnv : requiredEnv).filter(
  (name) => !process.env[name]
);
if (process.env.NODE_ENV === "production" && missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
}

missing.forEach((name) => {
  console.warn(`Warning: ${name} is not set`);
});

export const ENV = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  HF_API_KEY: process.env.HF_API_KEY,
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000"
};
