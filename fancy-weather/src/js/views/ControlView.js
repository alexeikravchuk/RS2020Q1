import { createElement, getTranslation } from '../utils/utility';
import { ERROR_MESSAGE } from '../constants';

export default class ControlView {
  constructor(model) {
    this.model = model;
  }

  render(container) {
    this.container = container.querySelector('#control');

    const optionsBlock = createElement('div', 'control--options', 'options');
    optionsBlock.insertAdjacentHTML('afterbegin', `<button class="options--refresh_btn">
        <i class="material-icons">autorenew</i>
      </button>
      <div class="options--lang-dropdown_menu">
        <button class="dropbtn lang" id="lang"></button>
        <div class="dropdown-content">
          <a class="lang" href="#"></a>
          <a class="lang" href="#"></a>
        </div>
      </div>
      <div class="options--temp-units">
        <button class="options--temp-units ${localStorage.temperatureUnits === 'F' ? 'active' : ''}">°F</button>
        <button class="options--temp-units ${localStorage.temperatureUnits !== 'F' ? 'active' : ''}">°C</button>
      </div>
      <button class="options--play_btn">
        <i class="material-icons voice-notification">play_circle_outline</i>
      </button>
    `);

    const searchBlock = createElement('div', 'control--search', 'search');
    searchBlock.insertAdjacentHTML('afterbegin', `<form class="search--form">
      <input class="search--input" type="search" required placeholder="Search city or ZIP"></input>
      <span class="material-icons recognition">record_voice_over</span>
      <button class="search-btn">SEARCH</button>
    </form>`);

    this.container.insertAdjacentElement('afterbegin', optionsBlock);
    this.container.insertAdjacentElement('beforeend', searchBlock);

    this.searchInput = searchBlock.querySelector('.search--input');
    this.setTranslation();
  }

  setTranslation() {
    const translation = getTranslation();

    this.container.querySelectorAll('.lang').forEach((element, i) => {
      // eslint-disable-next-line no-param-reassign
      element.innerText = translation.lang[i];
    });

    this.searchInput.placeholder = translation.placeholder;
    this.container.querySelector('.search-btn').textContent = translation.search;
  }

  get inputValue() {
    return this.searchInput.value;
  }

  clearInput() {
    this.searchInput.classList.remove('error');
    this.searchInput.value = '';
  }

  showErrorMessage() {
    this.searchInput.classList.add('error');
    this.searchInput.value = ERROR_MESSAGE[localStorage.language];
  }

  toggleButton(isActive, type) {
    const selector = type === 'speech' ? '.recognition' : '.voice-notification';
    const icon = this.container.querySelector(selector);
    if (isActive) {
      return icon.classList.add('active');
    }
    return icon.classList.remove('active');
  }

  submitFormWitchValue(city) {
    this.searchInput.value = city;
    this.container.querySelector('.search-btn').click();
  }
}
