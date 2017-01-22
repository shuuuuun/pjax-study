import 'whatwg-fetch';

export default class Pjax {
  constructor(opts = {}) {
    this.areaSelector = opts.area || 'body';
    this.areaElm = document.querySelector(this.areaSelector);
    this.linkElm = document.querySelectorAll(opts.link || 'a');
    this.ajaxOpts = opts.ajax || {};
    this.ajaxWait = opts.wait || 0;

    this.initLinkClickEvent();
  }

  initLinkClickEvent() {
    this.linkElm.forEach(elm => {
      elm.addEventListener('click', evt => {
        evt.preventDefault();
        const url = elm.href;
        this.getPageContent(url).then(htmlText => {
          const html = document.createElement('html');
          html.innerHTML = htmlText;
          this.replaceArea(html);
          this.updateHistory(html, url);
        });
      }, false);
    })
  }

  replaceArea(html) {
    const nextAreaElm = html.querySelector(this.areaSelector);
    this.areaElm.innerHTML = nextAreaElm.innerHTML;
  }

  updateHistory(html, url) {
    const state = {};
    const title = html.querySelector('title').textContent;

    history.pushState(state, title, url);
    document.querySelector('title').textContent = title; // 現状はpushStateでtitle変わらないらしいので
  }

  getPageContent(url) {
    console.log('fetch: ', url);
    const promise = fetch(url).then(res => res.text());
    return promise;
  }
}
