var Page = (function($, window, undefined) {
    var o = {};

    //private functions
    function handleDialogSubmit(event,$btn_obj) {
        event.preventDefault();
        var params = [];
        params.push({
            name: "id",
            value: $('.tmp-app-id').val()
        });

        $('#dialog-form form').find('input, select').each(function(index, object) {
            var $obj = $(object);
            params.push({
                name: "name",
                value: $obj.attr("name")
            });
            params.push({
                name: "value",
                value: $obj.val()
            });
            params.push({
                name: "type",
                value: $obj.data('type')
            });
        });

        $.ajax({
            url: CONTEXT_PATH + "/uui/applications",
            type: "POST",
            data: params,
            success: function() {
                addAppCallback();
                if ($btn_obj.parents('.app-icon').data('app-single-instance')) {
                    $btn_obj.hide();
                }
            }
        });

        return false;
    }

    function addAppCallback(result, textStatus) {
        $("#dialog-form").dialog('close');
        $.pnotify({
            title: 'Success',
            text: "App '" + Page.temp_app_title + "' Added To Home Page",
            type: 'success',
            hide: true,
            styling: 'jqueryui'
        });
    }
    
    function addFavCallback(obj) {
    	obj.click(function() {
    		var app_id = $(this).parents(".app-icon").data('app-id');
    		var app_title = $(this).parents(".app-icon").attr('title');
    		
    		//hack, I know
    		Page.temp_app_title = app_title;
    		
    		var promise = $.ajax({
    			url: CONTEXT_PATH + "/uui/applications/addFav",
    			type: "POST",
    			data: { id: app_id }
    		});
    		
    		promise.done(function(result, textStatus) {
    			if (textStatus == 'success') {
    				$.pnotify({
    		    		title: 'Success',
    		    		text: "App '" + Page.temp_app_title + "' Added To Favorites",
    		    		type: 'success',
    		    		hide: true,
    		    		styling: 'jqueryui'
    		    	});
    				var newButton = $('<button class="removeFav" title="Remove from Favorites"><i class="icon icons-fav-press"></i></button>');
    				removeFavCallback(newButton);
    				obj.replaceWith(newButton);
    			} else {
    				$.pnotify({
    		    		title: 'Fail',
    		    		text: "Failed to Add '" + Page.temp_app_title + "' App To Favorites",
    		    		type: 'success',
    		    		hide: true,
    		    		styling: 'jqueryui'
    		    	});
    			}
    		});
    	});
    }
   
    function removeFavCallback(obj) {
    	obj.click(function() {
    		var app_id = $(this).parents(".app-icon").data('app-id');
    		var app_title = $(this).parents(".app-icon").attr('title');
    		
    		//hack, I know
    		Page.temp_app_title = app_title;
    		
    		var promise = $.ajax({
    			url: CONTEXT_PATH + "/uui/applications/removeFav",
    			type: "POST",
    			data: { id: app_id }
    		});
    		
    		promise.done(function(result, textStatus) {
    			if (textStatus == 'success') {
    				$.pnotify({
    		    		title: 'Success',
    		    		text: "App '" + Page.temp_app_title + "' Removed from Favorites",
    		    		type: 'success',
    		    		hide: true,
    		    		styling: 'jqueryui'
    		    	});
    				var newButton = $('<button class="addFav" title="Add to Favorites"><i class="icon icons-fav"></i></button>');
    				addFavCallback(newButton);
    				obj.replaceWith(newButton);
    			} else {
    				$.pnotify({
    		    		title: 'Fail',
    		    		text: "Failed to Remove '" + Page.temp_app_title + "' App from Favorites",
    		    		type: 'success',
    		    		hide: true,
    		    		styling: 'jqueryui'
    		    	});
    			}
    		});
    	});
    }

    //public methods
    o.init = function() {
    	var statusToDisplay = $('#gitrepo').text();

    	var statusValue = $.trim(statusToDisplay);
        //alert("status value from value1  "+statusValue+"value 3");
        var gitrepo = document.getElementById("gitrepo");
       if((statusValue!=null && statusValue!='undefined' && gitrepo != null)){
        	//alert("in statvalue "+statusValue);
    		if(statusValue == "Available")
    			gitrepo.style.color="blue";
    		else if(statusValue == "Break")
    			{
    			//salert("in red");
    			gitrepo.style.color="red";
    			}
    		else if(statusValue.trim() == 'Working')
    			{
    			//alert("In working1");
    			gitrepo.style.color="green";
    			//document.getElementById('gitrepo').style.color="green";
    			}
    		else{
    			gitrepo.style.color="red";
    		}
    	}
        $("#dialog-form").dialog({
            autoOpen: false,
            height: 300,
            width: 350,
            modal: true,
            draggable: false,
            resizable: false,
            buttons: {
                "Add To Home": function() {
                    $('#dialog-form form').trigger("submit");
                },
                Cancel: function() {
                    $(this).dialog("close");
                }
            },
            close: function() {
            }
        });
        
        /////////////////////////////////////////////////
        
        //TODO: change urls in DB to be style names--then use css instead of img tag and js
        
        
        $(".app-content").hover( function handleIn(){        
            $(this).addClass("app-content-active");
            
            var im=$( $(this).children("img")[0] );
            
            if(im!=null){            
                var p=im.attr("src");
                
                if(p!=null){
                    
                    np=p.substring(0,p.lastIndexOf("-"));
                    np+="-active.png";
                    im.attr("src",np);
                }
            }    
        },function handleOut(){
             $(this).removeClass("app-content-active");
               var im=$( $(this).children("img")[0] );
            
            if(im!=null){            
                var p=im.attr("src");
                
                if(p!=null){
                    
                    np=p.substring(0,p.lastIndexOf("-"));
                    np+="-inactive.png";
                    im.attr("src",np);
                }
            }    
        });
        
        $('.app-icon div#addHome').hover( function handleIn(){ 
            $(this).removeClass("FW_add-Home-inactive_apps");
            $(this).addClass("FW_add-Home-active_apps");
        },function handleOut(){
           
             $(this).removeClass("FW_add-Home-active_apps");
             $(this).addClass("FW_add-Home-inactive_apps");
        });
        
        $('.app-icon a#launchApp').hover( function handleIn(){ 
            $(this).removeClass("FW_launch-inactive_apps");
            $(this).addClass("FW_launch-active_apps");
        },function handleOut(){
           
             $(this).removeClass("FW_launch-active_apps");
             $(this).addClass("FW_launch-inactive_apps");
        });
        
        
        /*
        .FW_add-Home-active_apps{ width:24px; height:24px; background-position:-10px -430px; }
.FW_launch-active_apps{ width:24px; height:24px; background-position:-10px -464px; }
.FW_add-Home-inactive_apps{ width:24px; height:24px; background-position:-10px -498px; }
.FW_launch-inactive_apps{ w
*/

        //$('.app-icon button#addHome').each(function(index, obj) {
        $('.app-icon div#addHome').each(function(index, obj) {
            var $obj = $(obj);

            $obj.click(function() {
                var app_id = $(this).parents(".app-icon").data('app-id');
                var app_title = $(this).parent().find('.name').text();
                //hack, I know
                Page.temp_app_title = app_title;

                var promise = $.ajax({
                    url: CONTEXT_PATH + "/uui/applications/dialog",
                    type: "POST",
                    data: {
                        id: app_id
                    }
                });

                promise.done(function(result, textStatus) {
                    if (textStatus == 'success') {
                        result += "<input type=hidden class='tmp-app-id' value='" + app_id + "'>";
                        $("#dialog-form form").remove();
                        $("#dialog-form").html(result);
                        $('#dialog-form form').submit(function(event) {
                            handleDialogSubmit(event,$obj);
                        });
                        $("#dialog-form").dialog("option", "title", "Adding App '" + app_title + "' to Home Page");
                        $("#dialog-form").dialog("open");
                        $('.date-picker').datepicker();
                    } else {
                        if ($obj.parents('.app-icon').data('app-single-instance')) {
                            $obj.hide();
                        }
                        addAppCallback();
                    }
                });
            });
        });
        
        $('.app-icon button.addFav').each(function(index, obj) {
        	addFavCallback($(obj));
        });
        
        $('.app-icon button.removeFav').each(function(index, obj) {
        	removeFavCallback($(obj));
        });

        o.initMiniOrderSearch();
    };

    ///////////////////////////////////////////////////////////////////////////
    o.orderIdMap = null;

    o.initMiniOrderSearch = function()
    {
        $("#order-search-input").autocomplete({
            source: o.handleMiniOrderSearchAuto,
            select: o.launchOrderManager,
            change: function(event, ui) {
                $("#order-search-input").val("");
                event.preventDefault();
                return false;
            },
            focus: function(event, ui) {
                var value = ui.item.value;
                var onum = value.substring(0, value.indexOf(" "));
                $("#order-search-input").val(onum);
                event.preventDefault();
                return false;
            },
            response: function(event, ui) {
                //console.log(ui);
                if (o.returnKey) {
                    //console.log("return key pressed");
                    o.returnKey = false;
                    o.handleReturnKey();
                }
            },
            minLength: 2
        }).keydown(function(e) {
            //console.log("keydown:" + e.keyCode);
            if (e.keyCode === 13) {
                o.returnKey = true;
                o.handleReturnKey();
            } else {
                o.returnKey = false;
            }
        });
    };


    o.callOrderManager = function(orderNo, orderId, lob, version, ordertype) {
        if (lob == "RETAIL VOIP") {
            lob = "RETAIL_VOIP";
        }
        else if (lob == "IP AUDIO") {
            lob = "IP_AUDIO";
        }
        else if (lob == "IMMERSIVE VIDEO") {
            lob = "IMMERSIVE_VIDEO";
        }

        var params = lob + "|" + orderNo + "|" + orderId + "|" + version + "|||||||";

        var cp = CONTEXT_PATH;
        var i = (cp.toUpperCase()).indexOf("/PCGUI");
        var suffix = cp.substring((i + 6));

        var ncp = cp.substring(0, i) + "/UPIIVOIPWeb" + suffix;


        if (LOCAL) {
            //alert("cp="+cp+" local="+LOCAL);
            ncp = "http://pcth.vzbi.com/UPIIVOIPWebTH";
        }

        var path = ncp + "/jsp/OrderMgr/OrderManager.jsp?ORDER=" + params;

        // if( LOCAL ){alert(" path="+path);}

        $.launchApp({target: null}, path,"upiOM");
    };

    o.launchOrderManager = function(event, ui)
    {
        //console.log("launchOrderManager");
        var value = ui.item.value;
        o.doLaunchOrderManager(value);
    };

    o.doLaunchOrderManager = function(order_number_version_lob) {
        //console.log(order_number_version_lob);
        var onum = order_number_version_lob.substring(0, order_number_version_lob.indexOf(" "));
        var ver = 0;
        var ver_index1 = order_number_version_lob.indexOf("(");
        var ver_index2 = order_number_version_lob.indexOf(")");
        if (ver_index1 != -1 && ver_index2 != -1)
        {
            ver = order_number_version_lob.substring((ver_index1 + 1), ver_index2);
        }
        var target = onum;
        //console.log("for format="+value+" order id="+o.orderIdMap[value]);
        var url = CONTEXT_PATH + "/ordermanager?orderNum=" + onum + "&orderVer=" + ver;
        if (o.orderIdMap != null && o.orderIdMap[order_number_version_lob] != null)
        {
            target = "ordermanager";
            url = CONTEXT_PATH + "/ordermanager?orderId=" + o.orderIdMap[order_number_version_lob];
        }

        var valarr = order_number_version_lob.split("-");
        var ordernum = $.trim(valarr[0]);
        var lob = $.trim(valarr[1]);
        var ordertype = o.order2ordertype[order_number_version_lob];
                
        //console.log(" ordernum="+ordernum+" lob="+lob);
        //console.log(" using url "+url);
        //console.log("targe = " + target);
        if (lob == "OPTIONLESS" || lob == "VZW" || lob == "OPTION2" || lob == "OPTION1")
        {
            $.launchApp({target: ""}, url, target);
        }
        else
        {
            o.callOrderManager(onum, o.orderIdMap[order_number_version_lob], lob, ver, ordertype);
        }
    };

    o.handleMiniOrderSearchAuto = function(req, respfnc)
    {
        //console.log("req t="+req["term"]+"  respfnc="+respfnc);
        $("#order-search-input-search").removeClass("icon-search");
        $("#order-search-input-search").addClass("icon-load");
        o.orderIdMap = null;
        $.ajax({url: CONTEXT_PATH + "/uui/order/mini/auto",
            type: "POST",
            data: {orderId: (req["term"])}
        }
        ).success(
                function(data) {
                    $("#order-search-input-search").removeClass("icon-load");
                    $("#order-search-input-search").addClass("icon-search");
                    var resultMap = jQuery.parseJSON(data);
                    
                    if (resultMap == null){return;}
                    
                    var data_obj = resultMap.order2orderid;
                    var order2ordertype = resultMap.order2ordertype;
                                       
                    //console.log("dataobj="+data_obj+" auto data="+data_obj["autoCompleteData"]);
                    o.orderIdMap = data_obj;
                    o.order2ordertype = order2ordertype;

                    var keys = [];
                    for (var k in data_obj) {
                        if (!data_obj.hasOwnProperty(k))
                            continue;
                        keys.push(k);
                    }

                    if (data_obj) {
                        respfnc(keys);
                    }
                    else {
                        respfnc({});
                    }
                }
        );
    };

    o.handleReturnKey = function() {
        var cnt = 0;
        var value = null;
        if (o.orderIdMap != null) {
            for (var v in o.orderIdMap)
            {
                value = v;
                cnt++;
            }
            if (cnt === 1) {
                //$( "#order-search-input" ).data('uiAutocomplete').term="";
                //console.log("calling doLaunchOrderManager");
                o.doLaunchOrderManager(value);
            }
        }
    };
///////////////////////////////////////////////////////////////////////////

    return o;
}(jQuery, window));

