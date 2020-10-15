import App from './App/App';
import cards from './cards';

window.addEventListener('DOMContentLoaded', () => {
  const app = new App(cards);
  app.start();
});
