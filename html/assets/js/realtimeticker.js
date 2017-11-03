'use strict';

/* Controllers */

angular.module('ticker', ['ngCookies'])
    .controller('realTimeTicker', function ($scope, $cookies) {

        const socket = io.connect('http://localhost:1080');

        $scope.status = 'Loading';
        $scope.manyCoins = 1;

        if($cookies.lastUsedCoinAmount) {
            $scope.manyCoins = $cookies.lastUsedCoinAmount;
        }

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
            $cookies.lastUsedCoinAmount = $scope.manyCoins;
        };

        $scope.updatePrice = function () {
            $scope.coinUSDWorth = $scope.price * $scope.manyCoins;
            $scope.$apply();
        }
    });