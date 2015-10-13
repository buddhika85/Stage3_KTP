(function () {
    "use strict";
    var module = angular.module("stockManagement");         // get module
    module.controller("AddPastSalesOrdersCtrl", ["$http", addPastSalesOrdersCtrl]);    // attach controller to the module


    function addPastSalesOrdersCtrl($http)                   // controller funcion
    {
        var vm = this;
        vm.title = "Past Sales Orders";
        //alert("AddPastSalesOrdersCtrl");
    };

}());