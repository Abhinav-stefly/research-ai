import axios from "axios";
import { ENV } from "./env.js";

export const hfClient = axios.create({
  baseURL: "https://api-inference.huggingface.co/models/",
  headers: {
    Authorization: `Bearer ${ENV.HF_API_KEY}`,
    "Content-Type": "application/json"
  }
});
