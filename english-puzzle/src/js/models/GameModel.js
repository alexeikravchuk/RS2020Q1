import GameView from '../views/GameView';
import getNumberOfPages from '../utils/API-helpers/getNumberOfPages';
import getCurrentPageWords from '../utils/API-helpers/getCurrentPageWords';
import getImageSrc from '../utils/game-helpers/getImgSrc';
import getPuzzles from '../utils/game-helpers/getPuzzles';
import { AUDIO_SRC } from '../constants';

export default class GameModel {
  #setDataResolve;
  #dataSetPromise = new Promise((resolve, _reject) => {
    this.#setDataResolve = resolve;
  });

  constructor(container) {
    this.container = container;
    this.view = new GameView(this, container);
  }

  async init() {
    const autoplay = localStorage.isAutoplayActive;

    this.state = {
      level: +localStorage.level || 0,
      currentPage: +localStorage.currentPage || 0,
      currentSentence: 0,
      isAutoplayActive: autoplay ? JSON.parse(autoplay) : true,
      isTranslateActive: localStorage.isTranslateActive || true,
      isPronunciationActive: localStorage.isPronunciationActive || true,
      isImageActive: localStorage.isImageActive || false,
      words: [],
      pages: 0,
    };

    await this.setData();
    return this.#setDataResolve();
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
      return 1;
    } catch (e) {
      this.container.innerHTML = e;
    }
    return 0;
  }

  start() {
    this.#dataSetPromise.then(() => {
      console.log('dataSetPromise resolved');
      console.log(this.state);
      try {
        this.view.render();
        this.makePuzzleDragable();
        this.setListeners();
        if (+this.state.isAutoplayActive) {
          this.playSentence();
        }
      } catch (e) {
        console.log(e);
        this.container.innerHTML = e;
      }
    });
  }

  setListeners() {
    document.getElementById('levels').addEventListener('change', (e) => this.changePage(e));
    document.getElementById('pages').addEventListener('change', (e) => this.changePage(e));
    this.container.addEventListener('click', (e) => this.determinateClick(e));
    
    this.container.addEventListener('dragstart', (e) => {
      this.handleDragStart(e);
    });
    
    this.container.addEventListener('dragover', (e) => {
      if (e.target.classList.contains('result--sentence-text_container') || 
          e.target.classList.contains('current-sentence') ||
          e.target.classList.contains('canvas-item')) {
        this.handleDragOver(e);
      }
    });
    
    this.container.addEventListener('drop', (e) => {
      if (e.target.classList.contains('result--sentence-text_container') || 
          e.target.classList.contains('current-sentence') ||
          e.target.classList.contains('canvas-item')) {
        this.handleDrop(e);
      }
    });
  }
  
  handleDragStart(event) {
    const target = event.target;
    if (!target.hasAttribute('data-item') || !target.classList.contains('canvas-item')) {
      return;
    }
    if (target.parentElement && target.parentElement.classList.contains('completed')) {
      event.preventDefault();
      return false;
    }
    target.style.cursor = 'grabbing';
    event.dataTransfer.effectAllowed = 'copyMove';
    event.dataTransfer.setData('text', target.dataset.item);
  }
  
  handleDragOver(event) {
    if (event.target.classList.contains('completed')) {
      return;
    }
    if (event.target.classList.contains('canvas-item') && event.target.parentElement.classList.contains('completed')) {
      return;
    }
    event.preventDefault();
  }
  
  handleDrop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData('text');
    const element = document.querySelector(`[data-item="${data}"]`);
    
    if (!element) {
      return 0;
    }
    
    if (element.parentElement && element.parentElement.classList.contains('completed')) {
      return 0;
    }

    element.style.cursor = 'grab';

    if (event.target.classList.contains('current-sentence')) {
      if (event.target.classList.contains('completed')) {
        return 0;
      }
      event.target.appendChild(element);
      return this.checkCurrentSentence();
    }
    if (event.target.classList.contains('canvas-item')) {
      const targetParent = event.target.parentElement;
      if (targetParent && targetParent.classList.contains('completed')) {
        return 0;
      }
      if (event.offsetX < event.target.clientWidth / 2) {
        event.target.insertAdjacentElement('beforebegin', element);
        return this.checkCurrentSentence();
      }
      event.target.insertAdjacentElement('afterend', element);
      return this.checkCurrentSentence();
    }
    return 0;
  }

  determinateClick(event) {
    const { target } = event;

    const resultFromGroup = this.handleCanvasItemFromGroup(target);
    if (resultFromGroup !== null) return resultFromGroup;

    const resultFromSentence = this.handleCanvasItemFromSentence(event, target);
    if (resultFromSentence !== null) return resultFromSentence;

    const resultFromIcon = this.handleMaterialIconClick(event, target);
    if (resultFromIcon !== null) return resultFromIcon;

    const resultFromButton = this.handleButtonClick(event, target);
    if (resultFromButton !== null) return resultFromButton;

    return 0;
  }

  handleCanvasItemFromGroup(target) {
    if (target.classList.contains('canvas-item') && target.parentElement.classList.contains('group-words')) {
      const currentSentence = this.container.querySelector('.current-sentence');
      if (currentSentence && !currentSentence.classList.contains('completed')) {
        currentSentence.insertAdjacentElement('beforeend', target);
        return this.checkCurrentSentence();
      }
    }
    return null;
  }

  handleCanvasItemFromSentence(event, target) {
    if (!target.classList.contains('canvas-item')) {
      return null;
    }

    if (target.parentElement.classList.contains('completed')) {
      return null;
    }

    if (!target.parentElement.classList.contains('current-sentence')) {
      return null;
    }

    if (localStorage.lastPuzzle) {
      return this.moveLastPuzzle(event, target);
    }

    GameModel.selectPuzzle(target);
    return 1;
  }

  moveLastPuzzle(event, target) {
    const lastPuzzle = this.container.querySelector(`[data-item="${localStorage.lastPuzzle}"]`);
    lastPuzzle.classList.remove('active');
    localStorage.lastPuzzle = '';

    const insertPosition = event.offsetX < target.clientWidth / 2 ? 'beforebegin' : 'afterend';
    target.insertAdjacentElement(insertPosition, lastPuzzle);
    return this.checkCurrentSentence();
  }

  static selectPuzzle(target) {
    localStorage.lastPuzzle = target.dataset.item;
    target.classList.add('active');
  }

  handleMaterialIconClick(event, target) {
    if (!target.classList.contains('material-icons')) {
      return null;
    }

    const parent = target.parentElement;
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
    if (parent.classList.contains('finish-btn')) {
      return this.finishCurrentSentence();
    }

    return null;
  }

  handleButtonClick(event, target) {
    let button = target;
    
    if (target.classList.contains('material-icons')) {
      button = target.parentElement;
    }
    
    if (button && button.classList.contains('finish-btn')) {
      return this.finishCurrentSentence();
    }
    return null;
  }

  toggleAutoplay(button) {
    button.classList.toggle('disabled');
    localStorage.isAutoplayActive = !this.state.isAutoplayActive;
    this.state.isAutoplayActive = JSON.parse(localStorage.isAutoplayActive);
    return 1;
  }

  toggleTranslate(button) {
    button.classList.toggle('disabled');
    this.container.querySelector('.sentence-translated').classList.toggle('hidden');
    return 1;
  }

  toggleListen(button) {
    button.classList.toggle('disabled');
    this.container.querySelector('.audio-hint').classList.toggle('hidden');
    return 1;
  }

  toggleImage(button) {
    button.classList.toggle('disabled');
    this.state.isImageActive = !button.classList.contains('disabled');
    localStorage.isImageActive = this.state.isImageActive;
    
    const puzzleBackground = this.container.querySelector('.result-field--background');
    puzzleBackground.classList.toggle('image');

    if (button.classList.contains('disabled')) {
      puzzleBackground.style.backgroundImage = 'none';
    } else {
      puzzleBackground.style.backgroundImage = `url(${this.state.imageSrcs.cutSrc})`;
    }
    return 1;
  }

  async changePage(event) {
    if (event.target.id === 'levels') {
      this.state.level = event.target.value - 1;
      this.state.currentPage = 0;
      this.view.updatePageOptions();
    } else if (event.target.id === 'pages') {
      this.state.currentPage = event.target.value - 1;
    }

    this.state.currentSentence = 0;
    await this.setData();
    this.view.resetPuzzle();
    setTimeout(() => {
      this.makePuzzleDragable();
    }, 0);
    if (+this.state.isAutoplayActive) {
      this.playSentence();
    }
  }

  playSentence() {
    const audioSrc = `${AUDIO_SRC}${this.state.words[this.state.currentSentence].audioExample}`;
    if (!this.state.audioplay) {
      this.state.audioplay = new Audio(audioSrc);
      this.state.audioplay.play();
      this.state.audioplay.addEventListener('ended', () => {
        this.state.audioplay = '';
      });
    }
  }

  checkCurrentSentence() {
    const sentenceElement = this.view.currentSentenceElement;
    const sentenceLength = +this.state.words[this.state.currentSentence].wordsPerExampleSentence;
    const canvasItems = sentenceElement.querySelectorAll('.canvas-item');
    const isCorectOrder = Array.from(canvasItems).every((item, i) => {
      if (+item.dataset.item.split('-')[1] === i + 1) {
        return true;
      }
      return false;
    });
    if (isCorectOrder && sentenceLength === canvasItems.length) {
      return this.showNextWords();
    }
    return 0;
  }

  finishCurrentSentence() {
    const currentSentence = this.container.querySelector('.current-sentence');
    if (!currentSentence || currentSentence.classList.contains('completed')) {
      return 0;
    }

    const currentSentenceIndex = this.state.currentSentence;
    const sentenceLength = +this.state.words[currentSentenceIndex].wordsPerExampleSentence;
    
    const existingWords = currentSentence.querySelectorAll('.canvas-item');
    const existingWordItems = new Set(Array.from(existingWords).map((word) => word.dataset.item));
    
    const groupWords = this.container.querySelector('.group-words');
    if (!groupWords) {
      return 0;
    }

    const allWords = groupWords.querySelectorAll('.canvas-item');
    const currentSentenceWords = Array.from(allWords).filter((word) => {
      const itemData = word.dataset.item.split('-');
      return +itemData[0] === currentSentenceIndex + 1 && !existingWordItems.has(word.dataset.item);
    });

    const totalWords = existingWords.length + currentSentenceWords.length;
    if (totalWords !== sentenceLength) {
      return 0;
    }

    currentSentenceWords.sort((a, b) => {
      const aIndex = +a.dataset.item.split('-')[1];
      const bIndex = +b.dataset.item.split('-')[1];
      return aIndex - bIndex;
    });

    const allSentenceWords = Array.from(existingWords).concat(currentSentenceWords);
    allSentenceWords.sort((a, b) => {
      const aIndex = +a.dataset.item.split('-')[1];
      const bIndex = +b.dataset.item.split('-')[1];
      return aIndex - bIndex;
    });

    currentSentence.innerHTML = '';
    allSentenceWords.forEach((word) => {
      currentSentence.appendChild(word);
    });

    return this.checkCurrentSentence();
  }

  showNextWords() {
    const previousSentenceIndex = this.state.currentSentence;
    this.state.currentSentence += 1;
    this.lockCompletedSentence(previousSentenceIndex);
    this.view.showNextWords();
    setTimeout(() => {
      this.makePuzzleDragable();
    }, 0);
    if (this.state.currentSentence < 10 && +this.state.isAutoplayActive) {
      this.playSentence();
    }
  }

  lockCompletedSentence(sentenceIndex) {
    const sentenceElements = this.container.querySelectorAll('.result--sentence');
    if (sentenceIndex >= 0 && sentenceIndex < sentenceElements.length) {
      const completedSentence = sentenceElements[sentenceIndex].lastElementChild;
      completedSentence.classList.add('completed');
      
      const words = completedSentence.querySelectorAll('.canvas-item');
      words.forEach((word) => {
        word.setAttribute('draggable', 'false');
        word.style.cursor = 'default';
        word.classList.remove('active');
        if (localStorage.lastPuzzle === word.dataset.item) {
          localStorage.lastPuzzle = '';
        }
      });
    }
  }

  makePuzzleDragable() {
    const rawElement = this.container.querySelector('.raw');
    if (rawElement) {
      Array.from(rawElement.querySelectorAll('[data-item]')).forEach((puzzle) => {
        if (!puzzle.parentElement || !puzzle.parentElement.classList.contains('completed')) {
          puzzle.setAttribute('draggable', 'true');
        }
      });
    }
  }
}