$(function() {
    Page.init();
});

function callChangeStatus()
{ 
	//alert("in change status");
	try{
	document.getElementById("statusField").value = document.getElementById("gitrepo").innerText;
    document.getElementById('gitrepo').innerText = "Click to Change Status";
    document.getElementById('gitrepo').style.color="black";

}catch(ex){
	alert(ex.description );
}
}

function removeChangeStatus()
{try{
	//alert("git repo value "+document.getElementById('gitrepo'));
	if((document.getElementById('gitrepo')!=null && document.getElementById('gitrepo')!='undefined')){	
		document.getElementById("gitrepo").innerText = document.getElementById("statusField").value;
		var value =document.getElementById("gitrepo").innerText;
		//alert("inner text "+value);
		if(($.trim($('#Val').val())) == "Available"){
			document.getElementById('gitrepo').style.color="blue";
		}else if(($.trim($('#Val').val())) == "Break"){
			document.getElementById('gitrepo').style.color="red";
		}else if(($.trim($('#Val').val())) == "Working"){

				document.getElementById('gitrepo').style.color="green";
		}else{
				document.getElementById('gitrepo').style.color="red";
		}
	}
}catch(ex){
	alert(ex.description );
}
}
var dispAvail = false;

$( "#gitrepo" ).click(function() {
	
	$("#gitrepo").show();
	//$("#newVal").html("<ul><li>123</li><li>abc</li><li>def</li><li>ghi</li><li>jkl</li><li>mno</li></ul>");
	//$("#newVal").html("<table border='1'><tr><td>last taskworked</td></tr><tr><td>last taskworked</td></tr><tr><td>last taskworked</td></tr>");
	//$("#newVal").show();
	$("#newVal").fadeIn();
	//$("#newVal").addClass("icon-load");
	
	
	//$("#gitrepo").
	//$( "#change-dialog" ).dialog( "open" );
    $.ajax({
        url: CONTEXT_PATH + "/uui/agentStatus/taskStatus",
        type: "POST",
        success:function(data){
        	//$("#newVal").removeClass("icon-load");
        	$("#newVal").html(data);
        	$("#newVal").fadeIn();
        	$("#newVal table tr:odd").css("background-color", "#FFFFFF");
        },
        error : function(){
        	alert("Error");
        	
        }
    });
   
  });
