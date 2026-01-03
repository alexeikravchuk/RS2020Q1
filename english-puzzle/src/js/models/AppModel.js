import AppView from '../views/AppView';
import checkToken from '../utils/app-helpers/checkToken';
import GameModel from './GameModel';
import { GAME_START_DELAY_MS } from '../constants';

export default class AppModel {
  constructor(container) {
    this.container = container;
    this.view = new AppView(this, container);
    this.gameModel = new GameModel(container);
  }

  async init() {
    this.view.render();
    if (!checkToken()) {
      return this.view.showLoginWindow();
    }
    await this.gameModel.init();
    return this.view.showIntro();
  }

  showLoginError(message) {
    if (message.includes('password')) {
      return this.view.showPasswordError(message);
    }
    return this.view.showLoginError(message);
  }

  startGame() {
    this.view.removeIntro();
    setTimeout(() => this.gameModel.start(), GAME_START_DELAY_MS);
  }
}
