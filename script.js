const apiKey = "5362bb7b3b0b2507ef393a80170c174a";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const plainUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";

let tryLoc = 0;

if ("geolocation" in navigator) {
  navigator.permissions
    .query({ name: "geolocation" })
    .then((permissionStatus) => {
      tryLoc = permissionStatus.state === "granted" ? 1 : 0;
    });
}

function checkLocation() {
  // console.log(tryLoc);

  if ("geolocation" in navigator) {
    navigator.permissions
      .query({ name: "geolocation" })
      .then(function (permissionStatus) {
        if (permissionStatus.state === "granted" && tryLoc === 0) {
          tryLoc = 1;
          location.reload();
        } else if (permissionStatus.state === "denied" && tryLoc === 1) {
          tryLoc = 0;
          location.reload();
        }
      });
  } else {
    // Geolocation is not supported by this browser
    console.log("Geolocation is not supported by your browser");
    // Handle your logic when geolocation is not supported
  }
}

setInterval(checkLocation, 1000);

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      getWeatherByCoord(longitude, latitude);
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        console.log("Location is OFF");
      } else {
        console.error("Error getting location: ", error);
      }
      getWeather("Delhi");
    }
  );
} else {
  console.log("Geolocation is not supported by your browser");
  getWeather("Delhi");
}

async function getWeatherByCoord(longitude, latitude) {
  try {
    const response = await fetch(
      `${plainUrl}&lon=${longitude}&lat=${latitude}&appid=${apiKey}`
    );
    const data = await response.json();
    // printing weather data object in console
    console.log(data);
    updateWeatherData(data);
    const currentDate = new Date();
    daydate.innerHTML = formatDate(currentDate);
    await fetchAdditionalWeatherData(longitude, latitude);
  } catch (error) {
    console.error("Error fetching weather data: ", error);
  }
}

async function getWeather(city) {
  try {
    const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);
    const data = await response.json();
    //printing weather data object in console
    console.log(data);
    updateWeatherData(data);
    const currentDate = new Date();
    daydate.innerHTML = formatDate(currentDate);
    await fetchAdditionalWeatherData(city);
  } catch (error) {
    console.error("Error fetching weather data: ", error);
  }
}

function updateWeatherData(data) {
  CityName.innerHTML = `${data.name}`;
  temp.innerHTML = `${data.main.temp}°C`;
  temp2.innerHTML = `${data.main.temp}°C`; //added
  temp_min.innerHTML = `${data.main.temp_min}°C`;
  temp_max.innerHTML = `${data.main.temp_max}°C`;
  humidity.innerHTML = `${data.main.humidity}%`;
  humidity2.innerHTML = `${data.main.humidity}%`; //added
  wind_speed.innerHTML = `${data.wind.speed} km/h`;
  wind_speed2.innerHTML = `${data.wind.speed} km/h`; //added
  wind_deg.innerHTML = `${data.wind.deg}°`;
  sunrise.innerHTML = `${new Date(
    data.sys.sunrise * 1000
  ).toLocaleTimeString()}`;
  sunset.innerHTML = `${new Date(data.sys.sunset * 1000).toLocaleTimeString()}`;
  pressure.innerHTML = `${data.main.pressure} mb`;
  visibility.innerHTML = `${data.visibility} m`;
  clouds.innerHTML = `${data.clouds.all}%`;
  icoinfo.innerText = `${data.weather[0].main}`;
  ico.innerHTML = `${weatherIcons[data.weather[0].icon]}`;
  //   const linkElem = document.getElementById("linkid");
  //   linkElem.href = `https://openweathermap.org/city/${data.id}`;

  setAnimatedBackground(data.weather[0].icon);
  updateWeatherSuggestions(data.weather[0].icon);
}

// async function fetchAdditionalWeatherData(location) {
//   try {
//     const response = await fetch(
//       `${plainUrl}&${
//         typeof location === "string"
//           ? `q=${location}`
//           : `lon=${location[0]}&lat=${location[1]}`
//       }&appid=${apiKey}`
//     );
//     const data = await response.json();
//     temp2.innerHTML = `${data.main.temp}°C`;
//     humidity2.innerHTML = `${data.main.humidity}%`;
//     wind_speed2.innerHTML = `${data.wind.speed} km/h`;
//   } catch (error) {
//     console.error("Error fetching additional weather data: ", error);
//   }
// }

