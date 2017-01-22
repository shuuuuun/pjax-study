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
        const href = elm.href;
        this.getPageContent(href).then(body => {
          const html = document.createElement('html');
          html.innerHTML = body;
          const nextAreaElm = html.querySelector(this.areaSelector);
          this.areaElm.innerHTML = nextAreaElm.innerHTML;
        });
      }, false);
    })
  }
  
  getPageContent(url) {
    console.log('fetch: ', url);
    const promise = fetch(url).then(res => res.text());
    return promise;
  }
}
