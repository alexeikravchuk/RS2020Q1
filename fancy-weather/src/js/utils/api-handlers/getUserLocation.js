import { IPINFO_API } from '../../constants';

export default async function getUserLocation() {
  try {
    const response = await fetch(IPINFO_API.getURL());
    if (response.status === 200) {
      return response.json();
    }
    throw Error();
  } catch (e) {
    throw Error(IPINFO_API.errorsMessage);
  }
}
