(function () {
    "use strict";
    var module = angular.module("stockManagement");         // get module
    module.controller("AddPastExchangeRatesCtrl", ["$http", addPastExchangeRatesCtrl]);    // attach controller to the module


    function addPastExchangeRatesCtrl($http)                   // controller funcion
    {
        var vm = this;
        vm.title = "Past Exchange Rates";
        //alert("AddPastExchangeRates");
    };

}());