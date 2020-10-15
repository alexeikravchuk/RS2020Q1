import {
  API_KEY_YANDEX_TRANSLATE,
  API_KEY_IPINFO,
  API_KEY_WEATHERBIT,
  API_KEY_GEOCODING,
  API_KEY_UNSPLASH,
} from '../../config';

const FOOTER_LINKS = {
  rss: {
    link: 'https://rs.school/',
    title: 'RS School 2020q1',
  },
  github: {
    link: 'https://github.com/alexeikravchuk',
    title: 'Alexei Kravchuk',
  },
};

const YANDEX_TRANSLATE_API = {
  link: 'https://translate.yandex.net/api/v1.5/tr.json/translate',
  key: API_KEY_YANDEX_TRANSLATE,
  getURL: (text, from, to) =>
    `${YANDEX_TRANSLATE_API.link}?key=${YANDEX_TRANSLATE_API.key}&lang=${from}-${to}&text=${text}`,
  errorsMessage: ':( Error connecting to Yandex.Translate server.',
};

const IPINFO_API = {
  link: 'https://ipinfo.io/',
  key: API_KEY_IPINFO,
  getURL: () => `${IPINFO_API.link}json?token=${IPINFO_API.key}`,
  errorsMessage: 'location error',
  defaultLocation: {
    city: 'Minsk',
    country: 'BY',
    placename: 'Minsk, Belarus',
    lat: 53.9,
    lng: 27.5667,
    region: 'Minsk City',
    timezone: 'Europe/Minsk',
  },
};

const WEATHERBIT_API = {
  link: 'http://api.weatherbit.io/v2.0/',
  key: API_KEY_WEATHERBIT,
  getCurrentURL: (lat, lng) => `${WEATHERBIT_API.link}current?key=${WEATHERBIT_API.key}&lat=${lat}&lon=${lng}`,
  getForecastURL: (lat, lng) =>
    `${WEATHERBIT_API.link}forecast/daily?key=${WEATHERBIT_API.key}&days=5&lat=${lat}&lon=${lng}`,
  errorsMessage: 'weatherbit API error',
};

const GEOCODING_API = {
  link: 'https://api.opencagedata.com/geocode/v1/json',
  key: API_KEY_GEOCODING,
  getReversURL: (lat, lng, language) =>
    `${GEOCODING_API.link}?q=${lat}+${lng}&language=${language.toLowerCase()}&key=${GEOCODING_API.key}`,
  getForvardURL: (placename, language) =>
    `${GEOCODING_API.link}?q=${placename}&language=${language.toLowerCase()}&key=${GEOCODING_API.key}`,
  errorsMessage: 'geocoding API error',
};

const GOOGLE_MAPS_API = {
  link: 'https://maps.googleapis.com/maps/api/js',
  key: 'AIzaSyAZQNfThTyMWUMk8qTkRpJYiltXwKWgSdM',
  getURL: () => `${GOOGLE_MAPS_API.link}?key=${GOOGLE_MAPS_API.key}`,
};

const UNSPLASH_API = {
  link: 'https://api.unsplash.com/photos/random',
  key: API_KEY_UNSPLASH,
  getURL: (query) => `${UNSPLASH_API.link}?client_id=${UNSPLASH_API.key}&query=${query}&orientation=landscape`,
  errorsMessage: 'unsplash API error',
};

const BACKGROUND_DEFAULT = './img/background_default.jpg';

const LANGUAGE_DEFAULT = 'en';

const DAY_TAGS = 'day,daytime';
const NIGHT_TAGS = 'night,dark';

const QUERY_DEFAULT = 'sky,nature';

const ERROR_MESSAGE = {
  en: 'Search Error',
  be: 'Памылка пошуку',
  ru: 'Ошибка поиска',
};

const MODAL_INFO_HTML = `
 <div class="modal--text">
  <h1>Fancy Weather</h1>
  <span>Voice commands to control:</span>
  <ul>
    <li>voice weather forecast: "weather", "forecast" ("погода", "прогноз")</li>
    <li>volume increase: "louder" ("громче")</li>
    <li>volume decrease: "quieter" ("тише")</li>
  </ul>

  <span>Additional functionality:</span>
  <ul>
    <li>a click on the map shows the weather at the specified location;</li>
    <li>you can share the search results using the link with coordinates.</li>
  </ul>

  <code>Press Esc, Space, Enter or click OK to close the window</code>
  <button class="close-btn">OK</button>
</div>`;

export {
  FOOTER_LINKS,
  YANDEX_TRANSLATE_API,
  IPINFO_API,
  WEATHERBIT_API,
  UNSPLASH_API,
  GEOCODING_API,
  GOOGLE_MAPS_API,
  BACKGROUND_DEFAULT,
  LANGUAGE_DEFAULT,
  DAY_TAGS,
  NIGHT_TAGS,
  QUERY_DEFAULT,
  ERROR_MESSAGE,
  MODAL_INFO_HTML,
};
