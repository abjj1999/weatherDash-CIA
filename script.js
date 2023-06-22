// Search box elements
const cityInput = document.getElementById("cityInput");
const submitBtn = document.getElementById("submitBtn");
const historyBox = document.getElementById("historyBox");
//-----------------
// Weather elements
const cityName = document.getElementById("cityName");
const date = document.getElementById("date");
const icon = document.getElementById("icon");
const description = document.getElementById("desc");
const temp = document.getElementById("temp");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const uvIndex = document.getElementById("uvIndex");
let cityHistory = [];

// Function to get the weather data from the API
const apiKey = "ce9ddbed2a5483d36efd8e6483c1ffa6";

submitBtn.addEventListener("click", function(event) {
    event.preventDefault();
    if(cityInput.value ===""){
        alert("Please enter a city name");
    }
    else{
        getCoords(cityInput.value);
        cityHistory.push(cityInput.value);
        localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
        renderCityHistory();
        cityInput.value = "";
    }
});

// get the city history from local storage
function getCityHistory(){
    const storedCityHistory = JSON.parse(localStorage.getItem("cityHistory"));
    if(storedCityHistory !== null){
        cityHistory = storedCityHistory;
    }
    renderCityHistory();
}

// render the city history on the page
function renderCityHistory(){
    historyBox.innerHTML = "";
    for(let i = 0; i < cityHistory.length; i++){
        const city = cityHistory[i];
        const historyBtn = document.createElement("button");
        historyBtn.textContent = city;
        historyBtn.setAttribute("class", "btn btn-secondary text-dark font-bolder fs-5 m-1 col-lg-3 col-md-3 col-sm-5");
        historyBtn.setAttribute("id", "historyBtn");
        historyBtn.setAttribute("type", "button");
        historyBtn.setAttribute("onclick", "getCoords(this.textContent)");
        historyBox.appendChild(historyBtn);
    }
}


// convert the city to lat and lon

function getCoords(city){
    const apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;
    fetch(apiUrl)
    .then(function(response){
            response.json()
            .then(function(data){
                const lat = data[0].lat;
                const lon = data[0].lon;
                // console.log(lat, lon, city);
                getWeatherData(lat, lon, city);
            })
       
        
    })
}

// get the weather data from the API

function getWeatherData(lat, lon, city){
    const apiUrl = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetch(apiUrl)
    .then(function(response){
        response.json()
        .then(function(data){
            console.log(data);
            displayWeatherData(data.current, city);
        })
    })
}

// display the weather data on the page
function displayWeatherData(data, city){
    cityName.textContent = city;
    date.textContent = new Date(data.dt * 1000).toLocaleDateString();
    icon.classList.remove("d-hidden");
    icon.setAttribute("src", `http://openweathermap.org/img/w/${data.weather[0].icon}.png`);
    description.textContent = data.weather[0].description;
    temp.textContent = "Temp: " +  data.temp + "°C";
    humidity.textContent = "Humidity: " + data.humidity + "%";
    windSpeed.textContent = "Wind Speed: " + data.wind_speed + "km/h";
    uvIndex.textContent = "UV Index: " + data.uvi;
    
}

getCityHistory();