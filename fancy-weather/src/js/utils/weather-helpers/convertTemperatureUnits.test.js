import convertTemperatureUnits from './convertTemperatureUnits';

describe('convertTemperatureUnits function', () => {
  test('should be defined', () => {
    expect(convertTemperatureUnits).toBeDefined();
  });

  test('should return a number', () => {
    expect(convertTemperatureUnits(10, 'F')).toStrictEqual(50);
    expect(convertTemperatureUnits(50, 'C')).toStrictEqual(10);
  });

  test('should throw an error on invalid arguments', () => {
    expect(() => convertTemperatureUnits(10, 'K')).toThrow();
    expect(() => convertTemperatureUnits()).toThrow();
  });
});
