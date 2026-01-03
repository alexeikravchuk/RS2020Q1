export default async function getCurrentPageWords(group, page) {
  if (typeof group !== 'number' || group < 0) {
    throw new Error(`Invalid group parameter: ${group}`);
  }

  if (typeof page !== 'number' || page < 0) {
    throw new Error(`Invalid page parameter: ${page}`);
  }

  const level = group + 1;
  const response = await fetch(`/collections/wordCollectionLevel${level}.json`);

  if (!response.ok) {
    throw new Error(`Failed to load word collection for level ${level}: ${response.status} ${response.statusText}`);
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error(`Failed to parse JSON for level ${level}: ${error.message}`);
  }

  if (!data || !data.rounds || !Array.isArray(data.rounds)) {
    throw new Error(`Invalid data structure in word collection for level ${level}`);
  }

  if (page >= data.rounds.length) {
    throw new Error(`Page ${page} is out of range for level ${level} (max: ${data.rounds.length - 1})`);
  }

  const round = data.rounds[page];
  if (!round || !round.words || !Array.isArray(round.words)) {
    throw new Error(`Invalid round data at page ${page} for level ${level}`);
  }

  const { words } = round;
  return words.map((word) => {
    const { textExample } = word;
    if (!textExample || typeof textExample !== 'string') {
      throw new Error(`Invalid word data: missing or invalid textExample`);
    }
    return {
      ...word,
      wordsPerExampleSentence: textExample.split(' ').length,
    };
  });
}
