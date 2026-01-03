import createElement from '../app-helpers/createElement';
import shufflePuzzles from './shufflePuzzles';
import { WORDS_PER_SENTENCE } from '../../constants';

function getSentenceFields() {
  let fieldHTML = '<div class="result-field--background"></div>\n';

  for (let i = 1; i <= WORDS_PER_SENTENCE; i += 1) {
    fieldHTML += `<div class="result--sentence">
      <div class="result--sentence-numeration${i > 1 ? ' hidden' : ''}"><span>${i}</span></div>
      <div class="result--sentence-text_container${i > 1 ? '' : ' current-sentence'}"></div>
    </div>\n`;
  }

  return fieldHTML;
}

export default function createGameFieldElement(gameState) {
  const puzzle = createElement('div', 'game--puzzle-wrapper');

  puzzle.insertAdjacentHTML(
    'afterbegin',
    `
    <div class="game--puzzle-results result">
      ${getSentenceFields()}
    </div>
    <div class="game--puzzle-raw raw">
    </div>
  `,
  );

  const puzzleData = gameState.puzzles?.[0] || [];
  const rawElement = puzzle.querySelector('.raw');

  if (rawElement) {
    rawElement.insertAdjacentElement('afterbegin', shufflePuzzles(puzzleData));
  }

  return puzzle;
}
