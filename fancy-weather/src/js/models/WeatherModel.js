import { getWeatherInfo, translate } from '../utils/api-handlers';
import WeatherView from '../views/WeatherView';

export default class WeatherModel {
  constructor(container) {
    this.container = container;
    this.view = new WeatherView(this);
    this.location = null;
    this.currentWeather = null;
    this.forecast = null;
  }

  async init(location) {
    this.location = location;
    await this.setWeatherInfo();
    return 1;
  }

  get weatherInfo() {
    return {
      placename: this.location.placename,
      currentWeather: this.currentWeather,
      forecast: this.forecast.data,
    };
  }

  get currentWeatherDescription() {
    return this.currentWeather[0].weather.description;
  }

  async setWeatherInfo() {
    const { lat, lng } = this.location;
    try {
      const [currentWeather, forecast] = await Promise.all([
        getWeatherInfo(lat, lng, 1),
        getWeatherInfo(lat, lng, 3),
      ]);

      [this.currentWeather] = currentWeather.data;
      this.forecast = forecast;
    } catch (e) {
      throw Error('error receiving weather information');
    }
  }

  getLocationTime() {
    const date = new Date();
    this.location.timeOffsetSec = this.location.timeOffsetSec || -date.getTimezoneOffset() * 60;
    const newTime = +date + date.getTimezoneOffset() * 60000 + this.location.timeOffsetSec * 1000;
    return new Date(newTime);
  }

  render() {
    this.view.render(this.container);
    this.view.updateView(this.location, this.getLocationTime());
    this.runTime();
  }

  runTime() {
    this.timer = setInterval(() => {
      this.view.showTime(this.getLocationTime());
    }, 1000);
  }

  async changeLanguage() {
    const from = localStorage.previousLanguage;
    const to = localStorage.language;
    this.location.placename = await translate(this.location.placename.split(', '), from, to);
    this.location.placename = this.location.placename[0].split(',').join(', ');
    this.view.updateView(this.location, this.getLocationTime());
  }

  changeTempUnits() {
    this.view.toggleUnits();
  }
}
