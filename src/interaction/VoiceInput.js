export class VoiceInput {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.recognition = null;
    this.isListening = false;
    this.supported = false;
    this._init();
  }

  _init() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    this.supported = true;
    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'en-US';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
    this.recognition.continuous = false;

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      this.isListening = false;
      this.eventBus.emit('voice:result', { transcript });
    };

    this.recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      this.isListening = false;
      this.eventBus.emit('voice:error', event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.eventBus.emit('voice:ended');
    };
  }

  startListening() {
    if (!this.supported || this.isListening) return;
    try {
      this.recognition.start();
      this.isListening = true;
      this.eventBus.emit('voice:listening');
    } catch (e) {
      console.warn('Could not start speech recognition:', e);
    }
  }

  stopListening() {
    if (!this.isListening) return;
    this.recognition.stop();
  }

  isSupported() {
    return this.supported;
  }
}
