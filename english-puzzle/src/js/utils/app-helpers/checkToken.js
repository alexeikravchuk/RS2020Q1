import { TOKEN_LIFETIME } from '../../constants';

export default function checkToken() {
  if (localStorage.token && localStorage.tokenTime) {
    const currentTime = Date.now();
    const tokenTime = new Date(JSON.parse(localStorage.tokenTime));
    if (currentTime - tokenTime < TOKEN_LIFETIME) {
      return true;
    }
    return false;
  }
  return false;
}
