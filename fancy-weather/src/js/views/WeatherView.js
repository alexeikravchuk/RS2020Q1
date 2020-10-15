/* eslint-disable no-param-reassign */
import { createElement, getTranslation } from '../utils/utility';
import { convertTemperatureUnits, getWeatherIconUrl } from '../utils/weather-helpers';

export default class WeatherView {
  constructor(model) {
    this.model = model;
  }

  render(container) {
    const weatherContainer = container.querySelector('#weather');
    weatherContainer.innerHTML = '';
    this.container = container;

    const timeBlock = this.container.querySelector('.location');
    timeBlock.innerHTML = '';
    timeBlock.insertAdjacentHTML('afterbegin', `<div class="location--placename"></div>
    <div class="location--timeblock">
      <div class="location--timeblock-date date">
        <span class="date--day-short"></span>
        <span class="date--date"></span>
        <span class="date--month"></span>
      </div>
      <div class="location--timeblock-time time"></div>
    </div>`);

    weatherContainer.insertAdjacentHTML('afterbegin', `<div class="weather--current">
      <div class="temperature--block">
        <div class="weather--current-temperature temp"></div>
        <div class="weather--current-forecast"></div>
      </div>
      <div class="weather--current-details">
        <div class="weather--current-details_icon"></div>
        <div class="weather--current-details_desc"></div>
      </div>
    </div>
    <div class="weather--forecast"></div>`);
  }

  updateView(location, time) {
    const { placename } = location;
    this.container.querySelector('.location--placename').textContent = placename;

    this.showDate(time);
    this.showTime(time);
    this.showCurrentWeather();
    this.showForecast();
    if (localStorage.temperatureUnits === 'F') {
      this.toggleUnits();
    }
  }

  showDate(time) {
    const translation = getTranslation();

    const dayShort = translation.dayShort[time.getDay()];
    const month = translation.month[time.getMonth()];

    this.container.querySelector('.date--day-short').textContent = dayShort;
    this.container.querySelector('.date--date').textContent = time.getDate();
    this.container.querySelector('.date--month').textContent = month;
  }

  showTime(time) {
    let hours = time.getHours();
    hours = (hours < 10 ? '0' : '') + hours;

    let minutes = time.getMinutes();
    minutes = (minutes < 10 ? '0' : '') + minutes;
    let seconds = time.getSeconds();
    seconds = (seconds < 10 ? '0' : '') + seconds;

    const currentTime = `${hours}:${minutes}:${seconds}`;

    this.container.querySelector('.time').textContent = currentTime;
  }

  showCurrentWeather() {
    const {
      temp,
      app_temp: appTemp,
      wind_spd: windSpeed,
      rh,
      weather,
    } = this.model.currentWeather;
    const { max_temp: maxTemp, low_temp: lowTemp } = this.model.forecast.data[0];

    const iconUrl = getWeatherIconUrl(weather.icon);
    const translation = getTranslation();

    this.container.querySelector('.weather--current-temperature').textContent = `${Math.round(temp)}°`;
    this.container.querySelector('.weather--current-forecast').innerHTML = '';
    this.container.querySelector('.weather--current-forecast').insertAdjacentHTML('afterbegin', `
      <span class="temperature-day temp">${Math.round(maxTemp)}°</span>
      <span class="temperature-night temp">${Math.round(lowTemp)}°</span>
    `);

    this.container.querySelector('.weather--current-details_icon').style.backgroundImage = `url(${iconUrl})`;
    this.container.querySelector('.weather--current-details_desc').innerHTML = '';
    this.container.querySelector('.weather--current-details_desc').insertAdjacentHTML('afterbegin', `
      <p>${translation.wether[weather.code]}</p>
      <p>${translation.feel} <span class="temp">${Math.round(appTemp)}°</span></p>
      <p>${translation.wind} ${Math.round(windSpeed)} ${translation.ms}</p>
      <p>${translation.humidity} ${Math.round(rh)}%</p>
    `);
  }

  showForecast() {
    const forecastContainer = this.container.querySelector('.weather--forecast');
    forecastContainer.innerHTML = '';

    const translation = getTranslation();
    const locationDay = this.model.getLocationTime().getDay();
    let forecastCounter = 0;

    this.model.forecast.data.forEach((forecast) => {
      const forecastDay = new Date(forecast.datetime).getDay();
      if (forecastDay === locationDay
          || (forecastDay + 7) % 7 === locationDay
         || forecastCounter === 3) {
        return 0;
      }

      const iconUrl = getWeatherIconUrl(forecast.weather.icon);

      const nextDayForecastElement = createElement('div', 'weather--forecast-next_day', 'next_day');
      nextDayForecastElement.insertAdjacentHTML('afterbegin',
        `<div class="weather--forecast-day_name next_day-name">${translation.day[forecastDay]}</div>
        <div class="weather--forecast-details next_day-details">
          <div class="wether--forecast-temperature next_day-temperature">
            <span class="temperature-day temp">${Math.round(forecast.max_temp)}°</span>
            <span class="temperature-night temp">${Math.round(forecast.low_temp)}°</span>
          </div>
          <div class="weather--forecast-icon next_day-icon" style="background-image: url(${iconUrl})"></div>
        </div>`);

      forecastCounter += 1;
      return forecastContainer.insertAdjacentElement('beforeend', nextDayForecastElement);
    });
  }

  toggleUnits() {
    const targetUnits = localStorage.temperatureUnits;
    this.container.querySelectorAll('.temp').forEach((element) => {
      const value = parseFloat(element.textContent);
      element.textContent = `${convertTemperatureUnits(value, targetUnits)}°`;
    });
  }
}
