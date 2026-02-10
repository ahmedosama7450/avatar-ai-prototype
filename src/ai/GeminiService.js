import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "VITE_GEMINI_API_KEY is required. Add it to your .env file.",
      );
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async sendMessage(contents) {
    const response = await this.ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents,
      config: {
        temperature: 0.7,
        maxOutputTokens: 300,
        responseMimeType: "application/json",
      },
    });

    const text = response.text.trim();
    return JSON.parse(text);
  }
}
