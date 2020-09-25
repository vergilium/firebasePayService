const functions = require('firebase-functions');
const db = require('../Models/fb.js').firestore;

const IPRange = require("../config.js").fkIPRange;
const merchat_id = require('../config.js').merchant_id;
const fkSecKey = require('../config.js').fkKeys['SK'];
const currency = require('../config.js').fkCurrency;
const debug = require('../config').debug;


function IPvalidate(req) {
    return (IPRange.includes(req.ip)) ? true : false;
}

function Debug(obj){
    if (debug === true)
    console.log(obj);
}

exports.Result = functions.https.onRequest(async (request, response) => {
    if (IPvalidate(request) || debug === true) {
        if (!request.body) return response.sendStatus(400); //Если пустой боди
Debug(request.body);
        let data = request.body;
Debug(data);
        let hash = md5(`${merchat_id}:${data['AMOUNT']}:${fkSecKey}:${data['MERCHANT_ORDER_ID']}`);
Debug(hash);
        if (hash == data['SIGN'] || debug === true) {
            //Обработка результата платежа
            let Cash = data['AMOUNT'] / 100 * currency.get(data['CUR_ID']); //Получение суммы и конвертация валюты
Debug(currency.get(data['CUR_ID']));
            //Сохранение в БД
            const docRef = db.collection('payReport')
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