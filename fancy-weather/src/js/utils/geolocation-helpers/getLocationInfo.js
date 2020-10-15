import { LANGUAGE_DEFAULT } from '../../constants';
import { getCityInfo } from '../api-handlers';

export default async function getLocationInfo(info) {
  const location = info;
  let extraInfo;
  try {
    if (!location.placename) {
      const language = localStorage.language || LANGUAGE_DEFAULT;
      localStorage.language = language;
      const { lat, lng } = info;
      extraInfo = await getCityInfo(lat, lng, language);
    } else {
      location.lat = info.geometry.lat;
      location.lng = info.geometry.lng;
    }

    const {
      town, city, village, hamlet, suburb, county, state, country, continent,
    } = extraInfo.components;
    const cityResult = town || village || hamlet || city || suburb || county || state;
    location.timeOffsetSec = extraInfo.annotations.timezone.offset_sec;

    location.placename = cityResult ? `${cityResult}, ${country || continent}` : extraInfo.formatted;
    return location;
  } catch (e) {
    throw Error(e.message);
  }
}
