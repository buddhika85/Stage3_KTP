
(function () {
    "use strict";
    var module = angular.module("stockManagement");         // get module
    module.controller("AmendStockCtrl", ["$http", amendStockCtrl]);    // attach controller to the module


    function amendStockCtrl($http)                   // controller funcion
    {
        alert("In");
    }
}());