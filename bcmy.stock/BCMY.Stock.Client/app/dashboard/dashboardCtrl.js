// IIFE to manage dashboard controller
(function () {
    "use strict";
    var module = angular.module("stockManagement");         // get module
    module.controller("DashboardCtrl", [dashboardCtrl]);    // attach controller to the module


    function dashboardCtrl()                   // controller funcion
    {
        var vm = this;
        vm.title = "Main Dashboard";

        DrawExchangeRatesChart();
    };

    // used to draw the exchange rates chart
    function DrawExchangeRatesChart()
    {
        var exchangeRatesDates = GetExchangeRatesData();
        var data = google.visualization.arrayToDataTable([
          ['Date', 'Euro', 'USD'],
          ['2004', 1000, 400],
          ['2005', 1170, 460],
          ['2006', 660, 1120],
          ['2007', 1030, 540]
        ]);

        var options = {
            title: 'Exchange Rate Deviation',
            curveType: 'function',
            legend: { position: 'bottom' }
        };

        var chart = new google.visualization.LineChart(document.getElementById('curveChartErHistory'));

        chart.draw(data, options);
    }
    
    // used to get the exchange rates data 
    function GetExchangeRatesData()
    {
        var exchangeRatesDates = null;

        // TO DO .. web service call to get exchange rates data

        return exchangeRatesDates;
    }

}());