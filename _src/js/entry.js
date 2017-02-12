import Pjax from './modules/Pjax';

const pjax = new Pjax({
  // areas: ['.js-content']
  area: '.js-content',
  // link: 'a:not([target])',
  link: '.js-nav-pjax',
  ajax: { timeout: 2500 },
  wait: 500,
});

pjax.on('pjax:complete', () => {
  console.log('changed!');
});

pjax.on('pjax:replaceStart', (areaElm, nextAreaElm) => {
  areaElm.classList.add('is-hide');
  nextAreaElm.classList.add('is-hide');
});

pjax.on('pjax:replaceEnd', areaElm => {
  areaElm.classList.remove('is-hide');
});
