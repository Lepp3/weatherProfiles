import { getFiveUsers, buildUserInfo } from "./userService.js";
import { getCachedData, setCachedData } from "./utils.js";
import { createUserCard, toggleContent } from "./dom.js";


export async function initApp() {
  toggleContent(true);
  const cardHolder = document.querySelector("#card--holder");

  let users = getCachedData();
  if (users) {
    users.forEach(user => {
      const card = createUserCard(user);
      cardHolder.appendChild(card);
    });
    toggleContent(false);
  } else {
    try {
      const baseUsers = await getFiveUsers();
      users = await buildUserInfo(baseUsers);
      setCachedData(users);
      users.forEach(user => {
        const card = createUserCard(user);
        cardHolder.appendChild(card);
      });
      toggleContent(false);
    } catch (error) {
      console.log("Initialization error: " + error.message);
    }

  }
}