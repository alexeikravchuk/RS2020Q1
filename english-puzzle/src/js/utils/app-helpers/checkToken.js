import { TOKEN_LIFETIME } from '../../constants';

export default function checkToken() {
  return true;

  // server is not working, so we need to comment this out
  /*
  if (localStorage.token && localStorage.tokenTime) {
    const currentTime = Date.now();
    const tokenTime = new Date(JSON.parse(localStorage.tokenTime));
    if (currentTime - tokenTime < TOKEN_LIFETIME) {
      return true;
    }
    return false;
  }
  return false;
  */
}
