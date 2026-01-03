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
    const target = event.target;
    const parent = target.parentElement;

    if (
      (target.classList.contains('signin_btn') && !target.disabled)
      || (parent?.classList.contains('signin_btn') && !parent.disabled)
    ) {
      event.preventDefault();
      return this.model.signIn?.();
    }

    if (
      (target.classList.contains('signup_btn') && !target.disabled)
      || (parent?.classList.contains('signup_btn') && !parent.disabled)
    ) {
      event.preventDefault();
      return this.model.signUp?.();
    }

    if (target.classList.contains('logout_btn')) {
      return this.model.logOut?.();
    }

    if (target.classList.contains('intro--start_btn')) {
      return this.model.startGame();
    }

    return false;
  }
}
