import getCurrentSeason from './getCurrentSeason';
import { DAY_TAGS, NIGHT_TAGS, QUERY_DEFAULT } from '../../constants';

export default function getBackgroundQuery(weather) {
  try {
    const wetherQuery = weather.currentWeather.weather.description.split(' ');
    const partOfDay = weather.currentWeather.pod === 'd' ? DAY_TAGS : NIGHT_TAGS;
    const season = getCurrentSeason(weather.getLocationTime().getMonth());
    const city = weather.location.placename.split(',')[0];
    const query = `${wetherQuery[wetherQuery.length - 1]},${partOfDay},${season},${city}`;
    return query;
  } catch (e) {
    return QUERY_DEFAULT;
  }
}
