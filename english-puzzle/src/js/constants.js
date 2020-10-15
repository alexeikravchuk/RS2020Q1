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

const TOKEN_LIFETIME = 4 * 60 * 60 * 1000;

const LEVELS_COUNT = 6;
const WORDS_PER_PAGE = 10;
const WORDS_PER_SENTENCE = 10;
const BACKGROUND_DEFAULT = './assets/img/background_default.jpg';
const AUDIO_SRC = 'https://raw.githubusercontent.com/alexeikravchuk/rslang-data/master/';

export {
  TOKEN_LIFETIME,
  LEVELS_COUNT,
  WORDS_PER_PAGE,
  WORDS_PER_SENTENCE,
  BACKGROUND_DEFAULT,
  FOOTER_LINKS,
  AUDIO_SRC,
};
