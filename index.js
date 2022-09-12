const express = require('express');
const app = express();
const bp = require('body-parser');
const axios = require('axios');
const PORT = 5004;
const fs = require('fs');
const open = require('open');

const { join } = require('path');

let counter = 0;
let find = 0;
let isCookieIn = false;
require('dotenv').config();
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  // allow access from any origin
  res.header('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

if (!isCookieIn) {
  fs.readFile(join(__dirname, 'cookies.json'), 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    }
    //console.log data.cookies
    let cookie = JSON.parse(data).cookies[0];
  });
  //openbrowser yemekepeti.com and set cookie
  open('https://www.yemeksepeti.com/');

  isCookieIn = true;
}
const getSim = () => {
  // get https://5sim.net/v1/user/buy/activation/turkey/virtual4/yemeksepeti
  //token x
  axios
    .get('https://5sim.net/v1/user/buy/activation/turkey/virtual4/yemeksepeti', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    })
    .then((res) => {
      counter++;
      console.log(counter, ' ', find);
      if (res.data !== 'no free phones') {
        find++;
        console.log(res.data.phone.substring(2));
        //get cookies.json console.log
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

setInterval(() => {
  getSim();
}, 100);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
