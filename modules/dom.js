import { getCachedData, setCachedData, clearCachedData } from './utils.js';
import { getWeather } from './weatherService.js';
import { getUsers } from './userService.js';

function createHTMLElement(tag, className, content) {
  const newElement = document.createElement(tag);
  if (className) {
    newElement.classList.add(className);
  }
  if (content) {
    newElement.textContent = content;
  }

  return newElement;
}

function createUserCard(user) {
  const newCard = createHTMLElement('article', 'card');
  const infoHolder = createHTMLElement('div', 'user-info');
  const userName = createHTMLElement(
    'h2',
    null,
    `${user.firstName} ${user.lastName}`
  );
  const userLocation = createHTMLElement(
    'p',
    null,
    `${user.city}, ${user.country}`
  );
  const userImage = createHTMLElement('img', 'card__img');
  userImage.src = user.userImage;
  infoHolder.append(userName, userLocation);
  newCard.append(userImage, infoHolder);
  if (!user.weather?.temperature) {
    const errorMessageP = createHTMLElement(
      'p',
      'error-weather',
      'Weather conditions unavailable at this time.'
    );
    newCard.appendChild(errorMessageP);
    return newCard;
  }

  const weatherInfoHolder = createWeatherInfoHolderAndPopulate(user.weather.temperature, user.weather.humidity,user.weather.condition);
  
  newCard.appendChild(weatherInfoHolder);
  return newCard;
}

function createWeatherInfoHolderAndPopulate(temperature,humidity,condition){
  const weatherInfoHolder = createHTMLElement('div', 'weather-info');
  const tempP = createHTMLElement(
    'p',
    'temp',
    `Temp : ${temperature}°C`
  );
  const humidityP = createHTMLElement(
    'p',
    'humidity',
    `Humidity : ${humidity}%`
  );
  const conditionP = createHTMLElement(
    'p',
    'condition',
    `Condition : ${condition}`
  );

  weatherInfoHolder.append(tempP, humidityP, conditionP);
  return weatherInfoHolder;

}

export async function renderCards() {
  toggleLoaderAndContent(true);
  hideErrorElement();
  const cardHolder = document.querySelector('#card--holder');
  const userCardsFragment = document.createDocumentFragment();
  const users = await getUsers();
  if (users) {
    users.forEach((user) => {
      const card = createUserCard(user);
      userCardsFragment.appendChild(card);
    });
    cardHolder.appendChild(userCardsFragment);
    toggleLoaderAndContent(false);
  } else {
    showErrorElement();
  }
}

function removeOldCards() {
  const cardHolder = document.querySelector('#card--holder');
  cardHolder.innerHTML = '';
}

function toggleLoaderAndContent(isLoading) {
  const loader = document.querySelector('.loader');
  const mainContent = document.querySelector('.main--content');

  loader.style.display = isLoading ? 'block' : 'none';
  mainContent.style.display = isLoading ? 'none' : 'flex';
}

function showErrorElement() {
  const errorMessage = document.querySelector('.error');
  const loader = document.querySelector('.loader');
  const mainContent = document.querySelector('.main--content');
  const refreshUsersButton = document.getElementById('refresh-weather');
  refreshUsersButton.disabled = true;
  mainContent.style.display = 'none';
  loader.style.display = 'none';
  errorMessage.style.display = 'block';
}

function hideErrorElement() {
  document.querySelector('.error').style.display = 'none';
}

async function updateWeatherInfo() {
  const cardsArr = document.querySelectorAll('.card');
  const cachedUsers = getCachedData('users');
  toggleLoaderAndContent(true);
  for (let i = 0; i < cardsArr.length; i++) {
    const weatherInfoHolder = cardsArr[i].querySelector('.weather-info');

    const { condition, temperature, humidity } = await getWeather(
      cachedUsers[i].weather.latitude,
      cachedUsers[i].weather.longitude
    );

    if (!condition) {
      const errorMessageParagraph = createHTMLElement(
        'p',
        'error-weather',
        'Weather conditions unavailable at this time.'
      );
      cardsArr[i].removeChild(weatherInfoHolder);
      cardsArr[i].appendChild(errorMessageParagraph);
      const { latitude, longitude } = cachedUsers[i].weather;
      cachedUsers[i].weather = { latitude, longitude };
      continue;
    }
    if (weatherInfoHolder) {
      const errorMessageParagraph = cardsArr[i].querySelector('.error-weather');
      if (!errorMessageParagraph) {
        const tempP = cardsArr[i].querySelector('.temp');
        const humidityP = cardsArr[i].querySelector('.humidity');
        const conditionP = cardsArr[i].querySelector('.condition');
        tempP.textContent = `Temp : ${temperature}°C`;
        humidityP.textContent = `Humidity : ${humidity}%`;
        conditionP.textContent = `Condition : ${condition}`;
        cachedUsers[i].weather.condition = condition;
        cachedUsers[i].weather.temperature = temperature;
        cachedUsers[i].weather.humidity = humidity;
      } else {
        const tempP = createHTMLElement('p', 'temp', `Temp : ${temperature}°C`);
        const humidityP = createHTMLElement(
          'p',
          'humidity',
          `Humidity : ${humidity}%`
        );
        const conditionP = createHTMLElement(
          'p',
          'condition',
          `Condition : ${condition}`
        );
        weatherInfoHolder.removeChild(errorMessageParagraph);
        weatherInfoHolder.append(tempP, humidityP, conditionP);
        cardsArr[i].appendChild(weatherInfoHolder);
        cachedUsers[i].weather.condition = condition;
        cachedUsers[i].weather.temperature = temperature;
        cachedUsers[i].weather.humidity = humidity;
      }
    } else {
      const errorMessageParagraph = document.querySelector('.error-weather');
      const weatherInfoHolder = createWeatherInfoHolderAndPopulate(temperature,humidity,condition);
      cardsArr[i].removeChild(errorMessageParagraph);
      cardsArr[i].appendChild(weatherInfoHolder);
    }
  }
  setCachedData('users', cachedUsers);
  toggleLoaderAndContent(false);
}

export function attachListeners() {
  const newUsersButton = document.getElementById('refresh-users');

  newUsersButton.addEventListener('click', () => {
    clearCachedData('users');
    removeOldCards();
    renderCards();
  });

  const updateWeatherButton = document.getElementById('refresh-weather');

  updateWeatherButton.addEventListener('click', async () => {
    await updateWeatherInfo();
  });
}

export async function setUpRefreshWeatherTimer() {
  let isUpdating = false;

  setInterval(async () => {
    if (isUpdating) {
      return;
    }

    isUpdating = true;
    try {
      toggleLoaderAndContent(true);
      await updateWeatherInfo();
      toggleLoaderAndContent(false);
    } catch (error) {
      console.error('Weather update failed:' + error.message);
    } finally {
      isUpdating = false;
    }
  }, 600000);
}
