function formattedTime(timestamp) {
	let date = new Date(timestamp);
	let currentHour = date.getHours();
	let currentMinutes = date.getMinutes();
	if (currentMinutes < 10) {
		currentMinutes = `0${currentMinutes}`;
	}
	if (currentHour < 10) {
		currentHour = `0${currentHour}`;
	}
	let days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	let currentDay = days[date.getDay()];
	return `${currentDay} ${currentHour}:${currentMinutes}`;
}

function formattedSunTime(timestamp, response) {
	let date = new Date(timestamp);
	let utc_offset = date.getTimezoneOffset();
	console.log(utc_offset);
	let minutes = date.setMinutes(date.getMinutes() + utc_offset);
	console.log(`UTC: ${date}`);

	let sunTimeHour = date.getHours();
	let sunTimeMinutes = date.getMinutes();

	if (sunTimeMinutes < 10) {
		sunTimeMinutes = `0${sunTimeMinutes}`;
	}
	if (sunTimeHour < 10) {
		sunTimeHour = `0${sunTimeHour}`;
	}
	return `${sunTimeHour}:${sunTimeMinutes}`;
}
function getGeolocation(event) {
	event.preventDefault();
	navigator.geolocation.getCurrentPosition(showGeolocation);
}
function showGeolocation(position) {
	let latitude = position.coords.latitude;
	let longitude = position.coords.longitude;
	let apiKey = "d023e1b756c64bfbbe242c0aadeadce3";
	let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

	axios.get(apiUrl).then(displayWeatherConditions);
}

function displayRain(response) {
	let nowRainElement = document.querySelector("#now-rain");
	let rain = response.data.rain;
	let snow = response.data.snow;
	if (rain || snow) {
		if (rain) {
			nowRainElement.innerHTML = `${response.data.rain["1h"]} mm`;
		}
		if (snow) {
			nowRainElement.innerHTML = `${response.data.snow["1h"]} mm`;
		}
	} else {
		nowRainElement.innerHTML = `0 mm`;
	}
}

navigator.geolocation.getCurrentPosition(showGeolocation);

function displayWeatherConditions(response) {
	console.log(response.data);
	let nowTempFeelsLikeElement = document.querySelector("#nowTempFeelsLike");
	let nowWindElement = document.querySelector("#now-wind");
	let nowHumidityElement = document.querySelector("#now-humidity");
	let nowConditionsElement = document.querySelector("#now-conditions");
	let nowLocationElement = document.querySelector("#now-location");
	let nowIconElement = document.querySelector("#now-icon");
	let tempElement = document.querySelector("#current-temp");
	let timeElement = document.querySelector(".time");
	let todaySunrise = document.querySelector("#sunrise-text");
	let todaySunset = document.querySelector("#sunset-text");
	let todayPressure = document.querySelector("#today-pressure-text");
	nowTempFeelsLikeElement.innerHTML = `Feels like ${Math.round(
		response.data.main.feels_like
	)}°`;
	nowWindElement.innerHTML = `${Math.round(response.data.wind.speed)} m/s`;
	nowHumidityElement.innerHTML = `${response.data.main.humidity} %`;
	nowConditionsElement.innerHTML = `Currently: ${response.data.weather[0].description}`;
	nowLocationElement.innerHTML = `${response.data.name} / ${response.data.sys.country}`;
	nowIconElement.setAttribute(
		"src",
		`https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
	);
	nowIconElement.setAttribute("alt", response.data.weather[0].description);
	tempElement.innerHTML = `${Math.round(response.data.main.temp)}°`;
	celsiusTemperature = Math.round(response.data.main.temp);
	timeElement.innerHTML = formattedTime(response.data.dt * 1000);
	let timezone_offset = response.data.timezone;
	todaySunrise.innerHTML = formattedSunTime(
		(response.data.sys.sunrise + timezone_offset) * 1000
	);
	todaySunset.innerHTML = formattedSunTime(response.data.sys.sunset * 1000);
	todayPressure.innerHTML = `${Math.round(response.data.main.pressure)} mb`;
	displayRain(response);
	console.log(response.data.snow);
}

function searchCity(city) {
	let apiKey = `d023e1b756c64bfbbe242c0aadeadce3`;
	let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=d023e1b756c64bfbbe242c0aadeadce3&units=metric`;
	axios.get(apiUrl).then(displayWeatherConditions);
}

function handleSubmit(event) {
	event.preventDefault();
	let city = document.querySelector("#city-input").value;
	searchCity(city);
}
function convertToImperialTemp(event) {
	event.preventDefault();
	let tempElement = document.querySelector("#current-temp");
	let imperialTemp = Math.round(celsiusTemperature * 1.8 + 32);
	tempElement.innerHTML = `${imperialTemp}°`;
	imperialButton.classList.add("active");
	metricButton.classList.remove("active");
}
function convertToMetricTemp(event) {
	event.preventDefault();
	let metricTemp = document.querySelector("#current-temp");
	metricTemp.innerHTML = `${celsiusTemperature}°`;
	metricButton.classList.add("active");
	imperialButton.classList.remove("active");
}
let celsiusTemperature = null;

let searchForm = document.querySelector(".searchEngine");
searchForm.addEventListener("submit", handleSubmit);

let currentLocationButton = document.querySelector("#current-location-icon");
currentLocationButton.addEventListener("click", getGeolocation);

let metricButton = document.querySelector("#celsius");
metricButton.addEventListener("click", convertToMetricTemp);

let imperialButton = document.querySelector("#fahrenheit");
imperialButton.addEventListener("click", convertToImperialTemp);

formattedTime();
searchCity("Stavanger");
