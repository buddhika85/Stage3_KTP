﻿// IIFE to manage common utility functions
//(function () {

    // used to validate a provided string with specified regex pattern
    // ref - http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
    function validateByRegex(element, regexPattern)
    {
        // email - /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
        var isValid = false;
        if (regexPattern.test(element.val()))
        {
            isValid = true;
        }
        return isValid;
    }

    // used to check whether a passed string is null or empty
    function isNullOrEmpty(element)
    {
        var isNullOrEmpty = false;
        if (element.val() == null || $.trim(element.val()) == "")
        {
            isNullOrEmpty = true;
        }
        return isNullOrEmpty;
    }

    // used to validate a drop down list
    function isValidDropDownListSelection(element)
    {
        var isValidDDLSelection = false;
        try {
            if (parseInt(element.val(), 10) != -1) {
                isValidDDLSelection = true;
            }
        }
        catch (exception)
        {
            isValidDDLSelection = true;     // means a wording selection on ddl
        }        
        return isValidDDLSelection;
    }

    // if with in the string valae there are any spaces they will be replaced by ^ sign
    function cleanSpaces(value)
    {        
        if (value.indexOf(" ") >= 0)
        {
            // contains spaces - " "
            value = value.replace(" ", "^");
        }
        return value;
    }

    // returns true if its only a whole number
    function IsAWholeNumber(value)
    {        
        if (!(isNaN(value)))
        {
            if (value % 1 == 0)
            {
                //alert('Whole Number');
                return true;
            }
            else
            {
                //value('Not a Whole Number');
                return false;
            }
        }
        else
        {
            return false;
        }
    }

    // returns true if its a whole or decimal number
    function IsANumber(value) {        
        if (!(isNaN(value))) 
            return true;        
        else 
            return false;        
    }

    // float value round up
    function RoundUpTo(floatValue, numOfDecimalPlaces)
    {        
        floatValue = parseFloat(floatValue);
        return floatValue.toFixed(numOfDecimalPlaces);
    }

    // reloads current page without angular scope variables
    function ReloadCurrentPage()
    {
        window.location.reload();
    }

    // validation - on key press of numeric only <input /> tag
    function isNumberKey(evt) {
        var charCode = (evt.which) ? evt.which : event.keyCode
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;
        return true;
    }

    // Limit decimal places to 2
    // After the decimal point key press, this will return false if user tries to input three decimal points
    // Ref - http://stackoverflow.com/questions/23221557/restrict-to-2-decimal-places-in-keypress-of-a-text-box and 
    // http://jsfiddle.net/S9G8C/203/
    function validateFloatKeyPressToTwoDecimalPlaces(el, evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        
        // make backspace functional
        if (charCode != 8) {
            var number = el.value.split('.');
            if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
                return false;
            }
            //just one dot
            if (number.length > 1 && charCode == 46) {
                return false;
            }
            //get the carat position
            var caratPos = getSelectionStart(el);
            var dotPos = el.value.indexOf(".");
            if (caratPos > dotPos && dotPos > -1 && (number[1].length > 1)) {
                return false;
            }
            return true;
        }
        else {
            return true;
        }        
    }

    // Ref - http://stackoverflow.com/questions/23221557/restrict-to-2-decimal-places-in-keypress-of-a-text-box and 
    // http://jsfiddle.net/S9G8C/203/
    //thanks: http://javascript.nwbox.com/cursor_position/
    function getSelectionStart(o) {
        if (o.createTextRange) {
            var r = document.selection.createRange().duplicate()
            r.moveEnd('character', o.value.length)
            if (r.text == '') return o.value.length
            return o.value.lastIndexOf(r.text)
        } else return o.selectionStart
    }

    // returns currency html entity value based on currency string passed
    function getCurrencyHtmlEntityValue(currencyStr)
    {
        currencyStr = currencyStr.toUpperCase();
        var currencyHtmlEntVal = '';
        switch (currencyStr) {
            case 'GBP':
                {
                    currencyHtmlEntVal = '&#163';
                    break;
                }
            case 'EURO':
                {
                    currencyHtmlEntVal = '&#8364;'
                    break;
                }
            case 'USD':
                {
                    currencyHtmlEntVal = '&#36;';
                    break;
                }
            default:
                {
                    currencyHtmlEntVal = '&#163';
                    break;
                }
        }
        return currencyHtmlEntVal;
    }

  
//}());