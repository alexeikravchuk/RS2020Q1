export default class Controller {
  constructor() {
    this.model = null;
    this.container = null;
  }

  init(model, container) {
    this.model = model;
    this.container = container;

    this.listeners = {
      keydown: (e) => this.keyAction(e),
      keyup: (e) => this.keyAction(e),
      mousedown: (e) => this.mouseAction(e),
      mouseup: (e) => this.mouseAction(e),
    };

    this.addListeners();
  }

  addListeners() {
    Object.keys(this.listeners).forEach((listener) => {
      document.addEventListener(listener, this.listeners[listener]);
    });
  }

  removeEventListeners() {
    Object.keys(this.listeners).forEach((listener) => {
      document.removeEventListener(listener, this.listeners[listener]);
    });
  }

  keyAction(e) {
    e.preventDefault();
    const keys = Array.from(this.container.querySelectorAll('.key'));
    const targetKey = keys.find((key) => key.dataset.code === e.code);
    if (targetKey) {
      this.determineKeyAction.call(this, targetKey, e);
    }
  }

  determineKeyAction(key, e) {
    if (e.type === 'keydown') {
      return this.keyDownAction(key);
    }
    return this.keyUpAction(key);
  }

  mouseAction(e) {
    if (e.type === 'mousedown' && e.target.classList.contains('key')) {
      return this.keyDownAction(e.target);
    }

    if (e.target.classList.contains('text-field')) {
      const cursorPosition = e.target.selectionStart;
      return this.model.moveCursore(cursorPosition);
    }

    if (
      e.type === 'mouseup' &&
      e.target.classList.contains('key') &&
      !/^Shift|^Caps/.test(e.target.dataset.code)
    ) {
      return this.keyUpAction(e.target);
    }

    return null;
  }

  keyDownAction(key) {
    key.classList.toggle('active');
    if (!key.classList.contains('special_key')) {
      return this.model.addCharacterToLine(key.dataset.code);
    }
    if (/^Shift/.test(key.dataset.code)) {
      Controller.changeShiftSynchronActivity(key.dataset.code);
    }

    return this.executeSpecialCommand(key);
  }

  keyUpAction(key) {
    if (key.dataset.code !== 'CapsLock') {
      key.classList.remove('active');
    }
    if (key.classList.contains('special_key')) {
      this.specialKeyUpAction(key);
    }
  }

  executeSpecialCommand(key) {
    switch (key.dataset.code) {
      case 'Backspace':
        this.model.removeCharacter('before');
        break;
      case 'Tab':
        this.model.addTabToLine();
        break;
      case 'Delete':
        this.model.removeCharacter('after');
        break;
      case 'CapsLock':
        this.model.toggleCapsLock();
        break;
      case 'Enter':
        this.model.goToNewLine();
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.model.toggleUpperCase();
        break;
      case 'Space':
        this.model.addSpaceToLine();
        break;
      case 'ArrowLeft':
        this.model.moveCursore('left');
        break;
      case 'ArrowRight':
        this.model.moveCursore('right');
        break;
      case 'ArrowUp':
        this.model.moveCursore('up');
        break;
      case 'ArrowDown':
        this.model.moveCursore('down');
        break;
      default:
        return -1;
    }
    return -1;
  }

  specialKeyUpAction(key) {
    if (/^Shift/.test(key.dataset.code)) {
      return this.model.toggleUpperCase(false);
    }
    if (/^Meta/.test(key.dataset.code)) {
      return this.model.toggleLanguage();
    }
    return 0;
  }

  static changeShiftSynchronActivity(keyName) {
    const specialKeys = document.querySelectorAll('.special_key');
    specialKeys.forEach((key) => {
      if (/^Shift/.test(key.dataset.code) && key.dataset.code !== keyName) {
        key.classList.toggle('active');
      }
    });
  }
}
