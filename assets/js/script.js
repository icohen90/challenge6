var cityInputEl = document.querySelector('#user-input');
var cityBtnEl = document.querySelector('#search-btn');
var cityNameEl = document.querySelector('#city-name');
var cityArr = [];
var apiKey = '362fa825187144745e7596776c3e51be'; // please enter API Key here

var checkForm = function(event){
    var city = cityInputEl;

    if(city){
        getCoords(city)
        cityInputEl.value = '';
    }else{
        alert("please enter a city!");
    }
};


    

    

       



