export default function getOptionsNumberListHTML(count, activeNumber) {
  let htmlLine = '';

  for (let i = 0; i < count; i += 1) {
    htmlLine += `<option ${i + 1 === activeNumber ? 'selected' : ''}>${i + 1}</option>\n`;
  }

  return htmlLine;
}
