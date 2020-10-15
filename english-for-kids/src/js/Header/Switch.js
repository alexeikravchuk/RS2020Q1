export default class Switch {
  constructor(state) {
    this.state = state;
  }

  render() {
    const switcher = document.querySelector('.switch-container');
    switcher.innerHTML = `<input type="checkbox" ${this.state === 'train' ? 'checked' : ''} id="switch" switch="none" />
    <label for="switch" data-on-label="train" data-off-label="play"></label>`;
  }
}
