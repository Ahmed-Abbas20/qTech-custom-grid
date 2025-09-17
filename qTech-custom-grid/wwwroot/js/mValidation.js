//بسم الله الرحمن الرحيم
//2/4/1433
//mValidation
//Created By Marwan
//-----------------------------------------------------
//Prototyping JavaScript Classes
//#Region

//upgraded By Mohammed Reda 06/06/1436
// add  requiredcondition
// add new Style (tooltip)

// Updated By Alaa Ebrahim 09/01/2017
// add new style (tooltip2) 

var getClass = {
    fa: "fa",
    arow: "arow-none",
    question: "fa-question-circle",
    asterisk: "fa-asterisk",
    redTex: "redText",
    tooltip: ["tooltip", "tooltip2"],
    spnE_Tip: "val_pos"
}
function getMsg(msg, initial) {
    return ((msg) ? (((msg.constructor == Function) ? (msg()) : msg)) : (initial ? initial : ''));
}
function showSpnEmssg(invalidMsg) {
    return "<p class=\"span_error\" ><span>" + invalidMsg + "</span></p>";
}

function addRemoveTooltip(element, spnA, spnE, isFire, msg, isReq) {
    spnA.style = '';
    isFire = (msg == "" || msg == null) ? false : true;
    // Tooltip in hover
    if (spnE == getClass.tooltip[0]) {
        if (isFire) {
            spnA.classList.add(getClass.fa);
            spnA.classList.remove(getClass.arow);
            spnA.classList.remove(getClass.asterisk);
            spnA.classList.add(getClass.question);
            spnA.classList.add(getClass.redTex);
        } else {
            spnA.classList.add(getClass.fa);
            spnA.classList.add(getClass.arow);
            spnA.classList.remove(getClass.question);
            isReq ? spnA.classList.add(getClass.asterisk) : spnA.classList.remove(getClass.asterisk);
            spnA.classList.remove(getClass.redTex);
        }

        if (spnA.hasAttribute("data-toggle") && spnA.getAttribute("data-toggle") == "tooltip") {
            spnA.setAttribute("data-original-title", "" + msg + "");
            $(spnA).tooltip();
        }
        else
            spnA.innerHTML = msg != "" ? showSpnEmssg(msg) : msg;
    }
    // Tooltip in click 
    else if (spnE == getClass.tooltip[1]) {
        if (isFire) {
            if (isReq) spnA.classList.remove(getClass.asterisk);
            spnA.classList.add(getClass.question);
            spnA.classList.add(getClass.redTex);
            $(spnA).click(function () {
                $(element).click();
                $(element).focus();
            });
            $(element).click(function () {
                if ($(spnA.parentNode).find('span[id="spnE_msg"]').length == 0)
                    $(spnA).after("<span class=\"error_bx\" id=\"spnE_msg\">" + msg + "</span>");
                spnA.parentNode.classList.add(getClass.spnE_Tip);
            });
            $(element).blur(function () {
                $(spnA.parentNode).find('span[id="spnE_msg"]').remove();
                spnA.parentNode.classList.remove(getClass.spnE_Tip);
            });
        }
        else {
            spnA.classList.remove(getClass.question);
            spnA.classList.remove(getClass.redTex);
            if (isReq) spnA.classList.add(getClass.asterisk);
            $(spnA).unbind("click");
            $(element).unbind("click");
            $(spnA.parentNode).find('span[id="spnE_msg"]').remove();
            spnA.parentNode.classList.remove(getClass.spnE_Tip);
        }
    }
}
//fTrim
//#Region
String.prototype.fTrim = function () {
    var regExp = new RegExp("\\s", "g");
    return this.replace(regExp, "");
};
//#EndRegion

//startsWith
//#Region
String.prototype.startsWith = function (str) {
    return (this.match("^" + str) == str);
}
//#EndRegion

//#EndRegion
//-----------------------------------------------------
//Utility Functions
//#Region

//isSomeThing
//#Region
function isSomeThing(obj) {
    return (((obj != undefined) && (obj != null)) ? (true) : (false));
};
//#EndRegion

//charCode
//#Region
function charCode(e) {

    var evt = ((isSomeThing(window.event)) ? (window.event) : (e));
    var IsMouseEvent = ((navigator.appName == "Microsoft Internet Explorer") ? (((evt.button == 0) ? (false) : (true))) : (((isSomeThing(evt.keyCode)) ? (false) : (true))));
    var key = ((IsMouseEvent) ? (((navigator.appName == "Microsoft Internet Explorer") ? (evt.button) : (evt.which))) : (((navigator.appName == "Microsoft Internet Explorer") ? (evt.keyCode) : (((evt.keyCode == 0) ? (evt.which) : (evt.keyCode))))));
    var r =
    {
        Key: key
        ,
        Ctrl: evt.ctrlKey
        ,
        Alt: evt.altKey
        ,
        Shift: evt.shiftKey
        ,
        Enter: ((key == 13) ? (true) : (false))
        ,
        Del: ((key == 46) ? (true) : (false))
        ,
        BackSpace: ((key == 8) ? (true) : (false))
        ,
        Tab: ((key == 9) ? (true) : (false))
        ,
        keyString: String.fromCharCode(key)
    };

    return r;
}
//#EndRegion

//isDom
//#Region
function isDom(obj) {
    if (isSomeThing(obj)) {
        if (obj.nodeType) {
            return true;
        }
    }
    return false;
}
//#EndRegion

//getVObj
//#Region
function getVObj(obj) {
    var r = null;
    if (isSomeThing(obj)) {
        var Element = ((isSomeThing(obj.Element)) ? (((obj.Element.constructor == String) ? (document.getElementById(obj.Element)) : (((obj.Element.constructor = Function) ? (obj.Element()) : (null))))) : (null));
        var spnA = ((isSomeThing(obj.spn_A)) ? (((obj.spn_A.constructor == String) ? (document.getElementById(obj.spn_A)) : (((obj.spn_A.constructor == Function) ? (obj.spn_A()) : ({ style: { color: '' } }))))) : ({ style: { color: '' } }));
        var spnE = ((isSomeThing(obj.spn_E)) ? (((obj.spn_E.constructor == String) ? ($.inArray(obj.spn_E, getClass.tooltip) > -1 ? obj.spn_E : (document.getElementById(obj.spn_E))) : (((obj.spn_E.constructor == Function) ? (obj.spn_E()) : ({ innerHTML: '' }))))) : ({ innerHTML: '' }));
        var spnL = ((isSomeThing(obj.spn_L)) ? (((obj.spn_A.constructor == String) ? (document.getElementById(obj.spn_L)) : (((obj.spn_A.constructor == Function) ? (obj.spn_L()) : ({ style: { display: '' } }))))) : ({ style: { display: '' } }));
        var fieldName = ((isSomeThing(obj.fieldName)) ? (obj.fieldName) : (''));
        var Disabled = ((isSomeThing(obj.Disabled)) ? (((typeof (obj.Disabled) == 'function') ? (obj.Disabled()) : (obj.Disabled))) : (false));
        var haveValidationScheme = ((isSomeThing(obj.validationScheme)) ? (true) : (false));
        var isRequired = ((isSomeThing(obj.validationScheme.Required)) ? ((obj.validationScheme.Required.requiredCondition != undefined) ? (((obj.validationScheme.Required.requiredCondition.constructor == Function) ? (obj.validationScheme.Required.requiredCondition()) : (obj.validationScheme.Required.requiredCondition))) : (true)) : (false));
        var isLength = ((isSomeThing(obj.validationScheme.Length)) ? (true) : (false));
        var isMinLength = ((isLength) ? (((isSomeThing(obj.validationScheme.Length.minLength)) ? (true) : (false))) : (false));
        var isMaxLength = ((isLength) ? (((isSomeThing(obj.validationScheme.Length.maxLength)) ? (true) : (false))) : (false));
        var isPattern = ((isSomeThing(obj.validationScheme.Pattern)) ? (true) : (false));
        var isDate = ((isSomeThing(obj.validationScheme.Date)) ? (true) : (false));
        var isReqDate = ((isSomeThing(obj.validationScheme.Date)) ? (obj.validationScheme.Date.isRequired) : (((isSomeThing(obj.validationScheme.anyDate)) ? (obj.validationScheme.anyDate.isRequired) : (false))));
        var isAnyDate = ((isSomeThing(obj.validationScheme.anyDate)) ? (true) : (false));
        var isTime = ((isSomeThing(obj.validationScheme.Time)) ? (true) : (false));
        var isCheckExist = ((isSomeThing(obj.validationScheme.checkExist)) ? (true) : (false));
        var isBindIfExist = ((isSomeThing(obj.validationScheme.bindIfExist)) ? (true) : (false));
        var isRangeNumber = ((isSomeThing(obj.validationScheme.rangeNumber)) ? (true) : (false));
        var isVFunction = ((isSomeThing(obj.validationScheme.vFunction)) ? (true) : (false));
        var Format = ((isSomeThing(obj.validationScheme.Format)) ? (true) : (false));
        r =
        {
            Element: Element,
            spn_A: spnA,
            spn_E: spnE,
            spn_L: spnL,
            fieldName: fieldName,
            Disabled: Disabled,
            Color: ((mCheck.isStr.notEmpty(obj.validationScheme.Color)) ? (obj.validationScheme.Color) : ("Red")),
            haveValidationScheme: haveValidationScheme,
            isRequired: isRequired,
            isLength: isLength,
            isMinLength: isMinLength,
            isMaxLength: isMaxLength,
            isPattern: isPattern,
            isDate: isDate,
            isAnyDate: isAnyDate,
            isReqDate: isReqDate,
            isTime: isTime,
            isCheckExist: isCheckExist,
            isBindIfExist: isBindIfExist,
            isRangeNumber: isRangeNumber,
            isVFunction: isVFunction,
            validationScheme: obj.validationScheme,
            isFormat: Format
        }
    }
    return r;
}
//#EndRegion

//getSelectedOption
//#Region
function getSelectedOption(e) {
    var options = [];
    for (var i = 0; i < e.options.length; i++) {
        if (e.options[i].selected == true) {
            options[options.length] = e.options[i];
        }
    }
    return options;
}
//#EndRegion

