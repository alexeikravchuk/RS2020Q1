export default function getOptionsNumberListHTML(count, activeNumber) {
  let htmlLine = '';

  if (!count || count === 0) {
    return htmlLine;
  }

  for (let i = 0; i < count; i += 1) {
    const optionValue = i + 1;
    const isSelected = activeNumber !== undefined && activeNumber !== null && i === activeNumber;
    htmlLine += `<option value="${optionValue}" ${isSelected ? 'selected="selected"' : ''}>${optionValue}</option>\n`;
  }

  return htmlLine;
}
