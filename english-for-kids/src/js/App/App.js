/* eslint-disable prefer-destructuring */
import Header from '../Header/Header';
import MainPage from '../MainPage/MainPage';
import CardList from '../CardList/CardList';
import Statistics from '../Statistics/Statistics';
import { createElement, shuffle } from '../utility';

export default class App {
  constructor(cards) {
    this.cards = cards.slice();
    this.state = {
      page: 0,
      currentCard: 0,
      play: false,
      playActive: false,
      randomArr: [],
      errors: 0,
    };
  }

  start() {
    this.header = new Header(this.cards[0]);
    this.header.renderNavigation();
    this.mainPage = new MainPage(this.cards);
    this.mainPage.render();
    this.cardList = new CardList(this.cards);
    this.startBtn = App.createStartBtn();
    this.ratingBar = App.createRatingBar();
    this.setListeners();
    document.location.hash = 'main';
    this.createCardList();
  }

  createCardList() {
    if (Statistics.checkLocalStorage()) {
      const cards = Statistics.getCardList();
      return this.cardList.setCardsList(cards);
    }
    return this.cardList.createCardsList();
  }

  setListeners() {
    document.addEventListener('click', this.determineTarget.bind(this));
    window.onhashchange = this.changePage.bind(this);
  }

  determineTarget(e) {
    if (e.target.classList.contains('menu-btn')
    || e.target.parentElement.classList.contains('menu-btn')) {
      Header.toggleMenu();
      return 1;
    }

    if (!e.target.classList.contains('navigation')
    && document.querySelector('.navigation').classList.contains('active')) {
      Header.closeMenu();
    }

    if (e.target.parentElement.classList.contains('switch-container')) {
      e.preventDefault();
      this.changeMode();
      return 1;
    }

    if (e.target.classList.contains('btn-game')) {
      if (e.target.classList.contains('repeat')) {
        return this.playCurrentAudio();
      }
      return this.startGame();
    }

    if (e.target.classList.contains('front') && !this.state.play) {
      const index = Array.from(document.querySelectorAll('.card .front')).indexOf(e.target);
      const currentCard = this.getCurrentCard(index);
      currentCard.state.train += 1;
      Statistics.saveCardList(this.cardList.cardsList);
      return currentCard.playAudio();
    }

    if (this.state.playActive
    && e.target.classList.contains('front')
    && !e.target.classList.contains('inactive')) {
      Statistics.saveCardList(this.cardList.cardsList);
      return this.checkCard(e.target);
    }

    if (e.target.classList.contains('btn-reset')) {
      Statistics.resetStatistics();
      this.createCardList();
      return new Statistics(this.cardList.cardsList).buildPage();
    }

    if (e.target.classList.contains('btn-repeat')) {
      document.location.hash = 'difficult_cards';
    }

    return -1;
  }

  changePage() {
    const page = document.location.hash;
    const container = document.querySelector('.main-container');
    container.innerHTML = '';
    this.resetGame();
    if (page === '#main') {
      this.mainPage.buildPage();
      return this.header.changeActiveLink(0);
    }
    if (page === '#statistics') {
      new Statistics(this.cardList.cardsList).buildPage(container);
      return this.header.changeActiveLink(9);
    }
    if (page === '#difficult_cards') {
      this.header.setTitle('Repeat words');
      return this.showDifficultWordCards();
    }
    this.state.page = page.split('cards-')[1];
    container.append(this.startBtn);
    container.append(this.ratingBar);
    this.showCards(this.cardList.getCards(this.state.page));
    return this.header.changeActiveLink(this.state.page);
  }

  showCards(cards) {
    this.currentCards = cards;
    const container = document.querySelector('.main-container');
    if (cards.length === 0) {
      return container.append(createElement('div', 'empty'));
    }
    const cardsHTML = cards.map((card) => card.getElement());
    cardsHTML.forEach((card) => container.append(card));
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    return 1;
  }

