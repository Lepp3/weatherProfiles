import { clearCachedData } from "./modules/utils.js";
import { initApp } from "./modules/appInitialization.js"; 
import { emptyCardHolder, updateWeatherInfo} from "./modules/dom.js";



const newUserButton = document.getElementById("refresh-users");

newUserButton.addEventListener("click", () => {
  clearCachedData();
  emptyCardHolder();
  initApp();
});

const updateWeatherButton = document.getElementById("refresh-weather");

updateWeatherButton.addEventListener("click", async () => {
  await updateWeatherInfo();
});

let isUpdating = false;

setInterval(async () => {
  if (isUpdating){
    return;
  } 

  isUpdating = true;
  try {
    await updateWeatherInfo();
  } catch (error) {
    console.error("Weather update failed:" + error.message);
  } finally {
    isUpdating = false;
  }
}, 600000)

initApp();
