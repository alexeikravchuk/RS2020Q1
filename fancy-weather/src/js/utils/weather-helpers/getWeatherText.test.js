import getWeatehrText from './getWeatehrText';

describe('getWeatehrText function', () => {
  test('should be defined', () => {
    expect(getWeatehrText).toBeDefined();
  });

  test('should return a string', () => {
    const location = 'City';
    localStorage.language = 'en';
    localStorage.temperatureUnits = 'C';
    const currentWeather = {
      temp: '10',
      app_temp: '9',
      wind_spd: '1',
      rh: '90',
      weather: {
        code: '200',
        feel: '8',
      },
    };
    const forecast = [
      { datetime: '21-05-2020' },
      { datetime: '22-05-2020' },
      { datetime: '23-05-2020' },
      { datetime: '24-05-2020' },
    ];

    expect(() => getWeatehrText(location, currentWeather, forecast)).not.toThrow();
    expect(getWeatehrText(location, currentWeather, forecast).includes('celsius')).toBeTruthy();
  });
});
