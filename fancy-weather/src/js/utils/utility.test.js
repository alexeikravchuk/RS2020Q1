import {
  createElement,
  getTranslation,
} from './utility';


describe('createElement function', () => {
  test('should be defined', () => {
    expect(createElement).toBeDefined();
  });

  test('should return element', () => {
    expect(createElement('div', 'test')).not.toBeNull();
    expect(createElement('div', 'second')).not.toBeUndefined();
    expect(createElement('div', 'third')).toBeInstanceOf(Element);
  });
});

describe('getTranslation function', () => {
  test('should be defined', () => {
    expect(getTranslation).toBeDefined();
  });

  test('should return an object', () => {
    expect(getTranslation()).toBeInstanceOf(Object);
  });

  test('must have by default a set of english values', () => {
    expect(getTranslation().placeholder.includes('Search')).toBeTruthy();
    expect(getTranslation().lat).toBeTruthy();
    expect(getTranslation().wind).toStrictEqual('Wind:');
  });

  test('must have a set of russian values', () => {
    localStorage.language = 'ru';
    expect(getTranslation().placeholder.includes('Искать')).toBeTruthy();
    expect(getTranslation().lat).toBeTruthy();
    expect(getTranslation().wind).toStrictEqual('Ветер:');
  });
});
