export default function setModalListeners() {
  localStorage.notFirstTimeLoaded = true;
  document.addEventListener('keydown', (e) => {
    if (e.keyCode === 13
      || e.keyCode === 32
      || e.keyCode === 255) {
      document.querySelector('.modal--info').remove();
    }
  });
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('close-btn')) {
      document.querySelector('.modal--info').remove();
    }
  });
}