//getValue
//#Region
function getValue(e) {
    var value = null;
    if (e) {
        if (e.type) {
            switch (e.type) {
                case "text":
                    value = e.value;
                    break;
                case "textarea":
                    value = e.value;
                    break;
                case "select-one":
                    value = getSelectedOption(e);
                    value = ((value.length > 0) ? (value[0].value) : (null));
                    break;
                case 'hidden':
                    value = e.value;
                    break;
                case 'file':
                    value = e.value;
                    break;
                case 'password':
                    value = e.value;
                    break;
            }
            return value;
        }
        else {
            if (e.tagName) {
                switch (e.tagName.toLowerCase()) {
                    case 'img':
                        value = e.getAttribute('src');
                        value = ((value == null) ? ('') : (value));
                        break;
                    case 'div':
                        if (e.classList.contains('ddl_multiSelect') || e.classList.contains('ddl_multiSelect_disabled'))
                            value = ((e.value && e.value.length > 0) ? (e.value[0].toString()) : ('-1'));
                        break;
                }
                return value;
            }
        }
    }

    return null;
}
//#EndRegion
//#EndRegion
//-----------------------------------------------------
//Validation Custom Functions
//#Region

//vEmail
//#Region
function vEmail(Value) {
    var r = false;
    if (isSomeThing(Value)) {
        var emailPattern = /^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i
        //Old Regular Experssion// /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zAZ\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        r = emailPattern.test(Value.toLowerCase());
    }
    return r;
}
//#EndRegion

//vMobile
//#Region
function vMobile(Value) {
    var r = false;
    if (isSomeThing(Value)) {
        if (Value.startsWith('9665')) {
            r = true;
        }
    }
    return r;
}
//#EndRegion

//vURL
function vURL(Value) {
    var r = false;
    if (isSomeThing(Value)) {
        var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        if (pattern.test(Value)) {
            return true;
        }
    }
    return r;
}


//Private Date Functions
//#Region

//validateHijriDate
//#Region
function validateHijriDate(obj, fireValidation) {
    if (obj) {
        fireValidation = ((fireValidation) ? (fireValidation) : (0))
        var textBox = ((obj.textBox) ? (obj.textBox) : (null));
        var Text = ((textBox) ? (reverse_date_str(textBox.value.fTrim())) : (null));
        var spnA = ((obj.spn_A) ? (obj.spn_A) : ({ style: { color: '' } }));
        var spnE = ((obj.spn_E) ? (obj.spn_E) : ({ innerHTML: '' }));
        var isRequired = ((obj.isRequired != undefined && obj.isRequired != null) ? (((obj.isRequired.constructor == Function) ? (obj.isRequired()) : (obj.isRequired))) : (true));
        var reqMsg = getMsg(obj.requiredMessage, 'برجاء أدخل التاريخ');
        var invalidMsg = getMsg(obj.invalidMessage, 'صيغة التاريخ غير صحيحة ، يرجي إدخال صيغة تاريخ صحيحه');

        maxDefaultDate = ((obj.maxDefaultDate != undefined && obj.maxDefaultDate != null) ? (((obj.maxDefaultDate.constructor == Function) ? (reverse_date_str(obj.maxDefaultDate())) : (reverse_date_str(obj.maxDefaultDate)))) : ($("input[id$='hdn_max_supo_Date_H']").val()));
        minDefaultDate = ((obj.minDefaultDate != undefined && obj.minDefaultDate != null) ? (((obj.minDefaultDate.constructor == Function) ? (reverse_date_str(obj.minDefaultDate())) : (reverse_date_str(obj.minDefaultDate)))) : ($("input[id$='hdn_min_supo_Date_H']").val()));

        var maxDate = ((obj.maxDate != undefined && obj.maxDate != null) ? (((obj.maxDate.constructor == Function) ? (reverse_date_str(obj.maxDate())) : (reverse_date_str(obj.maxDate)))) : (maxDefaultDate));
        var minDate = ((obj.minDate != undefined && obj.minDate != null) ? (((obj.minDate.constructor == Function) ? (reverse_date_str(obj.minDate())) : (reverse_date_str(obj.minDate)))) : (minDefaultDate));

        var rangMsg = getMsg(obj.rangeMessage, ('يجب ان يكون التاريخ بين ' + minDate + ' و ' + maxDate + ''));
        var rangeDefaultMsg = getMsg(obj.rangeDefaultMsg, ('التاريخ يجب ان يكون بين ' + minDefaultDate + ' الي ' + maxDefaultDate + ''));

        var minDateMsg = getMsg(obj.minRangeMessage);
        var maxDateMsg = getMsg(obj.maxRangeMessage);

        var exceedMsg;

        var compMinCondition = ((obj.compareMinCondition) ? (obj.compareMinCondition()) : (true));
        var compMaxCondition = ((obj.compareMaxCondition) ? (obj.compareMaxCondition()) : (true));


        if (Text != null) {
            if (Text != '') {

                var notValid = 0;
                var exceededDate = 0;
                var defaultExceedDate = 0;

                var dtAry = Text.split('/');

                var Day = Number(dtAry[2]);
                var Month = Number(dtAry[1]);
                var Year = Number(dtAry[0]);

                var dtMaxAry = maxDefaultDate.split('/');

                var mxDay = Number(dtMaxAry[2]);
                var mxMonth = Number(dtMaxAry[1]);
                var mxYear = Number(dtMaxAry[0]);

                var dtMinAry = minDefaultDate.split('/');

                var mnDay = Number(dtMinAry[2]);
                var mnMonth = Number(dtMinAry[1]);
                var mnYear = Number(dtMinAry[0]);


                if (Day == 30 && Month <= 12 && Year >= mnYear && Year <= mxYear) {
                    isValidHijriDateFromServer(textBox);
                    if (textBox.isValid == false) {
                        notValid += 1;
                    }
                }
                else {
                    if (Day < 1 || Day > 30) {
                        notValid += 1;
                    }
                    if (Month > 12 || Month < 1) {
                        notValid += 1;
                    }
                }
                if (fireValidation)
                    if ($.inArray(spnE, getClass.tooltip) > -1) {
                        addRemoveTooltip(textBox, spnA, spnE, false, "", (isRequired || obj.isReqDate));
                    } else {
                        spnA.style.color = 'Black';
                    }

                if (notValid > 0) {
                    if (fireValidation) {
                        if ($.inArray(spnE, getClass.tooltip) > -1) {
                            addRemoveTooltip(textBox, spnA, spnE, true, invalidMsg, (isRequired || obj.isReqDate));
                        } else {
                            spnE.innerHTML = invalidMsg;
                        }
                    }

                    if (obj.onFail)
                        obj.onFail(obj);

                    return false;
                }
                else {

                    if (!compareHijriDate(minDefaultDate, Text, compMinCondition)) {
                        defaultExceedDate += 1;
                        //exceedMsg = minDateMsg;
                    }

                    if (!compareHijriDate(Text, maxDefaultDate, compMaxCondition)) {
                        defaultExceedDate += 1;
                    }

                    if (defaultExceedDate > 0) {
                        if (fireValidation) {
                            if ($.inArray(spnE, getClass.tooltip) > -1) {
                                addRemoveTooltip(textBox, spnA, spnE, true, rangeDefaultMsg, (isRequired || obj.isReqDate));
                            } else {
                                spnE.innerHTML = rangeDefaultMsg;
                            }
                        }
                        if (obj.onFail)
                            obj.onFail(obj);
                        return false;
                    }

                    if (!compareHijriDate(minDate, Text, compMinCondition)) {
                        exceededDate += 1;
                        exceedMsg = minDateMsg;
                    }

                    if (!compareHijriDate(Text, maxDate, compMaxCondition)) {
                        exceededDate += 1;
                        exceedMsg = maxDateMsg;
                    }
                    if (exceededDate > 0) {
                        if (fireValidation) {
                            if ($.inArray(spnE, getClass.tooltip) > -1) {
                                addRemoveTooltip(textBox, spnA, spnE, true, (exceedMsg || rangMsg), (isRequired || obj.isReqDate));
                            } else {
                                spnE.innerHTML = (exceedMsg || rangMsg);
                            }
                        }
                        if (obj.onFail)
                            obj.onFail(obj);
                        return false;
                    }
                }
            }
            else {
                if (isRequired == true) {
                    if (fireValidation) {
                        if ($.inArray(obj.spn_E, getClass.tooltip) > -1) {
                            addRemoveTooltip(textBox, obj.spn_A, obj.spn_E, true, reqMsg, (isRequired || obj.isReqDate));
                        } else {
                            spnA.style.color = obj.Color;
                            spnE.innerHTML = reqMsg;
                        }

                    }
                    if (obj.onFail)
                        obj.onFail(obj);
                    return false;
                }
            }
            //spnA.style.color = 'Black';
            //spnE.innerHTML = '';

            if ($.inArray(spnE, getClass.tooltip) > -1) {
                addRemoveTooltip(textBox, spnA, spnE, false, "", (isRequired || obj.isReqDate));
            } else {
                spnA.style.color = 'Black';
                spnE.innerHTML = '';
            }
            if (obj.onSuccess)
                obj.onSuccess(obj);
            return true;
        }
    }
    return obj;
}
//#EndRegion

