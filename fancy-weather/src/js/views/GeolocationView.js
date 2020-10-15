import { getTranslation } from '../utils/utility';

export default class GeolocationView {
  constructor(model) {
    this.model = model;
  }

  render(container) {
    this.container = container.querySelector('#geolocation');
    this.container.innerHTML = '';

    this.container.insertAdjacentHTML('afterbegin', `
      <div class="geolocation--map"></div>
      <div class="geolocation--coordinats">
        <span class="lat"></span><br>
        <span class="lng"></span>
      </div>`);

    this.showСoordinates();
  }

  showСoordinates() {
    const { lat: latTranslation, lng: lngTranslation } = getTranslation();
    let { lat, lng } = this.model.location;
    const latMinutes = Math.round((Math.abs(lat) % 1) * 60);
    const lngMinutes = Math.round((Math.abs(lng) % 1) * 60);
    lat = `${latTranslation}: ${Math.floor(lat)}°${latMinutes < 10 ? '0' : ''}${latMinutes}'`;
    lng = `${lngTranslation}: ${Math.floor(lng)}°${lngMinutes < 10 ? '0' : ''}${lngMinutes}'`;

    document.querySelector('.lat').textContent = lat;
    document.querySelector('.lng').textContent = lng;
  }
}
