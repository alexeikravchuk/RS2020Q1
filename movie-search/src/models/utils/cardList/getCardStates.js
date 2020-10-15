import { OMD_API } from '../../../constants';
import { checkImgSrc } from '../../../utility';

async function extractMovieCardState(data) {
  return {
    title: data.Title,
    posterUrl: await checkImgSrc(data.Poster),
    year: data.Year,
    rating: data.imdbRating,
    id: data.imdbID,
  };
}

async function getMovieInformation(movieId) {
  const url = OMD_API.getMovieDateURL(movieId);
  const response = await fetch(url);
  const data = await response.json();
  const cardState = await extractMovieCardState(data);
  return cardState;
}

export default async function getCardStates(moviesIdList) {
  const cardStates = await Promise.all(moviesIdList.map((movieId) => getMovieInformation(movieId)));
  return cardStates;
}
