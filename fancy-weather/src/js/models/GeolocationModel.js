import { IPINFO_API } from '../constants';
import GeolocationView from '../views/GeolocationView';
import { getСoordinates, getLocationInfo } from '../utils/geolocation-helpers';

export default class GeolocationModel {
  constructor(container) {
    this.view = new GeolocationView(this);
    this.container = container;
    this.location = null;
  }

  async init() {
    try {
      const coordinates = await getСoordinates();
      await this.setLocation(coordinates);
    } catch (e) {
      this.location = IPINFO_API.defaultLocation;
    }
    return 1;
  }

  async setLocation(coordinates) {
    this.location = await getLocationInfo(coordinates);
  }

  render() {
    this.view.render(this.container);
    this.initMap();
  }

  initMap() {
    const mapBox = this.container.querySelector('.geolocation--map');
    const { Map, Marker } = window.google.maps;
    const { lat, lng } = this.location;
    const center = { lat, lng };

    const map = new Map(mapBox, {
      center,
      zoom: 11,
      zoomControl: true,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_CENTER,
      },
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
    });

    map.addListener('click', (e) => {
      this.mapMarker.setMap(null);
      this.mapMarker = new Marker({
        position: e.latLng,
        map,
      });

      window.location.hash = `lat=${e.latLng.lat()}&lng=${e.latLng.lng()}`;
      map.panTo(e.latLng);
    });

    this.map = map;
    this.mapMarker = new Marker({ position: center, map });
  }

  changeMapCenter() {
    const { lat, lng } = this.location;
    this.map.setCenter({ lat, lng });
    this.mapMarker.setMap(null);

    this.mapMarker = new window.google.maps.Marker({
      position: { lat, lng },
      map: this.map,
    });

    this.view.showСoordinates();
  }

  changeLanguage() {
    this.view.showСoordinates();
  }
}
