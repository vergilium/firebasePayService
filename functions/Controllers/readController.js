const functions = require('firebase-functions');
const db = require('../Models/fb.js').firestore;

exports.Read = functions.https.onRequest(async (request, response) => {
    const docRef = db.collection('payReport');
    const snapshot = await docRef.get();
    if(snapshot.empty){
        response.sendStatus(400);
        return;
    }

    let result = new Map();

    snapshot.forEach(doc => {
        result.set(doc.id, doc.data());     
    })
    const obj = Object.fromEntries(result);
    response.json(obj);
});