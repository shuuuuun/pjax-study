import Pjax from './modules/Pjax';

new Pjax({
  // areas: ['.js-content']
  area: '.js-content',
  // link: 'a:not([target])',
  link: '.js-nav-pjax',
  ajax: { timeout: 2500 },
  wait: 500,
});