//validateGeoDate
//#Region
function validateGeoDate(obj, fireValidation) {
    if (obj) {
        fireValidation = ((fireValidation) ? (fireValidation) : (0))
        var textBox = ((obj.textBox) ? (obj.textBox) : (null));
        var Text = ((textBox) ? (reverse_date_str(textBox.value.fTrim())) : (null));
        var spnA = ((obj.spn_A) ? (obj.spn_A) : ({ style: { color: '' } }));
        var spnE = ((obj.spn_E) ? (obj.spn_E) : ({ innerHTML: '' }));
        var isRequired = ((obj.isRequired != undefined && obj.isRequired != null) ? (((obj.isRequired.constructor == Function) ? (obj.isRequired()) : (obj.isRequired))) : (true));
        var reqMsg = getMsg(obj.requiredMessage, 'برجاء أدخل التاريخ');
        var invalidMsg = getMsg(obj.invalidMessage, 'صيغة التاريخ غير صحيحة ، يرجي إدخال صيغة تاريخ صحيحه');

        maxDefaultDate = ((obj.maxDefaultDate != undefined && obj.maxDefaultDate != null) ? (((obj.maxDefaultDate.constructor == Function) ? (reverse_date_str(obj.maxDefaultDate())) : (reverse_date_str(obj.maxDefaultDate)))) : ("2076/12/31"));
        minDefaultDate = ((obj.minDefaultDate != undefined && obj.minDefaultDate != null) ? (((obj.minDefaultDate.constructor == Function) ? (reverse_date_str(obj.minDefaultDate())) : (reverse_date_str(obj.minDefaultDate)))) : ("1902/01/01"));

        var maxDate = ((obj.maxDate != undefined && obj.maxDate != null) ? (((obj.maxDate.constructor == Function) ? (reverse_date_str(obj.maxDate())) : (reverse_date_str(obj.maxDate)))) : (maxDefaultDate));
        var minDate = ((obj.minDate != undefined && obj.minDate != null) ? (((obj.minDate.constructor == Function) ? (reverse_date_str(obj.minDate())) : (reverse_date_str(obj.minDate)))) : (minDefaultDate));

        var rangMsg = getMsg(obj.rangeMessage, ('يجب ان يكون التاريخ بين ' + minDate + ' و ' + maxDate + ''));
        var rangeDefaultMsg = getMsg(obj.rangeDefaultMsg, ('التاريخ يجب ان يكون بين ' + minDefaultDate + ' الي ' + maxDefaultDate + ''));

        var minDateMsg = getMsg(obj.minRangeMessage);
        var maxDateMsg = getMsg(obj.maxRangeMessage);

        var exceedMsg;

        var compMinCondition = ((obj.compareMinCondition) ? (obj.compareMinCondition()) : (true));
        var compMaxCondition = ((obj.compareMaxCondition) ? (obj.compareMaxCondition()) : (true));


        if (Text != null) {
            if (Text != '') {
                var notValid = 0;
                var exceededDate = 0;
                var defaultExceedDate = 0;

                var dtAry = Text.split('/');

                var Day = Number(dtAry[2]);
                var Month = Number(dtAry[1]);
                var Year = Number(dtAry[0]);

                var dtMaxAry = maxDefaultDate.split('/');

                var mxDay = Number(dtMaxAry[2]);
                var mxMonth = Number(dtMaxAry[1]);
                var mxYear = Number(dtMaxAry[0]);

                var dtMinAry = minDefaultDate.split('/');

                var mnDay = Number(dtMinAry[2]);
                var mnMonth = Number(dtMinAry[1]);
                var mnYear = Number(dtMinAry[0]);


                var validformat = /^\d{4}\/\d{2}\/\d{2}$/ //Basic check for format validity
                if (!validformat.test(obj.textBox.value))
                    notValid += 1;
                else {
                    var inputSplited = obj.textBox.value.split('/');
                    var monthfield = inputSplited[1]
                    var dayfield = inputSplited[2]
                    var yearfield = inputSplited[0]

                    var dayobj = new Date(yearfield, monthfield - 1, dayfield)
                    if ((dayobj.getMonth() + 1 != monthfield) || (dayobj.getDate() != dayfield) || (dayobj.getFullYear() != yearfield)) {
                        notValid += 1;
                    }
                }

                if (fireValidation)
                    if ($.inArray(spnE, getClass.tooltip) > -1) {
                        addRemoveTooltip(textBox, spnA, spnE, false, "", (isRequired || obj.isReqDate));
                    } else {
                        spnA.style.color = 'Black';
                    }

                if (notValid > 0) {
                    if (fireValidation) {
                        if ($.inArray(spnE, getClass.tooltip) > -1) {
                            addRemoveTooltip(textBox, spnA, spnE, true, invalidMsg, (isRequired || obj.isReqDate));
                        } else {
                            spnE.innerHTML = invalidMsg;
                        }
                    }

                    if (obj.onFail)
                        obj.onFail(obj);

                    return false;
                }
                else {

                    if (!compareHijriDate(minDefaultDate, Text, compMinCondition)) {
                        defaultExceedDate += 1;
                        //exceedMsg = minDateMsg;
                    }

                    if (!compareHijriDate(Text, maxDefaultDate, compMaxCondition)) {
                        defaultExceedDate += 1;
                    }

                    if (defaultExceedDate > 0) {
                        if (fireValidation) {
                            if ($.inArray(spnE, getClass.tooltip) > -1) {
                                addRemoveTooltip(textBox, spnA, spnE, true, rangeDefaultMsg, (isRequired || obj.isReqDate));
                            } else {
                                spnE.innerHTML = rangeDefaultMsg;
                            }
                        }
                        if (obj.onFail)
                            obj.onFail(obj);
                        return false;
                    }

                    if (!compareHijriDate(minDate, Text, compMinCondition)) {
                        exceededDate += 1;
                        exceedMsg = minDateMsg;
                    }

                    if (!compareHijriDate(Text, maxDate, compMaxCondition)) {
                        exceededDate += 1;
                        exceedMsg = maxDateMsg;
                    }
                    if (exceededDate > 0) {
                        if (fireValidation) {
                            if ($.inArray(spnE, getClass.tooltip) > -1) {
                                addRemoveTooltip(textBox, spnA, spnE, true, (exceedMsg || rangMsg), (isRequired || obj.isReqDate));
                            } else {
                                spnE.innerHTML = (exceedMsg || rangMsg);
                            }
                        }
                        if (obj.onFail)
                            obj.onFail(obj);
                        return false;
                    }
                }
            }
            else {
                if (isRequired == true) {
                    if (fireValidation) {
                        if ($.inArray(obj.spn_E, getClass.tooltip) > -1) {
                            addRemoveTooltip(textBox, obj.spn_A, obj.spn_E, true, reqMsg, (isRequired || obj.isReqDate));
                        } else {
                            spnA.style.color = obj.Color;
                            spnE.innerHTML = reqMsg;
                        }

                    }
                    if (obj.onFail)
                        obj.onFail(obj);
                    return false;
                }
            }
            //spnA.style.color = 'Black';
            //spnE.innerHTML = '';

            if ($.inArray(spnE, getClass.tooltip) > -1) {
                addRemoveTooltip(textBox, spnA, spnE, false, "", (isRequired || obj.isReqDate));
            } else {
                spnA.style.color = 'Black';
                spnE.innerHTML = '';
            }
            if (obj.onSuccess)
                obj.onSuccess(obj);
            return true;
        }
    }
    return obj;
}
//#EndRegion
//compareHijriDate
//#Region
function compareHijriDate(d1, d2, compareCondition) {
    if (d1 == '' || d2 == '') {
        notValid = 0;
    }
    else {
        d1 = reverse_date_str(d1);
        d2 = reverse_date_str(d2);

        var notValid = 0;
        if (compareCondition) {
            var d1Ary = d1.split('/');
            var d2Ary = d2.split('/');

            var day1 = Number(d1Ary[2]);
            var month1 = Number(d1Ary[1]);
            var year1 = Number(d1Ary[0]);

            var day2 = Number(d2Ary[2]);
            var month2 = Number(d2Ary[1]);
            var year2 = Number(d2Ary[0]);

            if (year1 > year2) {
                notValid += 1;
            }
            else if (year1 == year2) {
                if (month1 == month2) {
                    if (day1 > day2) {
                        notValid += 1;
                    }
                }
                else if (month1 > month2) {
                    notValid += 1;
                }
            }
        }
        else {
            notValid = 0;
        }
    }
    return ((notValid > 0) ? (false) : (true));
}
//#EndRegion

//isValidHijriDateFromServer
//#Region
function isValidHijriDateFromServer(obj) {
    var d = obj.value;
    obj.isValid = false;
    var url = get_abs_path();
    $.ajax(
        {
            type: "POST",
            url: url + "WebService/WebService_master.asmx/checkIfValidDate",
            data: "{date:'" + d + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (result) {
                var r = eval(result.d);
                if (r == 1)
                    obj.isValid = true;
            },
            error: function (error) {
                obj.isValid = false;
            }
        }
    );
}
//#EndRegion
//isValidHijriDateFromServer
//#Region
function compareTargetTimeWithCurrentTime(obj, type) {
    var t1Ary = obj.split(':');

    var HH = Number(t1Ary[0]);
    var MM = Number(t1Ary[1]);

    var ret = false;
    var url = get_abs_path();
    $.ajax(
        {
            type: "POST",
            url: url + "WebService/WebService_master.asmx/compareTargetTimeWithCurrentTime",
            data: "{hours:'" + HH + "',minutes:'" + MM + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (result) {
                var r = eval(result.d);
                if (r == 0 || (r == 1 && type == "maxTime") || (r == -1 && type == "minTime"))
                    ret = true;
            },
            error: function (error) {
                ret = false;
            }
        }
    );
    return ret;
}
//#EndRegion
//Private Time Functions
//#Region

