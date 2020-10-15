import AppView from '../views/AppView';
import checkToken from '../utils/app-helpers/checkToken';
import createUser from '../utils/API-helpers/createUser';
import loginUser from '../utils/API-helpers/loginUser';
import GameModel from './GameModel';

export default class AppModel {
  constructor(conatiner) {
    this.conatiner = conatiner;
    this.view = new AppView(this, conatiner);
    this.gameModel = new GameModel(conatiner);
  }

  async init() {
    this.view.render();
    if (!checkToken()) {
      return this.view.showLoginWindow();
    }
    await this.gameModel.init();
    return this.view.showIntro();
  }

  async signUp() {
    try {
      const result = await createUser(this.view.inputValues);
      if (result) {
        localStorage.userEmail = result.email;
        localStorage.userId = result.id;
        this.signIn();
      }
    } catch (e) {
      this.showLoginError(e.message);
    }
  }

  async signIn() {
    try {
      const result = await loginUser(this.view.inputValues);
      if (result) {
        localStorage.token = result.token;
        localStorage.tokenTime = JSON.stringify(new Date());
        localStorage.userEmail = this.view.inputValues.email;
        localStorage.userId = result.userId;
        await this.gameModel.init();
        this.view.showIntro();
      }
    } catch (e) {
      this.showLoginError(e.message);
    }
  }

  logOut() {
    localStorage.removeItem('token');
    this.view.showLoginWindow();
  }

  showLoginError(message) {
    if (message.includes('password')) {
      return this.view.showPasswordError(message);
    }
    return this.view.showLoginError(message);
  }

  startGame() {
    this.view.removeIntro();
    setTimeout(() => this.gameModel.start(), 310);
  }
}
