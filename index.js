// Init socket
var io = require('socket.io').listen(1080);

// Init CoinMarketCap Api
var capapi = require('coinmarketcap-api');
var apiclient = new capapi();
var numberOfSockets = 0;
var apiconfig = {
    currency: 'electroneum'
};

io.sockets.on('connection', function (socket) {

    socket.emit('loading', false);

    console.log("New connection");
    logTotal(true);

    socket.on('disconnect', function () {
        console.log('Got disconnect!');
        logTotal(false);
    });

    socket.on('updatePlz', function (ammountOfCoins) {
        console.log(ammountOfCoins);
        apiclient.getTicker(apiconfig)
            .then(function (response) {
                var usdPrice = response[0].price_usd;
                socket.emit('ping', usdPrice);
            })
            .catch(console.error);
    });

    apiclient.getTicker(apiconfig)
        .then(function (response) {
            var usdPrice = response[0].price_usd;
            socket.emit('ping', usdPrice);
        })
        .catch(console.error);
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