//validateTime
//#Region
function validateTime(obj, fireValidation) {
    if (obj) {
        fireValidation = ((fireValidation) ? (fireValidation) : (0))
        var textBox = ((obj.textBox) ? (obj.textBox) : (null));
        var Text = ((textBox) ? (textBox.value.fTrim()) : (null));
        var spnA = ((obj.spn_A) ? (obj.spn_A) : ({ style: { color: '' } }));
        var spnE = ((obj.spn_E) ? (obj.spn_E) : ({ innerHTML: '' }));
        var isRequired = ((obj.isRequired != undefined && obj.isRequired != null) ? (obj.isRequired) : (true));
        var reqMsg = getMsg(obj.requiredMessage, 'برجاء أدخل الوقت');
        var invalidMsg = getMsg(obj.invalidMessage, 'الوقت غير صحيح');
        var maxTime = ((obj.maxTime != undefined && obj.maxTime != null) ? (((typeof (obj.maxTime) == 'function') ? (obj.maxTime()) : (obj.maxTime))) : ('23:59'));
        var minTime = ((obj.minTime != undefined && obj.minTime != null) ? (((typeof (obj.minTime) == 'function') ? (obj.minTime()) : (obj.minTime))) : ('00:00'));
        var rangMsg = getMsg(obj.rangeMessage, ('يجب ان يكون الوقت في الفترة ما بين ' + minTime + ' و ' + maxTime + ''));
        if (Text != null) {
            if (Text != '') {
                var notValid = 0;
                var exceededTime = 0;

                var tAry = Text.split(':');
                if (tAry[0].length > 2 || tAry[1].length > 2)
                    notValid += 1;
                else {
                    var Hour = Number(tAry[0]);
                    var Minutes = Number(tAry[1]);

                    if (Hour > 23) {
                        notValid += 1;
                    }
                    if (Minutes > 59) {
                        notValid += 1;
                    }
                }
                if (fireValidation) {
                    if ($.inArray(spnE, getClass.tooltip) > -1) {
                        addRemoveTooltip(textBox, spnA, spnE, false, "", isRequired);
                    } else {
                        spnA.style.color = 'Black';
                    }
                }
                if (notValid > 0) {
                    if (fireValidation) {
                        if ($.inArray(spnE, getClass.tooltip) > -1) {
                            addRemoveTooltip(textBox, spnA, spnE, true, invalidMsg, isRequired);
                        } else {
                            spnE.innerHTML = invalidMsg;
                        }
                    }
                    if (obj.onFail)
                        obj.onFail(obj);
                    return false;
                }
                else {
                    if (minTime == "timeNow") {
                        if (!compareTargetTimeWithCurrentTime(Text, "minTime")) {
                            exceededTime += 1;
                        }
                    }
                    else {
                        if (!compareTime(minTime, Text)) {
                            exceededTime += 1;
                        }
                    }
                    if (maxTime == "timeNow") {
                        if (!compareTargetTimeWithCurrentTime(Text, "maxTime")) {
                            exceededTime += 1;
                        }
                    }
                    else {
                        if (!compareTime(Text, maxTime)) {
                            exceededTime += 1;
                        }
                    }
                    if (exceededTime > 0) {
                        if (fireValidation) {
                            if ($.inArray(spnE, getClass.tooltip) > -1) {
                                addRemoveTooltip(textBox, spnA, spnE, true, rangMsg, isRequired);
                            } else {
                                spnE.innerHTML = rangMsg;
                            }
                        }
                        if (obj.onFail)
                            obj.onFail(obj);
                        return false;
                    }
                }
            }
            else {
                if (isRequired == true) {
                    if (fireValidation) {

                        if ($.inArray(spnE, getClass.tooltip) > -1) {
                            addRemoveTooltip(textBox, spnA, spnE, true, reqMsg, isRequired);
                        } else {
                            spnA.style.color = obj.Color;
                            spnE.innerHTML = reqMsg;
                        }
                    }
                    if (obj.onFail)
                        obj.onFail(obj);
                    return false;
                }
            }

            if ($.inArray(spnE, getClass.tooltip) > -1) {
                addRemoveTooltip(textBox, spnA, spnE, false, "", isRequired);
            } else {
                spnA.style.color = 'Black';
                spnE.innerHTML = '';
            }

            if (obj.onSuccess)
                obj.onSuccess(obj);
            return true;
        }
    }
    return obj;
}
//#EndRegion

//compareTime
//#Region
function compareTime(t1, t2) {
    var notValid = 0;

    var t1Ary = t1.split(':');
    var t2Ary = t2.split(':');

    var h1 = Number(t1Ary[0]);
    var m1 = Number(t1Ary[1]);

    var h2 = Number(t2Ary[0]);
    var m2 = Number(t2Ary[1]);


    if (h1 > h2) {
        notValid += 1;
    }
    else if (h1 == h2) {
        if (m1 > m2) {
            notValid += 1;
        }
    }

    return ((notValid > 0) ? (false) : (true));
}
//#EndRegion

//#EndRegion

//#EndRegion
//-----------------------------------------------------
//Validation Private Functions
//#Region

//Required
//#Region
function Required(Value, requiredFlag) {
    var r = false;
    if (isSomeThing(Value)) {
        if (isSomeThing(requiredFlag)) {
            r = ((Value == requiredFlag) ? (true) : (false));
        }
        else {
            r = ((Value.fTrim() != '') ? (true) : (false));
        }
    }
    return r;
}
//#EndRegion

//minLength
//#Region
function minLength(Value, minLength, isRequired) {

    var r = false;
    if (isSomeThing(Value)) {
        if (isSomeThing(minLength)) {
            if (isRequired) {
                if (Value.length >= minLength) {
                    r = true;
                }
            }
            else {
                if (Value.length > 0) {
                    if (Value.length >= minLength) {
                        r = true;
                    }
                }
                else {
                    r = true;
                }
            }
        }
    }
    return r;
}
//#EndRegion

//maxLength
//#Region
function maxLength(Value, maxLength, isRequired) {

    var r = false;
    if (isSomeThing(Value)) {
        if (isSomeThing(maxLength)) {
            if (isRequired) {
                if (Value.length <= maxLength) {
                    r = true;
                }
            }
            else {
                if (Value.length > 0) {
                    if (Value.length <= maxLength) {
                        r = true;
                    }
                }
                else {
                    r = true;
                }
            }
        }
    }
    return r;
}
//#EndRegion

//Pattern
//#Region
function Pattern(Value, Pattern) {
    var r = false;
    if (isSomeThing(Value)) {
        if (isSomeThing(Pattern)) {
            var Regx = new RegExp(Pattern);
            r = Regx.test(Value);
        }
    }
    return r;
}
//#EndRegion

//#EndRegion
//-----------------------------------------------------
//Validation Firing Functions
//#Region

//fRequired
//#Region
function fRequired(obj, fireValidation) {
    var r = false;
    fireValidation = ((fireValidation) ? (fireValidation) : (0));
    var condtion = false;
    if (obj.Element.type == "radio" || (obj.Element.type == "checkbox" && obj.Element.name)) {
        if (document.querySelector("input[name$='" + obj.Element.name + "']:checked") != null)
            condtion = true;
    }
    else {
        condtion = obj.Value.fTrim() != obj.requiredValue
    }
    if (condtion) {
        if ($.inArray(obj.spn_E, getClass.tooltip) > -1) {
            addRemoveTooltip(obj.Element, obj.spn_A, obj.spn_E, false, "", true);
        } else {
            obj.spn_A.style.color = 'Black';
            obj.spn_E.innerHTML = '';
        }
        if (obj.onSuccess)
            obj.onSuccess(obj)
        r = true;
    }
    else {
        if (fireValidation) {
            if ($.inArray(obj.spn_E, getClass.tooltip) > -1) {
                addRemoveTooltip(obj.Element, obj.spn_A, obj.spn_E, true, obj.Msg, true);
            } else {
                //obj.spn_A.innerHTML = "*";
                obj.spn_A.style.color = obj.Color;
                obj.spn_E.innerHTML = obj.Msg;
            }
        }
        if (obj.onFail)
            obj.onFail(obj)
        r = false;
    }
    return r;
}
//#EndRegion

//fMinLength
//#Region
function fMinLength(obj, fireValidation) {

    var r = false;
    fireValidation = ((fireValidation) ? (fireValidation) : (0));

    if (fireValidation)
        if (obj.spn_E != getClass.tooltip) { obj.spn_A.style.color = 'Black'; }

    if (minLength(obj.Value, obj.Length, obj.isRequired)) {
        if (fireValidation) {
            if ($.inArray(obj.spn_E, getClass.tooltip) > -1) {
                addRemoveTooltip(obj.Element, obj.spn_A, obj.spn_E, false, "", obj.isRequired);
            } else {
                obj.spn_E.innerHTML = '';
            }
        }
        if (obj.onSuccess)
            obj.onSuccess(obj);
        r = true;
    }
    else {
        if (fireValidation) {

            if ($.inArray(obj.spn_E, getClass.tooltip) > -1) {
                addRemoveTooltip(obj.Element, obj.spn_A, obj.spn_E, true, obj.Msg, obj.isRequired);
            } else {
                obj.spn_E.innerHTML = obj.Msg;
            }
        }
        if (obj.onFail)
            obj.onFail(obj);
        r = false;

    }
    return r;
}
//#EndRegion

//fMaxLength
//#Region
function fMaxLength(obj, fireValidation) {

    var r = false;
    fireValidation = ((fireValidation) ? (fireValidation) : (0));
    if (fireValidation)
        if (obj.spn_E != getClass.tooltip) obj.spn_A.style.color = 'Black';
    if (maxLength(obj.Value, obj.Length, obj.isRequired)) {
        if (fireValidation) {
            if ($.inArray(obj.spn_E, getClass.tooltip) > -1) {
                addRemoveTooltip(obj.Element, obj.spn_A, obj.spn_E, false, "", obj.isRequired);
            } else {
                obj.spn_A.style.color = 'Black';
                obj.spn_E.innerHTML = '';
            }
        }
        if (obj.onSuccess)
            obj.onSuccess(obj);

        r = true;
    }
    else {
        if (fireValidation) {
            if ($.inArray(obj.spn_E, getClass.tooltip) > -1) {
                addRemoveTooltip(obj.Element, obj.spn_A, obj.spn_E, true, obj.Msg, obj.isRequired);
            } else {
                // obj.spn_A.style.color = obj.Color;
                obj.spn_E.innerHTML = obj.Msg;
            }

        }


        if (obj.onFail)
            obj.onFail(obj);

        r = false;
    }
    return r;
}
//#EndRegion

