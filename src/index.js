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
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
		"Sunday",
	];
	let currentDay = days[date.getDay()];
	return `${currentDay} ${currentHour}:${currentMinutes}`;
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
navigator.geolocation.getCurrentPosition(showGeolocation);

function displayWeatherConditions(response) {
	console.log(response.data);
	let nowTempFeelsLikeElement = document.querySelector("#nowTempFeelsLike");
	let nowWindElement = document.querySelector("#now-wind");
	let nowHumidityElement = document.querySelector("#now-humidity");
	let nowConditionsElement = document.querySelector("#now-conditions");
	let nowLocationElement = document.querySelector("#now-location");
	let tempElement = document.querySelector("#current-temp");
	let timeElement = document.querySelector(".time");
	nowTempFeelsLikeElement.innerHTML = `Feels like ${Math.round(
		response.data.main.feels_like
	)}°`;
	nowWindElement.innerHTML = `${Math.round(response.data.wind.speed)} m/s`;
	nowHumidityElement.innerHTML = `${response.data.main.humidity} %`;
	nowConditionsElement.innerHTML = `Currently: ${response.data.weather[0].description}`;
	nowLocationElement.innerHTML = `${response.data.name} / ${response.data.sys.country}`;
	tempElement.innerHTML = `${Math.round(response.data.main.temp)}°`;
	celsiusTemperature = Math.round(response.data.main.temp);
	displayRain(response);
	timeElement.innerHTML = formattedTime(response.data.dt * 1000);
}
function displayRain(response) {
	if (response.data.rain > 0) {
		document.querySelector("#now-rain").innerHTML = `${Math.round(
			response.data.rain
		)} mm`;
	} else {
		document.querySelector("#now-rain").innerHTML = `0 mm`;
	}
}
function searchCity(city) {
	let apiKey = `d023e1b756c64bfbbe242c0aadeadce3`;
	let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=d023e1b756c64bfbbe242c0aadeadce3&units=metric`;
	axios.get(apiUrl).then(displayWeatherConditions, displayRain);
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
searchCity("London");
