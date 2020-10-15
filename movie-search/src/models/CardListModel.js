import { OMD_API, FIRST_REQUEST_TEXT } from '../constants';
import { getCardStates, createCards, handleError } from './utils/cardList';

export default class CardListModel {
  constructor(swiperModel, searchBox) {
    this.swiperModel = swiperModel;
    this.searchBox = searchBox;
    this.requesText = '';
    this.pagesLoaded = 0;
    this.totalCards = 1;
  }

  async init() {
    const hash = window.location.hash.slice(1).split('%20').join(' ');
    const requesText = hash || localStorage.lastRequest || FIRST_REQUEST_TEXT;
    try {
      await this.loadFirstPageCards(requesText);
    } catch (err) {
      throw Error(err.message);
    }
  }

  async loadFirstPageCards(requesText) {
    this.requestOptions = this.searchBox.getRequestOptions();
    this.requestOptions.requesText = requesText;
    try {
      const cards = await this.loadNextPageCards(1, this.requestOptions);
      this.setFirstPageCardsInSlider(cards, requesText);
    } catch (err) {
      throw Error(err.message);
    }
  }

  async loadNextPageCards(page, requestOptions) {
    try {
      const moviesIdList = await this.getMoviesIdByPage(requestOptions.requesText, page);
      const cardStates = await getCardStates(moviesIdList);
      const cards = createCards(cardStates, requestOptions);
      return cards;
    } catch (err) {
      return handleError(err, requestOptions.requesText);
    }
  }

  setFirstPageCardsInSlider(cards, requesText) {
    this.requesText = requesText;

    localStorage.lastRequest = requesText;
    window.location.hash = requesText;

    this.pagesLoaded = 1;
    this.swiperModel.view.fadeOut(300);
    setTimeout(() => {
      this.swiperModel.swiper.virtual.removeAllSlides();
      this.addCardsToSwiper(cards);
    }, 200);
  }

  async addNextPageCards() {
    if (this.pagesLoaded * 10 < this.totalCards) {
      try {
        this.pagesLoaded += 1;
        const cards = await this.loadNextPageCards(this.pagesLoaded, this.requestOptions);
        return this.addCardsToSwiper(cards);
      } catch (err) {
        return 0;
      }
    }
    return 0;
  }

  async getMoviesIdByPage(requesText, page) {
    const url = OMD_API.getMovieListURL(requesText, page);
    let data = '';
    try {
      const response = await fetch(url);
      data = await response.json();
    } catch (err) {
      throw Error('404 Not Found');
    }

    if (data.Response === 'False') {
      throw Error(data.Error);
    }

    this.saveTotalCards(data);
    const { Search } = data;
    return Search.map((film) => film.imdbID);
  }

  saveTotalCards(data) {
    this.totalCards = +data.totalResults;
  }

  async addCardsToSwiper(cards) {
    let addedCards = 0;

    cards.forEach((card, i, arr) => {
      if (card) {
        addedCards += 1;
        this.swiperModel.swiper.virtual.appendSlide(card);
        return this.swiperModel.swiper.update();
      }
      if (i === arr.length - 1 && addedCards === 0) {
        return this.addNextPageCards();
      }
      if (
        !this.swiperModel.swiper.virtual.slides.length &&
        this.pagesLoaded * 10 >= this.totalCards
      ) {
        this.searchBox.addMessage(OMD_API.errorsMessage.NO_RESULT);
      }
      return 0;
    });
  }
}
