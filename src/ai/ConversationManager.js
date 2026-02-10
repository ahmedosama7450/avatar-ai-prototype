import { GeminiService } from './GeminiService.js';
import { SYSTEM_PROMPT, INITIAL_MESSAGE } from './SystemPrompt.js';

export class ConversationManager {
  constructor() {
    this.gemini = new GeminiService();
    this.history = [];
    this.currentStage = 'GREETING';
  }

  async getInitialGreeting() {
    this.history = [];

    const contents = this._buildContents(INITIAL_MESSAGE);
    const response = await this.gemini.sendMessage(contents);

    this._addToHistory('user', INITIAL_MESSAGE);
    this._addToHistory('model', JSON.stringify(response));
    this.currentStage = response.stage || 'GREETING';
    return this._normalizeResponse(response);
  }

  async processUserInput(userText) {
    this._addToHistory('user', userText);
    const contents = this._buildContents(userText);
    const response = await this.gemini.sendMessage(contents);

    this._addToHistory('model', JSON.stringify(response));
    this.currentStage = response.stage || this.currentStage;
    return this._normalizeResponse(response);
  }

  _buildContents(latestUserMessage) {
    const contents = [
      { role: 'user', parts: [{ text: SYSTEM_PROMPT + '\n\nNow begin the conversation. The child says: ' + latestUserMessage }] },
    ];

    for (const entry of this.history) {
      contents.push({
        role: entry.role,
        parts: [{ text: entry.text }],
      });
    }

    return contents;
  }

  _addToHistory(role, text) {
    this.history.push({ role, text });
    if (this.history.length > 20) {
      this.history = this.history.slice(-16);
    }
  }

  _normalizeResponse(response) {
    return {
      spokenText: response.spokenText || "That's great! Let's keep going!",
      emotion: response.emotion || 'happy',
      animation: response.animation || 'talking',
      suggestedOptions: response.suggestedOptions || ['Okay!', 'Tell me more'],
      stage: response.stage || this.currentStage,
    };
  }

  reset() {
    this.history = [];
    this.currentStage = 'GREETING';
  }
}
