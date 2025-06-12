import { getCachedData, setCachedData } from "./utils.js";
import { getWeather } from "./weatherService.js";


export function createUserCard(user) {
  const newCard = document.createElement("article");
  newCard.classList.add("card");
  const infoHolder = document.createElement("div");
  infoHolder.classList.add("user-info");
  const userName = document.createElement("h2");
  const userLocation = document.createElement("p");
  const userImage = document.createElement("img");
  userImage.classList.add("card__img");
  const weatherInfoHolder = document.createElement("div");
  weatherInfoHolder.classList.add("weather-info");
  const tempP = document.createElement("p");
  tempP.classList.add("temp");
  const humidityP = document.createElement("p");
  humidityP.classList.add("humidity");
  const conditionP = document.createElement("p");
  conditionP.classList.add("condition");

  userName.textContent = `${user.firstName}  ${user.lastName}`;
  userLocation.textContent = `${user.location.city}, ${user.location.country}`;
  userImage.src = user.userImage;

  infoHolder.appendChild(userName);
  infoHolder.appendChild(userLocation);
  newCard.appendChild(userImage);
  newCard.appendChild(infoHolder);

  tempP.textContent = `Temp : ${user.weather.temperature}°C`;
  humidityP.textContent = `Humidity : ${user.weather.humidity}%`;
  conditionP.textContent = `Condition : ${user.weather.condition}`;
  weatherInfoHolder.appendChild(tempP);
  weatherInfoHolder.appendChild(humidityP);
  weatherInfoHolder.appendChild(conditionP);
  newCard.appendChild(weatherInfoHolder);
  return newCard;

}

export function emptyCardHolder(){
  const cardHolder = document.querySelector("#card--holder");
  cardHolder.innerHTML = "";
}

export function toggleContent(isLoading) {
  const loader = document.querySelector(".loader");
  const mainContent = document.querySelector(".main--content");

  loader.style.display = isLoading ? "block" : "none";


  mainContent.style.display = isLoading ? "none" : "flex";

}

export async function updateWeatherInfo(){
  const cardsArr = document.querySelectorAll(".card");
  const cachedUsers = getCachedData();
  for (let i = 0; i <cardsArr.length; i++){
    const tempP = cardsArr[i].querySelector(".temp");
    const humidityP = cardsArr[i].querySelector(".humidity");
    const conditionP = cardsArr[i].querySelector(".condition");
    const updatedUser = await getWeather(cachedUsers[i]);
    tempP.textContent = `Temp : ${updatedUser.weather.temperature}°C`;
    humidityP.textContent = `Humidity : ${updatedUser.weather.humidity}%`;
    conditionP.textContent = `Condition : ${updatedUser.weather.condition}`;
    cachedUsers[i] = updatedUser;
  }
  setCachedData(cachedUsers);

}



