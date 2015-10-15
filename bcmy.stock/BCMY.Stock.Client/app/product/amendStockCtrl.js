
(function () {
    "use strict";
    var module = angular.module("stockManagement");         // get module
    module.controller("AmendStockCtrl", ["$http", amendStockCtrl]);    // attach controller to the module


    function amendStockCtrl($http)                   // controller funcion
    {        
        var vm = this;
        vm = defineModel(vm, $http);
        prepareInitialUI(vm);
        wireCommands(vm);
    }

    // used to define and assign initial values to the model properties
    function defineModel(vm, httpService)
    {
        vm.title = "Amend product stock counts";
        vm.httpService = httpService;                 // http service
        vm.productId = "";
        vm.stockCount = 0;
        return vm;
    }

    // used to initialise the UI at the intial view load
    function prepareInitialUI(vm)
    {
        drawProductsGrid(vm);
    }

    // binding commands to buttons
    function wireCommands(vm) {
        //vm.saveExchangeRates = function (vm) {
        //    saveExchangeRates(vm);
        //};

        //vm.reset = function (vm) {
        //    resetInputFields(vm);
        //};
    }

    // used to draw products grid with the stock count
    function drawProductsGrid(vm) {
        
        vm.httpService({
            method: "get",
            headers: { 'Content-Type': 'application/json' },
            url: ('http://localhost:61945/api/productinfo?withAmendData=true'),
        }).success(function (data) {
            
            $('#productsGrid').dataTable({
                "data": data,
                "aoColumns": [
                        { "mData": "productlistId", "sTitle": "Product list Id", "bVisible": false },
                        { "mData": "productcategory", "sTitle": "Category ID", "bVisible": false },
                        { "mData": "productCatergoryName", "sTitle": "Category" },
                        { "mData": "productcondition", "sTitle": "Condition ID", "bVisible": false },
                        { "mData": "conditionName", "sTitle": "Condition" },
                        { "mData": "productbrandid", "sTitle": "Brand ID", "bVisible": false },
                        { "mData": "productbrandname", "sTitle": "Brand" },
                        { "mData": "model", "sTitle": "Model" },
                        { "mData": "marketvalueGBP", "sTitle": "Market value &#163", "bVisible": false },
                        { "mData": "stockCount", "sTitle": "Stock count" },
                        { "sTitle": "View More", "defaultContent": "<button class='productInfo'>Amend count</button>" }
                ],
                "bDestroy": true,
                "aLengthMenu": [[15, 50, 100, 200, -1], [15, 50, 100, 200, "All"]],
                "iDisplayLength": 15
            });

            // data table
            var table = $('#productsGrid').DataTable();

            // on info button clicks
            $('#productsGrid tbody').on('click', 'button.productInfo', function () {
                var data = table.row($(this).parents('tr')).data();
                alert("View Info : " + data.productlistId + " - " + data.model);                
            });
        }
        ).error(function (data) {
            // display error message
            alert('error - web service access')
        });
    }


    // Destroy the product data grid
    function DestroyTable() {
        if ($.fn.DataTable.isDataTable('#productsGrid')) {
            $('#productsGrid').DataTable().destroy();
            $('#productsGrid').empty();
        }
    }
}());