import { createElement } from '../utility';
import { GOOGLE_MAPS_API } from '../../constants';

export default function getGoogleApiScriptElement() {
  const script = createElement('script');
  script.src = GOOGLE_MAPS_API.getURL();
  script.defer = true;
  script.async = true;
  return script;
}
