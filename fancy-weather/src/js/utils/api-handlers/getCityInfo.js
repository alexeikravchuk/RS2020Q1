import { GEOCODING_API } from '../../constants';

export default async function getCityInfo(lat, lng, language) {
  const url = GEOCODING_API.getReversURL(lat, lng, language);
  try {
    const response = await fetch(url);
    if (response.status === 200) {
      const json = await response.json();
      return json.results[0];
    }
    throw Error();
  } catch (e) {
    throw Error(GEOCODING_API.errorsMessage);
  }
}
