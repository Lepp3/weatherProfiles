import { getCachedData, setCachedData, clearCachedData } from './utils.js';
import { getWeather } from './weatherService.js';
import { fetchNewUsers, getUsers, buildUserInfo } from './userService.js';
import { User } from '../types/userTypes.js';
import { WeatherConditions } from '../types/weatherTypes.js';

function createHTMLElement({
  tag,
  className,
  content,
}: {
  tag: string;
  className: string | null;
  content?: string;
}): HTMLElement {
  const newElement = document.createElement(tag);
  if (className) {
    newElement.classList.add(className);
  }
  if (content) {
    newElement.textContent = content;
  }

  return newElement;
}

function createUserCard(user: User): HTMLElement {
  const newCard = createHTMLElement({ tag: 'article', className: 'card' });
  const infoHolder = createHTMLElement({ tag: 'div', className: 'user-info' });
  const userName = createHTMLElement({
    tag: 'h2',
    className: null,
    content: `${user.fullName}`,
  });
  const userLocation = createHTMLElement({
    tag: 'p',
    className: null,
    content: `${user.city}, ${user.country}`,
  });
  const userImage = createHTMLElement({
    tag: 'img',
    className: 'card__img',
  }) as HTMLImageElement;
  userImage.src = user.image;
  infoHolder.append(userName, userLocation);
  newCard.append(userImage, infoHolder);
  if (
    !user.weather?.temperature ||
    !user.weather?.humidity ||
    !user.weather?.condition
  ) {
    const errorMessageP = createHTMLElement({
      tag: 'p',
      className: 'error-weather',
      content: 'Weather conditions unavailable at this time.',
    });
    newCard.appendChild(errorMessageP);
    return newCard;
  }

  const weatherInfoHolder = createWeatherInfoHolderAndPopulate({
    temperature: user.weather.temperature,
    humidity: user.weather.humidity,
    condition: user.weather.condition,
  });
  const fetchSameNationalityButton = createHTMLElement({
    tag: 'button',
    className: 'action-button',
    content: 'Same nationality',
  });
  fetchSameNationalityButton.classList.add('nationality-functionality');
  fetchSameNationalityButton.addEventListener('click', async () => {
    await modifyCachedUsers(user);
    removeOldCards();
    await renderCards();
  });
  newCard.append(weatherInfoHolder, fetchSameNationalityButton);
  return newCard;
}

function createWeatherInfoHolderAndPopulate({
  temperature,
  humidity,
  condition,
}: {
  temperature: number;
  humidity: number;
  condition: string;
}): HTMLElement {
  const weatherInfoHolder = createHTMLElement({
    tag: 'div',
    className: 'weather-info',
  });
  const tempP = createHTMLElement({
    tag: 'p',
    className: 'temp',
    content: `Temp : ${temperature}°C`,
  });
  const humidityP = createHTMLElement({
    tag: 'p',
    className: 'humidity',
    content: `Humidity : ${humidity}%`,
  });
  const conditionP = createHTMLElement({
    tag: 'p',
    className: 'condition',
    content: `Condition : ${condition}`,
  });

  weatherInfoHolder.append(tempP, humidityP, conditionP);
  return weatherInfoHolder;
}

export async function renderCards(): Promise<void> {
  toggleLoaderAndContent(true);
  hideErrorElement();
  const cardHolder = document.querySelector('#card--holder')!;
  const userCardsFragment = document.createDocumentFragment();
  const users = await getUsers();
  if (users) {
    users.forEach((user: User) => {
      const card = createUserCard(user);

      userCardsFragment.appendChild(card);
    });
    cardHolder.appendChild(userCardsFragment);
    toggleLoaderAndContent(false);
  } else {
    showErrorElement();
  }
}

function removeOldCards(): void {
  const cardHolder = document.querySelector('#card--holder')!;
  while (cardHolder.firstChild) {
    cardHolder.removeChild(cardHolder.firstChild);
  }
}

function toggleLoaderAndContent(isLoading: boolean): void {
  const loader = document.querySelector('.loader');
  const mainContent = document.querySelector('.main--content');

  if (
    !(loader instanceof HTMLElement) ||
    !(mainContent instanceof HTMLElement)
  ) {
    console.log('One or more DOM elements are missing or incorrect.');
    return;
  }

  loader.style.display = isLoading ? 'block' : 'none';
  mainContent.style.display = isLoading ? 'none' : 'flex';
}

function showErrorElement(): void {
  const errorMessage = document.querySelector('.error');
  const loader = document.querySelector('.loader');
  const mainContent = document.querySelector('.main--content');
  const refreshUsersButton = document.getElementById('refresh-weather');

  if (
    !(errorMessage instanceof HTMLElement) ||
    !(loader instanceof HTMLElement) ||
    !(mainContent instanceof HTMLElement) ||
    !(refreshUsersButton instanceof HTMLButtonElement)
  ) {
    console.error('One or more DOM elements are missing or incorrect.');
    return;
  }

  refreshUsersButton.disabled = true;
  mainContent.style.display = 'none';
  loader.style.display = 'none';
  errorMessage.style.display = 'block';
}

function hideErrorElement(): void {
  const errorMessage = document.querySelector('.error');
  if (!(errorMessage instanceof HTMLElement)) {
    console.log('On or more DOM elements are missing or incorrect.');
    return;
  }
  errorMessage.style.display = 'none';
}

