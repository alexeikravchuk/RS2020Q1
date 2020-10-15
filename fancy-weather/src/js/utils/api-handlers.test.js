import fetch from 'node-fetch';
import {
  getGoogleApiScriptElement,
  getUserLocation,
  getWeatherInfo,
  getImage,
} from './api-handlers';

global.fetch = fetch;

describe('getGoogleApiScriptElement function', () => {
  test('should be defined', () => {
    expect(getGoogleApiScriptElement).toBeDefined();
  });

  test('shoul return script element', () => {
    expect(getGoogleApiScriptElement()).not.toBeNull();
    expect(getGoogleApiScriptElement()).not.toBeUndefined();
    expect(getGoogleApiScriptElement()).toBeInstanceOf(Element);
    expect(getGoogleApiScriptElement().tagName).toEqual('SCRIPT');
  });
});

describe('getUserLocation function', () => {
  test('should be defined', () => {
    expect(getUserLocation).toBeDefined();
  });

  test('should return object', async () => {
    const result = await getUserLocation();
    expect(result).toBeInstanceOf(Object);
    expect(result.loc).not.toBeUndefined();
  });
});

describe('getWeatherInfo function', () => {
  test('should be defined', () => {
    expect(getWeatherInfo).toBeDefined();
  });

  test('should return object with weather information', async () => {
    const location = [53, 57];
    const result = await getWeatherInfo(...location, 1);

    expect(result).toBeInstanceOf(Object);
    expect(result.data[0].temp).not.toBeUndefined();
    expect(result.data[0].weather).toBeInstanceOf(Object);
  });
});

describe('getImage function', async () => {
  test('should be defined', () => {
    expect(getImage).toBeDefined();
  });

  const query = 'spring,night';
  const imgUrl = await getImage(query);

  test('should return imgUrl', () => {
    expect(imgUrl).not.toBeDefined();
    expect(imgUrl).toMathc(/https:\/\/images.unsplash.com/);
  });
});
