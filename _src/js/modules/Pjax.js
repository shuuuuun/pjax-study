import 'whatwg-fetch';
import EventEmitter from 'eventemitter2';

export default class Pjax extends EventEmitter {
  constructor(opts = {}) {
    super();

    this.areaSelector = opts.area || 'body';
    this.areaElm = document.querySelector(this.areaSelector);
    this.linkElm = document.querySelectorAll(opts.link || 'a');
    this.wait = opts.wait || 0;

    this.initLinkClickEvent();
    this.initPopStateEvent();
  }

  initLinkClickEvent() {
    this.linkElm.forEach(elm => {
      elm.addEventListener('click', evt => {
        evt.preventDefault();
        const url = elm.href;
        if (url === document.location.href) return false;
        this.fetchPageContent(url).then(html => {
          this.replaceArea(html);
          this.pushHistory(html, url);
        });
      }, false);
    })
  }

  initPopStateEvent() {
    window.addEventListener('popstate', evt => {
      const url = document.location.href;
      this.fetchPageContent(url).then(html => {
        this.replaceArea(html);
      });
    });
  }

  replaceArea(html) {
    const nextAreaElm = html.querySelector(this.areaSelector);
    const parentNode = this.areaElm.parentNode;
    this.emit('pjax:replaceStart', this.areaElm, nextAreaElm);
    setTimeout(() => {
      parentNode.replaceChild(nextAreaElm, this.areaElm);
      this.areaElm = nextAreaElm;
      this.emit('pjax:replaceEnd', this.areaElm);
    }, this.wait);
  }

  pushHistory(html, url) {
    const state = {};
    const title = html.querySelector('title').textContent;

    history.pushState(state, title, url);
    document.querySelector('title').textContent = title; // 現状はpushStateでtitle変わらないらしいので
  }

  fetchPageContent(url) {
    console.log('fetch: ', url);
    const promise = fetch(url)
      .then(res => res.text())
      .then(htmlText => {
        const html = document.createElement('html');
        html.innerHTML = htmlText;

        this.emit('pjax:complete');
        return html;
      });
    return promise;
  }
}
