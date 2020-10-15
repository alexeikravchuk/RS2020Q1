import SearchBoxView from './SearchBoxView';

describe('get SearchBox Type', () => {
  const searchBoxView = new SearchBoxView();

  let searchBoxGetElement;
  beforeEach(() => {
    searchBoxGetElement = searchBoxView.getElement();
  });

  it('Should be an instance of Node', () => {
    expect(searchBoxGetElement).toBeInstanceOf(Node);
  });
});
