import GameView from '../views/GameView';
import getNumberOfPages from '../utils/API-helpers/getNumberOfPages';
import getCurrentPageWords from '../utils/API-helpers/getCurrentPageWords';
import getImageSrc from '../utils/game-helpers/getImgSrc';
import getPuzzles from '../utils/game-helpers/getPuzzles';
import { AUDIO_SRC } from '../constants';
import LocalStorage from '../utils/app-helpers/localStorage';

export default class GameModel {
  #dataReadyPromise;
  #dataReadyResolve;

  constructor(container) {
    this.container = container;
    this.view = new GameView(this, container);
    this.#initializeDataReadyPromise();
  }

  #initializeDataReadyPromise() {
    this.#dataReadyPromise = new Promise((resolve) => {
      this.#dataReadyResolve = resolve;
    });
  }

  async init() {
    this.state = {
      level: LocalStorage.getNumber('level', 0),
      currentPage: LocalStorage.getNumber('currentPage', 0),
      currentSentence: 0,
      isAutoplayActive: LocalStorage.getBoolean('isAutoplayActive', true),
      isTranslateActive: LocalStorage.getBoolean('isTranslateActive', true),
      isPronunciationActive: LocalStorage.getBoolean('isPronunciationActive', true),
      isImageActive: LocalStorage.getBoolean('isImageActive', false),
      words: [],
    };

    await this.setData();
    this.#dataReadyResolve();
  }

  async setData() {
    this.state.imageSrcs = getImageSrc(this.state.level, this.state.currentPage);
    try {
      const [pages, words] = await Promise.all([
        getNumberOfPages(this.state.level),
        getCurrentPageWords(this.state.level, this.state.currentPage),
      ]);

      this.state.words = words;
      this.state.pages = pages;

      this.state.puzzles = await getPuzzles({
        src: this.state.imageSrcs.cutSrc,
        wordsList: this.state.words.map((word) => word.textExample),
      });
      return true;
    } catch (error) {
      this.showError(error.message || 'Failed to load game data');
      return false;
    }
  }

  async start() {
    try {
      await this.#dataReadyPromise;
      this.view.render();
      this.makePuzzleDragable();
      this.setListeners();
      if (this.state.isAutoplayActive) {
        this.playSentence();
      }
    } catch (error) {
      this.showError(error.message || 'Failed to start game');
    }
  }

  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = 'padding: 20px; color: red; background: #ffe6e6; border: 1px solid red; margin: 20px;';
    this.container.innerHTML = '';
    this.container.appendChild(errorDiv);
  }

  setListeners() {
    const levelsElement = document.getElementById('levels');
    const pagesElement = document.getElementById('pages');
    if (levelsElement) {
      levelsElement.addEventListener('change', (e) => this.changePage(e));
    }
    if (pagesElement) {
      pagesElement.addEventListener('change', (e) => this.changePage(e));
    }
    this.container.addEventListener('click', (e) => this.determinateClick(e));
  }

  determinateClick(event) {
    const { target } = event;

    const resultFromGroup = this.handleCanvasItemFromGroup(target);
    if (resultFromGroup !== null && resultFromGroup !== false) {
      return resultFromGroup;
    }

    const resultFromSentence = this.handleCanvasItemFromSentence(event, target);
    if (resultFromSentence !== null && resultFromSentence !== false) {
      return resultFromSentence;
    }

    const resultFromIcon = this.handleMaterialIconClick(event, target);
    if (resultFromIcon !== null && resultFromIcon !== false) {
      return resultFromIcon;
    }

    return false;
  }

  handleCanvasItemFromGroup(target) {
    if (target.classList.contains('canvas-item') && target.parentElement?.classList.contains('group-words')) {
      const currentSentence = this.container.querySelector('.current-sentence');
      if (currentSentence) {
        currentSentence.insertAdjacentElement('beforeend', target);
        return this.checkCurrentSentence();
      }
    }
    return null;
  }

  handleCanvasItemFromSentence(event, target) {
    if (!target.classList.contains('canvas-item') || !target.parentElement.classList.contains('current-sentence')) {
      return null;
    }

    const lastPuzzleId = LocalStorage.get('lastPuzzle');
    if (lastPuzzleId) {
      return this.moveLastPuzzle(event, target, lastPuzzleId);
    }

    GameModel.selectPuzzle(target);
    return true;
  }

  moveLastPuzzle(event, target, lastPuzzleId) {
    const lastPuzzle = this.container.querySelector(`[data-item="${lastPuzzleId}"]`);
    if (!lastPuzzle) {
      LocalStorage.remove('lastPuzzle');
      return false;
    }
    lastPuzzle.classList.remove('active');
    LocalStorage.remove('lastPuzzle');

    const insertPosition = event.offsetX < target.clientWidth / 2 ? 'beforebegin' : 'afterend';
    target.insertAdjacentElement(insertPosition, lastPuzzle);
    return this.checkCurrentSentence();
  }

  static selectPuzzle(target) {
    const itemId = target.dataset.item;
    if (itemId) {
      LocalStorage.set('lastPuzzle', itemId);
      target.classList.add('active');
    }
  }

  handleMaterialIconClick(event, target) {
    if (!target.classList.contains('material-icons')) {
      return null;
    }

    const parent = target.parentElement;
    if (!parent) {
      return null;
    }

    if (parent.classList.contains('audio-hint')) {
      return this.playSentence();
    }
    if (parent.classList.contains('autoplay-btn')) {
      return this.toggleAutoplay(parent);
    }
    if (parent.classList.contains('translate-btn')) {
      return this.toggleTranslate(parent);
    }
    if (parent.classList.contains('listen-btn')) {
      return this.toggleListen(parent);
    }
    if (parent.classList.contains('image-btn')) {
      return this.toggleImage(parent);
    }

    return null;
  }

  toggleAutoplay(button) {
    button.classList.toggle('disabled');
    this.state.isAutoplayActive = !this.state.isAutoplayActive;
    LocalStorage.set('isAutoplayActive', this.state.isAutoplayActive);
    return true;
  }

  toggleTranslate(button) {
    button.classList.toggle('disabled');
    const translatedElement = this.container.querySelector('.sentence-translated');
    if (translatedElement) {
      translatedElement.classList.toggle('hidden');
    }
    return true;
  }

  toggleListen(button) {
    button.classList.toggle('disabled');
    const audioHintElement = this.container.querySelector('.audio-hint');
    if (audioHintElement) {
      audioHintElement.classList.toggle('hidden');
    }
    return true;
  }

  toggleImage(button) {
    button.classList.toggle('disabled');
    const puzzleBackground = this.container.querySelector('.result-field--background');
    if (!puzzleBackground) {
      return false;
    }
    puzzleBackground.classList.toggle('image');

    if (button.classList.contains('disabled')) {
      puzzleBackground.style.backgroundImage = 'none';
    } else {
      puzzleBackground.style.backgroundImage = `url(${this.state.imageSrcs.cutSrc})`;
    }
    return true;
  }

  async changePage(event) {
    if (event.target.id === 'levels') {
      this.state.level = Number(event.target.value) - 1;
      this.state.currentPage = 0;
      LocalStorage.set('level', this.state.level);
      LocalStorage.set('currentPage', this.state.currentPage);
      this.view.updatePageOptions();
    } else if (event.target.id === 'pages') {
      this.state.currentPage = Number(event.target.value) - 1;
      LocalStorage.set('currentPage', this.state.currentPage);
    }

    this.state.currentSentence = 0;
    await this.setData();
    this.view.resetPuzzle();
    this.makePuzzleDragable();
    if (this.state.isAutoplayActive) {
      this.playSentence();
    }
  }

  playSentence() {
    const currentWord = this.state.words[this.state.currentSentence];
    if (!currentWord || !currentWord.audioExample) {
      return false;
    }

    const audioSrc = `${AUDIO_SRC}${currentWord.audioExample}`;
    if (!this.state.audioplay) {
      this.state.audioplay = new Audio(audioSrc);
      this.state.audioplay.addEventListener('ended', () => {
        this.state.audioplay = null;
      });
      this.state.audioplay.addEventListener('error', () => {
        this.state.audioplay = null;
      });
      this.state.audioplay.play().catch(() => {
        this.state.audioplay = null;
      });
    }
    return true;
  }

  checkCurrentSentence() {
    const sentenceElement = this.view.currentSentenceElement;
    if (!sentenceElement) {
      return false;
    }

    const currentWord = this.state.words[this.state.currentSentence];
    if (!currentWord) {
      return false;
    }

    const sentenceLength = Number(currentWord.wordsPerExampleSentence);
    const canvasItems = sentenceElement.querySelectorAll('.canvas-item');
    const isCorrectOrder = Array.from(canvasItems).every((item, i) => {
      const itemParts = item.dataset.item?.split('-');
      if (!itemParts || itemParts.length < 2) {
        return false;
      }
      return Number(itemParts[1]) === i + 1;
    });

    if (isCorrectOrder && sentenceLength === canvasItems.length) {
      return this.showNextWords();
    }
    return false;
  }

  showNextWords() {
    this.state.currentSentence += 1;
    this.view.showNextWords();
    if (this.state.isAutoplayActive) {
      this.playSentence();
    }
    return true;
  }

  makePuzzleDragable() {
    function drag(event) {
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.effectAllowed = 'copyMove';
      event.dataTransfer.setData('text', event.target.dataset.item);
    }

    function allowDrop(event) {
      event.preventDefault();
    }

    function drop(event) {
      event.preventDefault();
      const data = event.dataTransfer.getData('text');
      const element = document.querySelector(`[data-item="${data}"]`);
      if (!element) {
        return false;
      }
      element.style.cursor = 'grab';

      if (event.target.classList.contains('current-sentence')) {
        event.target.appendChild(element);
        return this.checkCurrentSentence();
      }
      if (event.target.classList.contains('canvas-item')) {
        if (event.offsetX < event.target.clientWidth / 2) {
          event.target.insertAdjacentElement('beforebegin', element);
          return this.checkCurrentSentence();
        }
        event.target.insertAdjacentElement('afterend', element);
        return this.checkCurrentSentence();
      }
      return false;
    }

    this.state.puzzles.forEach((row) => {
      Array.from(row.querySelectorAll('[data-item]')).forEach((puzzle) => {
        puzzle.setAttribute('draggable', 'true');
        puzzle.addEventListener('dragstart', (event) => drag(event), false);
      });
    });

    Array.from(this.container.querySelectorAll('.result--sentence-text_container')).forEach((sentenceBox) => {
      sentenceBox.addEventListener('dragover', (event) => allowDrop(event));
      sentenceBox.addEventListener('drop', (event) => drop.call(this, event));
    });
  }
}
