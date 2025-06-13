import {
  renderCards,
  attachListeners,
  setUpRefreshWeatherTimer,
} from './modules/dom.js';

(async function initApp() {
  await renderCards();
  attachListeners();
  await setUpRefreshWeatherTimer();
})();
