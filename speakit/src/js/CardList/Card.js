import { createElement } from '../utility';
import { DATA_LINK } from '../constants';

export default class Card {
  constructor(state) {
    this.state = state;
    this.audio = this.setAudio();
  }

  getElement() {
    this.cardElement = createElement('div', 'card');
    this.cardElement.insertAdjacentHTML(
      'afterbegin',
      `
      <span class="audio-icon"></span>
      <p class="word">${this.state.word}</p>
      <p class="transcription">${this.state.transcription}</p>
      <p class="translation">${this.state.wordTranslate}</p>
    `,
    );
    return this.cardElement;
  }

  setAudio() {
    const audioSrc = DATA_LINK + this.state.audio;
    return new Audio(audioSrc);
  }

  playAudio() {
    this.audio.play();
  }

  getImgSrc() {
    return DATA_LINK + this.state.image;
  }
}
