﻿
(function () {
    "use strict";
    var module = angular.module("stockManagement");         // get module
    module.controller("AmendStockCtrl", ["$http", "blockUI", amendStockCtrl]);    // attach controller to the module


    function amendStockCtrl($http, blockUI)                   // controller funcion
    {        
        var vm = this;
        vm = defineModel(vm, $http, blockUI);
        prepareInitialUI(vm);
        wireCommands(vm);
    }

    // used to define and assign initial values to the model properties
    function defineModel(vm, httpService, blockUI)
    {
        vm.title = "Amend product stock counts";
        vm.httpService = httpService;                 // http service
        vm.blockUI = blockUI;
        vm.productId = "";
        vm.stockCount = 0;
        return vm;
    }

    // used to initialise the UI at the intial view load
    function prepareInitialUI(vm)
    {
        vm.blockUI.start();
        RemoveOutlineBorders($('#selectCategory'));
        drawProductsGrid(vm);
        populateCategoryDropDown(vm);
        vm.blockUI.stop();
    }

    // used to populate the product category drop down menu
    function populateCategoryDropDown(vm) {
        vm.httpService({
            method: "get",
            headers: { 'Content-Type': 'application/json' },
            url: ('http://localhost:61945/api/productinfo/getcategories?getcategories=true'),
        }).success(function (data) {
            var listitems = '<option value=-1 selected="selected">---- Select Category ----</option>';
            $.each(data, function (index, item) {
                listitems += '<option value=' + item.productCategoryID + '>' + item.productCatergoryName + '</option>';
            });
            $("#selectCategory option").remove();
            $("#selectCategory").append(listitems);
        }
        ).error(function (data) {
            // display error message
            alert('error - web service access')
        });
    }

    // binding commands to buttons
    function wireCommands(vm) {

        // on product category selection change
        $('#selectCategory').change(function () {
            onCategorySelection(vm, $('#selectCategory'));
        });

        // on product condition selection change
        $('#selectCondition').change(function () {
            onConditionSelection(vm, $('#selectCondition'));
        });

        // on product brand selection change
        $('#selectBrand').change(function () {
            onBrandSelection(vm, $('#selectBrand'));
        });

        vm.amendStock = function () {
            alert("amend stock");
        };

        vm.resetSearch = function () {
            alert("reset stock");
        };
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
                        {
                            "mData": "sotckAmended", "sTitle": "Counted?", "sClass": "right", "mRender": function (data, type, row) {
                                if (data == 'no') {
                                    return '<div style="background-color:darkorange; text-align:center">No</div> ';
                                }
                                else {
                                    return '<div style="background-color:green; text-align:center">Yes</div> ';
                                }
                            },
                            "aTargets": [0]
                        },
                        { "sTitle": "Amend count", "defaultContent": "<button class='productInfo'>Amend</button>" }
                ],
                "bDestroy": true,
                //"aLengthMenu": [[15, 50, 100, 200, -1], [15, 50, 100, 200, "All"]],
                "aLengthMenu": [[15, 50, 100, 200, 500, 700, 1000, -1], [15, 50, 100, 200, 500, 700, 1000, "All"]],
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

    // on product category ddl is changed
    function onCategorySelection(vm, ddl) {
        //alert('category changed : ' + ddl.val());
        var selectedCategory = ddl.val();
        var listitems = '<option value=-1 selected="selected">---- Select Condition ----</option>';
        if (selectedCategory != -1) {
            // remove errors
            RemoveOutlineBorders($('#selectCategory'));
            DisplayErrorMessage('', $('#lblErrorMessage'));

            // populate dependant DDL - condition
            vm.httpService({
                method: "get",
                headers: { 'Content-Type': 'application/json' },
                url: ('http://localhost:61945/api/productinfo/categoryId?categoryId=' + selectedCategory),
            }).success(function (data) {
                //alert(data.length);
                $.each(data, function (index, item) {
                    listitems += '<option value=' + item.conditionID + '>' + item.conditionName + '</option>';
                });
                $("#selectCondition option").remove();
                $("#selectCondition").append(listitems);
            }
            ).error(function (data) {
                // display error message
                alert('error - web service access - condition DDL population - please contact IT helpdesk');
                $("#selectCondition option").remove();
                $("#selectCondition").append(listitems);
            });
        }
        else {
            // remove prepopulated items in condition, brand and model            
            ResetDDL($("#selectCondition"), "Condition");
        }

        // remove prepopulated items brand and model  
        ResetDDL($("#selectModel"), "Model");
        ResetDDL($("#selectBrand"), "Brand");
    }

    // on product condition ddl is changed
    function onConditionSelection(vm, ddl) {
        //alert('condition changed');
        var selectedCondition = ddl.val();
        var selectedCategory = $('#selectCategory').val();
        var listitems = '<option value=-1 selected="selected">---- Select Brand ----</option>';
        var serverUrl = 'http://localhost:61945/api/ProductInfo?categoryId=' + selectedCategory + '&conditionId=' + selectedCondition;
        if (selectedCondition != -1 && selectedCategory != -1) {
            vm.httpService({
                method: "get",
                headers: { 'Content-Type': 'application/json' },
                url: serverUrl,
            }).success(function (data) {
                //alert(data.length);                
                $.each(data, function (index, item) {
                    listitems += '<option value=' + item.productbrandid + '>' + item.productbrandname + '</option>';
                });
                $("#selectBrand option").remove();
                $("#selectBrand").append(listitems);
            }
            ).error(function (data) {
                // display error message
                alert('error - web service access - brand DDL population - please contact IT helpdesk');
                $("#selectBrand option").remove();
                $("#selectBrand").append(listitems);
            });
        }
        else {
            // remove prepoluated items on model            
            ResetDDL($("#selectBrand"), "Brand");
        }

        // remove prepopulated items model
        ResetDDL($("#selectModel"), "Model");
    }

    // on product brand ddl is changed
    function onBrandSelection(vm, ddl) {
        var selectedCategory = $('#selectCategory').val();
        var selectedCondition = $("#selectCondition").val();
        var selectedBrands = ddl.val();
        //alert("brand changed " + selectedBrand);
        var listitems = '<option value=-1 selected="selected">---- Select Model ----</option>';
        var serverUrl = 'http://localhost:61945/api/ProductInfo?categoryId=' + selectedCategory + '&conditionId=' + selectedCondition + '&brandIdsCommaDelimited=' + selectedBrands;
        if (selectedBrands != -1 && selectedCondition != -1 && selectedCategory != -1) {
            vm.httpService({
                method: "get",
                headers: { 'Content-Type': 'application/json' },
                url: serverUrl,
            }).success(function (data) {
                //alert(data.length);
                $.each(data, function (index, item) {
                    listitems += '<option value=' + item.productListId + '>' + item.model + '</option>';
                });
                $("#selectModel option").remove();
                $("#selectModel").append(listitems);
            }
            ).error(function (data) {
                // display error message
                alert('error - web service access - model DDL population - please contact IT helpdesk');
                $("#selectModel option").remove();
                $("#selectModel").append(listitems);
            });
        }
        else {
            // remove prepoulated models
            ResetDDL($("#selectModel"), "Model");
        }
    }

    // used to reset search ddls
    function ResetSearchDDLs() {
        // reset main ddl
        var categoryDdl = $("#selectCategory");
        categoryDdl.val(-1);
        RemoveOutlineBorders(categoryDdl);
        DisplayErrorMessage('', $('#lblErrorMessage'));

        // reset other dependant ddls
        ResetDDL($("#selectModel"), "Model");
        ResetDDL($("#selectBrand"), "Brand");
        ResetDDL($("#selectCondition"), "Condition");
    }

    // Reset DDLs
    function ResetDDL(ddl, ddlName) {
        var listitems = '<option value=-1 selected="selected">---- Select' + ddlName + '----</option>';
        ddl.find('option').remove();
        ddl.append(listitems);
    }

    // used to remove error indicating outline borders
    function RemoveOutlineBorders(element) {
        element.removeClass("errorBorder");
    }
}());