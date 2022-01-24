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
	document.querySelector(
		"#now-location"
	).innerHTML = `${response.data.name} / ${response.data.sys.country}`;
	document.querySelector("#current-temp").innerHTML = `${Math.round(
		response.data.main.temp
	)}°`;
	document.querySelector(
		"#now-humidity"
	).innerHTML = `${response.data.main.humidity} %`;
	document.querySelector("#now-wind").innerHTML = `${Math.round(
		response.data.wind.speed
	)} m/s`;
	document.querySelector("#now-conditions").innerHTML =
		response.data.weather[0].main;
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
function convertToFahrenheit(event) {
	event.preventDefault();
	let temperatureElement = document.querySelector("#current-temp");
	let temperature = temperatureElement.innerHTML;
	temperature = Number(temperature);
	temperatureElement.innerHTML = `${Math.round(temperature * (9 / 5) + 32)}°`;
}
function convertToCelsius(event) {
	event.preventDefault();
	let temperatureElement = document.querySelector("#current-temp");
	let temperature = temperatureElement.innerHTML;
	temperature = Number(temperature);
	temperatureElement.innerHTML = `${Math.round(
		(temperature - 32) / (9 / 5)
	)}°`;
}

let searchForm = document.querySelector(".searchEngine");
searchForm.addEventListener("submit", handleSubmit);

let fahrenheitButton = document.querySelector(".fahrenheit");
fahrenheitButton.addEventListener("click", convertToFahrenheit);

let celsiusButton = document.querySelector(".celsius");
celsiusButton.addEventListener("click", convertToCelsius);

let currentLocationButton = document.querySelector("#current-location-icon");
currentLocationButton.addEventListener("click", getGeolocation);

formattedTime();
searchCity("Stavanger");
