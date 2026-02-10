export class VoiceOutput {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.synth = window.speechSynthesis;
    this.preferredVoice = null;
    this.supported = "speechSynthesis" in window;
    this._loadVoice();
  }

  _loadVoice() {
    if (!this.supported) return;

    const setVoice = () => {
      const voices = this.synth.getVoices();
      if (voices.length === 0) return;

      this.preferredVoice =
        voices.find((v) => v.name.includes("Natural")) ||
        voices.find((v) => v.name.includes("Online")) ||
        voices.find((v) => v.name.includes("Google UK English Female")) ||
        voices.find(
          (v) =>
            v.lang.startsWith("en") && v.name.toLowerCase().includes("female"),
        ) ||
        voices.find(
          (v) =>
            v.lang.startsWith("en") && !v.name.toLowerCase().includes("male"),
        ) ||
        voices.find((v) => v.lang.startsWith("en")) ||
        voices[0];
    };

    setVoice();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = setVoice;
    }
  }

  speak(text) {
    if (!this.supported) {
      this.eventBus.emit("speech:end");
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      if (this.preferredVoice) {
        utterance.voice = this.preferredVoice;
      }
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        this.eventBus.emit("speech:start");
      };

      utterance.onboundary = (event) => {
        if (event.name === "word") {
          this.eventBus.emit("speech:word", event);
        }
      };

      utterance.onend = () => {
        this.eventBus.emit("speech:end");
        resolve();
      };

      utterance.onerror = () => {
        this.eventBus.emit("speech:end");
        resolve();
      };

      this.synth.speak(utterance);
    });
  }

  stop() {
    if (this.supported) {
      this.synth.cancel();
    }
  }

  isSupported() {
    return this.supported;
  }
}
