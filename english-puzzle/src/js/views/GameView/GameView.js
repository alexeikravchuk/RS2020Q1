import createElement from '../../utils/app-helpers/createElement';
import createControlElement from '../../utils/game-helpers/createControlElement';
import createGameFieldElement from '../../utils/game-helpers/createGameFieldElement';
import shufflePuzzles from '../../utils/game-helpers/shufflePuzzles';
import getOptionsNumberListHTML from '../../utils/game-helpers/getOptionsListHTML';

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
    sentences.forEach((item) => {
      item.firstElementChild.classList.add('hidden');
      item.lastElementChild.classList.remove('current-sentence');
      item.lastElementChild.classList.remove('completed');
      item.style.display = '';
      item.style.opacity = '';
      item.style.transition = '';
      item.style.pointerEvents = '';
    });
    this.container.querySelectorAll('.canvas-item').forEach((item) => item.remove());
    sentences[0].firstElementChild.classList.remove('hidden');
    sentences[0].lastElementChild.classList.add('current-sentence');
    
    const groupWords = this.container.querySelector('.group-words');
    if (groupWords) {
      groupWords.remove();
    }
    
    this.container.querySelector('.sentence-translated').innerText = this.model.state.words[0].textExampleTranslate;
    
    const rawElement = this.container.querySelector('.raw');
    const backgroundElement = this.container.querySelector('.result-field--background');
    
    if (rawElement) {
      rawElement.style.display = '';
      rawElement.style.opacity = '1';
      rawElement.style.transition = '';
      rawElement.style.visibility = '';
      rawElement.style.pointerEvents = '';
    }
    
    if (backgroundElement) {
      backgroundElement.classList.remove('image');
      backgroundElement.style.backgroundImage = 'none';
      backgroundElement.style.opacity = '0.4';
      backgroundElement.style.backgroundColor = '#a0a0f0ff';
      backgroundElement.style.transition = '';
      
      if (this.model.state.isImageActive) {
        const imageBtn = this.container.querySelector('.image-btn');
        if (imageBtn && !imageBtn.classList.contains('disabled')) {
          backgroundElement.classList.add('image');
          backgroundElement.style.backgroundImage = `url(${this.model.state.imageSrcs.cutSrc})`;
          backgroundElement.style.backgroundColor = 'transparent';
        }
      }
    }
    
    const shuffledPuzzles = shufflePuzzles(this.model.state.puzzles[0]);
    if (rawElement && shuffledPuzzles) {
      rawElement.innerHTML = '';
      rawElement.insertAdjacentElement('afterbegin', shuffledPuzzles);
    }
  }

  updatePageOptions() {
    const pagesElement = this.container.querySelector('#pages');
    const levelsElement = this.container.querySelector('#levels');
    
    if (pagesElement) {
      pagesElement.innerHTML = '';
      const options = getOptionsNumberListHTML(this.model.state.pages, this.model.state.currentPage);
      pagesElement.insertAdjacentHTML('afterbegin', options);
      if (pagesElement.options.length > 0) {
        const pageValue = (this.model.state.currentPage || 0) + 1;
        pagesElement.value = pageValue;
      }
    }
    
    if (levelsElement && levelsElement.options.length > 0) {
      const levelValue = (this.model.state.level || 0) + 1;
      levelsElement.value = levelValue;
    }
  }

  showNextWords() {
    const sentenceElements = this.container.querySelectorAll('.result--sentence');
    const currentSentenceNumber = this.model.state.currentSentence;
    if (currentSentenceNumber < 10) {
      this.container.querySelector('.sentence-translated').innerText = this.model.state.words[
        currentSentenceNumber
      ].textExampleTranslate;
      sentenceElements[currentSentenceNumber - 1].lastElementChild.classList.remove('current-sentence');
      sentenceElements[currentSentenceNumber].firstElementChild.classList.remove('hidden');
      sentenceElements[currentSentenceNumber].lastElementChild.classList.add('current-sentence');
      this.container.querySelector('.group-words').remove();
      this.container
        .querySelector('.raw')
        .insertAdjacentElement('afterbegin', shufflePuzzles(this.model.state.puzzles[currentSentenceNumber]));
    } else {
      // Добавляем задержку перед показом финальной картинки, чтобы пользователь увидел собранное предложение
      setTimeout(() => {
        this.showCompletePicture();
      }, 800);
    }
  }

  showCompletePicture() {
    const backgroundElement = this.container.querySelector('.result-field--background');
    const rawElement = this.container.querySelector('.raw');
    const sentencesContainer = this.container.querySelector('.game--puzzle-results');
    const sentences = this.container.querySelectorAll('.result--sentence');
    const allCanvasItems = this.container.querySelectorAll('.canvas-item');
    
    if (backgroundElement && this.model.state.imageSrcs) {
      backgroundElement.classList.add('image');
      backgroundElement.style.backgroundImage = `url(${this.model.state.imageSrcs.cutSrc})`;
      backgroundElement.style.backgroundColor = 'transparent';
      backgroundElement.style.opacity = '0';
      backgroundElement.style.transition = 'opacity 1.2s ease-in 0.3s';
    }
    
    if (sentences) {
      sentences.forEach((sentence) => {
        sentence.style.transition = 'opacity 0.8s ease-out';
        sentence.style.opacity = '0';
      });
    }
    
    if (allCanvasItems.length > 0) {
      Array.from(allCanvasItems).forEach((item, index) => {
        item.style.transition = `opacity 0.6s ease-out ${index * 0.02}s, transform 0.6s ease-out ${index * 0.02}s`;
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
      });
    }
    
    if (rawElement) {
      rawElement.style.transition = 'opacity 0.8s ease-out';
      rawElement.style.opacity = '0';
    }
    
    setTimeout(() => {
      if (backgroundElement) {
        backgroundElement.style.opacity = '1';
      }
    }, 300);
    
    setTimeout(() => {
      if (sentences) {
        sentences.forEach((sentence) => {
          sentence.style.pointerEvents = 'none';
        });
      }
      
      if (rawElement) {
        rawElement.style.pointerEvents = 'none';
      }
    }, 1200);
  }
}
