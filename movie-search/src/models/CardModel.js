import CardView from '../views/CardView';

export default class CardModel {
  constructor(state) {
    this.state = state;
    this.view = new CardView(this.state);
  }

  get element() {
    return this.view.element;
  }
}
