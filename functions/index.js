const app = require('./app.js');
const functions = require('firebase-functions');

exports.widgets = functions.https.onRequest(app);
