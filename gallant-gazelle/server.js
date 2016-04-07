'use strict';

const express = require('express');
let app = express();
let port = process.env.PORT || 3000;

app.get('/info', function (req, res) {
  res.send({host: req.hostname, time: new Date()});
});

app.listen(port, function () {
  console.log('Example app listening on port ' + port);
});