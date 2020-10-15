import SwiperModel from './SwiperModel';
import CardListModel from './CardListModel';
import SearchBoxModel from './SearchBoxModel';
import Keyboard from '../Keyboard';

export default class AppModel {
  constructor(title) {
    this.title = title;
    this.searchBox = new SearchBoxModel();
    this.swiperModel = new SwiperModel();
    this.cardList = new CardListModel(this.swiperModel, this.searchBox);
  }

  init(view) {
    this.view = view;
    this.view.renderPage();
    this.swiperModel.init();
    this.cardList.init().catch((err) => this.searchBox.addMessage(err.message));
  }

  get searchInput() {
    return this.searchBox.element.querySelector('.search-input');
  }

  get searchBoxElement() {
    return this.searchBox.element;
  }

  get swiper() {
    return this.swiperModel.swiper;
  }

  addMessage(message) {
    this.searchBox.addMessage(message);
  }

  checkSearchBoxOptions() {
    return this.searchBox.isValidOptions();
  }

  addNextPageCards() {
    return this.cardList.addNextPageCards();
  }

  toggleKeyboard() {
    if (this.keyboard) {
      return this.destroyKeyboard();
    }
    return this.initKeyboard();
  }

  initKeyboard() {
    const container = this.searchBox.element;
    const input = container.querySelector('.search-input');
    const wrapper = container.querySelector('.keyboard-wrapper');
    this.keyboard = new Keyboard().init(container, input, wrapper);
    wrapper.classList.remove('hidden');
  }

  destroyKeyboard() {
    this.keyboard.destroy();
    this.keyboard = null;
  }

  get keyboardModel() {
    return this.keyboard.keyboardModel;
  }

  async searchForMovies(value) {
    this.searchBox.searchIndicator.classList.remove('hidden');
    try {
      this.searchBox.removeMessage();
      await this.cardList.loadFirstPageCards(value);
    } catch (err) {
      this.searchBox.addMessage(err.message);
    }
    this.searchBox.searchIndicator.classList.add('hidden');
  }

  toggleExtraParameters(isHide) {
    this.searchBox.toggleExtraParameters(isHide);
  }
}