const weatherIcons = {
  "01d": "\u2600", // Sunny
  "01n": "\uD83C\uDF11", // Clear night
  "02d": "\uD83C\uDF24", // Partly cloudy day
  "02n": "\uD83C\uDF25", // Partly cloudy night
  "03d": "\uD83C\uDF25", // Cloudy
  "03n": "\uD83C\uDF25", // Cloudy
  "04d": "\uD83C\uDF27", // Broken clouds
  "04n": "\uD83C\uDF27", // Broken clouds
  "09d": "\uD83C\uDF27", // Shower rain
  "09n": "\uD83C\uDF27", // Shower rain
  "10d": "\uD83C\uDF26", // Rain
  "10n": "\uD83C\uDF27", // Rain
  "11d": "\uD83C\uDF29", // Thunderstorm
  "11n": "\uD83C\uDF29", // Thunderstorm
  "13d": "\uD83C\uDF28", // Snow
  "13n": "\uD83C\uDF28", // Snow
  "50d": "\uD83C\uDF2B", // Mist
  "50n": "\uD83C\uDF2B", // Mist
  700: "\uD83C\uDF2A", // Dust or Sand
  900: "\uD83C\uDF2A", // Tornado
};

function setAnimatedBackground(weatherCondition) {
  const body = document.body;
  body.classList.remove(
    "clear-day",
    "clear-night",
    "partly-cloudy-day",
    "partly-cloudy-night",
    "cloudy-day",
    "cloudy-night",
    "broken-clouds-day",
    "broken-clouds-night",
    "shower-rain-day",
    "shower-rain-night",
    "rainy-day",
    "rainy-night",
    "thunder-day",
    "thunder-night",
    "snowy-day",
    "snowy-night",
    "misty-day",
    "misty-night",
    "dust",
    "tornado"
  );

  //   dont forget to put a break statement in every cases
  switch (weatherCondition) {
    case "01d":
      body.classList.add("clear-day");
      break;
    case "01n":
      body.classList.add("clear-night");
      break;
    case "02d":
      body.classList.add("partly-cloudy-day");
      break;
    case "02n":
      body.classList.add("partly-cloudy-night");
      break;
    case "03d":
      body.classList.add("cloudy-day");
      break;
    case "03n":
      body.classList.add("cloudy-night");
      break;
    case "04d":
      body.classList.add("broken-clouds-day");
      break;
    case "04n":
      body.classList.add("broken-clouds-night");
      break;
    case "09d":
      body.classList.add("shower-rain-day");
      break;
    case "09n":
      body.classList.add("shower-rain-night");
      break;
    case "10d":
      body.classList.add("rainy-day");
      break;
    case "10n":
      body.classList.add("rainy-night");
      break;
    case "11d":
      body.classList.add("thunder-day");
      break;
    case "11n":
      body.classList.add("thunder-night");
      break;
    case "13d":
      body.classList.add("snowy-day");
      break;
    case "13n":
      body.classList.add("snowy-night");
      break;
    case "50d":
      body.classList.add("misty-day");
      break;
    case "50n":
      body.classList.add("misty-night");
      break;
    case "700":
      body.classList.add("dust");
      break;
    case "900":
      body.classList.add("tornado");
      break;
    default:
      break;
  }
}

