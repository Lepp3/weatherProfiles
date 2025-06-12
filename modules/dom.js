import { getCachedData, setCachedData } from "./utils.js";
import { getWeather } from "./weatherService.js";




function createHTMLElement(tag,className,content){
  const newElement = document.createElement(tag);
  if(className){
    newElement.classList.add(className);
  }
  if(content){
    newElement.textContent = content;
  }

  return newElement;
}

export function createUserCard(user) {
  const newCard = createHTMLElement("article", "card");
  const infoHolder = createHTMLElement("div", "user-info");
  const userName = createHTMLElement("h2", null, `${user.firstName} ${user.lastName}`);
  const userLocation = createHTMLElement("p", null, `${user.location.city}, ${user.location.country}`);
  const userImage = createHTMLElement("img", "card__img");
  userImage.src = user.userImage;
  const weatherInfoHolder = createHTMLElement("div", "weather-info");
  const tempP = createHTMLElement("p", "temp", `Temp : ${user.weather.temperature}°C`);
  const humidityP = createHTMLElement("p", "humidity", `Humidity : ${user.weather.humidity}%`);
  const conditionP = createHTMLElement("p", "condition", `Condition : ${user.weather.condition}`);

  infoHolder.appendChild(userName);
  infoHolder.appendChild(userLocation);
  newCard.appendChild(userImage);
  newCard.appendChild(infoHolder);
  weatherInfoHolder.appendChild(tempP);
  weatherInfoHolder.appendChild(humidityP);
  weatherInfoHolder.appendChild(conditionP);
  newCard.appendChild(weatherInfoHolder);
  return newCard;

}

export function emptyCardHolder() {
  const cardHolder = document.querySelector("#card--holder");
  cardHolder.innerHTML = "";
}

export function toggleContent(isLoading) {
  const loader = document.querySelector(".loader");
  const mainContent = document.querySelector(".main--content");

  loader.style.display = isLoading ? "block" : "none";
  mainContent.style.display = isLoading ? "none" : "flex";

}

export async function updateWeatherInfo() {
  const cardsArr = document.querySelectorAll(".card");
  const cachedUsers = getCachedData();
  for (let i = 0; i < cardsArr.length; i++) {
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






