import { WEATHERBIT_API } from '../../constants';

export default async function getWeatherInfo(lat, lng, type) {
  try {
    let response;

    if (type === 1) {
      response = await fetch(WEATHERBIT_API.getCurrentURL(lat, lng));
    } else {
      response = await fetch(WEATHERBIT_API.getForecastURL(lat, lng));
    }

    if (response.status === 200) {
      return response.json();
    }
    throw Error();
  } catch (e) {
    throw Error(WEATHERBIT_API.errorsMessage);
  }
}
