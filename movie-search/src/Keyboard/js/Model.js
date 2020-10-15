import specialKeys from '../json/special-keys.json';
import characterKeys from '../json/character-keys.json';

export default class Model {
  constructor() {
    this.language = null;
    this.view = null;
    this.specialKeys = null;
    this.characterKeys = null;
    this.isCapsLockOn = false;
    this.isUpperCase = false;
    this.numberOfKeys = 64;
    this.line = '';
    this.cursorPosition = 0;
  }

  init(view) {
    this.view = view;
    this.line = this.view.textarea.value;
    this.cursorPosition = this.line.length;
    this.language = localStorage.language || 'en';
    this.specialKeys = specialKeys;
    this.characterKeys = characterKeys;
    this.update();
  }

  update() {
    this.view.drawKeyboard(this.numberOfKeys, this.specialKeys);
    this.updateCharacterKeys();
  }

  updateCharacterKeys() {
    this.view.updateCharacters(
      this.characterKeys,
      this.language,
      this.isUpperCase,
      this.isCapsLockOn
    );
  }

  changeLine(char) {
    const startLine = this.line.slice(0, this.cursorPosition);
    const endLine = this.line.slice(this.cursorPosition, this.line.length);
    this.line = startLine + char + endLine;
    this.cursorPosition += char.length;
    this.view.updateText();
  }

  addCharacterToLine(code) {
    let char = this.characterKeys[code].value[this.language][this.isUpperCase ? 1 : 0];
    if (this.isCapsLockOn) {
      char = char.toUpperCase();
    }
    this.changeLine(char);
  }

  addTabToLine() {
    const tab = '\t';
    this.changeLine(tab);
  }

  addSpaceToLine() {
    const space = ' ';
    this.changeLine(space);
  }

  goToNewLine() {
    const newLine = '\n';
    this.changeLine(newLine);
  }

  removeCharacter(position) {
    let startLine = '';
    let endLine = '';
    if (position === 'before' && this.cursorPosition > 0) {
      startLine = this.line.slice(0, this.cursorPosition - 1);
      endLine = this.line.slice(this.cursorPosition, this.line.length);
      this.cursorPosition -= 1;
    }

    if (position === 'after') {
      startLine = this.line.slice(0, this.cursorPosition);
      endLine = this.line.slice(this.cursorPosition + 1, this.line.length);
    }

    this.line = startLine + endLine;
    this.view.updateText();
  }

  toggleCapsLock() {
    this.isCapsLockOn = !this.isCapsLockOn;
    this.updateCharacterKeys();
  }

  toggleUpperCase(isUpperCase) {
    if (isUpperCase === undefined) {
      this.isUpperCase = !this.isUpperCase;
    } else {
      this.isUpperCase = isUpperCase;
    }
    this.updateCharacterKeys();
  }

  toggleLanguage() {
    this.language = this.language === 'en' ? 'ru' : 'en';
    localStorage.language = this.language;
    this.updateCharacterKeys();
  }

  moveCursore(direction) {
    if (typeof direction === 'number') {
      this.cursorPosition = direction;
      return 1;
    }
    switch (direction) {
      case 'left':
        if (this.cursorPosition > 0) {
          this.cursorPosition -= 1;
        }
        break;
      case 'right':
        if (this.cursorPosition < this.line.length) {
          this.cursorPosition += 1;
        }
        break;
      case 'up':
        this.cursorPosition -= 88;
        if (this.cursorPosition - 88 < 0) {
          this.cursorPosition = 0;
        }
        break;
      default:
        this.cursorPosition += 88;
        if (this.cursorPosition > this.line.length) {
          this.cursorPosition = this.line.length;
        }
    }
    this.view.updateText();
    return 1;
  }
}