  static createStartBtn() {
    const btns = createElement('div', 'btns', 'none');
    const btn = createElement('button', 'btn', 'btn-game');
    btn.innerText = 'Start game';
    btns.append(btn);
    return btns;
  }

  static createRatingBar() {
    const rating = createElement('div', 'rating', 'none');
    return rating;
  }

  changeMode() {
    this.state.play = !this.state.play;
    this.header.toggleSwitch();
    this.mainPage.changeStyle();
    this.cardList.changeMode();
    this.startBtn.classList.toggle('none');
    this.ratingBar.classList.toggle('none');
    if (!this.state.play) {
      this.resetGame();
    }
  }

  startGame() {
    this.state.playActive = true;
    this.state.randomArr = shuffle([0, 1, 2, 3, 4, 5, 6, 7]);
    this.startBtn.firstChild.classList.toggle('repeat');
    setTimeout(this.playCurrentAudio.bind(this), 1000);
  }

  playCurrentAudio() {
    this.getCurrentCard().playAudio();
  }

  getCurrentCard(index) {
    let currentCardIndex = index;
    if (this.state.playActive) {
      currentCardIndex = this.state.randomArr[this.state.currentCard];
    }
    return this.currentCards[currentCardIndex];
  }

  checkCard(target) {
    const targetWord = target.innerText;
    const currentWord = this.getCurrentCard().state.word;
    if (targetWord === currentWord) {
      target.classList.toggle('inactive');
      return this.callCorrectAction();
    }
    return this.callErrorAction();
  }

  callCorrectAction() {
    new Audio('assets/audio/correct.mp3').play();
    if (this.state.currentCard < 7) {
      this.state.currentCard += 1;
      this.getCurrentCard().state.correct += 1;
      setTimeout(this.playCurrentAudio.bind(this), 1000);
      return App.addSymbol(true);
    }
    return this.showResult();
  }

  callErrorAction() {
    this.state.errors += 1;
    this.getCurrentCard().state.mistakes += 1;
    new Audio('assets/audio/error.mp3').play();
    return App.addSymbol(false);
  }

  static addSymbol(result) {
    const symbolElement = createElement('div', result ? 'star-succes' : 'star-error');
    document.querySelector('.rating').append(symbolElement);
  }

  showResult() {
    const modal = createElement('div', 'modal');
    const container = document.querySelector('.main-container');
    container.insertAdjacentElement('afterbegin', modal);
    if (this.state.errors === 0) {
      return App.showSuccess(modal);
    }
    return App.showFailure(modal, this.state.errors);
  }

  static showSuccess(modalContainer) {
    modalContainer.classList.add('success');
    setTimeout(() => {
      new Audio('assets/audio/success.mp3').play();
    }, 1000);
    setTimeout(() => {
      document.location.hash = 'main';
    }, 4000);
  }

  static showFailure(modalContainer, errorsAmount) {
    modalContainer.classList.add('failure');
    const errors = createElement('p', 'errors__amount');
    errors.innerText = `${errorsAmount} error${errorsAmount > 1 ? 's' : ''}`;
    modalContainer.append(errors);
    setTimeout(() => {
      new Audio('assets/audio/failure.mp3').play();
    }, 1000);
    setTimeout(() => {
      document.location.hash = 'main';
    }, 4000);
  }

  resetGame() {
    document.querySelectorAll('.inactive').forEach((el) => el.classList.remove('inactive'));
    this.ratingBar.innerHTML = '';
    this.startBtn.firstChild.classList.remove('repeat');
    this.state = {
      play: this.state.play,
      page: this.state.page,
      currentCard: 0,
      playActive: false,
      randomArr: [],
      errors: 0,
    };
  }

  showDifficultWordCards() {
    if (this.state.play) {
      this.changeMode();
    }
    const difficultWordCards = this.cardList.getDifficultWordCards();
    this.showCards(difficultWordCards);
  }
}
