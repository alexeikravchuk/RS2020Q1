import Model from './js/Model';
import View from './js/View';
import Controller from './js/Controller';
import './sass/style.scss';

export default class Keyboard {
  constructor() {
    this.model = new Model();
    this.view = new View();
    this.controller = new Controller();
  }

  init(container, input, keyboard) {
    this.view.init(this.model, input, keyboard);
    this.model.init(this.view);
    this.controller.init(this.model, container);
    return this;
  }

  get keyboardModel() {
    return this.model;
  }

  destroy() {
    this.controller.removeEventListeners();

    const wrapper = document.querySelector('.keyboard-wrapper');
    wrapper.classList.add('hidden');

    setTimeout(() => {
      wrapper.innerHTML = '';
    }, 200);
  }
}
