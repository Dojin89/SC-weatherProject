function formattedTime() {
	let now = new Date();
	let days = [
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
		"Sunday",
	];
	let months = [
		"Jan",
		"Feb",
		"March",
		"April",
		"May",
		"June",
		"July",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	let currentDay = days[now.getDay()];
	let currentHour = now.getHours();
	let currentMinutes = now.getMinutes();
	let currentMonth = months[now.getMonth()];
	let currentDate = now.getDate();

	if (currentMinutes < 10) {
		currentMinutes = `0${currentMinutes}`;
	}
	if (currentHour < 10) {
		currentHour = `0${currentHour}`;
	}
	let currentTime = document.querySelector("#timestamp");
	currentTime.innerHTML = `${currentHour}:${currentMinutes} - ${currentDay} ${currentDate}. ${currentMonth}`;
}
function getGeolocation(event) {
	event.preventDefault();
	navigator.geolocation.getCurrentPosition(showGeolocation);
}
function showGeolocation(position, response) {
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
	nowTempFeelsLikeElement.innerHTML = `Feels like ${Math.round(
		response.data.main.feels_like
	)}°`;
	nowWindElement.innerHTML = `${Math.round(response.data.wind.speed)} m/s`;
	nowHumidityElement.innerHTML = `${response.data.main.humidity} %`;
	nowConditionsElement.innerHTML = `Currently: ${response.data.weather[0].description}`;
	nowLocationElement.innerHTML = `${response.data.name} / ${response.data.sys.country}`;
	tempElement.innerHTML = `${Math.round(response.data.main.temp)}°`;
	celsiusTemperature = Math.round(response.data.main.temp);
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
searchCity("London");
