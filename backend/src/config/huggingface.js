import axios from "axios";
import { ENV } from "./env.js";

export const hfClient = axios.create({
  baseURL: "https://router.huggingface.co/api/models/",
  headers: {
    Authorization: `Bearer ${ENV.HF_API_KEY}`,
    "Content-Type": "application/json"
  }
});
