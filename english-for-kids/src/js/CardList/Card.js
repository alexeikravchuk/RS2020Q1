import { createElement } from '../utility';

export default class Card {
  constructor(state) {
    this.state = { ...state };
    this.state.train = state.train || 0;
    this.state.correct = state.correct || 0;
    this.state.mistakes = state.mistakes || 0;
    this.buildElement();
    this.audio = new Audio(`assets/${this.state.audioSrc}`);
  }

  buildElement() {
    this.cardElement = createElement('div', 'card');
    this.cardElement.insertAdjacentHTML('afterbegin',
      `<div class="flipper"> 
        <div class="front" style="background-image: url(assets/${this.state.image})">
          <div class="card-header">${this.state.word}</div>
        </div>
        <div class="back" style="background-image: url(assets/${this.state.image})">
          <div class="card-header">${this.state.translation}</div>
        </div>
        <div class="rotate"></div>
      </div>`);
    this.cardElement.onclick = Card.determineСlick.bind(this);
    this.cardElement.querySelector('.back').onmouseout = (e) => Card.flip(e.currentTarget.parentElement);
    return this.cardElement;
  }

  getElement() {
    return this.cardElement;
  }

  static determineСlick(e) {
    if (e.target.classList.contains('rotate')) {
      return Card.flip(e.currentTarget.firstChild);
    }
    return 0;
  }

  static flip(target) {
    target.classList.toggle('translate');
  }

  playAudio() {
    return this.audio.play();
  }

  changeMode() {
    this.cardElement.classList.toggle('play');
  }
}
