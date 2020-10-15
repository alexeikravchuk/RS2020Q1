import { createElement } from '../../utility';

export default class SwiperView {
  constructor() {
    this.swiperElement = SwiperView.createSwiper();
    this.container = this.swiperElement.querySelector('.swiper-container');
  }

  static createSwiper() {
    const element = createElement('div', 'swiper-outer');
    element.insertAdjacentHTML(
      'afterbegin',
      `
      <div class="swiper-container">
        <div class="swiper-wrapper"></div>
        <div class="swiper-pagination"></div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
    `
    );
    return element;
  }

  fadeIn() {
    this.container.classList.remove('hidden');
  }

  fadeOut(timing) {
    this.container.classList.add('hidden');
    setTimeout(() => this.fadeIn(), timing);
  }

  get element() {
    return this.swiperElement;
  }
}
