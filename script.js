import { initApp } from "./modules/appInitialization.js";
import { attachListeners, setUpRefreshWeatherTimer } from "./modules/dom.js";



(async function initApp() {
  toggleContent(true);
  attachListeners();
  await setUpRefreshWeatherTimer();
  const cardHolder = document.querySelector("#card--holder");
  const userCardsFragment = document.createDocumentFragment();
  let users = getCachedData("users");
  if (users) {
    users.forEach(user => {
      const card = createUserCard(user);
      userCardsFragment.appendChild(card);
    });
    cardHolder.appendChild(userCardsFragment);
    toggleContent(false);
  } else {
    try {
      const baseUsers = await getFiveUsers();
      users = await buildUserInfo(baseUsers);
      setCachedData("users",users);
      
      users.forEach(user => {
        const card = createUserCard(user);
        userCardsFragment.appendChild(card);
      });
      cardHolder.appendChild(userCardsFragment);
      toggleContent(false);
    } catch (error) {
      console.log("Initialization error: " + error.message);
      showError();
    }

  }
})();

