
import api from "./api.js";
import utils from "./utils.js";

async function loadFiveUsers() {
  const contentHolder = document.getElementById("card--holder");
  const loader = document.getElementById("loader");
  contentHolder.style.display = "none";
  loader.style.display = "block";

  let cachedData = JSON.parse(localStorage.getItem("users"));
    if(cachedData && cachedData.length > 0){
        populateUserInfo(cachedData);
    }else{
        try{
            const result = await api.getFiveUsers();
            let users = result?.results;

            await populateUserInfo(users);

            contentHolder.style.display = "flex";
            loader.style.display = "none";
        }catch(error){
            console.error("Error: " + error.message);
        }
    }

}


async function populateUserInfo(users) {
  const cardHolder = document.getElementById("card--holder");
  cardHolder.innerHTML = "";
  for (let user of users) {
    let newCard = document.createElement("article");
    let infoHolder = document.createElement("div");
    let userName = document.createElement("h2");
    let userLocation = document.createElement("p");
    let userImage = document.createElement("img");
    newCard.classList.add("card");
    userImage.classList.add("card__img");
    infoHolder.classList.add("user-info");
    userName.textContent = user.name.first + " " + user.name.last;
    userLocation.textContent = user.location.city + ", " + user.location.country;
    userImage.src = user.picture.medium;
    infoHolder.appendChild(userName);
    infoHolder.appendChild(userLocation);
    newCard.appendChild(userImage);
    newCard.appendChild(infoHolder);
    try{
        const weatherInfo = await populateWeatherInfo(user);
    newCard.appendChild(weatherInfo);
    cardHolder.appendChild(newCard);
    }catch(error){
      console.error("Error: " + error.message);
    }
  }
}

function populateCachedInfo(users){
    
}

async function populateWeatherInfo(user) {
  const weatherInfoHolder = document.createElement("div");
  weatherInfoHolder.classList.add("weather-info");
  const tempP = document.createElement("p");
  tempP.classList.add("temp");
  const humidityP = document.createElement("p");
  humidityP.classList.add("humidity");
  const conditionP = document.createElement("p");
  conditionP.classList.add("condition");
  
  const [streetName, streetNumber, zipcode, city, country] = utils.extractLocationInfo(user.location);
  try{
    const geoInfo = await api.getGeoInformation(streetName,streetNumber,zipcode,city,country);
  const [latitude, longitude] = utils.extractLatAndLong(geoInfo.results[0].annotations);
  const { weatherCode, temperature, humidity } = await api.getWeather(latitude,longitude);
  const weatherDescription = utils.getWeatherDescription(weatherCode);
  tempP.textContent = "Temp : " + temperature + "°C";
  humidityP.textContent = "Humidity : " + humidity + "%";
  conditionP.textContent = "Condition : " + weatherDescription;
  weatherInfoHolder.appendChild(tempP);
  weatherInfoHolder.appendChild(humidityP);
  weatherInfoHolder.appendChild(conditionP);
  let cachedData = localStorage.getItem("users");
  if (!cachedData){
    localStorage.setItem("users", JSON.stringify([{firstName: user.name.first, lastName: user.name.last, city: user.location,city, country: user.location.country ,latitude, longitude, weather: {code: weatherCode, temperature, humidity}}]));
  }else{
    cachedData = JSON.parse(cachedData);
    cachedData.push({firstName: user.name.first, lastName: user.name.last, city, country: user.location.country ,latitude, longitude, weather: {code: weatherCode, temperature, humidity}});
    localStorage.setItem("users", JSON.stringify(cachedData));
  }
  return weatherInfoHolder;
  }catch(error){
    console.error("Error: " + error.message)
  }
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
  loadFiveUsers,
  updateWeatherData
};
