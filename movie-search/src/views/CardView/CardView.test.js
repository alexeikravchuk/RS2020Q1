import CardView from './CardView';

describe('getCardType', () => {
  const cardView = new CardView({
    title: "The Devil's Double",
    posterUrl:
      'https://m.media-amazon.com/images/M/MV5BMjI2MjA3MTQ0N15BMl5BanBnXkFtZTcwNjc4NDYwNQ@@._V1_SX300.jpg',
    year: '2011',
    rating: '8.3',
  });

  let cardGetElement;
  beforeEach(() => {
    cardGetElement = cardView.getElement();
  });

  it('Should be an instance of Node', () => {
    expect(cardGetElement).toBeInstanceOf(Node);
  });
});
