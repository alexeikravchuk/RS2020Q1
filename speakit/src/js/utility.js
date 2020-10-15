function createElement(tagName, ...classNames) {
  const element = document.createElement(tagName);
  element.classList.add(...classNames);
  return element;
}

function shuffle(arr) {
  let j;
  const newArr = arr;
  for (let i = arr.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [arr[j], arr[i]];
  }
  return newArr;
}

export { createElement, shuffle };
