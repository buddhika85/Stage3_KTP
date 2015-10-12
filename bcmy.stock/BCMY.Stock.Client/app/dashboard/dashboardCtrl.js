﻿// IIFE to manage dashboard controller
(function () {
    "use strict";
    var module = angular.module("stockManagement");         // get module
    module.controller("DashboardCtrl", ["$http", dashboardCtrl]);    // attach controller to the module


    function dashboardCtrl($http)                   // controller funcion
    {
        //var vm = this;
        //vm.title = "Main Dashboard";
        //vm.exchangeRatesDateJson = null

        //DrawExchangeRatesChart($http);
        var vm = this;

        //debugger
        var password = null;
        do {
            password = prompt("Enter password : ");
            //debugger;
            if (password === 'test123$')
            {

                vm.title = "Main Dashboard";
                vm.exchangeRatesDateJson = null;

                DrawExchangeRatesChart($http);

            }
        } while (password === null || (!(password === 'test123$')));
    };


    // used to draw the exchange rates chart
    // Ref - https://developers.google.com/chart/interactive/docs/gallery/linechart?hl=en
    function DrawExchangeRatesChart($http)
    {
        $http.get('http://localhost:61945/api/Chart?chartName=EXCHANGE_RATE_DEVIATION').
        then(function (response) {
             
            // adapting data to the google charts
            var array = $.parseJSON('[' + response.data + ']');           
            var dataArray = [['Date', 'Usd', 'Euro']];
            for (var i = 0; i < array[0].length; i++) {
                dataArray.push([array[0][i].Date, array[0][i].Usd, array[0][i].Euro]);
            }

            var data = new google.visualization.arrayToDataTable(dataArray);
            var options = {
                title: 'Exchange Rate Deviation - USD and Euro with GBP',
                curveType: 'function',
                legend: { position: 'bottom' }
            };
            var chart = new google.visualization.LineChart(document.getElementById('curveChartErHistory'));
            chart.draw(data, options);
        }, function (response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            alert('Web Service access error');
        });        
    }
    
 

}());