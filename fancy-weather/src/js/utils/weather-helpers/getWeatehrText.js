/* eslint-disable default-case */
import { getTranslation } from '../utility';
import convertTemperatureUnits from './convertTemperatureUnits';

function inflectCityName(city) {
  const lastLetter = city.substr(-1);
  const lastLetters = city.substr(-2);

  switch (lastLetters) {
    case 'чи':
    case 'ки':
    case 'щи':
      return `${city.slice(0, -1)}ах`;
    case 'ая':
      return `${city.slice(0, -2)}ой`;
    case 'ое':
      return `${city.slice(0, -1)}м`;
    case 'ец':
      return `${city.slice(0, -2)}це`;
    case 'ый':
      return `${city.slice(0, -2)}ом`;
  }

  switch (lastLetter) {
    case 'о':
    case 'e':
    case 'и':
      return city;
    case 'ь':
    case 'а':
      return `${city.slice(0, -1)}е`;
    case 'ы':
      return `${city.slice(0, -1)}ах`;
    default:
      return `${city}е`;
  }
}

export default function getWeatehrText(location, currentWeather, forecast) {
  const translation = getTranslation();
  const { speech } = translation;
  const units = localStorage.temperatureUnits;

  let { temp, app_temp: appTemp } = currentWeather;
  const { wind_spd: windSpeed, rh, weather } = currentWeather;
  let { max_temp: maxTempToday, low_temp: lowTempToday } = forecast[0];

  temp = units === 'F' ? convertTemperatureUnits(temp, 'F') : temp;
  appTemp = units === 'F' ? convertTemperatureUnits(appTemp, 'F') : appTemp;
  maxTempToday = units === 'F' ? convertTemperatureUnits(maxTempToday, 'F') : maxTempToday;
  lowTempToday = units === 'F' ? convertTemperatureUnits(lowTempToday, 'F') : lowTempToday;

  const { language } = localStorage;
  let city = location.split(', ')[0];
  if (language === 'ru' || language === 'be') {
    city = inflectCityName(city);
  }

  let text = `${speech.in} ${city} ${speech.now} ${Math.round(temp)}°
    ${Math.round(temp) < 0 ? speech.belowZero : ''} ${units === 'F' ? speech.fahrenheit : speech.celsius}.
    ${translation.wether[weather.code]}, ${translation.feel} ${Math.round(appTemp)}°,
    ${translation.wind} ${Math.round(windSpeed)} ${speech.ms},
    ${translation.humidity} ${Math.round(rh)}%.
    ${speech.dayExpected} ${Math.round(maxTempToday)}°, ${speech.nightExpected} ${Math.round(lowTempToday)}°. `;

  for (let i = 1; i <= 3; i += 1) {
    const { datetime } = forecast[i];
    let { max_temp: maxTemp, low_temp: lowTemp } = forecast[i];
    maxTemp = units === 'F' ? convertTemperatureUnits(maxTemp, 'F') : maxTemp;
    lowTemp = units === 'F' ? convertTemperatureUnits(lowTemp, 'F') : lowTemp;

    const day = new Date(datetime).getDay();
    text += `${speech.on} ${speech.inDay[day]} ${speech.dayExpected} ${Math.round(maxTemp)}°,
    ${speech.nightExpected} ${Math.round(lowTemp)}°. `;
  }

  return text.split('\n').join(' ').split('  ').join('');
}
