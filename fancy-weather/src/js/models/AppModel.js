import AppView from '../views/AppView';
import ControlModel from './ControlModel';
import WeatherModel from './WeatherModel';
import GeolocationModel from './GeolocationModel';
import { getBackgroundQuery } from '../utils/app-helpers';

export default class AppModel {
  constructor(container) {
    this.container = container;
    this.view = new AppView(this, container);
    this.control = new ControlModel(container);
    this.weather = new WeatherModel(container);
    this.geolocation = new GeolocationModel(container);
  }

  async init() {
    if (localStorage.language) {
      document.documentElement.lang = localStorage.language;
    }

    await this.geolocation.init();
    await this.weather.init(this.geolocation.location);
    this.control.setVoiceNotification(this.weather.weatherInfo);

    this.control.render();
    this.weather.render();
    this.geolocation.render();

    await this.updateBackground();

    return this.view.hidePreloader();
  }

  get searchInputValue() {
    return this.control.inputValue;
  }

  async updateBackground() {
    const backgrounQuery = getBackgroundQuery(this.weather);
    await this.view.updateBackground(backgrounQuery);
  }

  changeLanguage(language) {
    localStorage.previousLanguage = localStorage.language;
    localStorage.language = language;
    document.documentElement.lang = language;

    this.control.changeLanguage();
    this.weather.changeLanguage();
    this.geolocation.changeLanguage();

    this.control.setVoiceNotification(this.weather.weatherInfo);
  }

  changeTempUnits() {
    this.weather.changeTempUnits();
    this.control.setVoiceNotification(this.weather.weatherInfo);
  }

  async findPlace(coordinates) {
    try {
      this.view.showPreloader();

      await this.geolocation.setLocation(coordinates);
      await this.weather.init(this.geolocation.location);

      this.control.clearInput();
      this.weather.render();
      this.geolocation.changeMapCenter();

      await this.updateBackground();
      this.control.setVoiceNotification(this.weather.weatherInfo);
    } catch (e) {
      this.control.showErrorMessage(e.message);
    }

    return this.view.hidePreloader();
  }

  toggleSpeechRecognition() {
    this.control.toggleSpeechRecognition();
  }

  toggleVoiceNotification() {
    if (speechSynthesis.speaking) {
      speechSynthesis.pause();
      this.control.toggleVoiceButton(false);
      return speechSynthesis.cancel();
    }
    return this.runVoiceNotificaion();
  }

  runVoiceNotificaion() {
    if (!this.control.msgVoice) {
      this.control.setVoice();
    }
    this.control.toggleVoiceButton(true);

    const resumeTimer = setInterval(() => {
      if (!speechSynthesis.speaking) {
        return clearInterval(resumeTimer);
      }
      return speechSynthesis.resume();
    }, 10000);

    return speechSynthesis.speak(this.control.msg);
  }

  showModal() {
    this.view.showModal();
  }
}
