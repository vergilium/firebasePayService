const functions = require('firebase-functions');
const admin = require('firebase-admin');

const serviceAccount = require("../permissions.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://project1-916a9.firebaseio.com"
});

exports.firestore = admin.firestore();