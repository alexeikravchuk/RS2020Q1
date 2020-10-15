import { WORDS_PER_PAGE, WORDS_PER_SENTENCE } from '../../constants';

export default async function getCurrentPageWords(group, page) {
  const url = `https://afternoon-falls-25894.herokuapp.com/words?group=${group}&page=${page}&wordsPerExampleSentenceLTE=${WORDS_PER_PAGE}&wordsPerPage=${WORDS_PER_SENTENCE}`;
  const rawResponse = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (rawResponse.status === 200) {
    const content = await rawResponse.json();
    return content;
  }
  console.log(rawResponse);
  throw Error('error getting current page words');
}
