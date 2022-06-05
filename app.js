require('dotenv').config();
const express = require("express");
const https = require("https");
const ejs =require("ejs");
const bodyParser = require("body-parser");
const _ = require("lodash");
// const favicon = require("serve-favicon");
// const path = require("path");

const app = express();
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

let temp = 0;
let tempMax = 0;
let tempMin = 0;
let humidity = 0;
let pressure = 0;
let visibility = 0;
let windSpeed = 0;
let tempFeelsLike = 0;
let weatherDescription = "";
let iconURL = "";
let city = "";
let degree = "";

app.get("/", function(req, res){
    res.render("index");
});
app.post("/", function(req, res){
    const apiKey = process.env.API_KEY;
    const endPoint = "https://api.openweathermap.org/data/2.5/weather?";
    let cityName = req.body.cityName;
    if(req.body.temp == "celcius")
    {
        var unit = "metric";
        degree = "C";
    }
    else
    {
        var unit = "imperial";
        degree = "F";
    }
    const url = endPoint + "q=" + cityName + "&units=" + unit + "&appid=" + apiKey;
    city = _.startCase(_.toLower(req.body.cityName));
    https.get(url, function(response){
        console.log(response.statusCode);
        response.on("data", function(data){
            const weatherData = JSON.parse(data);
            temp = weatherData.main.temp;
            tempMax = weatherData.main.temp_max;
            tempMin = weatherData.main.temp_min;
            humidity = weatherData.main.humidity; 
            pressure = weatherData.main.pressure;   
            visibility = weatherData.visibility;            
            windSpeed = weatherData.wind.speed;                
            tempFeelsLike = weatherData.main.feels_like;
            weatherDescription = _.startCase(_.toLower(weatherData.weather[0].description));
            // var words = weatherDescription.split(" ");
            // weatherDescription = "";
            // for(let i = 0; i < words.length; i++)
            // {
            //     words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
            //     weatherDescription += words[i] + " ";
            // }
            const icon = weatherData.weather[0].icon;
            iconURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
            res.redirect("/weather");
        })
    })
})

app.get("/weather", function(req,res){

    res.render("weather.ejs", {

        temp: temp,
        tempMax: tempMax,
        tempMin: tempMin,
        humidity: humidity,
        windSpeed: windSpeed,
        tempFeelsLike: tempFeelsLike,
        weatherDescription: weatherDescription,
        iconURL: iconURL,
        city: city,
        degree: degree,
        visibility: visibility,
        pressure: pressure
    });
});

app.post("/weather", function(req,res){

    res.redirect("/");
});

app.listen(3000, function(){
    console.log("server active at port 3000");
});