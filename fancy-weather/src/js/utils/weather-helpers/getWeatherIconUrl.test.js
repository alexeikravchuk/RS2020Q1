import getWeatherIconUrl from './getWeatherIconUrl';

describe('getWeatherIconUrl function', () => {
  test('should be defined', () => {
    expect(getWeatherIconUrl).toBeDefined();
  });

  test('should return correct url or null', () => {
    expect(getWeatherIconUrl('t04d')).toStrictEqual('./img/weather_icons/thunderstorms.svg');
    expect(getWeatherIconUrl('t04d').includes('.svg')).toBeTruthy();
    expect(getWeatherIconUrl(5)).toEqual(null);
  });
});
