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

export function createUserCard(user) {
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
  if (!user.weather.temperature) {
    const weatherInfoHolder = createHTMLElement('div', 'weather-info');
    const errorMessageP = createHTMLElement(
      'p',
      'error-weather',
      'Weather conditions unavailable at this time.'
    );
    weatherInfoHolder.appendChild(errorMessageP);
    newCard.appendChild(weatherInfoHolder);
    return newCard;
  }
  const weatherInfoHolder = createHTMLElement('div', 'weather-info');
  const tempP = createHTMLElement(
    'p',
    'temp',
    `Temp : ${user.weather.temperature}°C`
  );
  const humidityP = createHTMLElement(
    'p',
    'humidity',
    `Humidity : ${user.weather.humidity}%`
  );
  const conditionP = createHTMLElement(
    'p',
    'condition',
    `Condition : ${user.weather.condition}`
  );

  weatherInfoHolder.append(tempP, humidityP, conditionP);
  newCard.appendChild(weatherInfoHolder);
  return newCard;
}

export function removeOldCards() {
  const cardHolder = document.querySelector('#card--holder');
  cardHolder.innerHTML = '';
}

export function toggleLoaderAndContent(isLoading) {
  const loader = document.querySelector('.loader');
  const mainContent = document.querySelector('.main--content');

  loader.style.display = isLoading ? 'block' : 'none';
  mainContent.style.display = isLoading ? 'none' : 'flex';
}

export function showError() {
  const errorMessage = document.querySelector('.error');
  const loader = document.querySelector('.loader');
  const mainContent = document.querySelector('.main--content');
  mainContent.style.display = 'none';
  loader.style.display = 'none';
  errorMessage.style.display = 'block';
}

export async function updateWeatherInfo() {
  const cardsArr = document.querySelectorAll('.card');
  const cachedUsers = getCachedData('users');
  for (let i = 0; i < cardsArr.length; i++) {
    const tempP = cardsArr[i].querySelector('.temp');
    const humidityP = cardsArr[i].querySelector('.humidity');
    const conditionP = cardsArr[i].querySelector('.condition');
    const {condition, temperature, humidity } = await getWeather(cachedUsers[i].weather.latitude, cachedUsers[i].weather.longitude);
    tempP.textContent = `Temp : ${temperature}°C`;
    humidityP.textContent = `Humidity : ${humidity}%`;
    conditionP.textContent = `Condition : ${condition}`;
    cachedUsers[i].weather.condition = condition;
    cachedUsers[i].weather.temperature = temperature;
    cachedUsers[i].weather.humidity = humidity;
  }
  setCachedData('users', cachedUsers);
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

export async function renderCards() {
  toggleLoaderAndContent(true);
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
    console.log('Initialization error: ' + error.message);
    showError();
  }
}

export async function setUpRefreshWeatherTimer() {
  let isUpdating = false;

  setInterval(async () => {
    if (isUpdating) {
      return;
    }

    isUpdating = true;
    try {
      await updateWeatherInfo();
    } catch (error) {
      console.error('Weather update failed:' + error.message);
    } finally {
      isUpdating = false;
    }
  }, 600000);
}