$("#newTable").mouseout(function(){
	
	$("#newVal").hide();
});
function sendNew(value){
	var id1 = value.id;
	//alert("The value Clicked is::"+value+"::::id = "+id1);
	var dat = $("#"+id1).html();
	//alert("Data is::"+dat);
	var agentAction = "";
	if(dat == "Available" || dat == "AVAILABLE"){
		agentAction = "fromAvailable";
	}else{
		agentAction = "fromUpdate";
	}
	//alert("Agent Action is:::"+agentAction);
	$.ajax({
        url: CONTEXT_PATH + "/uui/agentStatus/update",
        type: "POST",
        data: {
        	   'setNewDisposition':dat,
        	   'action':agentAction
        },
        success:function(data){
        	$("#gitrepo").html(data); 
        	if(data == "Available")
        	{
        	 document.getElementById("gitrepo").style.color ="blue";
        	 }else if(data == "Break"||data == "BREAK"){
        		document.getElementById("gitrepo").style.color ="red";
        	}else if(data == "Working" || data == "WORKING"){
        		document.getElementById("gitrepo").style.color ="green";
        	}else{
        		document.getElementById("gitrepo").style.color ="red";
        	}
        	//alert("Update is Completed::So Going to Hide it ");
        	$("#newVal").hide();
        },
        error : function(){
        	alert("Error");
        	
        }
    });
	
	
}

