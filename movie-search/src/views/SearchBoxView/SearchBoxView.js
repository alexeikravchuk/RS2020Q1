import { createElement } from '../../utility';
import { MIN_YEAR, MAX_YEAR, MIN_RATING, MAX_RATING } from '../../constants';

export default class SearchBoxView {
  constructor() {
    this.searchElement = SearchBoxView.buildElement();
    this.searchMessageText = this.element.querySelector('.search-message');
  }

  static buildElement() {
    const element = createElement('div', 'search', 'search-wrapper');
    element.insertAdjacentHTML(
      'afterbegin',
      `
      <div class="search-input_box">
        <div class="search-icon"></div>
        <input class="search-input" autocomplete="off" placeholder="Search movie"></input>
        <div class="search-indicator hidden"></div>
        <div class="search-reset"></div>
        <div class="keyboard-btn"></div>
      </div>
      <div class="search-btn btn">Search</div>
      <div class="extra-btn btn">Options</div>
      <div class="extra-wrapper hidden">
        <div class="extra-year">
          <label class="extra-label" for="extra-year-min">Release year:</label>
          <input class="extra_input-year extra_input" id="extra-year-min" placeholder="from"
            type="number" min="${MIN_YEAR}" max="${MAX_YEAR}" step="1"
            value="${MIN_YEAR}" title="from" require/> -
          <input class="extra_input-year extra_input" id="extra-year-max" placeholder="to"
            type="number" min="${MIN_YEAR}" max="${MAX_YEAR}" step="1"
            value="${MAX_YEAR}" title="to" required"/>
        </div>
        <div class="extra-rating">
          <label class="extra-label" for="extra-rating-min">Movie rating:</label>
          <input class="extra_input-rating extra_input" id="extra-rating-min" placeholder="from"
            type="number" min="${MIN_RATING}" max="${MAX_RATING}" step="0.1"
            value="${MIN_RATING}" title="from" required/> -
          <input class="extra_input-rating extra_input" id="extra-rating-max" placeholder="to"
            type="number" min="${MIN_RATING}" max="${MAX_RATING}" step="0.1"
            value="${MAX_RATING}" title="to" required/>
        </div>
      </div>
      <div class="search-message"></div>
      <div class="keyboard keyboard-wrapper hidden"></div>
    `
    );
    return element;
  }

  showMessage(message) {
    this.searchMessageText.classList.add('top');
    this.searchMessageText.innerText = message;
    setTimeout(() => this.searchMessageText.classList.remove('top'), 2000);
  }

  removeMessage() {
    this.searchMessageText.innerText = '';
  }

  get element() {
    return this.searchElement;
  }
}
