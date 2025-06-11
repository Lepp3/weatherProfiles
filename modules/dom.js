
import api from "./api.js";
import utils from "./utils.js";








function createUserCard(user){
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
  
  userName.textContent = user.firstName + " " + user.lastName;
  userLocation.textContent = user.location.city + ", " + user.location.country;
  userImage.src = user.userImage;;

  infoHolder.appendChild(userName);
  infoHolder.appendChild(userLocation);
  newCard.appendChild(userImage);
  newCard.appendChild(infoHolder);

  tempP.textContent = "Temp : " + user.weather.temperature + "°C";
  humidityP.textContent = "Humidity : " + user.weather.humidity + "%";
  conditionP.textContent = "Condition : " + user.weather.condition;
  weatherInfoHolder.appendChild(tempP);
  weatherInfoHolder.appendChild(humidityP);
  weatherInfoHolder.appendChild(conditionP);
  newCard.appendChild(weatherInfoHolder);
  return newCard;

}

async function initApp() {
  const cardHolder = document.getElementById("card--holder");
  const loader = document.getElementById("loader");
  cardHolder.style.display = "none";
  loader.style.display = "block";
  cardHolder.innerHTML = "";

  let users = utils.getCachedData();
  if (users) {
    users.forEach(user => {
      const card = createUserCard(user);
      cardHolder.appendChild(card);
    });
    loader.style.display = "none";
    cardHolder.style.display = "flex";
  } else {
    try {
      const baseUsers = await api.getFiveUsers();
      users = await buildUserInfo(baseUsers);
      utils.setCachedData(users);
      users.forEach(user => {
        const card = createUserCard(user);
        cardHolder.appendChild(card);
      });
      loader.style.display = "none";
      cardHolder.style.display = "flex";
    } catch (error) {
      console.log(error);
    }

  }
}

async function buildUserInfo(users){
  const completeUsers = await Promise.all(
    users.map(async user =>{
      const withGeoInfo = await api.getGeoInformation(user);
      const withWeatherInfo = await api.getWeather(withGeoInfo);
      return withWeatherInfo;
    })
  );
  return completeUsers;
}








async function updateWeatherData() {
    const cardArray = document.querySelectorAll(".card");
    for (const [i, card] of cardArray.entries()) {
        console.log(card);
        const weatherInfoHolder = card.querySelector(".weather-info");
        const cachedLocations = JSON.parse(localStorage.getItem("locations"));
        console.log(cachedLocations);
        console.log(cachedLocations[i]);
        if (weatherInfoHolder && cachedLocations && cachedLocations[i]) {
            const location = cachedLocations[i];
            try {
                const { weatherCode, temperature, humidity } = await api.getWeather(location.latitude, location.longitude);
                const weatherDescription = utils.getWeatherDescription(weatherCode);
                weatherInfoHolder.querySelector(".temp").textContent = "Temp : " + temperature + "°C";
                weatherInfoHolder.querySelector(".humidity").textContent = "Humidity : " + humidity + "%";
                weatherInfoHolder.querySelector(".condition").textContent = "Condition : " + weatherDescription;
            } catch (error) {
                console.error("Error: " + error.message);
            }

        }
    }
}



export default {
  initApp,
  updateWeatherData
};
