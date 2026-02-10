import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  constructor(apiKey) {
    // Use provided key, or fallback to env var (useful for dev)
    const key = apiKey || import.meta.env.VITE_GEMINI_API_KEY;

    if (!key) {
      throw new Error(
        "API Key is required. Please provide it in the settings.",
      );
    }
    this.ai = new GoogleGenAI({ apiKey: key });
  }

  async sendMessage(contents) {
    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash",
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
