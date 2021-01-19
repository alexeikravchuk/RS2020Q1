import shuffleArray from '../app-helpers/shuffleArray';

export default function shufflePuzzles(puzzlesElement) {
  const puzzles = shuffleArray(Array.from(puzzlesElement.querySelectorAll('.canvas-item')));
  puzzlesElement.append(...puzzles);
  return puzzlesElement;
}
