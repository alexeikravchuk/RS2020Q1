import { createElement } from '../utility';

export default class MainPage {
  constructor(cards) {
    this.cards = cards;
    this.cardList = [];
  }

  render() {
    fetch('assets/main.html')
      .then((response) => response.text())
      .then(this.createCardList.bind(this))
      .then(this.buildPage.bind(this));
  }

  createCardList(cardMarkup) {
    let page = 0;
    this.cardList = this.cards[0].map((cardName) => {
      const card = createElement('div', 'main-card');
      card.innerHTML = cardMarkup;
      card.querySelector('.main-card__link').href = `#cards-${page += 1}`;
      card.querySelector('.main-card__caption').innerText = cardName;
      card.querySelector('.main-card__img').alt = cardName;

      const index = 1 + this.cards[0].indexOf(cardName);
      const randomCardNumber = Math.floor(Math.random() * this.cards[index].length);
      const randomImgUrl = `assets/${this.cards[index][randomCardNumber].image}`;

      card.querySelector('.main-card__img').src = randomImgUrl;
      return card;
    });
  }

  buildPage() {
    const container = document.querySelector('.main-container');
    this.cardList.forEach((card) => container.append(card));
  }

  changeStyle() {
    this.cardList.forEach((card) => card.classList.toggle('play'));
  }
}
