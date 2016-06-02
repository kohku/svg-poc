(function($){
    $.fn.validationEngineLanguage = function(){
    };
    $.validationEngineLanguage = {
        newLang: function(){
            $.validationEngineLanguage.allRules = {
                "required": { // Add your regex rules here, you can take telephone as an example
                    "regex": "none",
                    "alertText": "* This field is required",
                    "alertTextCheckboxMultiple": "* Please select an option",
                    "alertTextCheckboxe": "* This checkbox is required",
                    "alertTextDateRange": "* Both date range fields are required"
                },
                "requiredInFunction": { 
                    "func": function(field, rules, i, options){
                        return (field.val() == "test") ? true : false;
                    },
                    "alertText": "* Field must equal test"
                },
                "dateRange": {
                    "regex": "none",
                    "alertText": "* Invalid ",
                    "alertText2": "Date Range"
                },
                "dateTimeRange": {
                    "regex": "none",
                    "alertText": "* Invalid ",
                    "alertText2": "Date Time Range"
                },
                "minSize": {
                    "regex": "none",
                    "alertText": "* Minimum ",
                    "alertText2": " characters allowed"
                },
                "maxSize": {
                    "regex": "none",
                    "alertText": "* Maximum ",
                    "alertText2": " characters allowed"
                },
				"groupRequired": {
                    "regex": "none",
                    "alertText": "* V6 or V4 is required"
                },
                "min": {
                    "regex": "none",
                    "alertText": "* Minimum value is "
                },
                "max": {
                    "regex": "none",
                    "alertText": "* Maximum value is "
                },
                "past": {
                    "regex": "none",
                    "alertText": "* Date prior to "
                },
                "future": {
                    "regex": "none",
                    "alertText": "* Date past "
                },	
                "maxCheckbox": {
                    "regex": "none",
                    "alertText": "* Maximum ",
                    "alertText2": " options allowed"
                },
                "minCheckbox": {
                    "regex": "none",
                    "alertText": "* Please select atleast ",
                    "alertText2": " option(s)"
                },
                "equals": {
                    "regex": "none",
                    "alertText": "* Fields do not match"
                },
                "creditCard": {
                    "regex": "none",
                    "alertText": "* Invalid credit card number"
                },
                "phone": {
                    // credit: jquery.h5validate.js / orefalo
                    "regex": /^([\+][0-9]{1,3}[\ \.\-])?([\(]{1}[0-9]{2,6}[\)])?([0-9\ \.\-\/]{3,20})((x|ext|extension)[\ ]?[0-9]{1,4})?$/,
                    "alertText": "* Invalid phone number"
                },
                "telephone": {
                    "regex":  /^1?\s*\W?\s*([2-9][0-9]{2})\s*\W?\s*([0-9]{3})\s*\W?\s*([0-9]{4})(\se?x?t?(\d*))?$/,  
                    "alertText": "* Invalid telephone number"
                },
                "email": {
                    // HTML5 compatible email regex ( http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#    e-mail-state-%28type=email%29 )
                    "regex": /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                    "alertText": "* Invalid email address"
                },
                "integer": {
                    "regex": /^[\-\+]?\d+$/,
                    "alertText": "* Not a valid integer"
                },
                "number": {
                    // Number, including positive, negative, and floating decimal. credit: orefalo
                    "regex": /^[\-\+]?((([0-9]{1,3})([,][0-9]{3})*)|([0-9]+))?([\.]([0-9]+))?$/,
                    "alertText": "* Invalid floating decimal number"
                },
                "date": {                    
                    //	Check if date is valid by leap year
			"func": function (field) {
					var pattern = new RegExp(/^(\d{4})[\/\-\.](0?[1-9]|1[012])[\/\-\.](0?[1-9]|[12][0-9]|3[01])$/);
					var match = pattern.exec(field.val());
					if (match == null)
					   return false;
	
					var year = match[1];
					var month = match[2]*1;
					var day = match[3]*1;					
					var date = new Date(year, month - 1, day); // because months starts from 0.
	
					return (date.getFullYear() == year && date.getMonth() == (month - 1) && date.getDate() == day);
				},                		
			 "alertText": "* Invalid date, must be in YYYY-MM-DD format"
                },
                "checktid": {                    
                    "func": function (field, rules, i, options) {
						var max = rules[i + 2].toUpperCase();
						var comparevalue = '';
						var len = 0;
						if(field[0] && field[0].value){
							comparevalue = field[0].value.toUpperCase();
							len =max.length;
						}	
						if (max && max != undefined)
						{
							len =max.length;
						}
						if (max == comparevalue.substring(0,len))
						{
							return true;
						}
						return false;
					},                		
					"alertText": "* Invalid TID, TID should start with CLLI"
                }, 
                "checkstring": {
                	"func": function (field, rules, i, options){
                		var value = field.val();
                		var test_str1 = value.substr(0,2);
                		var test_str2 = value.substr(2,6); 
                		if ((isNaN(test_str1)) && (!isNaN(test_str2))){
                			return true;
                		}
                		return false;
                	},
                	"alertText": "* Format should be 2 chars followed by 6 digits"
                },
                "checkNumber": {
                	"func": function (field, rules, i, options){
                		var value = field.val();
                		if (value == 3){
                			return true;
                		}
                		return false;
                	},
                	"alertText": "* Field should contain 3 digits"
                },
                "checkformat": {
                	"func": function (field, rules, i, options){
                		var value = field.val();
                		if (value == 8){
                			return true;
                		}
                		return false;
                	},
                	"alertText": "* Field should contain 8 alphanumeric chars"
                },
                "checkField": {
                	"func": function (field, rules, i, options){
                		var value = field.val();
                		var test_str1 = value.substr(0,2);
                		var test_str2 = value.substr(2,1);
                		var test_str3 = value.substr(3,1);
                		var test_str4 = value.substr(4,1);
                		if ((isNaN(test_str1)) && (test_str2 == 0) && (test_str3 == 0) && (test_str4 == 0)){
                			return true;
                		}
                		return false;
                	},
                	"alertText": "* Format should be 2 chars followed by 3 zeros"
                },
                "validField": {
                	"func": function (field, rules, i, options){
                		var value = field.val();
                		if (value == 5){
                			return true;
                		}
                		return false;
                	},
                	"alertText": "* Field should contain 5 alphanumeric chars"
                },
                "checkdecimal": {
                	"func": function (field, rules, i, options){
                		var value = field.val();
                		var str1 = value.substr(0,3);
                		var str2 = value.substr(4,2);
                		if ((!isNaN(str1)) && (!isNaN(str2)) && (value.indexOf(".")==3)){
                			return true;
                		}
                		return false;
                	},
                	"alertText": "* Invalid decimal. Format should be XXX.XX"
                },
                "checklength": {
                	"func": function (field, rules, i, options){
                		var value = field.val();
                		if (value == 6){
                			return true;
                		}
                		return false;
                	},
                	"alertText": "* Invalid decimal. Format should be XXX.XX"
                },
                "groupCcrTeo": {
                    "regex": "none",
                    "alertText": "* Either CCR or TEO is required"
                },
                "ipv4": {
                    "regex": /^((([01]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))[.]){3}(([0-1]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))$/,
                    "alertText": "* Invalid IP address"
                },
                "url": {
                    "regex": /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
                    "alertText": "* Invalid URL"
                },
                "alphanum":{
                    "regex": /^[0-9a-zA-Z]+$/,
                    "alertText": "* Letters and Numbers only"
                },				
				"alphanumWithOneDash":{
                   "regex" : /^([0-9a-zA-Z]+)(-([0-9a-zA-Z]+)|([0-9a-zA-Z]+)+)?$/,
                    "alertText": "* Letters, Numbers and Only one Dash followed by alphanumeric character. eg: ABC12345 OR ABC-1234"
                },
				"alphanumWithDash":{                   
				   "regex" : /^([0-9a-zA-Z]+-?)+([0-9a-zA-Z]+)$/,
                    "alertText": "* Letters, Numbers and Dash followed by alphanumeric character. eg: ABC12345 OR ABC-12345-11"
                },
                "alphanumWithDot":{
                    "regex": /^[.0-9a-zA-Z]+$/,
                    "alertText": "* Letters, Numbers and Dots only"
                },
                "alphanumWithspl":{
                    "regex": /^([A-Za-z0-9]|[A-Za-z0-9][\s\@#$%&*+\-_(),+':;?.,!]*[A-Za-z0-9]*[\s\@#$%&*+\-_(),+':;?.,!]*[A-Za-z0-9][A-Za-z0-9]*)$/,
                    "alertText": "* Should Start and End with Letters or Numbers only"
                },
                
                "dateformat": {                    
          	"func": function (field) {
					var pattern = new RegExp(/^(0?[1-9]|1[012])[\/\/\.](0?[1-9]|[12][0-9]|3[01])[\/\/\.](\d{4})$/);
					var match = pattern.exec(field.val());
					
					if (match == null)
						{
						return false;}
					  
					var year = match[3];
					var month = match[1]*1;
					var day = match[2]*1;	
			
					var date = new Date( year,month - 1, day); // because months starts from 0.
					
					return (date.getMonth() == (month - 1) && date.getDate() == day && date.getFullYear() == year  );
				},                		
			 "alertText": "* Invalid date, must be in MM/DD/YYYY format"
                },
                "dateTime24HrFormat": {                    
          	"func": function (field) {
          		var result = true;
          				var val = field.val();
          			 	var dateFormat = /^([0]?[1-9]|[1][0-2])[/]([0]?[1-9]|[1|2][0-9]|[3][0|1])[/]([0-9]{4}|[0-9]{2})$/g;
						var timeFormat = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/;
						var list =[];
						if(val){
							list = val.split(" ");
						}
						if(list && list.length==1){
							return dateFormat.test(list[0]);								
						}else if(list && list.length==2){
							result = dateFormat.test(list[0]);
							if(result && list[1]){
								result =  timeFormat.test(list[1]);
							}
						}else if (list && list.length > 2){
							return false;
						}
						return result;
				},                		
			 "alertText": "* Invalid DateTime Format.\nExpected format MM/DD/YYYY HH:MM."
                },
                "dateTimeformat": {
	                "regex": /^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{4}\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1}$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^((1[012]|0?[1-9]){1}\/(0?[1-9]|[12][0-9]|3[01]){1}\/\d{2,4}\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1})$/,
                    "alertText": " * Invalid date, must be in MM-DD-YYYY hh:mm:ss AM|PMformat"
                    
	            },
		 "alpha":{
                    "regex": /^[a-zA-Z]+$/,
                    "alertText": "* Letters only"
                },
		"numeric": {
                    "regex": /^[0-9\ ]+$/,
                    "alertText": "* Numbers only"
                },
		"city":{
		   "regex":/^[a-zA-z] ?([a-zA-z]|[a-zA-z] )*[a-zA-z]$/,
                    "alertText": "* invalid city"
		},
		"startSlotBBCard":{
            "regex": /^[0-9][0-9a-zA-Z]*$/,
            "alertText": "Please enter a whole number only or whole number plus a letter."
        },
                "onlyNumberSp": {
                    "regex": /^[0-9\ ]+$/,
                    "alertText": "* Numbers only"
                },
                "onlyLetterSp": {
                    "regex": /^[a-zA-Z\ \']+$/,
                    "alertText": "* Letters only"
                },
                "onlyLetterNumber": {
                    "regex": /^[0-9a-zA-Z]+$/,
                    "alertText": "* No special characters allowed"
                },
                // --- CUSTOM RULES -- Those are specific to the demos, they can be removed or changed to your likings
                "ajaxUserCall": {
                    "url": "ajaxValidateFieldUser",
                    // you may want to pass extra data on the ajax call
                    "extraData": "name=eric",
                    "alertText": "* This user is already taken",
                    "alertTextLoad": "* Validating, please wait"
                },
				"ajaxUserCallPhp": {
                    "url": "phpajax/ajaxValidateFieldUser.php",
                    // you may want to pass extra data on the ajax call
                    "extraData": "name=eric",
                    // if you provide an "alertTextOk", it will show as a green prompt when the field validates
                    "alertTextOk": "* This username is available",
                    "alertText": "* This user is already taken",
                    "alertTextLoad": "* Validating, please wait"
                },
                "ajaxNameCall": {
                    // remote json service location
                    "url": "ajaxValidateFieldName",
                    // error
                    "alertText": "* This name is already taken",
                    // if you provide an "alertTextOk", it will show as a green prompt when the field validates
                    "alertTextOk": "* This name is available",
                    // speaks by itself
                    "alertTextLoad": "* Validating, please wait"
                },
				 "ajaxNameCallPhp": {
	                    // remote json service location
	                    "url": "phpajax/ajaxValidateFieldName.php",
	                    // error
	                    "alertText": "* This name is already taken",
	                    // speaks by itself
	                    "alertTextLoad": "* Validating, please wait"
	                },
                "validate2fields": {
                    "alertText": "* Please input HELLO"
                },
	            //tls warning:homegrown not fielded 
                "dateFormat":{
                    "regex": /^\d{4}[\/\/](0?[1-9]|1[012])[\/\/](0?[1-9]|[12][0-9]|3[01])$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(?:(?:0?[1-9]|1[0-2])(\/|-)(?:0?[1-9]|1\d|2[0-8]))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(0?2(\/|-)29)(\/|-)(?:(?:0[48]00|[13579][26]00|[2468][048]00)|(?:\d\d)?(?:0[48]|[2468][048]|[13579][26]))$/,
                    "alertText": "* Invalid Date"
                },
                //tls warning:homegrown not fielded 
				"dateTimeFormat": {
	                "regex": /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1}$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^((1[012]|0?[1-9]){1}\/(0?[1-9]|[12][0-9]|3[01]){1}\/\d{2,4}\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1})$/,
                    "alertText": "* Invalid Date or Date Format",
                    "alertText2": "Expected Format: ",
                    "alertText3": "mm/dd/yyyy hh:mm:ss AM|PM or ", 
                    "alertText4": "yyyy-mm-dd hh:mm:ss AM|PM"
	            },
                "ipv4ipv6": {
                    "regex": /^(((([1]?\d)?\d|2[0-4]\d|25[0-5])\.){3}(([1]?\d)?\d|2[0-4]\d|25[0-5]))|([\da-fA-F]{1,4}(\:[\da-fA-F]{1,4}){7})|(([\da-fA-F]{1,4}:){0,5}::([\da-fA-F]{1,4}:){0,5}[\da-fA-F]{1,4})$/,
                    "alertText": "* Invalid IP4/IP6 address"
                },
                "ipv4-Port": {
                    "regex": /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\:(\d{1,5})$/,
                    "alertText": "* Invalid IPv4:Port address.\n Expected Format: nnn.nnn.nnn.nnn:nnnnn"
                },
                 "ipv4-Port-maxVal": {
                    "regex": 	/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\:(\d{1,5})$/,
                    "alertText": "* Invalid IPv4:Port address.\n Maximum value for each IPv4 octet is 255."
                },
                 "ipv6-Port": {
                    "regex": /^\[s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*\]:(\d{1,5})$/,
                    "alertText": "* Invalid IPv6:Port address.\n Expected Format: [xxxx:xxxx:xxxx:xxxx:xxxx:\nxxxx:xxxx:xxxx]:nnnnn. \nEach IPv6 octet should contain valid Hexa chars[0-9A-Fa-f]."
                },
                "ipV4-maxVal": {
                 "regex": /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                 "alertText": "* Invalid IPv4 address.\n Maximum value for each IPv4 octet is 255."
             },
               "ipV4": {
                 "regex": /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/,
                 "alertText": "* Invalid IPv4 address.\n Expected Format: nnn.nnn.nnn.nnn"
             },
              "ipv6": {
                 "regex": /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,
                 "alertText": "* Invalid IPv6 address.\n Expected Format: xxxx:xxxx:xxxx:xxxx:\nxxxx:xxxx:xxxx:xxxx \nEach IPv6 octet should contain valid Hexa chars[0-9A-Fa-f]."
             },
             "macAddrs": {
                 "regex": /^([0-9a-fA-F]{1,2}:){5}([0-9a-fA-F]{1,2})$/,
                 "alertText": "* Invalid MAC address.\n Expected Format: xx:xx:xx:xx:xx:xx"
             },
             /*ipv4 subnet mask validation is handled in common code.js by funcCall[validateIpv4SubnetMask]*/
            /* "ipv4-subnetMask": {                    
				"func": function (field) {
					var val ="";
					if(field[0] && field[0].value){
						val = field[0].value;
					}	
					var octets =[];				
					if(val){
						octets = val.split('.');
					}
					if(octets && octets.length){
						if(octets[0]==255 ){
							if(octets[1]==255){
								if( octets[2] ==255){
										if(!(octets[3] ==255 || octets[3] ==254 || octets[3] ==252 || octets[3] ==248 || octets[3] ==240 || octets[3] ==224 || octets[3] ==192 || octets[3] ==128 || octets[3] ==0)){
											return false;
										}
								}else if ((octets[2] ==254 || octets[2] ==252 ||  octets[2] ==248 || octets[2] ==240 || octets[2] ==224 || octets[2] ==192 || octets[2] ==128 || octets[2] ==0)){
										if(octets[3]!=0 ){
											return false;
										}
								}								
							}else if((octets[1] ==254 || octets[1] ==252 ||  octets[1] ==248 || octets[1] ==240 || octets[1] ==224 || octets[1] ==192 || octets[1] ==128 || octets[1] ==0)){
										if(octets[2]!=0 || octets[3]!=0 ){
											return false;
										}
							}
						} else if((octets[0] ==254 || octets[0] ==252 ||  octets[0] ==248 || octets[0] ==240 || octets[0] ==224 || octets[0] ==192 || octets[0] ==128 || octets[0] ==0)){
										if(octets[1]!=0 || octets[2]!=0 || octets[3]!=0 ){
											return false;
										}
						}	
						return true;				
					}
					return true;
				},                		
			 	"alertText": "* Invalid IPv4 Subnet Mask."
                },*/
                "x25": {
                    "regex": /^[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$/,
                    "alertText": "* Invalid X25 address"
                },
                "portnum": {
                    //"regex":/(6553[0-5]|655[0-2][0-9]\d|65[0-4](\d){2}|6[0-4](\d){3}|[1-5](\d){4}|[1-9](\d){0,3})/,
                    "regex":/^0*(?:6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9])$/,
                    "alertText": "* Invalid Port number"
                },
                "telnet": {
                    //"regex":/^[1-9][0-9]*\.[0-9]+\.[0-9]+\.[0-9]+(?::[0-9]+)$/,
                	"regex":/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):(\d{1,5})$/,
                    "alertText": "* Invalid IP:PORT address"
                },
                "datakit": {
                    "regex":/^[A-Za-z][A-Za-z0-9/]{0,24}$/,
                    "alertText": "* Invalid Datakit address"
                }
            };
            
        }
    };

    $.validationEngineLanguage.newLang();
    
})(jQuery);
