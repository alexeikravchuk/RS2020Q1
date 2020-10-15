export default function convertTemperatureUnits(value, targetUnits) {
  if (targetUnits === 'F') {
    return Math.round((Math.round(value) * 9) / 5 + 32);
  }
  if (targetUnits === 'C') {
    return Math.round(((Math.round(value) - 32) * 5) / 9);
  }
  throw Error('Invalid value of units');
}
