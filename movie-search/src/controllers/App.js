import AppModel from '../models/AppModel';
import AppView from '../views/AppView';
import { APP_TITLE } from '../constants';
import { translateFromRuToEn } from '../utility';

export default class App {
  constructor(container) {
    this.container = container;
    this.model = new AppModel(APP_TITLE);
    this.view = new AppView();
  }

  start() {
    this.view.init(this.model, this.container);
    this.model.init(this.view);
    this.searchInput = this.model.searchInput;
    this.setListeners();
    this.setCursorToTheInputField();
  }

  setListeners() {
    const slider = this.model.swiper;
    slider.on('slideChange', () => this.checkIsPenultPage());
    this.searchInput.addEventListener('keyup', (event) => this.checkKey(event));
    document.addEventListener('mousedown', (event) => this.checkMouseTarget(event));
  }

  checkIsPenultPage() {
    const paginationBullets = document.querySelectorAll('.swiper-pagination-bullet');
    const { length } = paginationBullets;
    if (
      paginationBullets[length - 1].classList.contains('swiper-pagination-bullet-active') ||
      paginationBullets[length - 2].classList.contains('swiper-pagination-bullet-active')
    ) {
      this.model.addNextPageCards();
    }
  }

  checkKey(event) {
    if (event.key === 'Enter') {
      this.findMovies();
    }
  }

  checkMouseTarget(event) {
    if (
      event.target.classList.contains('search-btn') ||
      event.target.classList.contains('search-icon') ||
      event.target.dataset.code === 'Enter'
    ) {
      return this.findMovies();
    }
    if (event.target.classList.contains('search-reset')) {
      return this.clearInput();
    }
    if (event.target.classList.contains('keyboard-btn')) {
      return this.model.toggleKeyboard();
    }
    if (event.target.classList.contains('extra-btn')) {
      return this.model.toggleExtraParameters();
    }
    if (!event.target.parentNode.classList.contains('keyboard') && this.model.keyboard) {
      this.model.destroyKeyboard();
    }
    return 0;
  }

  findMovies() {
    if (!this.model.checkSearchBoxOptions()) {
      return 0;
    }

    const inputValue = this.searchInput.value.replace(/\s+/g, ' ');
    if (inputValue.length === 0) {
      return this.clearInput();
    }

    this.model.toggleExtraParameters(true);

    if (this.model.keyboard) {
      this.model.destroyKeyboard();
    }

    if (!/[а-я]/i.test(inputValue)) {
      this.searchInput.value = inputValue;
      return this.model.searchForMovies(inputValue);
    }

    translateFromRuToEn(inputValue)
      .then((enValue) => {
        this.model.searchForMovies(enValue);
        this.model.addMessage(`Showing results for '${enValue}'`);
      })
      .catch((err) => {
        this.model.addMessage(err.message);
      });
    return 0;
  }

  clearInput() {
    this.searchInput.value = '';
    if (this.model.keyboard) {
      this.model.keyboardModel.line = '';
    }
  }

  setCursorToTheInputField() {
    this.model.searchInput.focus();
  }
}
