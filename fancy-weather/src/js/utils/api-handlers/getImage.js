import { UNSPLASH_API, BACKGROUND_DEFAULT } from '../../constants';
import { checkImgSrc } from '../utility';

export default async function getImage(query) {
  try {
    const response = await fetch(UNSPLASH_API.getURL(query));
    if (response.status === 200) {
      const json = await response.json();
      const url = await json.urls.regular;
      return checkImgSrc(url);
    }
    return BACKGROUND_DEFAULT;
  } catch (e) {
    return BACKGROUND_DEFAULT;
  }
}
