import { getUserLocation } from '../api-handlers';

export default async function getСoordinates() {
  let location;

  if (sessionStorage.navigatorLocation) {
    location = JSON.parse(sessionStorage.navigatorLocation);
    localStorage.removeItem('navigatorLocation');
    return location;
  }

  location = await getUserLocation();
  const { loc } = location;

  location.lat = +loc.split(',')[0];
  location.lng = +loc.split(',')[1];

  return location;
}