//fPattern
//#Region
function fPattern(obj, fireValidation) {

    var r = true;
    fireValidation = ((fireValidation) ? (fireValidation) : (0));
    if (obj.Value != '') {
        switch (obj.Pattern) {
            case "MOBILE":
                r = vMobile(obj.Value);
                break;
            case "EMAIL":
                r = vEmail(obj.Value);
                break;
            case "NOTZERO":
                r = ((Number(obj.Value) != 0) ? (true) : (false));
                break;
            case "URL":
                r = vURL(obj.Value);
                break;
            default:
                r = new RegExp(obj.Pattern).test(obj.Value);
                break;
        }

        if (fireValidation)
            if (obj.spn_E != getClass.tooltip) obj.spn_A.style.color = 'Black';

        if (r) {
            if (fireValidation) {
                if ($.inArray(obj.spn_E, getClass.tooltip) > -1) {
                    addRemoveTooltip(obj.Element, obj.spn_A, obj.spn_E, false, "", obj.isRequired);
                } else {
                    obj.spn_A.style.color = 'Black';
                    obj.spn_E.innerHTML = '';
                }
            }

            if (obj.onSuccess)
                obj.onSuccess(obj);

        }
        else {
            if (fireValidation) {
                if ($.inArray(obj.spn_E, getClass.tooltip) > -1) {
                    addRemoveTooltip(obj.Element, obj.spn_A, obj.spn_E, true, obj.Msg, obj.isRequired);
                } else {
                    // obj.spn_A.style.color = obj.Color;
                    obj.spn_E.innerHTML = obj.Msg;
                }

            }
            //    obj.spn_E.innerHTML = obj.Msg;

            if (obj.onFail)
                obj.onFail(obj);

        }
    }
    else {
        if (obj.isRequired == false) {
            if (fireValidation) {
                if ($.inArray(obj.spn_E, getClass.tooltip) > -1) {
                    addRemoveTooltip(obj.Element, obj.spn_A, obj.spn_E, false, "", obj.isRequired);
                } else {
                    // obj.spn_A.style.color = 'Black';
                    obj.spn_E.innerHTML = '';
                }
            }
        }
    }
    return r;
}
//fFormat
//#Region
function fAllowInputChars(obj, fireValidation) {
    var r = true;
    var FormatCondition = ((obj.FormatCondition) ? (obj.FormatCondition()) : (true));
    if (FormatCondition) {
        fireValidation = ((fireValidation) ? (fireValidation) : (0));
        if (obj.Value != '') {
            switch (obj.InputTypeKey) {
                case "float":
                    r = !isNaN(obj.Value);
                    obj.Msg = obj.Msg ? obj.Msg : "عفوا الحقل يقبل ارقام فقط";
                    break;
                case "positiveFloat":
                    r = !isNaN(obj.Value) && obj.Value >= 0;
                    obj.Msg = obj.Msg ? obj.Msg : "عفوا الحقل يقبل ارقام موجبة فقط";
                    break;
                case "int":
                    r = !isNaN(obj.Value);
                    if (r)
                        r = !obj.Value.includes(".");
                    obj.Msg = obj.Msg ? obj.Msg : "عفوا الحقل يقبل ارقام صحيحه فقط";
                    break;
                case "positiveInt":
                    r = !isNaN(obj.Value) && obj.Value >= 0;
                    if (r)
                        r = !obj.Value.includes(".");
                    obj.Msg = obj.Msg ? obj.Msg : "عفوا الحقل يقبل ارقام صحيحه موجبة فقط";
                    break;
                case "positiveFloatWithout+":
                    r = !isNaN(obj.Value) && obj.Value >= 0
                    if (r)
                        r = !obj.Value.includes("+");
                    obj.Msg = obj.Msg ? obj.Msg : "عفوا الحقل يقبل ارقام موجبة فقط";
                    break;
                case "positiveFloatWithSpecial":
                    r = (!isNaN(obj.Value) && obj.Value >= 0) || ((obj.Value.includes("/") || obj.Value.includes("\\") || obj.Value.includes("-")));
                    if (r)
                        r = !obj.Value.includes("+");
                    obj.Msg = obj.Msg ? obj.Msg : "عفوا الحقل يقبل ارقام موجبة فقط";
                    break;
                case "string":
                    var specCharAry = ["%%","-", "/", "\\", "’", "‘", "،", "؟", "?", "=", "+", "!", "@", "#", "$", "%", "^", "&", "*", ")", "(", "_", ">", "<", "{", "}", "[", "]", "|", ":", ";", ".", "÷", "؛", '"', "،", ",", "~", "'", '×'];
                    var preventchars = specCharAry.filter(function (e) { return this.indexOf(e) < 0; }, obj.AllowedSpecialChars);
                    if (preventchars != null && preventchars.length > 0) {
                        for (var i = 0; i < preventchars.length; i++) {
                            if (obj.Value.indexOf((typeof (preventchars) == "string") ? preventchars.charAt(i) : preventchars[i]) != -1) {
                                r = false;
                                break;
                            }
                        }
                    }
                    if (!r) {
                        if (obj.AllowedSpecialChars && obj.AllowedSpecialChars.length > 0)
                            obj.Msg = obj.Msg ? obj.Msg : "عفوا الحقل يقبل حروف وارقام وعلامات خاصه (" + obj.AllowedSpecialChars.toString() + ") فقط";
                        else
                            obj.Msg = obj.Msg ? obj.Msg : "عفوا الحقل يقبل حروف وارقام";
                    }
                    break;
                case "charactersOnly":
                    var specCharAry = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "-", "/", "\\", "’", "‘", "،", "؟", "?", "=", "+", "!", "@", "#", "$", "%", "^", "&", "*", ")", "(", "_", ">", "<", "{", "}", "[", "]", "|", ":", ";", ".", "÷", "؛", '"', "،", ",", "~", "'", '×'];
                    var preventchars = specCharAry.filter(function (e) { return this.indexOf(e) < 0; }, obj.AllowedSpecialChars);
                    if (preventchars != null && preventchars.length > 0) {
                        for (var i = 0; i < preventchars.length; i++) {
                            if (obj.Value.indexOf((typeof (preventchars) == "string") ? preventchars.charAt(i) : preventchars[i]) != -1) {
                                r = false;
                                break;
                            }
                        }
                    }
                    if (!r) {
                        if (obj.AllowedSpecialChars && obj.AllowedSpecialChars.length > 0)
                            obj.Msg = obj.Msg ? obj.Msg : "عفوا الحقل يقبل حروف وعلامات خاصه (" + obj.AllowedSpecialChars.toString() + ") فقط";
                        else
                            obj.Msg = obj.Msg ? obj.Msg : "عفوا الحقل يقبل حروف فقط";
                    }
                    break;
                case "":
                    var allSpecialCharacters = ["<", ">", ";", "{", "}", "-", "/", "\\", "’", "‘", "،", "؟", "?", "=", "+", "!", "@", "#", "$", "%", "^", "&", "*", ")", "(", "_", "[", "]", "|", ":", ".", "÷", "؛", '"', "،", ",", "~", "'", '×'];
                    var allLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'ا', 'أ', 'إ', 'ء', 'آ', 'ب', 'پ', 'ت', 'ث', 'ج', 'چ', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ژ', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ک', 'گ', 'ل', 'م', 'ن', 'ؤ', 'و', 'ه', 'ة', 'ى', 'ي', 'ئ', ' '];
                    var numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩", "٠"];
                    var specCharAry = numbers.concat(allLetters, allSpecialCharacters)
                    var preventchars = specCharAry.filter(function (e) { return this.indexOf(e) < 0; }, obj.AllowedSpecialChars);
                    if (preventchars != null && preventchars.length > 0) {
                        for (var i = 0; i < preventchars.length; i++) {
                            if (obj.Value.indexOf((typeof (preventchars) == "string") ? preventchars.charAt(i) : preventchars[i]) != -1) {
                                r = false;
                                break;
                            }
                        }
                    }
                    if (!r) {
                        if (obj.AllowedSpecialChars && obj.AllowedSpecialChars.length > 0)
                            obj.Msg = obj.Msg ? obj.Msg : "عفوا الحقل يقبل حروف وعلامات خاصه (" + obj.AllowedSpecialChars.toString() + ") فقط";
                        else
                            obj.Msg = obj.Msg ? obj.Msg : "عفوا الحقل يقبل حروف فقط";
                    }

                    break;
            }

            if (fireValidation)
                if (obj.spn_E != getClass.tooltip) obj.spn_A.style.color = 'Black';

            if (r) {
                if (fireValidation) {
                    if ($.inArray(obj.spn_E, getClass.tooltip) > -1) {
                        addRemoveTooltip(obj.Element, obj.spn_A, obj.spn_E, false, "", obj.isRequired);
                    } else {
                        obj.spn_A.style.color = 'Black';
                        obj.spn_E.innerHTML = '';
                    }
                }
                if (obj.onSuccess)
                    obj.onSuccess(obj);

            }
            else {
                if (fireValidation) {
                    if ($.inArray(obj.spn_E, getClass.tooltip) > -1) {
                        addRemoveTooltip(obj.Element, obj.spn_A, obj.spn_E, true, obj.Msg, obj.isRequired);
                    } else {
                        obj.spn_E.innerHTML = obj.Msg;
                    }
                }
                if (obj.onFail)
                    obj.onFail(obj);

            }
        }
        else {
            if (obj.isRequired == false) {
                if (fireValidation) {
                    if ($.inArray(obj.spn_E, getClass.tooltip) > -1) {
                        addRemoveTooltip(obj.Element, obj.spn_A, obj.spn_E, false, "", obj.isRequired);
                    } else {
                        obj.spn_E.innerHTML = '';
                    }
                }
            }
        }
    }
    return r;
}
//#EndRegion

