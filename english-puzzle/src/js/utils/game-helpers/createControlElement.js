import getOptionsNumberListHTML from './getOptionsListHTML';
import { LEVELS_COUNT } from '../../constants';
import createElement from '../app-helpers/createElement';

export default function createControlElement(gameState) {
  const control = createElement('div', 'game--control-wrapper');

  const textExampleTranslate = gameState.words && gameState.words[0] ? gameState.words[0].textExampleTranslate : '';
  control.insertAdjacentHTML(
    'afterbegin',
    `
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
          ${getOptionsNumberListHTML(gameState.pages || 0, gameState.currentPage)}
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
      <button class="image-btn${+gameState.isImageActive ? '' : ' disabled'}">
        <i class="material-icons">image</i>
        <span class="tooltiptext">Image hint</span>
      </button>
      <button class="finish-btn">
        <i class="material-icons">check_circle</i>
        <span class="tooltiptext">Finish current sentence</span>
      </button>
    </div>
    <div class="control--hints">
      <div class="audio-hint">
        <i class="material-icons">volume_up</i>
        <span class="tooltiptext">play pronunciation hint</span>
      </div>
      <div class="translation-hint">
        <p class="sentence-translated">${textExampleTranslate}</p>
      </div>
    </div>
  `,
  );
  
  const levelsSelect = control.querySelector('#levels');
  const pagesSelect = control.querySelector('#pages');
  
  if (levelsSelect && levelsSelect.options.length > 0) {
    const levelValue = (gameState.level || 0) + 1;
    levelsSelect.value = levelValue;
  }
  
  if (pagesSelect && pagesSelect.options.length > 0) {
    const pageValue = (gameState.currentPage || 0) + 1;
    pagesSelect.value = pageValue;
  }
  
  return control;
}
