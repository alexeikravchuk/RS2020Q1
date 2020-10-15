import AppModel from '../models/AppModel';

export default class App {
  constructor(container) {
    this.container = container;
    this.model = new AppModel(container);
  }

  start() {
    this.model.init();
    this.setListeners();
  }

  setListeners() {
    document.addEventListener('click', (e) => this.determineTarget(e));
  }

  determineTarget(event) {
    if ((event.target.classList.contains('signin_btn') && !event.target.disabled)
    || (event.target.parentElement.classList.contains('signin_btn')
    && !event.target.parentElement.disabled)) {
      event.preventDefault();
      return this.model.signIn();
    }

    if ((event.target.classList.contains('signup_btn') && !event.target.disabled)
    || (event.target.parentElement.classList.contains('signup_btn')
    && !event.target.parentElement.disabled)) {
      event.preventDefault();
      return this.model.signUp();
    }

    if (event.target.classList.contains('logout_btn')) {
      return this.model.logOut();
    }

    if (event.target.classList.contains('intro--start_btn')) {
      return this.model.startGame();
    }

    return 0;
  }
}
