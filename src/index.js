const apiKey = '0fc354a0fbfd44029b661850253005';
const baseURL = 'https://api.weatherapi.com/v1';

// DOM elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const currentLocationBtn = document.getElementById('current-location-btn');

const cityNameEl = document.getElementById('current-city-name');
const dateEl = document.getElementById('current-date');
const tempEl = document.getElementById('current-temp');
const windEl = document.getElementById('current-wind');
const humidityEl = document.getElementById('current-humidity');
const weatherIconEl = document.getElementById('current-weather-icon');
const forecastContainer = document.getElementById('forecast-cards-container');

// Fetch weather for a city
async function fetchWeatherData(city) {
    try {
        const currentRes = await fetch(`${baseURL}/current.json?key=${apiKey}&q=${city}`);
        const currentData = await currentRes.json();
        displayCurrentWeather(currentData);

        const forecastRes = await fetch(`${baseURL}/forecast.json?key=${apiKey}&q=${city}&days=5`);
        const forecastData = await forecastRes.json();
        displayForecast(forecastData);
    } catch (error) {
        alert('Error fetching weather data');
        console.error(error);
    }
}

function displayCurrentWeather(data) {
    cityNameEl.textContent = data.location.name;
    dateEl.textContent = data.location.localtime.split(' ')[0];
    tempEl.textContent = `Temperature: ${data.current.temp_c}°C`;
    windEl.textContent = `Wind: ${data.current.wind_kph} km/h`;
    humidityEl.textContent = `Humidity: ${data.current.humidity}%`;
    weatherIconEl.innerHTML = `<img src="${data.current.condition.icon}" alt="Weather Icon" class="w-20 h-20">`;
}

function displayForecast(data) {
    forecastContainer.innerHTML = ''; // Clear old cards

    data.forecast.forecastday.forEach(day => {
        const card = document.createElement('div');
        card.className = 'bg-white shadow-lg border border-blue-300 rounded-xl p-4 m-4 w-60 text-center flex-shrink-0 transition-transform hover:scale-105';

        card.innerHTML = `
            <p class="font-bold">${day.date}</p>
            <img src="${day.day.condition.icon}" alt="icon" class="mx-auto">
            <p>Temp: ${day.day.avgtemp_c}°C</p>
            <p>Wind: ${day.day.maxwind_kph} km/h</p>
            <p>Humidity: ${day.day.avghumidity}%</p>
        `;
        forecastContainer.appendChild(card);
    });
}

// Event Listeners
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherData(city);
    } else {
        alert('Please enter a city name');
    }
});

currentLocationBtn.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherData(`${lat},${lon}`);
        },
        error => {
            alert('Unable to retrieve your location');
            console.error(error);
        }
    );
});

// Initial load
fetchWeatherData('New York');


