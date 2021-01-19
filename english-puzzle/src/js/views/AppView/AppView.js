import { FOOTER_LINKS } from '../../constants';
import setFormValidation from '../../utils/setFormValidation';

export default class AppView {
  constructor(model, container) {
    this.model = model;
    this.container = container;
  }

  get inputValues() {
    return {
      email: this.container.querySelector('.input_email').value,
      password: this.container.querySelector('.input_password').value,
    };
  }

  render() {
    this.container.insertAdjacentHTML('beforebegin', `
    <header class="header--block header">
      <div class="header--wrapper wrapper">
        <h1 class="header--title">English Puzzle</h1>
        <div class="header--buttons">
          <button class="header--buttons-logout_btn logout_btn hidden" title="logout">Logout</button>
        </div>
      </div>
    </header>
    `);
    this.container.insertAdjacentHTML('afterend', `
    <footer class="footer">
      <div class="footer-container">
        <a href="${FOOTER_LINKS.rss.link}" class="rss" target="blank">${FOOTER_LINKS.rss.title}</a>
        <a href="${FOOTER_LINKS.github.link}" class="github" target="blank">${FOOTER_LINKS.github.title}</a>
      </div>
    </footer>
    `);
  }

  showLoginWindow() {
    this.container.classList.add('hidden');
    setTimeout(() => {
      this.container.innerHTML = '';
      this.container.insertAdjacentHTML('afterbegin', `
      <div class="login--window login">
        <h3 class="login--title">Login</h3>
        <form class="login--form">
          <div class="login--form-input_wrapper">
            <input class="login--form-input input_email invalid" name="email" placeholder="Email" type="email"
            autocomplete="off" minlength="6" maxlength="30"required>
            <span class="input_email-tooltiptext"></span>
          </div>
          <div class="login--form-input_wrapper">
            <input class="login--form-input input_password invalid" name="password" placeholder="Password"
            type="password" autocomplete="off" minlength="8" maxlength="30" required>
            <span class="input_password-tooltiptext password-tooltip"></span>
          </div>
          <div class="login--form-btns">
            <button class="login--form-submit_btn signin_btn btn-disabled" disabled="">
              <span class="btn--content">Sign in</span>
            </button>
            <button class="login--form-submit_btn signup_btn btn-disabled" disabled="">
              <span class="btn--content">Sign up</span>
            </button>
          </div>
        </form>
      </div>
      `);
      this.container.classList.remove('hidden');
      document.querySelector('.logout_btn').classList.add('hidden');
      setFormValidation(this.container.querySelector('.login--form'));
    }, 350);
  }

  showLoginError(message) {
    const tooltip = this.container.querySelector('.input_email-tooltiptext');
    const email = this.container.querySelector('.input_email');
    tooltip.innerText = message;
    email.classList.add('invalid');
    tooltip.classList.add('visible');
    setTimeout(() => {
      tooltip.classList.remove('visible');
      email.classList.remove('invalid');
    }, 4000);
  }

  showPasswordError(message) {
    const tooltip = this.container.querySelector('.input_password-tooltiptext');
    const email = this.container.querySelector('.input_password');
    tooltip.innerText = message;
    email.classList.add('invalid');
    tooltip.classList.add('visible');
    setTimeout(() => {
      tooltip.classList.remove('visible');
      email.classList.remove('invalid');
    }, 4000);
  }

  showIntro() {
    this.container.classList.add('hidden');
    setTimeout(() => {
      this.container.innerHTML = '';
      this.container.insertAdjacentHTML('afterbegin', `
      <div class="intro--window intro">
        <h3 class="title">ENGLISH PUZZLE</h3>
        <p class="intro--text">Click on words, collect phrases.<br>
          Words can be drag and drop. Select tooltips in the menu
        </p>
        <a href="#" class="intro--start_btn">Start</a>
      </div>
      `);
      document.querySelector('.logout_btn').classList.remove('hidden');
      this.container.classList.remove('hidden');
    }, 350);
  }

  removeIntro() {
    const intro = this.container.querySelector('.intro');
    this.container.classList.add('hidden');
    setTimeout(() => {
      intro.remove();
      this.container.classList.remove('hidden');
    }, 300);
  }
}
