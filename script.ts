import {
  renderCards,
  attachListeners,
  setUpRefreshWeatherTimer,
} from './modules/dom.js';

(async function initApp():Promise<void> {
  await renderCards();
  attachListeners();
  await setUpRefreshWeatherTimer();
})();
