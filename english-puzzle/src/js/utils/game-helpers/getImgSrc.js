import * as paintings from '../../../assets/data_paintings';

export default function getImageSrc(level, page) {
  const src = './assets/data_paintings/';
  const paintingInfo = paintings[`paintings${level + 1}`][page];

  return {
    imageSrc: `${src}${paintingInfo.imageSrc}`,
    cutSrc: `${src}${paintingInfo.cutSrc}`,
  };
}
