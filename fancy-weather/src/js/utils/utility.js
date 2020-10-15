import translationRu from '../../assets/i18n/ru.json';
import translationBe from '../../assets/i18n/be.json';
import translationEn from '../../assets/i18n/en.json';
import { BACKGROUND_DEFAULT } from '../constants';

function createElement(tagName, ...classNames) {
  const element = document.createElement(tagName);
  element.classList.add(...classNames);
  return element;
}

function getTranslation() {
  switch (localStorage.language) {
    case 'ru':
      return translationRu;
    case 'be':
      return translationBe;
    default:
      return translationEn;
  }
}

async function checkImgSrc(src) {
  if (src === 'N/A') {
    return BACKGROUND_DEFAULT;
  }

  try {
    const response = await fetch(src);
    if (!response.ok) {
      throw new Error('The network response was not ok.');
    }
    const myBlob = await response.blob();
    return URL.createObjectURL(myBlob);
  } catch (error) {
    return BACKGROUND_DEFAULT;
  }
}

export {
  createElement,
  getTranslation,
  checkImgSrc,
};