$("#change-dialog").dialog({
	 autoOpen: false,
     height: 230,
     width:  600,
     modal: true,
     draggable: true,
     resizable: false
    });
   // buttons: {
   // 	 "Change My Status To Available": function() {
            //searchRemark();
     $("#toAvailable").click(function(){
           $.ajax({
                url: CONTEXT_PATH + "/uui/agentStatus/update",
                type: "POST",
                data:"action=fromUpdate",
                success:function(data){
                	$("#gitrepo").html(data); 
                	if(data == "Available")
                	{
                	 document.getElementById("gitrepo").style.color ="blue";
                	}else if(data == "Break"){
                		document.getElementById("gitrepo").style.color ="red";
                	}else if(data == "Working" ){
                		document.getElementById("gitrepo").style.color ="green";
                	}else{
                		document.getElementById("gitrepo").style.color ="red";
                	}
                	$("#newVal").fadeout();
                },
                error : function(){
                	alert("Error");
                	
                }
            });
           //$( "#change-dialog" ).dialog( "close" ); 
          });
    	// "Update Dispostion": function() {
     $("#changeDisposition").click(function(){
        	$.ajax({
                url: CONTEXT_PATH + "/uui/agentStatus/update",
                type: "POST",
                data: $("#dispositionForm").serialize()+"&action=fromUpdate",
                
                success:function(data){
                	$("#gitrepo").html(data); 
                	if(data == "Available")
                	{
                	 document.getElementById("gitrepo").style.color ="blue";
                	}else if(data == "Break"){
                		document.getElementById("gitrepo").style.color ="red";
                	}else if(data == "Working" ){
                		document.getElementById("gitrepo").style.color ="green";
                	}else{
                		document.getElementById("gitrepo").style.color ="red";
                	}
                	     
                },
                error : function(){
                	alert("Error2");
                	
                }
            });

        	$( "#change-dialog").dialog( "close" ); 
        });
        

    $("#cancel").click(function(){
    	$( "#change-dialog").dialog( "close" ); 
    });

