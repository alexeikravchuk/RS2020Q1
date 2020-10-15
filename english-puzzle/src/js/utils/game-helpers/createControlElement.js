import getOptionsNumberListHTML from './getOptionsListHTML';
import { LEVELS_COUNT } from '../../constants';
import createElement from '../app-helpers/createElement';

export default function createControlElement(gameState) {
  const control = createElement('div', 'game--control-wrapper');
  control.insertAdjacentHTML('afterbegin', `
    <form class="control--raunds">
      <div class="control--raunds-level">
        <label for="levels">Level</label>
        <select id="levels">
          ${getOptionsNumberListHTML(LEVELS_COUNT, gameState.level)}
        </select>
      </div>
      <div class="control--raunds-page">
        <label for="pages">Page</label>
        <select id="pages">
          ${getOptionsNumberListHTML(gameState.pages, gameState.currentPage)}
        </select>
      </div>
    </form>
    <div class="control--buttons">
      <button class="autoplay-btn${+gameState.isAutoplayActive ? '' : ' disabled'}">
        <i class="material-icons">volume_up</i>
        <span class="tooltiptext">Autoplay</span>
      </button>
      <button class="translate-btn">
        <i class="material-icons">translate</i>
        <span class="tooltiptext">Translate hint</span>
      </button>
      <button class="listen-btn">
        <i class="material-icons">music_note</i>
        <span class="tooltiptext">Pronunciation hint </span>
      </button>
      <button class="image-btn disabled">
        <i class="material-icons">image</i>
        <span class="tooltiptext">Image hint</span>
      </button>
    </div>
    <div class="control--hints">
      <div class="audio-hint">
        <i class="material-icons">volume_up</i>
        <span class="tooltiptext">play pronunciation hint</span>
      </div>
      <div class="translation-hint">
        <p class="sentence-translated">${gameState.words[0].textExampleTranslate}</p>
      </div>
    </div>
  `);
  return control;
}
