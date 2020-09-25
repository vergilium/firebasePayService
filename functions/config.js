//#region Настройки фрии кассы
//Ключи для доступа к кассе
const fkKeys = {
    AK: '',
    SK: ''
}
//ID магазина
const merchant_id = '';

//Адресс запросса
const fkURL = 'https://www.free-kassa.ru/api.php';

const fkIPRange = ['136.243.38.147', '136.243.38.149', '136.243.38.150', '136.243.38.151', '136.243.38.189', '136.243.38.108']

const fkCurrency =new Map([
//Валюта/курс
['123', 28.0] //USD
])

//#endregion

//#region Настройки приложения
debug = true;
//#endregion

module.exports = {
fkKeys,
merchant_id,
fkURL,
fkIPRange,
fkCurrency,
debug
}