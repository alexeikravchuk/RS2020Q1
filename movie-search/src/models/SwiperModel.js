import Swiper from 'swiper';
import SwiperView from '../views/SwiperView';

export default class SwiperModel {
  constructor() {
    this.view = new SwiperView();
  }

  get element() {
    return this.view.element;
  }

  init() {
    this.swiper = new Swiper('.swiper-container', {
      speed: 300,
      spaceBetween: 0,
      effect: 'slide',
      preloadImages: true,
      updateOnWindowResize: true,
      preventInteractionOnTransition: true,
      preventClicks: true,
      slidesPerGroup: 1,
      virtual: {
        cache: true,
        renderSlide: (card) => card.element,
        addSlidesBefore: 4,
        addSlidesAfter: 4,
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 2,
        },
        1366: {
          slidesPerView: 3,
        },
        1600: {
          slidesPerView: 4,
        },
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        bulletElement: 'span',
        type: 'bullets',
        dynamicBullets: true,
        dynamicMainBullets: 3,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }
}
