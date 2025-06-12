import dom from "./modules/dom.js";
import { clearCachedData } from "./modules/utils.js";



const newUserButton = document.getElementById("refresh-users");
newUserButton.addEventListener("click", () => {
  clearCachedData();
  dom.initApp();
});

const updateWeatherButton = document.getElementById("refresh-weather");
updateWeatherButton.addEventListener("click", () => {
  dom.updateWeatherData();
});

let isUpdating = false;

setInterval(async () => {
  if (isUpdating){
    return;
  } 

  isUpdating = true;
  try {
    await dom.updateWeatherData();
  } catch (err) {
    console.error("Weather update failed:", err);
  } finally {
    isUpdating = false;
  }
}, 600000)

dom.initApp();
