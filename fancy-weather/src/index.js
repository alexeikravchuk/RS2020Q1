import 'normalize.css';
import './assets/style/style.scss';
import App from './js/controllers/App';

window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app-container');
  new App(container).start();
});
