import { ConversationManager } from '../ai/ConversationManager.js';
import { VoiceInput } from './VoiceInput.js';
import { VoiceOutput } from './VoiceOutput.js';
import { UIControls } from './UIControls.js';

export class InteractionController {
  constructor(eventBus, animationEngine) {
    this.eventBus = eventBus;
    this.animationEngine = animationEngine;
    this.conversation = new ConversationManager();
    this.voiceInput = new VoiceInput(eventBus);
    this.voiceOutput = new VoiceOutput(eventBus);
    this.ui = new UIControls(eventBus);
    this.isBusy = false;

    this._setupListeners();
  }

  _setupListeners() {
    // User taps a response option
    this.eventBus.on('ui:optionSelected', (option) => {
      this._handleUserInput(option);
    });

    // User types and sends text
    this.eventBus.on('ui:textSubmitted', (text) => {
      this._handleUserInput(text);
    });

    // User speaks via microphone
    this.eventBus.on('voice:result', ({ transcript }) => {
      this._handleUserInput(transcript);
    });

    // Microphone controls
    this.eventBus.on('ui:micStart', () => {
      this.voiceInput.startListening();
    });

    this.eventBus.on('ui:micStop', () => {
      this.voiceInput.stopListening();
    });

    // Hide mic if not supported
    if (!this.voiceInput.isSupported()) {
      this.ui.showMicUnsupported();
    }
  }

  async start() {
    this.ui.showLoading();
    this.ui.setDialogText('');

    // Small delay to let the avatar render first
    await this._delay(800);

    // Play initial wave animation
    this.animationEngine.transitionTo('wave');

    const response = await this.conversation.getInitialGreeting();
    this.ui.hideLoading();
    await this._presentResponse(response);
  }

  async _handleUserInput(userText) {
    if (this.isBusy) return;
    this.isBusy = true;

    // Clear current options
    this.ui.clearOptions();
    this.voiceInput.stopListening();

    // Show thinking state
    this.animationEngine.transitionTo('thinking');
    this.ui.setDialogText('...');

    // Check if user wants to restart
    if (userText.toLowerCase() === 'start over') {
      this.conversation.reset();
      this.isBusy = false;
      await this.start();
      return;
    }

    // Get AI response
    const response = await this.conversation.processUserInput(userText);
    await this._presentResponse(response);

    this.isBusy = false;
  }

  async _presentResponse(response) {
    // Map emotion to animation state
    const emotionToState = {
      happy: 'happy',
      excited: 'happy',
      thinking: 'thinking',
      encouraging: 'encouraging',
      neutral: 'idle',
    };

    // First play the specified animation (wave, nod, etc.)
    const animState = response.animation || 'talking';
    if (animState === 'wave') {
      this.animationEngine.transitionTo('wave');
      await this._delay(600);
    } else if (animState === 'nod') {
      this.animationEngine.transitionTo('nod');
      await this._delay(400);
    }

    // Set dialog text
    this.ui.setDialogText(response.spokenText);

    // Transition to talking state and speak
    this.animationEngine.transitionTo('talking');
    await this.voiceOutput.speak(response.spokenText);

    // After speaking, show the emotion
    const emotionState = emotionToState[response.emotion] || 'idle';
    this.animationEngine.transitionTo(emotionState);
    await this._delay(500);

    // Show response options
    this.ui.showOptions(response.suggestedOptions);
    this.isBusy = false;
  }

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