//fRangeNumber
//#Region
function fRangeNumber(obj, fireValidation) {
    var r = true;
    fireValidation = ((fireValidation) ? (fireValidation) : (0));
    if (obj) {
        var number = ((isSomeThing(obj.Value)) ? (((obj.Value.fTrim() != '') ? (Number(obj.Value)) : (null))) : (null));
        var maxNumber = ((isSomeThing(obj.maxNumber)) ? (((obj.maxNumber.constructor == Number) ? (Number(obj.maxNumber)) : (((obj.maxNumber.constructor == Function) ? (obj.maxNumber()) : (null))))) : (null));
        var minNumber = ((isSomeThing(obj.minNumber)) ? (((obj.minNumber.constructor == Number) ? (Number(obj.minNumber)) : (((obj.minNumber.constructor == Function) ? (obj.minNumber()) : (null))))) : (null));
        var compareMaxCondition = ((isSomeThing(obj.compareMaxCondition)) ? (obj.compareMaxCondition()) : (true));
        var compareMinCondition = ((isSomeThing(obj.compareMinCondition)) ? (obj.compareMinCondition()) : (true));
        var rangeMessage = ((isSomeThing(obj.Msg)) ? (((obj.Msg.constructor == String) ? (obj.Msg) : (((obj.Msg.constructor == Function) ? (obj.Msg()) : (''))))) : (''));

        if (number != null) {
            if (maxNumber != null) {
                if (compareMaxCondition) {
                    if (number > maxNumber) {
                        r = false;
                    }
                }
            }
            if (minNumber != null) {
                if (compareMinCondition) {
                    if (number < minNumber) {
                        r = false;
                    }
                }
            }
        }
        if (fireValidation)
            if (obj.spn_E != getClass.tooltip) obj.spn_A.style.color = 'Black';

        if (r) {
            if (obj.onSuccess)
                obj.onSuccess();
            if (fireValidation) {
                if ($.inArray(obj.spn_E, getClass.tooltip) > -1) {
                    addRemoveTooltip(obj.Element, obj.spn_A, obj.spn_E, false, "", obj.isRequired);
                } else {
                    // obj.spn_A.style.color = 'Black';
                    obj.spn_E.innerHTML = '';
                }
            }
        }
        else {
            if (fireValidation) {
                // obj.spn_E.innerHTML = rangeMessage;
                if ($.inArray(obj.spn_E, getClass.tooltip) > -1) {
                    addRemoveTooltip(obj.Element, obj.spn_A, obj.spn_E, true, rangeMessage, obj.isRequired);
                } else {
                    // obj.spn_A.style.color = obj.Color;
                    obj.spn_E.innerHTML = rangeMessage;
                }
            }
            if (obj.onFail)
                obj.onFail();
        }
    }
    return r;
}
//#EndRegion

//fVFunction
//#Region
function fVFunction(obj, fireValidation) {
    var r = true;
    fireValidation = ((fireValidation) ? (fireValidation) : (0));
    if (obj) {
        var vCondition = ((obj.vCondition) ? (obj.vCondition()) : (true));
        if (vCondition) {
            var Text = obj.Value;
            var vFunction = ((obj.vFunction) ? ((obj.vFunction.constructor == Function) ? (obj.vFunction) : (null)) : (null));
            if (vFunction) {

                if (fireValidation)
                    if (obj.spn_E != getClass.tooltip) obj.spn_A.style.color = 'Black';

                r = vFunction(Text, obj);

                if (r) {

                    if (typeof (r) == 'boolean') {
                        if (fireValidation) {
                            if ($.inArray(obj.spn_E, getClass.tooltip) > -1) {
                                addRemoveTooltip(obj.Element, obj.spn_A, obj.spn_E, false, "", (obj.isRequired || obj.isReqDate));
                            } else {
                                // obj.spn_A.style.color = 'Black';
                                obj.spn_E.innerHTML = '';
                            }
                        }

                        if (obj.onSuccess)
                            obj.onSuccess();
                    }
                    else {

                        if (obj.onFail)
                            obj.onFail();

                        if (fireValidation) {
                            if ($.inArray(obj.spn_E, getClass.tooltip) > -1) {
                                addRemoveTooltip(obj.Element, obj.spn_A, obj.spn_E, true, r, (obj.isRequired || obj.isReqDate));
                            } else {
                                obj.spn_E.innerHTML = r;
                            }

                            return false;
                        }
                    }
                }
                else {
                    if (fireValidation)

                        if (obj.onFail)
                            obj.onFail();
                    if ($.inArray(obj.spn_E, getClass.tooltip) > -1) {
                        addRemoveTooltip(obj.Element, obj.spn_A, obj.spn_E, true, obj.Msg, (obj.isRequired || obj.isReqDate));
                    } else {
                        obj.spn_E.innerHTML = obj.Msg;
                    }
                    r = (obj.Msg == "" || obj.Msg == null) ? true : r;
                    //  obj.spn_E.innerHTML = obj.Msg;
                }
            }
        }
    }
    return r;
}
//#EndRegion

//fHDate
//#Region
function fHDate(obj, fireValidation) {
    return validateHijriDate(obj, fireValidation);
}
//#EndRegion

//fHDate
//#Region
function fAnyDate(obj, fireValidation) {
    var dateVal = $.trim(obj.textBox.value);
    if (dateVal != "") {
        var dateAry = dateVal.split("/");
        var yearVal = Number((dateAry[2].length == 4) ? (dateAry[2]) : (dateAry[0]));
        const isGeorg = obj.isGeorg != null ? obj.isGeorg.constructor == Function ? obj.isGeorg() : obj.isGeorg : null;
        if ((obj.isGeorg == null && (yearVal <= $("input[id$='hdn_max_supo_Date_H']").val().split('/')[0])) || isGeorg == false) {
            return validateHijriDate(obj, fireValidation);
        } else {
            return validateGeoDate(obj, fireValidation);
        }
    }
    else if (obj.isRequired == true) {
        if (fireValidation) {
            var reqMsg = ((obj.requiredMessage != undefined && obj.requiredMessage != null) ? (obj.requiredMessage) : ('برجاء أدخل التاريخ'));
            if ($.inArray(obj.spn_E, getClass.tooltip) > -1) {
                addRemoveTooltip(obj.textBox, obj.spn_A, obj.spn_E, true, reqMsg, (obj.isReqDate));
            } else {
                obj.spn_A.style.color = obj.Color;
                obj.spn_E.innerHTML = reqMsg;
            }

        }
        if (obj.onFail)
            obj.onFail(obj);
        return false;
    }
}
//#EndRegion

//fTime
//#Region
function fTime(obj, fireValidation) {
    return validateTime(obj, fireValidation);
}
//#EndRegion

