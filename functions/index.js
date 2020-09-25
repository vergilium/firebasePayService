const express = require('express');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const md5 = require('md5');
const serviceAccount = require("./permissions.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://project1-916a9.firebaseio.com"
});

const app = express();

const IPRange = require("./config.js").fkIPRange;
const merchat_id = require('./config.js').merchant_id;
const fkSecKey = require('./config.js').fkKeys['SK'];
const currency = require('./config.js').fkCurrency;
const debug = require('./config').debug;
const dfFirestore = admin.firestore();

function IPvalidate(req) {
    return (IPRange.includes(req.ip)) ? true : false;
}

function Debug(obj){
    if (debug === true)
    console.log(obj);
}

//exports.Result = functions.https.onRequest(async (request, response) => {
app.post('/app/api/fk/Result', async (request, response) => {
    if (IPvalidate(request) || debug == true) {
        if (!request.body) return response.sendStatus(400); //Если пустой боди
Debug(request.body);
        let data = request.body;
Debug(data);
        let hash = md5(`${merchat_id}:${data['AMOUNT']}:${fkSecKey}:${data['MERCHANT_ORDER_ID']}`);
Debug(hash);
        if (hash == data['SIGN'] || debug == true) {
            //Обработка результата платежа
            let Cash = data['AMOUNT'] / 100 * currency.get(data['CUR_ID']); //Получение суммы и конвертация валюты
Debug(currency.get(data['CUR_ID']));
            //Сохранение в БД
            const docRef = dfFirestore.collection('payReport')
                .doc(`fk:${data['intid']}`);
            await docRef.set({
                    trans_id : data['intid'],
                    amount : Cash,
                    order_id : data['MERCHANT_ORDER_ID'],
                    user_phone : data['P_PHONE'],
                    cur_id : data['CUR_ID'],
                    note : data['us_key']
        });
        }
        response.send("YES");
    } else {
        response.send("IP Adress not valid");
        console.log(`${new Date()} IP Adress ${request.ip} not valid!`);
    }
});

//exports.Read = functions.https.onRequest(async (request, response) => {
app.post('/app/api/fk/Read', async (request, response) => {
    const docRef = dfFirestore.collection('payReport');
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

exports.widgets = functions.https.onRequest(app);
