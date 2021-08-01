var cityInputEl = document.querySelector('#user-input');
var cityBtnEl = document.querySelector('#search-btn');
var cityNameEl = document.querySelector('#city-name');
var cityArr = [];
var apiKey = '362fa825187144745e7596776c3e51be'; // please enter API Key here

var checkForm = function(event){
    var selectedcity = cityInputEl
    .value
    .trim()
    .toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');

    if(selectedcity){
        getCoords(selectedcity)
        cityInputEl.value = '';
    }else{
        alert("please enter a city!");
    }
};

var getCoords = function(city) {
    var currentWeatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(currentWeatherApi).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var lon = data.coord['lon'];
                var lat = data.coord['lat'];
                getCityForecast(city, lon, lat);

                // saves searched city and refreshes recent city list
                if (document.querySelector('.city-list')) {
                    document.querySelector('.city-list').remove();
                }

                saveCity(city);
                loadCities();
            });
        } else {
            alert(`Error: ${response.statusText}`)
        }
    })
    .catch(function(error) {
        alert('Unable to load weather.');
    })
}

var getCityForecast = function(city, lon, lat) {
    var oneCallApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,alerts&appid=${apiKey}`;
    fetch(oneCallApi).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {

                // identifies city name in forecast
                cityNameEl.textContent = `${city} (${moment().format("M/D/YYYY")})`; 

                console.log(data)

                currentForecast(data);
                fiveDayForecast(data);
            });
        }
    })
}

var currentForecast = function(forecast) {
    
    var forecastEl = document.querySelector('.container');
    forecastEl.classList.remove('hide');

    var weatherIconEl = document.querySelector('#current-icon');
    var currentIcon = forecast.current.weather[0].icon;
    weatherIconEl.setAttribute('src', `http://openweathermap.org/img/wn/${currentIcon}.png`);
    weatherIconEl.setAttribute('alt', forecast.current.weather[0].main)

    var currentTempEl = document.querySelector('#current-temp');
    currentTempEl.textContent = Math.floor(forecast.current['temp']);

    var currentHumidityEl = document.querySelector('#humidity');
    currentHumidityEl.textContent = forecast.current['humidity'];

    var currentWindEl = document.querySelector('#wind-speed')
    currentWindEl.textContent = forecast.current['wind_speed'];

    var uviEl = document.querySelector('#uvi')
    var currentUvi = forecast.current['uvi'];
    uviEl.textContent = currentUvi;

    // styles UV index
    switch (true) {
        case (currentUvi <= 2):
            uviEl.className = 'bg-sucess';
            break;
        case (currentUvi <= 5):
            uviEl.className = 'bg-warning';
            break;
        case (currentUvi <=7):
            uviEl.className = 'bg-danger';
            break;
        default:
            uviEl.className = 'bg-info';
            uviEl.setAttribute('style', 'background-color: #553C7B');
    }
}

var fiveDayForecast = function(forecast) { 

    var unhide = document.querySelector('.five-day-forecast');
    unhide.classList.remove('hide');
    
    for (var i = 1; i < 6; i++) {
        var dateP = document.querySelector('#date-' + i);
        dateP.textContent = moment().add(i, 'days').format('M/D/YYYY');

        var iconImg = document.querySelector('#img-' + i);
        var iconCode = forecast.daily[i].weather[0].icon;
        iconImg.setAttribute('src', `http://openweathermap.org/img/wn/${iconCode}.png`);
        iconImg.setAttribute('alt', forecast.daily[i].weather[0].main);

        var temp = document.querySelector('#temp-' + i);
        temp.textContent = Math.floor(forecast.daily[i].temp.day);
     
        var wind = document.querySelector('#wind-' + i);
        wind.textContent = Math.floor(forecast.daily[i].wind_speed);

        var humiditySpan = document.querySelector('#humidity-' + i);
        humiditySpan.textContent = forecast.daily[i].humidity;
    }
}

var saveCity = function(city) {

    // prevents duplicate city from being saved and moves it to end of array
    for (var i = 0; i < cityArr.length; i++) {
        if (city === cityArr[i]) {
            cityArr.splice(i, 1);
        }
    }

    cityArr.push(city);
    localStorage.setItem('cities', JSON.stringify(cityArr));
}

var loadCities = function() {
    cityArr = JSON.parse(localStorage.getItem('cities'));

    if (!cityArr) {
        cityArr = [];
        return false;
    } else if (cityArr.length > 5) {
        // saves only the five most recent cities
        cityArr.shift();
    }

    var recentCities = document.querySelector('#recent-searches');
    var cityListUl = document.createElement('ul');
    cityListUl.className = 'list-group list-group-flush city-list';
    recentCities.appendChild(cityListUl);

    for (var i = 0; i < cityArr.length; i++) {
        var cityListItem = document.createElement('button');
        cityListItem.setAttribute('type', 'button');
        cityListItem.className = 'list-group-item';
        cityListItem.setAttribute('value', cityArr[i]);
        cityListItem.textContent = cityArr[i];
        cityListUl.prepend(cityListItem);
    }

    var cityList = document.querySelector('.city-list');
    cityList.addEventListener('click', selectRecent)
}

var selectRecent = function(event) {
    var clickedCity = event.target.getAttribute('value');

    getCoords(clickedCity);
}

loadCities();
cityBtnEl.addEventListener('click', checkForm);

// searches for city on ENTER key
cityInputEl.addEventListener('keyup', function(event) {
    if (event.keyCode === 13) {
        cityBtnEl.click();
    }
});
    

    

       



