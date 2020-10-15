import getCurrentSeason from './getCurrentSeason';

describe('getCurrentSeason function', () => {
  test('should return correct value', () => {
    expect(getCurrentSeason(0)).not.toBeUndefined();
    expect(getCurrentSeason(0)).toStrictEqual('winter');
    expect(getCurrentSeason(2)).toEqual('spring');
    expect(getCurrentSeason(5)).toMatch('summer');
  });
});
