import Switch from './Switch';
import { MODES, ICONS } from '../constants';
import { createElement } from '../utility';

export default class Header {
  constructor(pages) {
    this.pages = pages;
    this.title = null;
    this.titleIcon = ICONS.main;
    this.mode = MODES.train;
    this.switcher = new Switch(this.mode);
    this.switcher.render();
  }

  renderNavigation() {
    this.setTitle('Main Page', this.titleIcon);
    this.buildNavigation();
  }

  buildNavigation() {
    const mainLinkHTML = Header.createNavItemHTML('#main', 'Main Page');
    const staticticsLinkHTML = Header.createNavItemHTML('#statistics', 'Statistics');

    let page = 0;
    const linksHTML = mainLinkHTML + this.pages.map((title) => {
      const navItemElement = Header.createNavItemHTML(`#cards-${page += 1}`, title);
      return navItemElement;
    }).join('') + staticticsLinkHTML;

    const links = createElement('ul', 'menu');
    links.innerHTML = linksHTML;
    links.firstChild.classList.add('active');

    document.getElementById('nav').append(links);

    this.setNavigationIcons();
  }

  static createNavItemHTML(href, innerText) {
    const linkHTML = `<a class="navigation__item" href="${href}">
      <div class="navigation__icon"></div>${innerText}</a>`;
    return linkHTML;
  }

  setNavigationIcons() {
    this.links = document.querySelectorAll('.navigation__icon');
    let lastIconName = '';
    this.links.forEach((item) => {
      const link = item;
      let iconName = link.parentElement.innerText.split(' ')[0].toLowerCase();
      if (iconName === lastIconName) {
        iconName += '2';
      }
      link.style.backgroundImage = `url(${ICONS[iconName]})`;
      lastIconName = iconName;
    });
  }

  setTitle(title, iconUrl) {
    this.title = title;
    if (iconUrl) {
      document.querySelector('.header__icon').style.backgroundImage = `url(${iconUrl})`;
    }
    document.querySelector('.header__title').innerText = title;
  }

  static toggleMenu() {
    document.querySelector('.menu-btn').classList.toggle('menu-btn_active');
    document.getElementById('nav').classList.toggle('active');
  }

  static closeMenu() {
    document.querySelector('.menu-btn').classList.remove('menu-btn_active');
    document.getElementById('nav').classList.remove('active');
  }

  toggleSwitch() {
    this.mode = (this.mode === MODES.play) ? MODES.train : MODES.play;
    document.getElementById('switch').checked = this.mode === MODES.train;
    Header.toggleStyle();
  }

  changeActiveLink(page) {
    const navigationItems = document.querySelectorAll('.navigation__item');
    navigationItems.forEach((item) => item.classList.remove('active'));
    navigationItems[page].classList.add('active');
    const iconUrl = navigationItems[page].querySelector('.navigation__icon').style.backgroundImage.split('"')[1];
    this.setTitle(navigationItems[page].innerText, iconUrl);
  }

  static toggleStyle() {
    document.querySelector('.header-container').classList.toggle('play');
    document.querySelector('.menu-btn').classList.toggle('play');
    document.querySelector('.navigation').classList.toggle('play');
  }
}
