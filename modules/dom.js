import { getCachedData,setCachedData } from "./utils.js";
import { updateWeatherData } from "./weatherService.js";



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


export async function updateWeatherData() {
  const cardArray = document.querySelectorAll(".card");
  const cachedUsers = getCachedData();
  for (const [i, card] of cardArray.entries()) {
    const weatherInfoHolder = card.querySelector(".weather-info");
    try {
      const { weatherCondition, temperature, humidity } = await updateWeatherData(cachedUsers[i].weather.latitude, cachedUsers[i].weather.longitude);
      cachedUsers[i].weather.condition = weatherCondition;
      cachedUsers[i].weather.temperature = temperature;
      cachedUsers[i].weather.humidity = humidity;

      weatherInfoHolder.querySelector(".temp").textContent = `Temp : ${temperature}°C`;
      weatherInfoHolder.querySelector(".humidity").textContent = `Humidity : ${humidity}%`;
      weatherInfoHolder.querySelector(".condition").textContent = `Condition : ${weatherCondition}`;

    } catch (error) {
      console.error("Cannot update weather data: " + error.message);
      return;
    }

  }
  setCachedData(cachedUsers);
}

