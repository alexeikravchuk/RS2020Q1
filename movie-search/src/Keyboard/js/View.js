/* eslint-disable no-continue */
export function createElement(tagName, ...classNames) {
  const element = document.createElement(tagName);
  classNames.forEach((name) => element.classList.add(name));
  return element;
}
export default class View {
  constructor() {
    this.model = null;
    this.container = null;
  }

  init(model, textarea, container) {
    this.model = model;
    this.textarea = textarea;
    this.container = container;
  }

  drawKeyboard(numberOfKeys, specialKeys) {
    const arrowsUpDown = createElement('div', 'up-down-arrows');

    // creating keys
    for (let i = 0; i < numberOfKeys; i += 1) {
      const key = createElement('div', 'key');

      // set special-keys attributes
      Object.keys(specialKeys).forEach((specialKey) => {
        if (specialKeys[specialKey].id === i) {
          key.classList.add('special_key', `special_key-${specialKeys[specialKey].width}`);
          key.dataset.code = specialKey;
          key.innerText = specialKeys[specialKey].value;
        }
      });

      // creating block for arrowUp and arrowDown keys
      if (key.dataset.code === 'ArrowUp') {
        arrowsUpDown.append(key);
        continue;
      }

      if (key.dataset.code === 'ArrowDown') {
        arrowsUpDown.append(key);
        this.container.append(arrowsUpDown);
        continue;
      }

      this.container.append(key);
    }
  }

  updateCharacters(characterKeys, language, isUpperCase, isCapsLock) {
    const keys = this.container.querySelectorAll('.key') || null;
    Object.keys(characterKeys).forEach((code) => {
      keys[characterKeys[code].id].dataset.code = code;
      let char = characterKeys[code].value[language][isUpperCase ? 1 : 0];
      if (isCapsLock && !isUpperCase) {
        char = char.toUpperCase();
      } else if (isCapsLock && isUpperCase) {
        char = char.toLowerCase();
      }
      keys[characterKeys[code].id].innerText = char;
    });
  }

  updateText() {
    this.textarea.value = this.model.line;
    this.textarea.selectionStart = this.model.cursorPosition;
    this.textarea.selectionEnd = this.model.cursorPosition;
    setTimeout(() => this.textarea.focus(), 10);
  }
}
