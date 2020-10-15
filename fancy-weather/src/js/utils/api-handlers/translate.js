import { YANDEX_TRANSLATE_API } from '../../constants';

export default async function translate(line, from, to) {
  const url = YANDEX_TRANSLATE_API.getURL(line, from, to);
  try {
    const response = await fetch(url, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
    const json = await response.json();
    if (json.code === 200) {
      return json.text;
    }
    throw Error();
  } catch (e) {
    throw Error(YANDEX_TRANSLATE_API.errorsMessage);
  }
}
