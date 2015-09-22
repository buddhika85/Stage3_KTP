// IIFE to manage dashboard controller
(function () {
    "use strict";
    var module = angular.module("stockManagement");         // get module
    module.controller("DashboardCtrl", ["$http", dashboardCtrl]);    // attach controller to the module


    function dashboardCtrl($http)                   // controller funcion
    {
        var vm = this;
        vm.title = "Main Dashboard";
        vm.exchangeRatesDateJson = null

        DrawExchangeRatesChart($http);
    };


    // used to draw the exchange rates chart
    function DrawExchangeRatesChart($http)
    {
        $http.get('http://localhost:61945/api/ExchangeRate').
        then(function (response) {
            
            debugger
            var twoDArray = [
                              ['Year', 'Sales', 'Expenses'],
                              ['2004',  1000,      400],
                              ['2005',  1170,      460],
                              ['2006',  660,       1120],
                              ['2007',  1030,      540]
                                ];
            var data = new google.visualization.arrayToDataTable(twoDArray);
            var options = {
                title: 'Exchange Rate Deviation',
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