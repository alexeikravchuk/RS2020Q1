import App from './controllers/App';

window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app-container');
  new App(container).start();
});
