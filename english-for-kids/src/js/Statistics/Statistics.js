import { createElement } from '../utility';

export default class Statistics {
  constructor(cardList) {
    this.cardList = cardList;
  }

  static checkLocalStorage() {
    if (localStorage.cards) {
      return true;
    }
    return false;
  }

  static getCardList() {
    return JSON.parse(localStorage.cards);
  }

  static saveCardList(cardList) {
    localStorage.cards = JSON.stringify(cardList);
  }

  static resetStatistics() {
    localStorage.removeItem('cards');
  }

  buildPage() {
    const container = document.querySelector('.main-container');
    container.innerHTML = '';
    const buttons = Statistics.createButtons();
    container.append(buttons);

    this.table = Statistics.createTable(this.cardList);
    const tableWrapper = createElement('div', 'table-wrapper');
    tableWrapper.append(this.table);
    container.append(tableWrapper);

    this.table.onclick = this.sortTableRows.bind(this);
  }

  static createButtons() {
    const btns = createElement('div', 'btns');
    btns.innerHTML = `<button class="btn btn-repeat">Repeat difficult words</button>
    <button class="btn btn-reset">Reset</button>`;
    return btns;
  }

  static createTable(cardList) {
    const table = createElement('table', 'statistics_table');
    const tBody = createElement('tbody', 'tbody');
    table.append(Statistics.createTH());
    table.append(tBody);
    Object.keys(cardList).forEach((category) => {
      cardList[category].forEach((card) => tBody.append(Statistics.createTR(card.state, category)));
    });
    return table;
  }

  static createTH() {
    const tableHead = createElement('thead', 'thead');
    tableHead.innerHTML = `<tr>
      <th class="th th-category">Category</th>
      <th class="th th-word">Word</th>
      <th class="th th-translation">Translation</th>
      <th class="th th-train">Train</th>
      <th class="th th-correct">Correct</th>
      <th class="th th-mistakes">Mistakes</th>
      <th class="th th-percent">Mistakes, %</th>
    </tr>`;
    return tableHead;
  }

  static createTR(state, category) {
    const guesses = state.mistakes + state.correct;
    const percent = guesses > 0 ? parseInt((state.mistakes * 100) / guesses, 10) : 0;
    const tableRow = createElement('tr', 'tr-card');
    tableRow.innerHTML = `<td class="td td-category">${category}</td>
    <td class="td td-word">${state.word}</td>
    <td class="td td-translation">${state.translation}</td>
    <td class="td td-train">${state.train}</td>
    <td class="td td-correct">${state.correct}</td>
    <td class="td td-mistakes">${state.mistakes}</td>
    <td class="td td-percent">${percent}</td>`;
    return tableRow;
  }

  sortTableRows(e) {
    const rowsArray = Array.from(this.table.querySelectorAll('.tr-card'));
    if (e.target.classList.contains('th')) {
      const tdSelector = `.td${e.target.classList[1].substr(2)}`;
      this.toggleTHClass(e.target);
      rowsArray.sort((x, y) => {
        const factor = e.target.classList.contains('revers') ? -1 : 1;
        return Statistics.compareCells(x, y, tdSelector) * factor;
      });
      return this.insertRows(rowsArray);
    }
    return 0;
  }

  static compareCells(x, y, selector) {
    const xText = x.querySelector(selector).innerText;
    const yText = y.querySelector(selector).innerText;
    return xText.localeCompare(yText);
  }

  insertRows(rows) {
    const tbody = this.table.querySelector('tbody');
    tbody.innerHTML = '';
    rows.forEach((row) => tbody.append(row));
  }

  toggleTHClass(target) {
    if (target.classList.contains('sorted')) {
      return target.classList.toggle('revers');
    }
    this.table.querySelectorAll('.th').forEach((th) => {
      th.classList.remove('sorted');
      th.classList.remove('revers');
    });
    return target.classList.add('sorted');
  }
}
