import createElement from '../../utils/app-helpers/createElement';
import createControlElement from '../../utils/game-helpers/createControlElement';
import createGameFieldElement from '../../utils/game-helpers/createGameFieldElement';
import shufflePuzzles from '../../utils/game-helpers/shufflePuzzles';
import getOptionsNumberListHTML from '../../utils/game-helpers/getOptionsListHTML';
import { WORDS_PER_SENTENCE } from '../../constants';

export default class GameView {
  constructor(model, container) {
    this.model = model;
    this.container = container;
  }

  render() {
    const gameContainer = createElement('div', 'game--wrapper');

    const control = createControlElement(this.model.state);
    const puzzle = createGameFieldElement(this.model.state);
    const buttons = createElement('div', 'game--buttons-wrapper');

    gameContainer.insertAdjacentElement('beforeend', control);
    gameContainer.insertAdjacentElement('beforeend', puzzle);
    gameContainer.insertAdjacentElement('beforeend', buttons);

    this.container.insertAdjacentElement('afterbegin', gameContainer);
  }

  get currentSentenceElement() {
    return this.container.querySelector('.current-sentence');
  }

  resetPuzzle() {
    const sentences = this.container.querySelectorAll('.result--sentence');
    if (sentences.length === 0) {
      return;
    }

    sentences.forEach((item) => {
      if (item.firstElementChild) {
        item.firstElementChild.classList.add('hidden');
      }
      if (item.lastElementChild) {
        item.lastElementChild.classList.remove('current-sentence');
      }
    });

    this.container.querySelectorAll('.canvas-item').forEach((item) => item.remove());

    if (sentences[0].firstElementChild) {
      sentences[0].firstElementChild.classList.remove('hidden');
    }
    if (sentences[0].lastElementChild) {
      sentences[0].lastElementChild.classList.add('current-sentence');
    }

    const groupWords = this.container.querySelector('.group-words');
    if (groupWords) {
      groupWords.remove();
    }

    const translatedElement = this.container.querySelector('.sentence-translated');
    if (translatedElement && this.model.state.words[0]) {
      translatedElement.innerText = this.model.state.words[0].textExampleTranslate;
    }

    const rawElement = this.container.querySelector('.raw');
    if (rawElement && this.model.state.puzzles[0]) {
      rawElement.insertAdjacentElement('afterbegin', shufflePuzzles(this.model.state.puzzles[0]));
    }
  }

  updatePageOptions() {
    const pagesElement = this.container.querySelector('#pages');
    if (!pagesElement) {
      return;
    }
    pagesElement.innerHTML = '';
    const options = getOptionsNumberListHTML(this.model.state.pages, this.model.state.currentPage);
    pagesElement.insertAdjacentHTML('afterbegin', options);
  }

  showNextWords() {
    const sentenceElements = this.container.querySelectorAll('.result--sentence');
    const currentSentenceNumber = this.model.state.currentSentence;
    const maxSentences = WORDS_PER_SENTENCE;

    if (currentSentenceNumber >= maxSentences || currentSentenceNumber >= sentenceElements.length) {
      return;
    }

    const currentWord = this.model.state.words[currentSentenceNumber];
    if (!currentWord) {
      return;
    }

    const translatedElement = this.container.querySelector('.sentence-translated');
    if (translatedElement) {
      translatedElement.innerText = currentWord.textExampleTranslate;
    }

    if (currentSentenceNumber > 0 && sentenceElements[currentSentenceNumber - 1]?.lastElementChild) {
      sentenceElements[currentSentenceNumber - 1].lastElementChild.classList.remove('current-sentence');
    }

    if (sentenceElements[currentSentenceNumber]?.firstElementChild) {
      sentenceElements[currentSentenceNumber].firstElementChild.classList.remove('hidden');
    }
    if (sentenceElements[currentSentenceNumber]?.lastElementChild) {
      sentenceElements[currentSentenceNumber].lastElementChild.classList.add('current-sentence');
    }

    const groupWords = this.container.querySelector('.group-words');
    if (groupWords) {
      groupWords.remove();
    }

    const rawElement = this.container.querySelector('.raw');
    if (rawElement && this.model.state.puzzles[currentSentenceNumber]) {
      rawElement.insertAdjacentElement('afterbegin', shufflePuzzles(this.model.state.puzzles[currentSentenceNumber]));
    }
  }
}
