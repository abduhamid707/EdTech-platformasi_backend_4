import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // .env faylidan kalitni o‘qiydi
});

export default openai;
