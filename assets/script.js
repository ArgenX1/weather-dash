// defining all global variables
const today = moment().format('L'); 
const searchBtn = document.querySelector("#searchBtn");
const pastSearches = document.querySelector("#pastSearches");
const city = document.querySelector("#city");
const userCity = document.querySelector("#userCity");
const userIcon = document.querySelector("#icon");
const userTemp = document.querySelector("#temp");
const userWind = document.querySelector("#wind");
const userHumidity = document.querySelector("#humidity");
const userUv = document.querySelector("#uv");
let cityName;
const h5El = document.getElementsByTagName("h5");
const iconEl = document.querySelectorAll(".cardIcon");
const humidityEl = document.querySelectorAll(".cardHumidity");
const tempEl = document.querySelectorAll(".cardTemp");
const windEl = document.querySelectorAll(".cardWind");
const pastCity = [];

userCity.textContent = userCity.innerHTML + " " + today;

searchBtn.addEventListener("click", function(event){
    event.preventDefault();
    cityName=city.value.trim();
    getCoordinates();
})

function getCoordinates(){
    const requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&APPID=cae8444643fe0b52a066739e6b318cbd';

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            const lat = data.coord.lat;
            const lon = data.coord.lon;
            const officialCity = data.name;
            const nowIcon = 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png';
            userIcon.setAttribute("src", nowIcon);
            const cityTitle = officialCity + " " + today;
            const secondRequest = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon +'&units=imperial&APPID=cae8444643fe0b52a066739e6b318cbd';
            if(!localStorage.getItem("pastCity")){
                const pastSearchBtn = document.createElement("button");
                pastSearchBtn.textContent = officialCity;
                pastSearches.append(pastSearchBtn);
                pastSearchBtn.classList.add("btn-secondary", "btn-lg", "btn-block");
                pastCity.push(pastSearchBtn.textContent.valueOf());
                localStorage.setItem("pastCity",pastCity);
            }else{
                const pastCitiesArray = localStorage.getItem("pastCity").split(",");
                if(!pastCitiesArray.includes(officialCity)){
                    const pastSearchBtn = document.createElement("button");
                    pastSearchBtn.textContent = officialCity;
                    pastSearches.append(pastSearchBtn);
                    pastSearchBtn.classList.add("btn-secondary", "btn-lg", "btn-block");
                    pastCity.push(pastSearchBtn.textContent.valueOf());
                    localStorage.setItem("pastCity",pastCity);
                }
            }   
            
            fetch(secondRequest)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    userCity.textContent = cityTitle;
                    userTemp.textContent = "Temp: " + data.current.temp + "ºF";
                    userWind.textContent = "Wind: " + data.current.wind_speed + " MPH";
                    userHumidity.textContent = "Humidity: " + data.current.humidity + "%";
                    userUv.textContent = "UV Index: " + data.current.uvi;
                    for (let i = 0; i < h5El.length; i++) {
                        const cardDates = data.daily[i+1].dt;
                        const differentDates = moment(cardDates, "X").format("L");
                        h5El[i].textContent = differentDates;
                        const iconCard = 'http://openweathermap.org/img/wn/' + data.daily[i+1].weather[0].icon + '@2x.png';
                        iconEl[i].setAttribute("src", iconCard);
                        const humidCard = data.daily[i+1].humidity;
                        humidityEl[i].textContent = "Humidity: " + humidCard + "%";
                        const tempCard = data.daily[i+1].temp.max;
                        tempEl[i].textContent = "Temp: " + tempCard + "ºF";
                        const windCard = data.daily[i+1].wind_speed;
                        windEl[i].textContent = "Wind: " + windCard + " MPH";
                    }
                });
        });
}

if(localStorage.getItem("pastCity")){
    let pastStoredCity = localStorage.getItem("pastCity");
    pastStoredCity = pastStoredCity.split(",");
    for (i=0; i < pastStoredCity.length; i++){
        const pastStoredCityBtn = document.createElement("button");
        pastSearches.append(pastStoredCityBtn);
        pastStoredCityBtn.textContent = pastStoredCity[i];
        pastStoredCityBtn.classList.add("btn-secondary", "btn-lg", "btn-block");
    }
}

pastSearches.addEventListener("click", function(event){
    event.preventDefault();
    cityName=event.target.innerHTML;
    getCoordinates();
})