'use strict';

const express = require('express');
const os = require('os');
let app = express();
let port = process.env.PORT || 3000;

app.get('/info', function (req, res) {
  res.send({host: os.hostname(), time: new Date()});
});

app.listen(port, function () {
  console.log('Example app listening on port ' + port);
});