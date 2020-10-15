import { getImage } from '../utils/api-handlers';
import { FOOTER_LINKS, MODAL_INFO_HTML } from '../constants';
import { createElement } from '../utils/utility';
import { setModalListeners } from '../utils/app-helpers';

export default class AppView {
  constructor(model, container) {
    this.model = model;
    this.container = container;
    this.backgroundImg = null;
    this.buildApp();
  }

  buildApp() {
    this.container.insertAdjacentHTML('afterbegin', `
      <div class="preloader">
        <div class="preloader--row">
          <div class="preloader--item"></div>
          <div class="preloader--item"></div>
        </div>
      </div>
      <div class="app-wrapper" id="app">
        <div class="controll-wrapper" id="control"></div>
        <div class="weather--location location"></div>
        <div class="info--wrapper">
          <div class="weather--wrapper" id="weather"></div>
          <div class="geolocation-wrapper" id="geolocation"></div>
        </div>
        <span></span><span></span>
        <footer class="footer">
          <div class="footer-container">
            <a href="${FOOTER_LINKS.rss.link}" class="rss" target="blank">${FOOTER_LINKS.rss.title}</a>
            <a href="${FOOTER_LINKS.github.link}" class="github" target="blank">${FOOTER_LINKS.github.title}</a>
          </div>
        </footer>
      </div>
    `);
  }

  async updateBackground(query) {
    const imgUrl = await getImage(query);
    this.container.style.backgroundImage = `url(${imgUrl})`;
    return 1;
  }

  showModal() {
    const modal = createElement('div', 'modal--info');
    modal.insertAdjacentHTML('afterbegin', `${MODAL_INFO_HTML}`);
    this.container.insertAdjacentElement('afterend', modal);
    setModalListeners();
  }

  hidePreloader() {
    this.container.classList.add('loaded_hiding');
    setTimeout(() => {
      this.container.classList.add('loaded');
      this.container.classList.remove('loaded_hiding');
    }, 700);
  }

  showPreloader() {
    this.container.classList.add('loaded_hiding');
    setTimeout(() => {
      this.container.classList.remove('loaded');
      this.container.classList.remove('loaded_hiding');
    }, 700);
  }
}
