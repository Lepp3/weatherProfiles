import {
  renderCards,
  attachListeners,
  setUpRefreshWeatherTimer,
} from './modules/dom.js';

(async function initApp():Promise<void> {
  await renderCards();
  await attachListeners();
  await setUpRefreshWeatherTimer();
})();
