export default async function getNumberOfPages(group) {
  const level = group + 1;
  const response = await fetch(`/collections/wordCollectionLevel${level}.json`);

  if (!response.ok) {
    throw new Error(`Failed to load word collection for level ${level}: ${response.status} ${response.statusText}`);
  }

  let data;
  try {
    const text = await response.text();
    data = JSON.parse(text);
  } catch (error) {
    throw new Error(`Failed to parse JSON for level ${level}: ${error.message}`);
  }

  if (!data || !data.rounds || !Array.isArray(data.rounds)) {
    throw new Error(`Invalid data structure in word collection for level ${level}`);
  }

  return data.rounds.length;
}
