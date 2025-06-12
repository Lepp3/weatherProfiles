import { getFiveUsers, buildUserInfo } from "./userService.js";
import { getCachedData,setCachedData } from "./utils.js";
import { createUserCard } from "./dom.js";



export async function initApp() {
  const cardHolder = document.getElementById("card--holder");
  const loader = document.getElementById("loader");
  cardHolder.style.display = "none";
  loader.style.display = "block";
  cardHolder.innerHTML = "";

  let users = getCachedData();
  if (users) {
    users.forEach(user => {
      const card = createUserCard(user);
      cardHolder.appendChild(card);
    });
    loader.style.display = "none";
    cardHolder.style.display = "flex";
  } else {
    try {
      const baseUsers = await getFiveUsers();
      users = await buildUserInfo(baseUsers);
      setCachedData(users);
      users.forEach(user => {
        const card = createUserCard(user);
        cardHolder.appendChild(card);
      });
      loader.style.display = "none";
      cardHolder.style.display = "flex";
    } catch (error) {
      console.log("Initialization error: " + error.message);
    }

  }
}