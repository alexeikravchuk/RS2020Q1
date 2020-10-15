const APP_TITLE = 'MovieSearch';
const FIRST_REQUEST_TEXT = 'dream';
const NO_POSTER_IMG = './assets/img/no_poster.jpg';

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
  key: 'key=trnsl.1.1.20200424T201938Z.3f0507346db250f1.23ad3b3e2cb7ad06e6a17ef51446f1f79c887410',
  getURL: (direction, text) =>
    `${YANDEX_TRANSLATE_API.link}?${YANDEX_TRANSLATE_API.key}&lang=${direction}&text=${text}`,
  errorsMessage: ':( Error connecting to Yandex.Translate server.',
};

const TRANSLATE_DIRECTION = {
  fromRuToEn: 'ru-en',
  fromEnToRu: 'en-ru',
};

const OMD_API = {
  link: 'http://www.omdbapi.com/',
  // apikey: '5e340316',
  // apikey: 'e1949d9',
  apikey: 'fda80ffd',
  getMovieListURL: (title, page = 1) =>
    `${OMD_API.link}?apikey=${OMD_API.apikey}&type=movie&s=${title}&page=${page}`,
  getMovieDateURL: (id) => `${OMD_API.link}?apikey=${OMD_API.apikey}&i=${id}`,
  errorsMessage: {
    'Movie not found!': 'No results were found for',
    'Something went wrong.': 'No results were found for',
    'Too many results.': 'Too many results for',
    '404 Not Found': ':( Error connecting to OMDb API server.',
    NO_RESULT: 'According to the given options, no results were found',
  },
};

const MIN_YEAR = 1900;
const MAX_YEAR = 2099;
const MIN_RATING = 0;
const MAX_RATING = 10;

export {
  APP_TITLE,
  FIRST_REQUEST_TEXT,
  NO_POSTER_IMG,
  FOOTER_LINKS,
  YANDEX_TRANSLATE_API,
  TRANSLATE_DIRECTION,
  OMD_API,
  MIN_YEAR,
  MAX_YEAR,
  MIN_RATING,
  MAX_RATING,
};
