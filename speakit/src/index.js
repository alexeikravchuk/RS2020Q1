import App from './js/App/App';
import './sass/style.scss';

window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app-container');
  new App(container).start();
});
