import createElement from '../app-helpers/createElement';
import shufflePuzzles from './shufflePuzzles';

function getSentenceFields() {
  let fildHTML = '<div class="result-field--background"></div>\n';

  for (let i = 1; i <= 10; i += 1) {
    fildHTML += `<div class="result--sentence">
      <div class="result--sentence-numeration${i > 1 ? ' hidden' : ''}"><span>${i}</span></div>
      <div class="result--sentence-text_container${i > 1 ? '' : ' current-sentence'}"></div>
    </div>\n`;
  }

  return fildHTML;
}

export default function createGameFieldElement(gameState) {
  const puzzle = createElement('div', 'game--puzzle-wrapper');

  puzzle.insertAdjacentHTML('afterbegin', `
    <div class="game--puzzle-results result">
      ${getSentenceFields()}
    </div>
    <div class="game--puzzle-raw raw">
    </div>
  `);

  puzzle.querySelector('.raw').insertAdjacentElement('afterbegin', shufflePuzzles(gameState.puzzles[0]));

  return puzzle;
}
