'use strict';

/* Controllers */

angular.module('ticker', ['ngCookies'])
    .controller('realTimeTicker', function ($scope, $cookieStore) {

        const socket = io.connect('https://electroneum.red:8895');

        $scope.status = 'Loading';
        $scope.manyCoins = 1;

        socket.on('connect', function () {
            $scope.status = 'Connected';
        });

        socket.on('initialize', function (init) {
            $scope.coinname = init.coinname;
        });

        socket.on('priceUpdate', function (price) {
            $scope.price = price;
            $scope.updatePrice();
        });

        $scope.updateAmount = function () {
            $scope.manyCoins = $scope.coinAmount;
            $scope.updatePrice();
        };

        $scope.updatePrice = function () {
            $scope.coinUSDWorth = $scope.price * $scope.manyCoins;
            $scope.$apply();
        }
    });
