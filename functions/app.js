const express = require('express');
const functions = require('firebase-functions');
const md5 = require('md5');
const fkController = require('./Controllers/fkControllers.js');
const readController = require('./Controllers/readController.js');

const app = express();

app.post('/app/api/fk/Result', fkController.Result);

app.post('/app/api/fk/Read', readController.Read);

module.exports = app;