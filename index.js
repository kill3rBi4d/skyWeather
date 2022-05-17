// "use strict"

const weather = {
    'apiKey' : '68427b55a96f5123a386531ff34e571f',
    fetchWeather: function(city) {
        fetch(
            'https://api.openweathermap.org/data/2.5/weather?q=' 
            + city 
            +'&units=metric&appid='
            +this.apiKey
        )
        .then((res)=> res.json())
        .then((data) => this.displayWeather(data))
        .catch((err) => this.notFound(err))
    },
    displayWeather: function(data){
        const { name } = data;
        const { country } = data.sys;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data .main;
        const { speed } = data.wind;

        // console.log(name,icon, description, temp, humidity, speed)
        document.querySelector('.city').innerText = 'Weather in '+ name + ', '+country;
        document.querySelector('.temp').innerText = Math.ceil(temp) + ' °C'
        document.querySelector('.icon').src = 'https://openweathermap.org/img/wn/'+ icon +'.png'
        document.querySelector('.description').innerText = description;
        document.querySelector('.humidity').innerText = 'Humidity: '+ humidity +'%';
        document.querySelector('.wind').innerText = 'Wind speed: '+ speed +' km/h' 
        document.querySelector('.loading').style.display = 'none'
        document.querySelector('.weather').style.display = 'flex'
        document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?sky')"
    },
    search: function(){
        let input = document.querySelector('.search-input').value;
        if(input != '')
            this.fetchWeather(input)
        else
            console.log(input);
    },
    notFound: function(err){
        // console.log(err)
        document.querySelector('.city').innerText = 'City not found!';
        document.querySelector('.temp').innerText = '';
        document.querySelector('.icon').src = '';
        document.querySelector('.description').innerText = '';
        document.querySelector('.humidity').innerText = '';
        document.querySelector('.wind').innerText = '' 
    }
}

document
.querySelector('.search-btn')
.addEventListener('click', ()=>{
    weather.search()
    document.querySelector('.search-input')
    .value = ''
})
document
.querySelector('.search-input')
.addEventListener('keyup', (e)=>{
    if(e.key == 'Enter'){
        weather.search()
        document.querySelector('.search-input')
        .value = ''
    }
})

//onload
if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}else{
    // console.log('Snap! Error');
    err("We could not find your location! Make sure you have enabled gps on your devices.")
}

//Get location
function onSuccess(position){
    let geoApiKey = '47ced2adbceb45a6bba62542871cf5ca'
    let {latitude, longitude} = position.coords;
    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${geoApiKey}`)
    .then(response => response.json()).then(response =>{
        let allDetails = response.results[0].components;
        let {province} = allDetails;

        //call weather fetch funtion
        weather.fetchWeather(province)
    }).catch(()=>{
        err('We could not find your location.')

    });
}
function onError(error){
    if(error.code == 1){
        err('Opps! You\'re invisible, please turn on your GPS.')
    }else if(error.code == 2){
        err('We live on planet earth, you\'re in Jupiter!')
    }else{
        err('Unkown error occured, please refresh the page.')
    }
}

//err
function err(err){
    document.querySelector('.err').style.display = 'flex';
    document.querySelector('.msg').innerText = err

    document.querySelector('.close-btn').addEventListener('click', ()=>{
        document.querySelector('.err').style.display = 'none'
        // window.location.reload()
        weather.fetchWeather("Kampala")
    })
}