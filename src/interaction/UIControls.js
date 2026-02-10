export class UIControls {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.dialogText = document.getElementById('dialog-text');
    this.optionsContainer = document.getElementById('options-container');
    this.inputContainer = document.getElementById('input-container');
    this.textInput = document.getElementById('text-input');
    this.sendButton = document.getElementById('send-button');
    this.micButton = document.getElementById('mic-button');
    this.micLabel = document.getElementById('mic-label');
    this.loadingOverlay = document.getElementById('loading-overlay');

    this._setupTextInput();
    this._setupMicButton();
    this._setupVoiceListeners();
  }

  _setupTextInput() {
    const sendMessage = () => {
      const text = this.textInput.value.trim();
      if (text) {
        this.disableInput();
        this.eventBus.emit('ui:textSubmitted', text);
        this.textInput.value = '';
      }
    };

    this.sendButton.addEventListener('click', sendMessage);
    this.textInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }

  _setupMicButton() {
    this.micButton.addEventListener('click', () => {
      if (this.micButton.classList.contains('listening')) {
        this.eventBus.emit('ui:micStop');
      } else {
        this.eventBus.emit('ui:micStart');
      }
    });
  }

  _setupVoiceListeners() {
    this.eventBus.on('voice:listening', () => {
      this.micButton.classList.add('listening');
      this.micLabel.textContent = 'Listening...';
    });

    this.eventBus.on('voice:ended', () => {
      this.micButton.classList.remove('listening');
      this.micLabel.textContent = 'Tap to speak';
    });

    this.eventBus.on('voice:error', () => {
      this.micButton.classList.remove('listening');
      this.micLabel.textContent = 'Tap to speak';
    });
  }

  setDialogText(text) {
    this.dialogText.style.opacity = '0';
    setTimeout(() => {
      this.dialogText.textContent = text;
      this.dialogText.style.opacity = '1';
    }, 150);
  }

  showOptions(options) {
    this.optionsContainer.innerHTML = '';

    options.forEach((option) => {
      const btn = document.createElement('button');
      btn.className = 'option-button';
      btn.textContent = option;
      btn.addEventListener('click', () => {
        this.disableOptions();
        this.eventBus.emit('ui:optionSelected', option);
      });
      this.optionsContainer.appendChild(btn);
    });

    this.enableInput();
  }

  clearOptions() {
    this.optionsContainer.innerHTML = '';
    this.disableInput();
  }

  disableOptions() {
    const buttons = this.optionsContainer.querySelectorAll('.option-button');
    buttons.forEach(btn => {
      btn.disabled = true;
    });
    this.disableInput();
  }

  enableInput() {
    this.inputContainer.classList.remove('hidden');
    this.micButton.classList.remove('hidden');
    this.textInput.disabled = false;
    this.sendButton.disabled = false;
  }

  disableInput() {
    this.inputContainer.classList.add('hidden');
    this.micButton.classList.add('hidden');
    this.textInput.disabled = true;
    this.sendButton.disabled = true;
  }

  showLoading() {
    this.loadingOverlay.classList.remove('hidden');
  }

  hideLoading() {
    this.loadingOverlay.classList.add('hidden');
  }

  showMicUnsupported() {
    this.micButton.style.display = 'none';
  }
}
