import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
dotenv.config();
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/', (req, res) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    res.sendFile(__dirname +'/index.html');
})

app.post('/', (req, res) =>{
    const query = req.body.cityName;
    const apiKey = process.env.API_KEY;
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}`;

    https.get(url, (response) => {
        console.log(response.statusCode);

        response.on('data', (data) => {
            const weatherData = JSON.parse(data); 
            const temp = weatherData.main.temp;
            const tempInCelsius = (temp - 273).toFixed(2);
            const description = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageUrl = 'https://openweathermap.org/img/w/' + icon + '.png';

            res.write(`<h1> Icon is ${icon}</h1>`);
            res.write('<h1>The tempearture of ' + query + ' is '+tempInCelsius+' and the description is ' + description + '</h1>');
            res.write('<img src="'+imageUrl+'">');
            res.send();
        })
    });
})

app.listen(3000, () => {
    console.log('Server started on port 3000');
})