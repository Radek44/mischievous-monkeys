'use strict';
const request = require('request');
const express = require('express');

let app = express();
let port = process.env.PORT || 5000;
let backend = process.env.GAZELLE;

if(!backend){
    throw new Error('Error: backend wasn\'t specified');
}

app.get('/', function (req, res) {
  console.log('processing request');
  request(backend, (err, response, body)=>{
    let json = JSON.parse(body);
    res.send(
        {
            frontend:{host: req.hostname, time: new Date()},
            backend: {host: json.host, time: json.time}
        });    
  });
});

app.listen(port, function () {
  console.log('Front end app listening on port ' + port);
});

console.log('Backend found at: ' + process.env.GAZELLE);