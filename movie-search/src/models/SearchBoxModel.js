import SearchBoxView from '../views/SearchBoxView';

export default class SearchBoxModel {
  constructor() {
    this.view = new SearchBoxView();
  }

  getRequestOptions() {
    return {
      minYear: this.view.element.querySelector('#extra-year-min').value,
      maxYear: this.view.element.querySelector('#extra-year-max').value,
      minRating: this.view.element.querySelector('#extra-rating-min').value,
      maxRating: this.view.element.querySelector('#extra-rating-max').value,
    };
  }

  get searchIndicator() {
    return this.view.element.querySelector('.search-indicator');
  }

  addMessage(message) {
    this.view.showMessage(message);
  }

  removeMessage() {
    this.view.removeMessage();
  }

  get element() {
    return this.view.element;
  }

  toggleExtraParameters(isHide) {
    const extra = this.view.element.querySelector('.extra-wrapper');
    if (isHide) {
      return extra.classList.add('hidden');
    }
    return extra.classList.toggle('hidden');
  }

  isValidOptions() {
    const options = this.getRequestOptions();

    if (!options.minYear || !options.maxYear || !options.minRating || !options.maxRating) {
      return this.addMessage('Option fields cannot be empty');
    }
    if (+options.minYear > +options.maxYear) {
      return this.addMessage("Release year 'from' cannot be greater than 'to'");
    }
    if (+options.minYear < 1900 || +options.maxYear > 2099) {
      return this.addMessage('Movie release year can only be from 1900 to 2099');
    }

    if (+options.minRating > +options.maxRating) {
      return this.addMessage("Rating 'from' cannot be greater than 'to'");
    }
    if (+options.minRating < 0 || +options.maxRating > 10) {
      return this.addMessage('Movie rating can only be from 0 to 10');
    }

    return true;
  }
}
