const express = require('express');
const finnhub = require('finnhub');
const path = require('path');

const app = express();
const port = 3000;



const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "crvdanhr01qkji45ia40crvdanhr01qkji45ia4g"
const finnhubClient = new finnhub.DefaultApi()

finnhubClient.congressionalTrading("AAPL", '2020-01-01', '2020-01-08', (error, data, response) => {
  console.log(data)
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
