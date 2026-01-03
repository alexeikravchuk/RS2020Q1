import * as paintings from '../../../assets/data_paintings';

export default function getImageSrc(level, page) {
  if (typeof level !== 'number' || level < 0) {
    throw new Error(`Invalid level parameter: ${level}`);
  }

  if (typeof page !== 'number' || page < 0) {
    throw new Error(`Invalid page parameter: ${page}`);
  }

  const levelKey = `paintings${level + 1}`;
  const levelPaintings = paintings[levelKey];

  if (!levelPaintings || !Array.isArray(levelPaintings)) {
    throw new Error(`Paintings data not found for level ${level + 1}`);
  }

  if (page >= levelPaintings.length) {
    throw new Error(`Page ${page} is out of range for level ${level + 1} (max: ${levelPaintings.length - 1})`);
  }

  const paintingInfo = levelPaintings[page];

  if (!paintingInfo || !paintingInfo.imageSrc || !paintingInfo.cutSrc) {
    throw new Error(`Invalid painting data at page ${page} for level ${level + 1}`);
  }

  const src = './assets/data_paintings/';

  return {
    imageSrc: `${src}${paintingInfo.imageSrc}`,
    cutSrc: `${src}${paintingInfo.cutSrc}`,
  };
}
