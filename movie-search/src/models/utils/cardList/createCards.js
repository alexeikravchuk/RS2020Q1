import { MIN_YEAR, MAX_YEAR, MIN_RATING, MAX_RATING } from '../../../constants';
import CardModel from '../../CardModel';

function checkIsMatchOptions(state, options) {
  try {
    const yearStart = +state.year.match(/^\d{4}/);
    const yearEnd = +state.year.match(/\d{4}$/);
    const rating = +state.rating;

    if (
      +options.minYear === MIN_YEAR &&
      +options.maxYear === MAX_YEAR &&
      +options.minRating === MIN_RATING &&
      +options.maxRating === MAX_RATING
    ) {
      return true;
    }

    if (
      yearStart >= +options.minYear &&
      yearEnd <= +options.maxYear &&
      rating >= +options.minRating &&
      rating <= +options.maxRating
    ) {
      return true;
    }
  } catch (err) {
    return false;
  }
  return false;
}

export default function createCards(cardStates, options) {
  return cardStates.map((state) => {
    if (checkIsMatchOptions(state, options)) {
      return new CardModel(state);
    }
    return null;
  });
}
