//api key : 6100d52267d5667864c2043ca6d1555f

//Seleccion de elementos
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

//Datos
const weather = {};
const lang = "Es";

weather.temperature = {
    unit : "celsius"
}

//variables y constantes
const KELVIN = 273;
//API key
const key = "6100d52267d5667864c2043ca6d1555f";

//check geolocalizacion activada en el navegador
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Geolocalizador no soportado por el navegador</p>";
}

//settear posicion del usuario
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

//mostrar error cuando hay problema con el servicio de geolocalizacion
function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

//obtener el clima de la API
function getWeather(latitude, longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&lang=${lang}`;

    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function(){
            displayWeather();
        })
}

//mostrar el clima en la UI
function displayWeather(){
    iconElement.innerHTML = `<img src="../icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

//convertir Celsius a Fahrenheit
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

//cambiar magnitudes al hacer click en los grados de temperatura
tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined)return;

    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);

        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
})