//fCheckExist
//#Region
function fCheckExist(obj, fireValidation) {
    var res = true;
    obj.spn_A.style.color = 'Black';
    var checkExistCondition = ((obj.checkExistCondition != undefined) ? (((obj.checkExistCondition.constructor == Function) ? (obj.checkExistCondition()) : (obj.checkExistCondition))) : (true));
    if (checkExistCondition) {
        $.ajax({
            type: "POST",
            url: obj.Url,
            data: obj.Data(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function (result) {
                var r = eval(result);
                if (r.d == obj.successValue) {
                    res = true;
                    //  obj.spn_E.innerHTML = '';
                    if ($.inArray(obj.spn_E, getClass.tooltip) > -1) {
                        addRemoveTooltip(obj.Element, obj.spn_A, obj.spn_E, false, "", (obj.isRequired || obj.isReqDate));
                    } else {
                        // obj.spn_A.style.color = 'Black';
                        obj.spn_E.innerHTML = '';
                    }
                    if (obj.onSuccess)
                        obj.onSuccess(r.d);
                }
                else {
                    res = false;
                    var failResult = null;

                    if (obj.onFail)
                        failResult = obj.onFail(r.d);

                    if (fireValidation)

                        if ($.inArray(obj.spn_E, getClass.tooltip) > -1) {
                            addRemoveTooltip(obj.Element, obj.spn_A, obj.spn_E, true, ((typeof (obj.Msg) == 'function') ? (obj.Msg(failResult)) : (obj.Msg)), (obj.isRequired || obj.isReqDate));
                        } else {
                            // obj.spn_A.style.color = obj.Color;
                            obj.spn_E.innerHTML = ((typeof (obj.Msg) == 'function') ? (obj.Msg(failResult)) : (obj.Msg));
                        }
                }
            },
            error: function (result) {
                if (obj.onError)
                    obj.onError(result);
            }
        });
    }
    return res;
}
//#EndRegion

//fBindIfExist
//#Region
function fBindIfExist(obj, fireValidation) {

    var bindIfExistCondition = ((isSomeThing(obj.bindIfExistCondition)) ? (obj.bindIfExistCondition(obj, fireValidation)) : (true));
    var res = bindIfExistCondition;
    var Disabled = ((mCheck.isBoolean(obj.Disabled)) ? (obj.Disabled) : (((mCheck.isFunc(obj.Disabled)) ? (obj.Disabled()) : (false))));
    if (Disabled == false) {
        if (bindIfExistCondition == true) {
            if ($.inArray(obj.spn_E, getClass.tooltip) < 0) {
                obj.spn_A.style.color = 'Black';
                obj.spn_L.style.display = 'inline-block';
            } else {
                addRemoveTooltip(obj.Element, obj.spn_A, obj.spn_E, false, "", (obj.isRequired || obj.isReqDate));
            }
            $.ajax({
                type: "POST",
                url: ((typeof (obj.Url) == 'function') ? (obj.Url()) : (obj.Url)),
                data: obj.Data(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
                cache: false,
                success: function (result) {
                    obj.spn_L.style.display = 'none';
                    var r = eval(result);
                    if (((typeof (obj.failValue) == 'string') ? (r.d == obj.failValue) : (obj.failValue.Contains(r.d)))) {
                        res = false;
                        if ($.inArray(obj.spn_E, getClass.tooltip) < 0) {
                            obj.spn_E.innerHTML = ((typeof (obj.failValue) == 'string') ? (((typeof (obj.Msg) == 'function') ? (obj.Msg()) : (obj.Msg))) : (obj.Msg[r.d]));
                            obj.spn_E.style.display = 'inline-block';
                        }
                        else {
                            addRemoveTooltip(obj.Element, obj.spn_A, obj.spn_E, true, ((typeof (obj.failValue) == 'string') ? (((typeof (obj.Msg) == 'function') ? (obj.Msg()) : (obj.Msg))) : (obj.Msg[r.d])), (obj.isRequired || obj.isReqDate));
                        }
                        if (obj.onFail)
                            obj.onFail(r.d);
                    }
                    else {
                        res = true;
                        if ($.inArray(obj.spn_E, getClass.tooltip) > -1) {
                            addRemoveTooltip(obj.Element, obj.spn_A, obj.spn_E, false, "", (obj.isRequired || obj.isReqDate));
                        } else {
                            // obj.spn_A.style.color = 'Black';
                            obj.spn_E.innerHTML = '';
                        }

                        obj.onSuccess(r.d);
                    }
                },
                error: function (req) {
                    obj.spn_L.style.display = 'none';
                    if (obj.onError) {
                        obj.onError(req);
                    }
                }

            });
        }
        else {
            return true;
        }
    }
    else {
        return true;
    }
    return res;
}
//#EndRegion

//fCompare
function fCompare(obj, fireValidation) {

}
//#EndRegion
//-----------------------------------------------------
//Validating
//#Region

//Validate
//#Region
function Validate(obj, fireValidation) {
    obj = getVObj(obj);
    var r = true;
    if (obj.Disabled == false) {
        var validateCondition = ((obj.validateCondition) ? (obj.validateCondition()) : (true))
        if (validateCondition) {
            var haveValidationScheme = obj.haveValidationScheme
            var isRequired = obj.isRequired;
            var isLength = obj.isLength;
            var isMinLength = obj.isMinLength;
            var isMaxLength = obj.isMaxLength;
            var isPattern = obj.isPattern;
            var isDate = obj.isDate;
            var isAnyDate = obj.isAnyDate;
            var isTime = obj.isTime;
            var isRangeNumber = obj.isRangeNumber;
            var isvFunction = obj.isVFunction;
            var isCheckExist = obj.isCheckExist;
            var isBindIfExist = obj.isBindIfExist
            var isFormat = obj.isFormat;
            if (haveValidationScheme) {
                if (isRequired) {
                    if ($.inArray(obj.spn_E, getClass.tooltip) > -1) {
                        addRemoveTooltip(obj.Element, obj.spn_A, obj.spn_E, false, "", (isRequired || obj.isReqDate));
                    }
                    r = fRequired({
                        Element: obj.Element,
                        Value: getValue(obj.Element),
                        requiredValue: ((obj.validationScheme.Required.Value) ? (obj.validationScheme.Required.Value) : ('')),
                        Msg: getMsg(obj.validationScheme.Required.Msg),
                        spn_A: obj.spn_A,
                        spn_E: obj.spn_E,
                        onSuccess: ((obj.validationScheme.Required.onSuccess) ? (obj.validationScheme.Required.onSuccess) : (null)),
                        onFail: ((obj.validationScheme.Required.onFail) ? (obj.validationScheme.Required.onFail) : (null)),
                        Color: obj.Color
                    }, fireValidation);
                    if (r == false) {
                        return r;
                    }
                } else {
                    if ($.inArray(obj.spn_E, getClass.tooltip) > -1) {
                        addRemoveTooltip(obj.Element, obj.spn_A, obj.spn_E, false, "", isRequired);
                    }
                    else {
                        obj.spn_E.innerHTML = '';
                    }
                }
                if (isMinLength) {
                    r = fMinLength({
                        Element: obj.Element,
                        Value: getValue(obj.Element),
                        Length: obj.validationScheme.Length.minLength.Value,
                        Msg: getMsg(obj.validationScheme.Length.minLength.Msg),
                        spn_A: obj.spn_A,
                        spn_E: obj.spn_E,
                        isRequired: isRequired,
                        onSuccess: ((obj.validationScheme.Length.minLength.onSuccess) ? (obj.validationScheme.Length.minLength.onSuccess) : (null)),
                        onFail: ((obj.validationScheme.Length.minLength.onFail) ? (obj.validationScheme.Length.minLength.onFail) : (null)),
                        Color: obj.Color
                    }, fireValidation);

                    if (r == false) {
                        return r;
                    }
                }
                if (isMaxLength) {
                    r = fMaxLength({
                        Element: obj.Element,
                        Value: getValue(obj.Element),
                        Length: obj.validationScheme.Length.maxLength.Value,
                        Msg: getMsg(obj.validationScheme.Length.maxLength.Msg),
                        spn_A: obj.spn_A,
                        spn_E: obj.spn_E,
                        isRequired: isRequired,
                        onSuccess: ((obj.validationScheme.Length.maxLength.onSuccess) ? (obj.validationScheme.Length.maxLength.onSuccess) : (null)),
                        onFail: ((obj.validationScheme.Length.maxLength.onFail) ? (obj.validationScheme.Length.maxLength.onFail) : (null)),
                        Color: obj.Color
                    }, fireValidation);

                    if (r == false) {
                        return r;
                    }
                }
                if (isPattern) {
                    r = fPattern({
                        Element: obj.Element,
                        Value: getValue(obj.Element),
                        Pattern: obj.validationScheme.Pattern.Value,
                        Msg: getMsg(obj.validationScheme.Pattern.Msg),
                        spn_A: obj.spn_A,
                        spn_E: obj.spn_E,
                        isRequired: isRequired,
                        onSuccess: ((obj.validationScheme.Pattern.onSuccess) ? (obj.validationScheme.Pattern.onSuccess) : (null)),
                        onFail: ((obj.validationScheme.Pattern.onFail) ? (obj.validationScheme.Pattern.onFail) : (null)),
                        Color: obj.Color
                    }, fireValidation);

                    if (r == false) {
                        return r;
                    }
                }
                if (isFormat) {
                    r = fAllowInputChars({
                        Element: obj.Element,
                        Value: getValue(obj.Element),
                        Msg: (typeof (obj.validationScheme.Format.Msg) == "undefined") ? (null) : ((obj.validationScheme.Format.Msg.constructor == Function) ? obj.validationScheme.Format.Msg() : obj.validationScheme.Format.Msg),
                        FormatCondition: ((obj.validationScheme.Format.FormatCondition) ? (obj.validationScheme.Format.FormatCondition) : (null)),
                        AllowedSpecialChars: (typeof (obj.validationScheme.Format.AllowedSpecialChars) == "undefined") ? ([]) : ((obj.validationScheme.Format.AllowedSpecialChars.constructor == Function) ? obj.validationScheme.Format.AllowedSpecialChars() : obj.validationScheme.Format.AllowedSpecialChars),
                        InputTypeKey: (typeof (obj.validationScheme.Format.Key) == "undefined") ? (null) : ((obj.validationScheme.Format.Key.constructor == Function) ? obj.validationScheme.Format.Key() : obj.validationScheme.Format.Key),
                        spn_A: obj.spn_A,
                        spn_E: obj.spn_E,
                        onSuccess: ((obj.validationScheme.Format.onSuccess) ? (obj.validationScheme.Format.onSuccess) : (null)),
                        onFail: ((obj.validationScheme.Format.onFail) ? (obj.validationScheme.Format.onFail) : (null)),
                        isRequired: isRequired,
                        Color: obj.Color

                    }, fireValidation);
                    if (r == false) {
                        return r;
                    }
                }

                if (isRangeNumber) {
                    r = fRangeNumber({
                        Element: obj.Element,
                        Value: getValue(obj.Element),
                        maxNumber: obj.validationScheme.rangeNumber.maxNumber,
                        minNumber: obj.validationScheme.rangeNumber.minNumber,
                        compareMaxCondition: obj.validationScheme.rangeNumber.compareMaxCondition,
                        compareMinCondition: obj.validationScheme.rangeNumber.compareMinCondition,
                        Msg: getMsg(obj.validationScheme.rangeNumber.Msg),
                        spn_A: obj.spn_A,
                        spn_E: obj.spn_E,
                        isRequired: isRequired,
                        onSuccess: ((obj.validationScheme.rangeNumber.onSuccess) ? (obj.validationScheme.rangeNumber.onSuccess) : (null)),
                        onFail: ((obj.validationScheme.rangeNumber.onFail) ? (obj.validationScheme.rangeNumber.onFail) : (null)),
                        Color: obj.Color
                    }, fireValidation);
                    if (r == false) {
                        return r;
                    }
                }
                if (isDate) {
                    var dateObj = obj.validationScheme.Date;
                    dateObj.textBox = obj.Element;
                    dateObj.spn_A = obj.spn_A;
                    dateObj.spn_E = obj.spn_E;
                    dateObj.onSuccess = ((obj.validationScheme.Date.onSuccess) ? (obj.validationScheme.Date.onSuccess) : (null));
                    dateObj.onFail = ((obj.validationScheme.Date.onFail) ? (obj.validationScheme.Date.onFail) : (null));
                    dateObj.Color = obj.Color;
                    r = fHDate(dateObj, fireValidation);
                    if (r == false) {
                        return r;
                    }
                }
                if (isAnyDate) {
                    var dateObj = obj.validationScheme.anyDate;
                    dateObj.textBox = obj.Element;
                    dateObj.spn_A = obj.spn_A;
                    dateObj.spn_E = obj.spn_E;
                    dateObj.onSuccess = ((obj.validationScheme.anyDate.onSuccess) ? (obj.validationScheme.anyDate.onSuccess) : (null));
                    dateObj.onFail = ((obj.validationScheme.anyDate.onFail) ? (obj.validationScheme.anyDate.onFail) : (null));
                    dateObj.Color = obj.Color;
                    dateObj.isGeorg = (typeof (obj.validationScheme.anyDate.isGeorg) == "undefined" || obj.validationScheme.anyDate.isGeorg == null) ? null : obj.validationScheme.anyDate.isGeorg;
                    r = fAnyDate(dateObj, fireValidation);
                    if (r == false) {
                        return r;
                    }
                }
                if (isTime) {
                    var timeObj = obj.validationScheme.Time;
                    timeObj.textBox = obj.Element;
                    timeObj.spn_A = obj.spn_A;
                    timeObj.spn_E = obj.spn_E;
                    timeObj.onSuccess = ((obj.validationScheme.Time.onSuccess) ? (obj.validationScheme.Time.onSuccess) : (null));
                    timeObj.onFail = ((obj.validationScheme.Time.onFail) ? (obj.validationScheme.Time.onFail) : (null));
                    timeObj.Color = obj.Color;
                    r = fTime(timeObj, fireValidation);
                    if (r == false) {
                        return r;
                    }
                }

                if (isCheckExist) {
                    r = fCheckExist({
                        Element: obj.Element,
                        Value: getValue(obj.Element),
                        checkExistCondition: obj.validationScheme.checkExist.checkExistCondition,
                        Url: obj.validationScheme.checkExist.Url,
                        isRequired: isRequired,
                        Data: obj.validationScheme.checkExist.Data,
                        successValue: obj.validationScheme.checkExist.successValue,
                        onSuccess: obj.validationScheme.checkExist.onSuccess,
                        onFail: obj.validationScheme.checkExist.onFail,
                        onError: obj.validationScheme.checkExist.onError,
                        Msg: obj.validationScheme.checkExist.Msg,
                        spn_A: obj.spn_A,
                        spn_E: obj.spn_E,
                        Color: obj.Color
                    }, fireValidation);
                    if (r == false) {
                        return r;
                    }
                }

                if (isBindIfExist) {
                    r = fBindIfExist({
                        Element: obj.Element,
                        Value: getValue(obj.Element),
                        Url: obj.validationScheme.bindIfExist.Url,
                        Data: obj.validationScheme.bindIfExist.Data,
                        failValue: obj.validationScheme.bindIfExist.failValue,
                        Msg: obj.validationScheme.bindIfExist.Msg,
                        isRequired: isRequired,
                        bindIfExistCondition: obj.validationScheme.bindIfExist.bindIfExistCondition,
                        onSuccess: obj.validationScheme.bindIfExist.onSuccess,
                        onFail: obj.validationScheme.bindIfExist.onFail,
                        onError: obj.validationScheme.bindIfExist.onError,
                        Disabled: obj.validationScheme.bindIfExist.Disabled,
                        spn_A: obj.spn_A,
                        spn_E: obj.spn_E,
                        spn_L: obj.spn_L,
                        Color: obj.Color
                    });
                    if (r == false) {
                        return r;
                    }
                }

                if (isvFunction) {
                    r = fVFunction({
                        Element: obj.Element,
                        Value: getValue(obj.Element),
                        vFunction: ((obj.validationScheme.vFunction.Func) ? (obj.validationScheme.vFunction.Func) : (null)),
                        Msg: (typeof (obj.validationScheme.vFunction.Msg) == "undefined") ? (null) : ((obj.validationScheme.vFunction.Msg.constructor == Function) ? obj.validationScheme.vFunction.Msg() : obj.validationScheme.vFunction.Msg),
                        vCondition: ((obj.validationScheme.vFunction.vCondition) ? (obj.validationScheme.vFunction.vCondition) : (null)),
                        isRequired: isRequired,
                        spn_A: obj.spn_A,
                        spn_E: obj.spn_E,
                        onSuccess: ((obj.validationScheme.vFunction.onSuccess) ? (obj.validationScheme.vFunction.onSuccess) : (null)),
                        onFail: ((obj.validationScheme.vFunction.onFail) ? (obj.validationScheme.vFunction.onFail) : (null)),
                        Color: obj.Color

                    }, fireValidation);
                    if (r == false) {
                        return r;
                    }
                }

            }
        }
    }

    if (obj.validationScheme.onSuccess)
        obj.validationScheme.onSuccess();

    return r;
}
//#EndRegion

//validateAll
//#Region
function validateAll(ary, fireValidation) {
    var notValid = 0;
    var focusElement = "";
    if (ary) {
        for (var i = 0; i < ary.length; i++) {
            if (ary[i]) {
                if (Validate(ary[i], fireValidation) == false) {
                    notValid += 1;
                    var e = document.getElementById(ary[i].Element);
                    if (e != null) {
                        if ((notValid == 1 && e.disabled == false) || (focusElement == "" && e.disabled == false))
                            focusElement = ary[i].Element;
                    }
                }
            }
        }
    }
    if (notValid > 0 && focusElement != "")
        document.getElementById(focusElement).focus();

    return ((notValid > 0) ? (false) : (true));
}
//#EndRegion

//clearValidation
//#Region
function clearValidation(obj) {
    var objAry = ((obj) ? (((obj.constructor == Array) ? (obj) : ([obj]))) : (null));
    if (objAry) {
        for (var i = 0; i < objAry.length; i++) {
            var objt = getVObj(objAry[i]);
            var req = (objt.isReqDate || objt.isRequired) ? ((objt.Disabled) ? false : true) : false;
            if (!objt.Disabled) {
                if ($.inArray(objt.spn_E, getClass.tooltip) > -1) {
                    addRemoveTooltip(objt.Element, objt.spn_A, objt.spn_E, false, "", req);
                } else {
                    objt.spn_A.style.display = (req == true) ? ("") : ("none");
                    objt.spn_A.style.color = 'Black';
                    objt.spn_E.innerHTML = '';
                    objt.spn_L.style.display = 'none';
                }
            }

        }
    }
}
//#EndRegion


//#EndRegion
//-----------------------------------------------------
//validateOnPress
//#Region
function validateOnEnter(e, vObj, fireValidation, Func) {
    var evt = ((window.event) ? (event) : (e));
    var cCode = charCode(evt);
    if (cCode.Key == 13) {
        Validate(vObj, fireValidation);
        return false;
    }
    return ((isSomeThing(Func)) ? (((Func.constructor == Function) ? (Func(evt)) : (true))) : (true))
}
//#EndRegion
//-----------------------------------------------------
//restoreValidation
//#Region
function restoreValidation(vAry) {
    var hdfld_ValidationRestorePoint = mScript.getByIds('div_ValidationRestorePoint').getByTypes('hidden');
    if (mCheck.isAry(vAry)) {
        if (hdfld_ValidationRestorePoint) {
            if (hdfld_ValidationRestorePoint.Val() != '') {
                var rAry = eval('(' + hdfld_ValidationRestorePoint.Val() + ')');
                for (var i = 0; i < rAry.length; i++) {
                    var obj = rAry[i];
                    if (obj.spn_A)
                        mScript.getByIds(obj.spn_A).Style('color', obj.spn_A_Color);
                    if (obj.spn_E)
                        mScript.getByIds(obj.spn_E).Html(obj.spn_E_Html);
                }
                hdfld_ValidationRestorePoint.Val('');
            }
            else {
                var rAry = [];
                for (var i = 0; i < vAry.length; i++) {
                    var obj = vAry[i];
                    var rObj = {};
                    if (obj.spn_A) {
                        rObj.spn_A = obj.spn_A
                        rObj.spn_A_Color = mScript.getByIds(obj.spn_A).Style('color');
                    }
                    if (obj.spn_E) {
                        rObj.spn_E = obj.spn_E
                        rObj.spn_E_Html = mScript.getByIds(obj.spn_E).Html()
                    }
                    rAry[rAry.length] = rObj;
                }
                hdfld_ValidationRestorePoint.Val(mProto.Array(rAry).Stringfy());
            }
        }
    }
};
//#EndRegion


/* This Function to Append Validate() function to controls that have Validations based On setting prop [isBlur,isChange,otherEvent]
isBlur : Bolean
isChange : Bolean    
otherEvent : string may contain for example 'focus' or 'mouseleave' or 'mousemove' ,....etc
It Take one Arg [objAry]: Validation object Array

must add ( AddValidationEvents(validationArray)in document ready)
*/

function AddValidationEvents(objAry, blurFunction = null) {
    if (objAry) {
        var len = objAry.length;
        for (var i = 0; i < len; i++) {
            var objt = objAry[i];
            if (objt && !objt.Disabled) {
                if (isSomeThing(objt.Element)) {
                    objt.callBackFunction = blurFunction && typeof blurFunction === 'function' ? blurFunction : null;
                    if (isSomeThing(objt.isBlur) && objt.isBlur == true) {
                        document.getElementById(objt.Element).addEventListener("blur", (function (index) {
                            return function () {
                                Validate.call(this, objAry[index], 1);
                                if (objAry[index].callBackFunction != null ) {
                                    objAry[index].callBackFunction.call(this, objAry[index]);
                                }
                            };
                        })(i));
                    }
                    if (isSomeThing(objt.isChange) && objt.isChange == true) {
                        //$("#" + objt.Element).click(Validate.bind(this, objAry[i], 1));//Work Also
                        document.getElementById(objt.Element).addEventListener("change", Validate.bind(this, objAry[i], 1));
                    }
                    if (isSomeThing(objt.otherEvent) && objt.otherEvent != '') {
                        document.getElementById(objt.Element).addEventListener(objt.otherEvent, Validate.bind(this, objAry[i], 1));
                    }
                }
            }
        }
    }
}

function validateById(IDs, validationAry, fireValidation) {
    var IDsAry = (IDs ? (Array.isArray(IDs) ? IDs : [IDs]) : null);
    var length = IDsAry ? IDsAry.length : 0;
    var notValid = 0;
    if (validationAry && IDsAry) {
        for (var j = 0; j < length; j++) {
            for (var i = 0; i < validationAry.length; i++) {
                if (validationAry[i].Element == IDsAry[j]) {
                    if (!Validate(validationAry[i], fireValidation)) {
                        notValid++;
                        break;
                    }
                }
            }
        }
    }
    return (notValid > 0 ? false : true);
}

function clearValidationById(IDs, validationAry) {
    var IDsAry = (IDs ? (Array.isArray(IDs) ? IDs : [IDs]) : null);
    var length = IDsAry ? IDsAry.length : 0;
    var notValid = 0;
    if (validationAry && IDsAry) {
        for (var j = 0; j < length; j++) {
            for (var i = 0; i < validationAry.length; i++) {
                if (validationAry[i].Element == IDsAry[j]) {
                    clearValidation(validationAry[i]);
                    break;
                }
            }
        }
    }
}

function disableValidationById(IDs, validationAry, disabled) {
    var IDsAry = (IDs ? (Array.isArray(IDs) ? IDs : [IDs]) : null);
    var length = IDsAry ? IDsAry.length : 0;
    if (validationAry && IDsAry) {
        for (var j = 0; j < length; j++) {
            for (var i = 0; i < validationAry.length; i++) {
                if (validationAry[i].Element == IDsAry[j]) {
                    validationAry[i].Disabled = disabled;
                }
            }
        }
    }
}
function reverse_date_str(date_str) {
    if ($.trim(date_str) != "") {
        var date_arr = date_str.split('/');
        if (date_arr.length == 3) {
            if ((date_arr[2]).length == 4) {
                date_str = date_arr[2] + "/" + date_arr[1] + "/" + date_arr[0];
            } else {
                date_str = date_arr[0] + "/" + date_arr[1] + "/" + date_arr[2];
            }
        }
    }
    return date_str;
}

