export default async function getCurrentPageWords(group, page) {
  const level = group + 1;
  const response = await fetch(`/collections/wordCollectionLevel${level}.json`);

  if (!response.ok) {
    throw new Error(`Failed to load word collection for level ${level}`);
  }

  const data = await response.json();

  if (page < 0 || page >= data.rounds.length) {
    throw new Error(`Page ${page} is out of range for level ${level}`);
  }

  const { words } = data.rounds[page];
  return words.map((word) => {
    const { textExample } = word;
    return {
      ...word,
      wordsPerExampleSentence: textExample.split(' ').length,
    };
  });
}
