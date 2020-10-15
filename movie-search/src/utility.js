import { NO_POSTER_IMG, YANDEX_TRANSLATE_API, TRANSLATE_DIRECTION } from './constants';

function createElement(tagName, ...classNames) {
  const element = document.createElement(tagName);
  element.classList.add(...classNames);
  return element;
}

function shuffle(arr) {
  let j;
  const newArr = arr;
  for (let i = arr.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [arr[j], arr[i]];
  }
  return newArr;
}

async function checkImgSrc(src) {
  if (src === 'N/A') {
    return NO_POSTER_IMG;
  }

  try {
    const response = await fetch(src);
    if (!response.ok) {
      throw new Error('The network response was not ok.');
    }
    const myBlob = await response.blob();
    return URL.createObjectURL(myBlob);
  } catch (error) {
    return NO_POSTER_IMG;
  }
}

function translateFromRuToEn(russianLine) {
  const url = YANDEX_TRANSLATE_API.getURL(TRANSLATE_DIRECTION.fromRuToEn, russianLine);
  return fetch(url, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  })
    .then((response) => response.json())
    .then((json) => {
      if (json.code === 200) {
        const englishLine = json.text;
        return englishLine;
      }
      throw Error(YANDEX_TRANSLATE_API.errorsMessage);
    })
    .catch(() => {
      throw Error(YANDEX_TRANSLATE_API.errorsMessage);
    });
}

export { createElement, shuffle, checkImgSrc, translateFromRuToEn };
