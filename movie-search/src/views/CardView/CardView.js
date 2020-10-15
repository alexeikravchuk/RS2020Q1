import { createElement } from '../../utility';

export default class CardView {
  constructor(state) {
    this.state = state;
    this.cardElement = this.createCardElement();
  }

  createCardElement() {
    const element = createElement('div', 'card', 'swiper-slide');
    element.insertAdjacentHTML(
      'afterbegin',
      `
      <a class="card-header" href="https://www.imdb.com/title/${this.state.id}/videogallery" target="_blank">${this.state.title}</a>
      <div class="card-body" style="background-image: url(${this.state.posterUrl})"></div>
      <div class="card-footer">${this.state.year}</div>
      <div class="card-imbd">
        <span>${this.state.rating}</span>
      </div>
    `
    );

    return element;
  }

  get element() {
    return this.cardElement;
  }
}
