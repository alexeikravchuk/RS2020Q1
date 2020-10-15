import { getGoogleApiScriptElement, getGeocodingLocation } from '../utils/api-handlers';
import AppModel from '../models/AppModel';

export default class App {
  constructor(container) {
    this.container = container;
    this.model = new AppModel(container);
  }

  start() {
    const googleScript = getGoogleApiScriptElement();
    document.body.insertAdjacentElement('beforeend', googleScript);

    this.setListeners();

    if (window.location.hash.includes('lat=')
    && window.location.hash.includes('&lng=')) {
      return this.initWithHashCoordinates();
    }

    return this.initWithNavigatorCoordinates();
  }

  initWithHashCoordinates() {
    const { hash } = window.location;
    const pos = {
      lat: parseFloat(hash.split('lat=')[1]),
      lng: parseFloat(hash.split('lng=')[1]),
    };
    sessionStorage.navigatorLocation = JSON.stringify(pos);
    this.model.init();
  }

  initWithNavigatorCoordinates() {
    try {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        sessionStorage.navigatorLocation = JSON.stringify(pos);
        this.model.init(this.control, this.weather, this.geolocation);
      }, () => this.model.init());
    } catch (e) {
      this.model.init();
    }
  }

  setListeners() {
    document.addEventListener('click', (e) => this.determineTarget(e));
    window.onhashchange = (e) => this.checkHash(e);

    if (!localStorage.notFirstTimeLoaded) {
      this.model.showModal();
    }
  }

  determineTarget(event) {
    if (event.target.classList.contains('options--refresh_btn')
    || event.target.parentElement.classList.contains('options--refresh_btn')) {
      return this.model.updateBackground();
    }

    if (event.target.classList.contains('lang')) {
      return this.model.changeLanguage(event.target.textContent);
    }

    if (event.target.classList.contains('options--temp-units')
    && !event.target.classList.contains('active')) {
      document.querySelectorAll('.options--temp-units').forEach((element) => {
        element.classList.remove('active');
      });
      event.target.classList.add('active');
      localStorage.temperatureUnits = event.target.textContent.slice(1);
      return this.model.changeTempUnits();
    }

    if (event.target.classList.contains('search-btn')) {
      event.preventDefault();
      const request = this.model.searchInputValue;
      window.location.hash = '';
      return request && this.changeLocationHash(request);
    }

    if (event.target.classList.contains('recognition')) {
      return this.model.toggleSpeechRecognition();
    }

    if (event.target.classList.contains('voice-notification')) {
      return this.model.toggleVoiceNotification();
    }

    return 0;
  }

  checkHash() {
    const { hash } = window.location;
    if (hash.includes('lat') && hash.includes('lng')) {
      const coordinates = {
        lat: parseFloat(hash.split('lat=')[1]),
        lng: parseFloat(hash.split('lng=')[1]),
      };
      this.model.findPlace(coordinates);
    }
  }

  async changeLocationHash(placename) {
    try {
      const location = await getGeocodingLocation(placename);
      window.location.hash = `lat=${location.geometry.lat}&lng=${location.geometry.lng}`;
    } catch (e) {
      this.model.control.showErrorMessage(e.message);
    }
  }
}
