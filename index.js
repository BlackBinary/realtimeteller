// Load the .env
require('dotenv').load();

// Init socket
var io = require('socket.io').listen(process.env.PORT || 3000);

// Init CoinMarketCap Api
var capapi = require('coinmarketcap-api');
var apiclient = new capapi();

// Declare some vars
var numberOfSockets = 0;
var usdPrice = 0;
var updateTime = new Date();
var apiconfig = {
    currency: process.env.COIN
};

setInterval(function () {
    apiclient.getTicker(apiconfig)
        .then(function (response) {
            updateTime = new Date();
            usdPrice = response[0].price_usd;
            io.sockets.emit('priceUpdate', usdPrice);
            console.log('Price Updated');
        })
        .catch(console.error)
}, 20000);

io.sockets.on('connection', function (socket) {

    socket.emit('initialize', {
        coinname: apiconfig.currency
    });

    console.log("New connection");
    logTotal(true);
    socket.emit('priceUpdate', usdPrice);

    socket.on('disconnect', function () {
        console.log('Disconnect');
        logTotal(false);
    });

});

// Simple connection counter impl
function logTotal(addOrSub) {
    if (addOrSub) {
        numberOfSockets++;
    } else {
        numberOfSockets--;
    }
    console.log("Connections: " + numberOfSockets);
}