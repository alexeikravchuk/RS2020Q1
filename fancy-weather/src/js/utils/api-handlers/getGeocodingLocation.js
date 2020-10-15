import { GEOCODING_API, LANGUAGE_DEFAULT } from '../../constants';

export default async function getGeocodingLocation(placename, language = LANGUAGE_DEFAULT) {
  const url = GEOCODING_API.getForvardURL(placename, language);
  try {
    const response = await fetch(url);
    if (response.status === 200) {
      const json = await response.json();
      const result = json.results.find((item) => {
        const { country_code: code } = item.components;
        if (code === 'by') {
          return true;
        }
        return false;
      });
      return result || json.results[0];
    }
    throw Error();
  } catch (e) {
    throw Error(GEOCODING_API.errorsMessage);
  }
}
