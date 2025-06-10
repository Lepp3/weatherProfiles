import dom from "./modules/dom.js";

window.addEventListener("load", () => {
  dom.loadFiveUsers();
});

const newUserButton = document.getElementById("refresh-users");
newUserButton.addEventListener("click", () => {
  dom.loadFiveUsers();
});

const updateWeatherButton = document.getElementById("refresh-weather");
updateWeatherButton.addEventListener("click", () => {
  dom.updateWeatherData();
});

let isUpdating = false;

setInterval(async () => {
  if (isUpdating) return;

  isUpdating = true;
  try {
    await dom.updateWeatherData();
  } catch (err) {
    console.error("Weather update failed:", err);
  } finally {
    isUpdating = false;}}, 600000)
