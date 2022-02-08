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

function formattedSunTime(timestamp) {
	let date = new Date(timestamp);
	let utc_offset = date.getTimezoneOffset();
	let minutes = date.setMinutes(date.getMinutes() + utc_offset);

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

function formatDay(timestamp) {
	let date = new Date(timestamp * 1000);
	let day = date.getDay();
	let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	return days[day];
}

function formattedLocalTime(timestamp) {
	let date = new Date(timestamp);
	let utc_offset = date.getTimezoneOffset();
	let minutes = date.setMinutes(date.getMinutes() + utc_offset);

	let currentLocalHour = date.getHours();
	let currentLocalMinutes = date.getMinutes();
	if (currentLocalMinutes < 10) {
		currentLocalMinutes = `0${currentLocalMinutes}`;
	}
	if (currentLocalHour < 10) {
		currentLocalHour = `0${currentLocalHour}`;
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

	let currentLocalDay = days[date.getDay()];
	let skyImg = document.querySelector("#current-sky");
	if (currentLocalHour < 5) {
		skyImg.setAttribute("src", `img/sky/sky_night.jpg`);
	}
	if (currentLocalHour >= 22) {
		skyImg.setAttribute("src", `img/sky/sky_night.jpg`);
	}
	if (currentLocalHour >= 5 && currentLocalHour < 9) {
		skyImg.setAttribute("src", `img/sky/sky_sunrise.jpg`);
	}

	if (currentLocalHour >= 9 && currentLocalHour < 18) {
		skyImg.setAttribute("src", `img/sky/sky_day.jpg`);
	}
	if (currentLocalHour >= 18 && currentLocalHour < 22) {
		skyImg.setAttribute("src", `img/sky/sky_sunset1.jpg`);
	}

	return `${currentLocalDay} ${currentLocalHour}:${currentLocalMinutes}`;
}
function displayUvi(response) {
	console.log(response);
	let uvi = response.data.currently[8].uvi;
	let nowUv = document.querySelector("#now-solar-radiation-text");
	if (uvi < 3) {
		nowUv.innerHtml = `Low`;
	}
	if (uvi >= 3 && uvi < 6) {
		nowUv.innerHtml = `Moderate`;
	}
	if (uvi >= 6 && uvi < 8) {
		nowUv.innerHtml = `High`;
	}
	if (uvi >= 8 && uvi < 11) {
		nowUv.innerHtml = `Very high`;
	}
	if (uvi >= 11) {
		nowUv.innerHtml = `Extreme`;
	}
}

function displayForecast(response) {
	let forecast = response.data.daily;
	let forecastElement = document.querySelector(".forecast");
	let forecastHTML = `<div class="row">`;
	forecast.forEach(function (forecastDay, index) {
		if (index < 6) {
			let forecastTempMin = Math.round((forecastDay.temp.min * 10) / 10);
			let forecastTempMax = Math.round((forecastDay.temp.max * 10) / 10);

			forecastHTML =
				forecastHTML +
				`
      				<div class="col-2">
					  <div  class="day">
        				<div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
        				<img
          					src="http://openweathermap.org/img/wn/${
								forecastDay.weather[0].icon
							}@2x.png"
          					alt=""
          					width="60"
							  class="forecastIcon"
        				/>
        				<div class="weather-forecast-temperatures">
          					<span class="temp" id="forecast-temp-min" > ${forecastTempMin}° / </span>          
		  					<span class="temp" id="forecast-temp-max"> ${forecastTempMax}° </span>
        				</div>
						</div>
      				</div>
					`;
		}
	});
	forecastHTML = forecastHTML + `</div>`;
	forecastElement.innerHTML = forecastHTML;
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

function getForecast(coordinates) {
	console.log(coordinates);
	let apiKey = `d023e1b756c64bfbbe242c0aadeadce3`;
	let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
	console.log(apiUrl);
	axios.get(apiUrl).then(displayForecast);
}

function displayRain(response) {
	let nowRainElement = document.querySelector("#now-rain");
	let nowRainIcon = document.querySelector("#now-rain-icon");
	let nowSnowIcon = document.querySelector("#now-rain-icon");
	let rain = response.data.rain;
	let snow = response.data.snow;
	if (rain || snow) {
		if (rain) {
			let nowRain = Math.round(response.data.rain["1h"] * 10) / 10;
			nowRainElement.innerHTML = `${nowRain} mm`;
			nowRainIcon.setAttribute(
				"src",
				`img/icons/umbrella-blue-solid.png`
			);
		}
		if (snow) {
			let nowSnow = Math.round(response.data.snow["1h"] * 10) / 10;
			nowRainElement.innerHTML = `${nowSnow} mm`;
			nowSnowIcon.setAttribute("src", `img/icons/snow2.png`);
		}
	} else {
		nowRainElement.innerHTML = `0 mm`;
		nowRainIcon.setAttribute("src", `img/icons/umbrella-blue-solid.png`);
	}
}
navigator.geolocation.getCurrentPosition(showGeolocation);

function displayWeatherConditions(response) {
	console.log(response.data);
	let localTimeElement = document.querySelector("#local-time");
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
	let todayTempMin = document.querySelector("#temp-min");
	let todayTempMax = document.querySelector("#temp-max");;
	todayTempMin.innerHTML = `${Math.round(response.data.main.temp_min *10 )/10}° / `;
	todayTempMax.innerHTML = `${Math.round(response.data.main.temp_max*10)/10}° C`;
console.log(response.data);
	nowTempFeelsLikeElement.innerHTML = `Feels like ${Math.round(
		(response.data.main.feels_like * 10) / 10
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
	tempElement.innerHTML = `${
		Math.round(response.data.main.temp * 10) / 10
	}°C`;
	celsiusTemperature = Math.round(response.data.main.temp * 10) / 10;
	let timezone_offset = response.data.timezone;
	todaySunrise.innerHTML = formattedSunTime(
		(response.data.sys.sunrise + timezone_offset) * 1000
	);
	todaySunset.innerHTML = formattedSunTime(
		(response.data.sys.sunset + timezone_offset) * 1000
	);
	timeElement.innerHTML = formattedTime(response.data.dt * 1000);
	localTimeElement.innerHTML = formattedLocalTime(
		(response.data.dt + timezone_offset) * 1000
	);
	todayPressure.innerHTML = `${Math.round(response.data.main.pressure)} mb`;
	displayRain(response);
	getForecast(response.data.coord);
	displayForecast(response);
	console.log(response.data.currently);
	displayUvi(response.data.currently);
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

let searchForm = document.querySelector(".searchEngine");
searchForm.addEventListener("submit", handleSubmit);

let currentLocationButton = document.querySelector("#current-location-icon");
currentLocationButton.addEventListener("click", getGeolocation);

formattedTime();
searchCity("Moscow");
