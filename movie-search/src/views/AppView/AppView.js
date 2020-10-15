import { createElement } from '../../utility';
import { FOOTER_LINKS } from '../../constants';

export default class AppView {
  constructor() {
    this.container = null;
  }

  init(model, container) {
    this.model = model;
    this.container = container;
  }

  renderPage() {
    this.headerElement = this.createHeader();
    this.searchBoxElement = this.model.searchBox.element;
    this.swiperElement = this.model.swiperModel.element;
    this.footerElement = AppView.createFooter();
    this.container.insertAdjacentElement('beforebegin', this.headerElement);
    this.container.insertAdjacentElement('afterbegin', this.searchBoxElement);
    this.container.insertAdjacentElement('beforeend', this.swiperElement);
    this.container.insertAdjacentElement('afterend', this.footerElement);
  }

  createHeader() {
    const header = createElement('header', 'header');
    header.insertAdjacentHTML(
      'afterbegin',
      `
      <h1>${this.model.title}</h1>
    `
    );
    return header;
  }

  static createFooter() {
    const footer = createElement('footer', 'footer');
    footer.insertAdjacentHTML(
      'afterbegin',
      `
      <div class="footer-container">
        <a href="${FOOTER_LINKS.rss.link}" class="rss" target="blank">
          ${FOOTER_LINKS.rss.title}
        </a>      
        <a href="${FOOTER_LINKS.github.link}" class="github" target="blank">
          ${FOOTER_LINKS.github.title}
        </a> 
      </div>
    `
    );
    return footer;
  }
}
