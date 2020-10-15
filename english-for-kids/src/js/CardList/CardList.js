import Card from './Card';
import { MODES } from '../constants';

export default class CardList {
  constructor(cardArray) {
    this.cardArray = cardArray;
    this.mode = MODES.train;
    this.cardsList = {};
  }

  createCardsList() {
    this.cardsList = {};
    for (let i = 0; i < this.cardArray[0].length; i += 1) {
      const cards = this.cardArray[i + 1].map((card) => new Card(card));
      this.cardsList[this.cardArray[0][i]] = cards;
    }
  }

  setCardsList(cardsList) {
    this.cardsList = {};
    Object.keys(cardsList).forEach((key) => {
      const cards = cardsList[key].map((card) => new Card(card.state));
      this.cardsList[key] = cards;
    });
  }

  getCards(page) {
    const key = this.cardArray[0][page - 1];
    return this.cardsList[key];
  }

  getDifficultWordCards() {
    const allCards = Object.keys(this.cardsList).map((key) => this.cardsList[key]).flat();
    allCards.sort(CardList.comparingCardsByPercent);
    const dificultWords = allCards.slice(0, 8).filter((card) => card.state.mistakes > 0);
    return dificultWords;
  }

  static comparingCardsByPercent(x, y) {
    const xGuesses = x.state.mistakes + x.state.mistakes;
    const xPercent = xGuesses > 0 ? x.state.mistakes / (xGuesses) : 0;
    const yGuesses = y.state.mistakes + y.state.mistakes;
    const yPercent = yGuesses > 0 ? y.state.mistakes / (yGuesses) : 0;
    if (xPercent === yPercent) {
      return 0;
    }
    if (xPercent > yPercent) {
      return -1;
    }
    return 1;
  }

  getMode() {
    return this.mode;
  }

  changeMode() {
    this.mode = (this.mode === MODES.play) ? MODES.train : MODES.play;
    Object.keys(this.cardsList).forEach((key) => {
      this.cardsList[key].forEach((card) => card.changeMode());
    });
  }
}
