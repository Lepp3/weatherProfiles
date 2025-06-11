api for 5 random users name,location,gender,nationality - https://randomuser.me/api/?results=5&inc=gender,name,nat,location


api for getting lat and long based on location - https://api.opencagedata.com/geocode/v1/json?q={streetName}+{streetNumber}%2C+{zip code}+{city name}%2C+{countryName}&key={api key}

api for weather based on lat and long + weather codes = https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}4&current=weather_code&current=temperature_2m&current=relative_humidity_2m



init app > check for localstored data ? yes->storeddata.foreach(drawcard+append to container) no->call 3 apis, structure information, save to localStorage, take from localstorage .foreach(drawcard+append to container);

update weather > get info from localStorage, queryselectorAll cards > for of (cards and users) > replaceChild new weatherInfoHolder in place of old
new users > empty localStorage > call 3 apis, structure info, save to local, render + append
every 10 min update weather