const weatherSuggestions = {
  "01d": [
    "Go for a walk 🚶‍♀️",
    "Visit a park 🌳",
    "Have a picnic 🧺",
    "Wear sunglasses 😎",
  ], // Sunny
  "01n": [
    "Stargazing 🌟",
    "Evening walk 🌜🚶‍♀️",
    "Outdoor dinner 🍽️",
    "Campfire 🔥",
  ], // Clear night
  "02d": [
    "Take a walk 🚶‍♀️",
    "Photography 📸",
    "Jog in the park 🏃‍♂️",
    "Visit a botanical garden 🌸🌿",
  ], // Partly cloudy day
  "02n": [
    "Relax outdoors 🌌",
    "Watch the stars ✨",
    "Enjoy a calm night 🌃",
    "Wear a light jacket 🧥",
  ], // Partly cloudy night
  "03d": [
    "Visit a museum 🏛️",
    "Read a book 📖",
    "Go shopping 🛍️",
    "Wear comfortable clothes 👕",
  ], // Cloudy
  "03n": [
    "Watch a movie 🎬",
    "Read indoors 📚",
    "Listen to music 🎧",
    "Wear warm clothes 🧣",
  ], // Cloudy
  "04d": [
    "Stay indoors 🏠",
    "Cook a new recipe 🍳",
    "Board games 🎲",
    "Wear a light jacket 🧥",
  ], // Broken clouds
  "04n": [
    "Relax at home 🛋️",
    "Read a book 📖",
    "Listen to audiobooks 🎧",
    "Wear warm clothes 🧣",
  ], // Broken clouds
  "09d": [
    "Read a book 📖",
    "Watch a movie 🎬",
    "Have a cup of tea ☕",
    "Wear a raincoat (if outdoor)🧥",
  ], // Shower rain
  "09n": [
    "Watch a movie 🎬",
    "Listen to music 🎧",
    "Enjoy a warm drink ☕",
    "Wear a raincoat (if outdoor)🧥",
  ], // Shower rain
  "10d": [
    "Carry an umbrella ☔",
    "Visit a café ☕",
    "Watch a movie 🎬",
    "Indoor activities 🎨",
  ], // Rain
  "10n": [
    "Stay indoors 🏠",
    "Read a book 📖",
    "Listen to the rain 🌧️",
    "Wear a raincoat (if outdoor) 🧥",
  ], // Rain
  "11d": [
    "Stay indoors 🏠",
    "Unplug electronics 🔌",
    "Read a book 📖",
    "Avoid outdoor activities 🚫",
  ], // Thunderstorm
  "11n": [
    "Stay safe 🛡️",
    "Watch a movie 🎬",
    "Read a book 📖",
    "Avoid outdoor activities 🚫",
  ], // Thunderstorm
  "13d": [
    "Build a snowman ⛄",
    "Go skiing 🎿",
    "Drink hot chocolate ☕",
    "Wear a warm jacket 🧥",
  ], // Snow
  "13n": [
    "Stay warm indoors 🏠",
    "Read a book 📖",
    "Drink hot chocolate ☕",
    "Wear a warm jacket 🧥",
  ], // Snow
  "50d": [
    "Drive carefully 🚗",
    "Stay indoors 🏠",
    "Wear reflective clothing 👕",
    "Use fog lights 💡",
  ], // Mist
  "50n": [
    "Be cautious outdoors ⚠️",
    "Watch a movie 🎬",
    "Read a book 📖",
    "Use fog lights 💡",
  ], // Mist
  700: [
    "Close windows 🪟",
    "Wear a mask 😷",
    "Stay indoors 🏠",
    "Avoid outdoor activities 🚫",
  ], // Dust or Sand
  900: [
    "Take shelter immediately 🛡️",
    "Stay away from windows 🚫",
    "Monitor emergency alerts 📻",
    "Avoid outdoor activities 🌪️🚫",
  ], // Tornado
};

function updateWeatherSuggestions(weatherCondition) {
  const suggestions = weatherSuggestions[weatherCondition] || [
    "No suggestions available for this weather condition",
  ];
  const suggestionsContainer = document.getElementById("weather-suggestions");
  suggestionsContainer.innerHTML = "";

  suggestions.forEach((suggestion) => {
    const suggestionItem = document.createElement("li");
    suggestionItem.textContent = suggestion;
    suggestionsContainer.appendChild(suggestionItem);
  });
}

function formatDate(date) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  return `${day} ${months[monthIndex]} ${year}`;
}

submit.addEventListener("click", (e) => {
  e.preventDefault();
  getWeather(city.value);
});
