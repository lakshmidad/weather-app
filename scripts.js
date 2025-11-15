/* ============================================
   WEATHER FORECAST APPLICATION - SCRIPT
   ============================================
   REFACTORING APPROACH:
   - Separated concerns: HTML structure, CSS styling, JS logic
   - Renamed all variables with meaningful names (no single letters)
   - Organized code into logical sections
   - Added comprehensive comments for clarity
   - Implemented proper error handling
   - Used modern JavaScript practices (const, let)
   - Added event listeners instead of inline handlers
   ============================================ */

// ============ CONFIGURATION ============
// API key for OpenWeatherMap (Note: This should be stored in environment variables in production)
const WEATHER_API_KEY = 'b6fd43b195acb137f7d9294ca3d7312e';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const TEMPERATURE_UNIT = 'metric';

// ============ DOM ELEMENTS ============
// Cache DOM elements for better performance
const cityInputElement = document.getElementById('cityInput');
const searchButtonElement = document.getElementById('searchButton');
const weatherResultElement = document.getElementById('weatherResult');

// ============ EVENT LISTENERS ============
// Attach event listeners to interactive elements
searchButtonElement.addEventListener('click', handleGetWeather);

// Allow Enter key to trigger search
cityInputElement.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleGetWeather();
    }
});

// ============ MAIN FUNCTIONS ============

/**
 * Handles the weather search request when user clicks button or presses Enter
 * Validates input and initiates the API call
 */
function handleGetWeather() {
    const cityName = cityInputElement.value.trim();

    // Validate that user entered a city name
    if (!cityName) {
        displayErrorMessage('Please enter a city name!');
        return;
    }

    // Show loading state while fetching data
    displayLoadingMessage();

    // Fetch weather data for the specified city
    fetchWeatherData(cityName);
}

/**
 * Fetches weather data from the OpenWeatherMap API
 * @param {string} cityName - The name of the city to fetch weather for
 */
function fetchWeatherData(cityName) {
    // Construct API request URL with parameters
    const apiUrl = `${WEATHER_API_URL}?q=${encodeURIComponent(cityName)}&appid=${WEATHER_API_KEY}&units=${TEMPERATURE_UNIT}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(weatherData => handleWeatherDataSuccess(weatherData))
        .catch(error => handleWeatherDataError(error));
}

/**
 * Processes successful weather data response
 * @param {object} weatherData - The weather data returned from the API
 */
function handleWeatherDataSuccess(weatherData) {
    // Check if the API returned an error (city not found)
    if (weatherData.cod === '404' || weatherData.cod === 404) {
        displayErrorMessage('City not found! Please check the spelling and try again.');
        return;
    }

    // Check for other API errors
    if (weatherData.cod !== '200' && weatherData.cod !== 200) {
        displayErrorMessage('An error occurred while fetching weather data.');
        return;
    }

    // Extract relevant weather information
    const weatherCondition = weatherData.weather[0].main;
    const temperature = Math.round(weatherData.main.temp);
    const humidity = weatherData.main.humidity;
    const cityNameFromAPI = weatherData.name;
    const countryCode = weatherData.sys.country;

    // Display the weather information
    displayWeatherInfo(weatherCondition, temperature, humidity, cityNameFromAPI, countryCode);
}

/**
 * Handles errors that occur during the API request
 * @param {Error} error - The error object from the fetch request
 */
function handleWeatherDataError(error) {
    console.error('Weather API Error:', error);
    displayErrorMessage('Error fetching weather data! Please check your internet connection and try again.');
}

// ============ DISPLAY FUNCTIONS ============

/**
 * Displays weather information in a formatted manner
 * @param {string} weatherCondition - The weather condition (e.g., "Cloudy", "Rainy")
 * @param {number} temperature - The current temperature in Celsius
 * @param {number} humidity - The humidity percentage
 * @param {string} cityName - The name of the city
 * @param {string} countryCode - The country code (e.g., "US", "GB")
 */
function displayWeatherInfo(weatherCondition, temperature, humidity, cityName, countryCode) {
    const weatherHTML = `
        <div class="weather-condition">${weatherCondition}</div>
        <div class="temperature-display">${temperature}°C</div>
        <div class="weather-detail">Humidity: ${humidity}%</div>
        <div class="weather-detail">City: ${cityName}, ${countryCode}</div>
    `;

    weatherResultElement.innerHTML = weatherHTML;
}

/**
 * Displays an error message to the user
 * @param {string} errorMessage - The error message to display
 */
function displayErrorMessage(errorMessage) {
    const errorHTML = `<p class="error-message">${errorMessage}</p>`;
    weatherResultElement.innerHTML = errorHTML;
}

/**
 * Displays a loading message while fetching weather data
 */
function displayLoadingMessage() {
    const loadingHTML = `<p class="loading-message">Loading weather data...</p>`;
    weatherResultElement.innerHTML = loadingHTML;
}