async function updateWeatherInfo() {
  const cardsArr = document.querySelectorAll('.card');
  const cachedUsers = getCachedData('users')!;
  toggleLoaderAndContent(true);
  for (let i = 0; i < cardsArr.length; i++) {
    const weatherInfoHolder = cardsArr[i].querySelector(
      '.weather-info'
    ) as HTMLElement;

    const weatherConditions: WeatherConditions | null = await getWeather({
      latitude: cachedUsers[i].coordinates?.latitude,
      longitude: cachedUsers[i].coordinates?.longitude,
    });

    if (!weatherConditions) {
      const errorMessageParagraph = createHTMLElement({
        tag: 'p',
        className: 'error-weather',
        content: 'Weather conditions unavailable at this time.',
      });
      cardsArr[i].removeChild(weatherInfoHolder);
      cardsArr[i].appendChild(errorMessageParagraph);
      const coordinates = cachedUsers[i].coordinates;
      if (coordinates) {
        const { latitude, longitude } = coordinates;
        cachedUsers[i]!.coordinates!.latitude = latitude;
        cachedUsers[i]!.coordinates!.longitude = longitude;
      }

      continue;
    }
    if (weatherInfoHolder) {
      const errorMessageParagraph = cardsArr[i].querySelector('.error-weather');
      if (!errorMessageParagraph) {
        const tempP = cardsArr[i].querySelector('.temp')!;
        const humidityP = cardsArr[i].querySelector('.humidity')!;
        const conditionP = cardsArr[i].querySelector('.condition')!;
        tempP.textContent = `Temp : ${weatherConditions.temperature}°C`;
        humidityP.textContent = `Humidity : ${weatherConditions.humidity}%`;
        conditionP.textContent = `Condition : ${weatherConditions.condition}`;
        cachedUsers[i].weather!.condition = weatherConditions.condition;
        cachedUsers[i].weather!.temperature = weatherConditions.temperature;
        cachedUsers[i].weather!.humidity = weatherConditions.humidity;
      } else {
        const tempP = createHTMLElement({
          tag: 'p',
          className: 'temp',
          content: `Temp : ${weatherConditions.temperature}°C`,
        });
        const humidityP = createHTMLElement({
          tag: 'p',
          className: 'humidity',
          content: `Humidity : ${weatherConditions.humidity}%`,
        });
        const conditionP = createHTMLElement({
          tag: 'p',
          className: 'condition',
          content: `Condition : ${weatherConditions.condition}`,
        });
        weatherInfoHolder.removeChild(errorMessageParagraph);
        weatherInfoHolder.append(tempP, humidityP, conditionP);
        cardsArr[i].appendChild(weatherInfoHolder);
        cachedUsers[i].weather!.condition = weatherConditions.condition;
        cachedUsers[i].weather!.temperature = weatherConditions.temperature;
        cachedUsers[i].weather!.humidity = weatherConditions.humidity;
      }
    } else {
      const errorMessageParagraph = document.querySelector(
        '.error-weather'
      ) as HTMLElement;
      const weatherInfoHolder = createWeatherInfoHolderAndPopulate({
        temperature: weatherConditions.temperature!,
        humidity: weatherConditions.humidity!,
        condition: weatherConditions.condition!,
      });
      cardsArr[i].removeChild(errorMessageParagraph);
      cardsArr[i].appendChild(weatherInfoHolder);
    }
  }
  setCachedData({ key: 'users', data: cachedUsers });
  toggleLoaderAndContent(false);
}

export  function attachListeners(): void {
  const newUsersButton = document.getElementById(
    'refresh-users'
  ) as HTMLButtonElement;

  newUsersButton.addEventListener('click', async () => {
    clearCachedData('users');
    removeOldCards();
    await renderCards();
  });

  const updateWeatherButton = document.getElementById(
    'refresh-weather'
  ) as HTMLButtonElement;

  updateWeatherButton.addEventListener('click', async () => {
    await updateWeatherInfo();
  });
}

export async function modifyCachedUsers(user: User): Promise<void> {
  toggleLoaderAndContent(true);
  let storedUsers: User[] = getCachedData('users')!;
  const desiredNationality = user.nationality;
  const usersThatMatchCriteria = storedUsers.filter(
    (user) => user.nationality === desiredNationality
  );
  const neededUsers = storedUsers.length - usersThatMatchCriteria.length;
  const replacedIndexes: number[] = [];
  storedUsers.forEach((user, index) => {
    if (user.nationality !== desiredNationality) {
      replacedIndexes.push(index);
    }
  });
  const newBaseUsers = await fetchNewUsers({
    nationality: desiredNationality,
    neededUsers,
  });
  if (!newBaseUsers) {
    return;
  }
  const readyUsers = await buildUserInfo(newBaseUsers);
  if (!readyUsers) {
    return;
  }
  storedUsers.forEach((user, index) => {
    if (replacedIndexes.includes(index)) {
      storedUsers[index] = readyUsers.shift()!;
    }
  });
  setCachedData({ key: 'users', data: storedUsers as User[] });
  toggleLoaderAndContent(false);
}

export async function setUpRefreshWeatherTimer(): Promise<void> {
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
      error instanceof Error
        ? console.error('Weather update failed:' + error.message)
        : console.error(String(error));
    } finally {
      isUpdating = false;
    }
  }, 600000);
}
