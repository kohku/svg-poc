/**
 * 
 */


var alertOption = { title: "Info" };
var homeWindow = $(window).getHome();

if(! homeWindow){
	homeWindow = window;
}

$(document).ready(function(){
	$('.mainbox').show();
	
	$('.remodal .remodal-close').hide();
	$('.remodal h2 .remodal-close,.action_notification .remodal-close').show();

	$('#detailsForm, #searchForm').validationEngine();
	
	$("#EffectiveRange").daterangepicker({
		dateFormat : "yy-mm-dd",
		rangeSplitter : "to",
		presets : {
			dateRange: 'Date Range'
		},
		presetRanges: [
//		   			{text: 'Today', dateStart: 'today', dateEnd: 'today' },
		   			], 
		onOpen : function(){
			$(".ui-daterangepickercontain").css('left', ($("#EffectiveRange").offset().left));
			$(".ui-daterangepickercontain").css('top', ($("#EffectiveRange").offset().top + 28));
		}
	});
	
	UTEADMIN.rulesetAdmin.resetForm("#detailsForm");
//	UTEADMIN.rulesetAdmin.fetchDropdownDetails();
	UTEADMIN.rulesetAdmin.renderSearchDataTable([],"Enter criteria and do search ");
	
	$('#rulePanels').on('click', '.header', handlePanelClick);
	
	$('#rulePanels').on('click', '.deleteRule', UTEADMIN.rulesetAdmin.handleDeleteRule);
	
	$("#searchBtn").click(function(){

		if($('#searchForm').validationEngine('validate')){
			UTEADMIN.rulesetAdmin.setLoadingGifPosition();
			$("#searchResultDiv").hide();
			$("#searchLoadingDiv").show();

			var searchParams = $('#searchForm').serializeArray();	

			UTEADMIN.rulesetAdmin.renderSearchResult(searchParams);
		}
		
	});
	
	$("#saveBtn").click(function(){
		
		if($('#detailsForm').validationEngine('validate')){
			UTEADMIN.rulesetAdmin.setLoadingGifPosition();
			$("#searchLoadingDiv").show();
			UTEADMIN.rulesetAdmin.enableForm("#detailsForm");
			var wgDetails = $('#detailsForm').serializeArray();
			
			UTEADMIN.rulesetAdmin.saveWgDetails(wgDetails);
		}

	});
	
	$("#createNewRulesetBtn").click(function(){
		UTEADMIN.rulesetAdmin.handleNewRulesetAdd();
	});
	
	$("#createRuleBtn").click(function(){
		UTEADMIN.rulesetAdmin.createNewRuleBlock();
	});
	
	$("#cancelBtn").click(function(){

		UTEADMIN.rulesetAdmin.resetForm("#detailsForm");
    	$( "#accordionPage" ).accordion({ active: 0 });
    	$("#FormHeader").html("Add Ruleset");
    	UTEADMIN.rulesetAdmin.enableForm("#detailsForm");

	});
	
	$('#searchResultDiv').on('click', '.editApp', function(evt) {
		
		var ruleId = $(this).parents(".vzuui-om-dropdown").attr('data');
		$(".hidedropdown").hide();
		var rulesetDtlsObj = UTEADMIN.rulesetAdmin.searchRulesetDtlMap[ruleId];
		
		UTEADMIN.rulesetAdmin.currentRuleSetObj = rulesetDtlsObj;
		
		UTEADMIN.rulesetAdmin.loadEditForm(rulesetDtlsObj, false);
		
	});
	
	
	$('#searchResultDiv').on('click', '.deleteApp', function(evt) {
		
		var ruleId = $(this).parents(".vzuui-om-dropdown").attr('data');
		var ruleDtlsObj = UTEADMIN.rulesetAdmin.searchRulesetDtlMap[ruleId];
		var deleteRowRef = $(this).closest('tr')[0];
		
		if (!confirm("Delete Operation is irreversible, Do you want to delete the selected Ruleset")) {
	        return false;
	    }
		
		$.ajax({
	        type: "POST",
	        url: CONTEXT_PATH + "/ute/admin/rulesetadmin/delete",
	        data : {
	        		"ApplicationName" : ruleDtlsObj.ApplicationName,
	        		"JobfunctionName" : ruleDtlsObj.RulesetName,
	        		},
	        
	    }).done(function (uteReturnData) {
            
            var deleteMsg = "Failed to delete ruleset";
        	
        	if(uteReturnData){
        		try{
        			
        			var ruleReturnObj = null;
        			
        			if(uteReturnData.Body.deleteRuleSetsResponse){
        				ruleReturnObj = uteReturnData.Body.deleteRuleSetsResponse;
        			}
        			
        			if(ruleReturnObj){
        				if(ruleReturnObj.FaultCode == "UTE0000" || ruleReturnObj.FaultCode == "NO_ERROR"){
        					deleteMsg = "Ruleset deleted successfully";
                			
        					$('#searchResultDatagrid').dataTable().fnDeleteRow(deleteRowRef);
                			
                		}
                		else{
                			deleteMsg = ruleReturnObj.FaultDescription;
                		}
        			}
        			else{
        				deleteMsg = uteReturnData.Body.Fault.detail.UTEServiceFault.FaultDescription;
        			}
            	}
            	catch(e){
            		deleteMsg = uteReturnData.Body.Fault.detail.UTEServiceFault.FaultDescription;
            	}
        	}
        	$("#searchLoadingDiv").hide();
        	alertOption.displayMessage=deleteMsg;
        	homeWindow.alertDialog(alertOption);
        	
            return false;
	    	
	    }).error(function(){
	    	$("#searchLoadingDiv").hide();
	    	alertOption.displayMessage= "Failure in calling UTE Service";
        	homeWindow.alertDialog(alertOption);
	    	
	    }); //closes the ajax call
		
	});
	
	$('#searchResultDatagrid').on('click', '.vzuui-om-menu', function(evt) {
		
		evt.stopPropagation();
       
	       $("body").click(function(e){
	           if(e.target.id != "popupBlock")
	           {
	        	   $(".hidedropdown").hide();
	               $("body").unbind("click");
	           }
	       });
		
	       $(".hidedropdown").hide();
	       var position = $(this).position();
		
	       $(this).siblings(".hidedropdown").animate({left:position.left + 16 , top:position.top + 10}, 100).show();
		
	});

	$('#accordion1,#accordion2,#accordion3,#accordion4,#accordion5').accordion({
		heightStyle: "content",
		collapsible:true,
		beforeActivate: function(event, ui) {
			// The accordion believes a panel is being opened
			if (ui.newHeader[0]) {
				var currHeader  = ui.newHeader;
				var currContent = currHeader.next('.ui-accordion-content');
				// The accordion believes a panel is being closed
			} else {
				var currHeader  = ui.oldHeader;
				var currContent = currHeader.next('.ui-accordion-content');
			}
			// Since we've changed the default behavior, this detects the actual status
			var isPanelSelected = currHeader.attr('aria-selected') == 'true';

			// Toggle the panel's header
			currHeader.toggleClass('ui-corner-all',isPanelSelected).toggleClass('accordion-header-active ui-state-active ui-corner-top',!isPanelSelected).attr('aria-selected',((!isPanelSelected).toString()));

			// Toggle the panel's icon
			currHeader.children('.ui-icon').toggleClass('ui-icon-triangle-1-e',isPanelSelected).toggleClass('ui-icon-triangle-1-s',!isPanelSelected);

			// Toggle the panel's content
			currContent.toggleClass('accordion-content-active',!isPanelSelected)    
			if (isPanelSelected) { currContent.slideUp(); }  else { currContent.slideDown(); }

			return false; // Cancels the default action
		}
	});
	
	$('#detailsForm').on('change', '#ApplicationName', function(evt) {
		
		UTEADMIN.rulesetAdmin.fetchRuleAttrDetails($(this).val());
		
	});
	
	$('#accordionPage').accordion({
		heightStyle: "content",
		collapsible:false,
		active: 0,
	});
	
	$('.orderTabs').tabs();
	$(".vzuui-navigator-timeline").each(function(){
		$(this).find(".vzuui-todo_holder_content:first").show();
	});
	$(".vzuui-timeline li").bind("click",function(){	
		var str_ref = $(this).attr("title");
		$(".vzuui-active").removeClass("vzuui-active");
		$(this).addClass("vzuui-active");
		$(this).parents(".vzuui-navigator-timeline").find(".vzuui-todo_holder_content").hide();
		$(this).parents(".vzuui-navigator-timeline").find("#"+str_ref+"_tab").show();
	});
});

function handlePanelClick() {
    //console.log(" panel click dragged="+dragged);
    if(window.dragged){
    	window.dragged=false;
        return;
    }
    togglePanel(this);
    $(this).find('.closePanel').parent().addClass('vzuui-active-panel');
    $(this).find('.openPanel').parent().removeClass('vzuui-active-panel');
}   


function togglePanel(id) {
    var id = $(id).parent().attr('id');
    var pid = "#"+id + "Body";
    var p = $(pid);
    //console.log("toggle before vis="+p.is(':visible'));
    
    if (p.is(':visible')) {
        closePanel("#"+id);
    } else {
        openPanel("#" + id);
    }
     //console.log("toggle after vis="+p.is(':visible'));
}


function openPanel(id) {
    var pid = id + "Body";
    var p = $(pid);
    
    if( p.is(":visible") ){
        scrollto(id);
        return;
    }
    if ($.trim(p.text()) == '') {
        if(p.html().indexOf('<iframe')>-1){
            scrollto(id);
        }else{
            scrollto(id,refreshPanel);
        }

    } else {
        scrollto(id);
    }
    p.show();

    var header = $(id+"Head");
    var closePanel = $(header).find('.closePanel');
    var openPanel = $(header).find('.openPanel');

    closePanel.removeClass('closePanel').addClass('openPanel');

    openPanel.removeClass('openPanel').addClass('closePanel');
    
    //UiSettingsSave(appPanelSet.key, appPanelSet);
    //console.log("finished open id="+id);
    return false;
}

function closePanel(id) {
    var pid = id + "Body";
    closeMsg(id);
    $(pid).hide();
    var header = $(id+"Head");
    var closePanel = $(header).find('.closePanel');
    var openPanel = $(header).find('.openPanel');

    closePanel.removeClass('closePanel').addClass('openPanel');         
    openPanel.removeClass('openPanel').addClass('closePanel');

    return false;
}

scrollto.running = false;

function scrollto(id,callback) {
    //console.log(" scrollto id="+id+" callback="+callback+" running="+scrollto.running);
//    if (scrollto.running) return;
//    scrollto.running = true;

    var offset = {
        top:-40
    };
    if (!window.hideHeader) {
        offset = {
        /* top:0*/
         top:-45
        };
    }
    
    if (window.iframed) {
 
        offset = {
            top:-4     
        };
    }
    
    if (callback) {
        callback(id);
    }
   
   
    if ($.scrollTo) {
        setTimeout(function(){
            //console.log(" --scrolling id="+id);
        $.scrollTo(id,500,
        {
            axis: 'y',
            easing: 'swing',
            offset: offset,
            onAfter: function() {
                scrollto.running = false;                       
                
            }
        });
        },500);
    }
}


function refreshPanel(id,callback) {  
	    var idurl= CONTEXT_PATH + $(id).data("url");
	    if(idurl==""){return;}
	    
	    var bid=$(id+"Body"); 
	    
	      var l=$(id+" .ui-resizable").length; 
	        var html = "<div class='spinny' style='text-align:left;height:35px;background:white;' ><span class='vzuui-progress-image'></span></div>";
	        var c=$(bid);
	        c.html(html);
	        html = '<iframe id="iframe_content_'+id.substr(1)+'"  style="background:#888888;width:100%;height:100%;" frameBorder="0" '+' class="vzuui-app-iframe" scrolling="no" src="' + idurl + '"></iframe>';

	        var iframe = $(html);
	        iframe.hide();
	        c.append(iframe); 
	        
	        $(iframe).one('load', function() {
	            c.find(".spinny").remove();
	            iframe.show();
	        });

	    setTimeout(function() {
	        $(iframe).autoiframeresize();
	    }, 1000);
	
    return;
    
}

function closeMsg(id) {
    if (id.indexOf("Msg") < 0) id = id + "Msg";
    $(id).hide();
    return false;
}
function showMsg(id, msg) {
    if (id.indexOf("Msg") < 0) id = id + "Msg";
    $(id).html(msg).show();
    return false;
}
   

window.UTEADMIN = window.UTEADMIN || {};
UTEADMIN.rulesetAdmin = UTEADMIN.rulesetAdmin || {};
UTEADMIN.util = UTEADMIN.util || {};
UTEADMIN.rulesetAdmin.searchRulesetDtlMap = {};
UTEADMIN.rulesetAdmin.currentDictDtlMap = {};
UTEADMIN.rulesetAdmin.currentRulesArray = [];
UTEADMIN.rulesetAdmin.dropdownMetaMap = {};
UTEADMIN.rulesetAdmin.newRuleCounter = 0;
UTEADMIN.rulesetAdmin.ruleAttributesMap = {};
UTEADMIN.rulesetAdmin.currentRuleSetObj = {};


UTEADMIN.rulesetAdmin.fetchRuleAttrDetails = function (applicationId, callbackFunction) {
	
	var paramDetails = {"applicationId" : applicationId};
	
    $.ajax({
        type: "GET",
        url: CONTEXT_PATH + "/ute/admin/ruleadminnew/getruleattrdetails",
        data: paramDetails,
    }).done(function (dropdownDetails) {
    	
    	UTEADMIN.rulesetAdmin.ruleAttributesMap = dropdownDetails;
    	
    	if(dropdownDetails && dropdownDetails.CompleteData && Object.keys(dropdownDetails.CompleteData).length){
    		
    		if(callbackFunction){
    			callbackFunction();
    		}
    	}
    	else{
    		alertOption.displayMessage = "Selected Task Source is not having Rule Attributes created in UTE";
        	homeWindow.alertDialog(alertOption);
    	}
    	
    }).error(function(){
    	
    	alertOption.displayMessage= "Failure in calling UTE Service";
    	homeWindow.alertDialog(alertOption);
    	
    }); 
}


UTEADMIN.rulesetAdmin.fetchRuleAttrDetailsReverse = function (applicationId, callbackFunction) {
	
	var paramDetails = {"applicationId" : applicationId};
	
    $.ajax({
        type: "GET",
        url: CONTEXT_PATH + "/ute/admin/ruleadminnew/getruleattrreverse",
        data: paramDetails,
    }).done(function (dropdownDetails) {
    	
    	UTEADMIN.rulesetAdmin.ruleAttributesMap = dropdownDetails;
    	
    	if(dropdownDetails && dropdownDetails.CompleteData && Object.keys(dropdownDetails.CompleteData).length){
    		
    		if(callbackFunction){
    			callbackFunction();
    		}
    	}
    	else{
    		alertOption.displayMessage = "Selected Task Source is not having Rule Attributes created in UTE";
        	homeWindow.alertDialog(alertOption);
    	}
    	
    }).error(function(){
    	alertOption.displayMessage= "Failure in calling UTE Service";
    	homeWindow.alertDialog(alertOption);
    	
    }); 
}


UTEADMIN.rulesetAdmin.handleDeleteRule = function (event) {
	
	event.stopPropagation();
	var deleteRowRef = $(this).closest('.appPanel');
	var ruleId = deleteRowRef.attr('id');
	
	if (!confirm("Delete Operation is irreversible, Do you want to delete the selected Rule")) {
        return false;
    }
	UTEADMIN.rulesetAdmin.setLoadingGifPosition();
	$("#searchLoadingDiv").show();
	
	$.ajax({
        type: "POST",
        url: CONTEXT_PATH + "/ute/admin/ruleadminnew/delete",
        data : {
        		"RuleName" : ruleId,
        		"ApplicationName" : UTEADMIN.rulesetAdmin.currentRuleSetObj.ApplicationName,
        		"JobFunctionName" : UTEADMIN.rulesetAdmin.currentRuleSetObj.RulesetName,
        		},
        
    }).done(function (uteReturnData) {
        
        var deleteMsg = "Failed to delete rule";
    	
    	if(uteReturnData){
    		try{
    			
    			var ruleReturnObj = null;
    			
    			if(uteReturnData.Body.deleteRulesResponse){
    				ruleReturnObj = uteReturnData.Body.deleteRulesResponse;
    			}
    			
    			if(ruleReturnObj){
    				if(ruleReturnObj.FaultCode == "UTE0000" || ruleReturnObj.FaultCode == "NO_ERROR"){
    					deleteMsg = "Rule deleted successfully";
            			
    					deleteRowRef.remove();
            			
            		}
            		else{
            			deleteMsg = ruleReturnObj.FaultDescription;
            		}
    			}
    			else{
    				deleteMsg = uteReturnData.Body.Fault.detail.UTEServiceFault.FaultDescription;
    			}
        	}
        	catch(e){
        		deleteMsg = uteReturnData.Body.Fault.detail.UTEServiceFault.FaultDescription;
        	}
    	}
    	$("#searchLoadingDiv").hide();
    	alertOption.displayMessage=deleteMsg;
    	homeWindow.alertDialog(alertOption);
    	
        return false;
    	
    }).error(function(){
    	$("#searchLoadingDiv").hide();
    	alertOption.displayMessage= "Failure in calling UTE Service";
    	homeWindow.alertDialog(alertOption);
    	
    }); //closes the ajax call
}



UTEADMIN.rulesetAdmin.renderSearchResult = function (searchParams) {
	
    $.ajax({
        type: "POST",
        url: CONTEXT_PATH + "/ute/admin/rulesetadmin/search",
        data: searchParams,
    }).done(function (uteReturnData) {
    	
    	var ruleResultHtmlData = [];
    	var erroMsg = "";
    	
    	if(uteReturnData){
    		try{
        			var ruleDtls = uteReturnData.Body.getRulesetsNameByApplicationResponse.rulesetList.rulesetInfo;
        			UTEADMIN.rulesetAdmin.currentDictDtlMap = uteReturnData.Body.getRulesetsNameByApplicationResponse;
        			
        			if($.type(ruleDtls) == "array"){
        				
        				for (var i = 0, c = ruleDtls.length; i < c; i++) {
            	        	ruleResultHtmlData.push([
             		            	        	    '<span class="vzuui-om-menu"></span><div id="popupBlock" class="vzuui-om-dropdown hidedropdown" data="' + ruleDtls[i].RulesetName + '"><ul id="vzuui-task-actions"><li class="editApp">Edit</li><li class="deleteApp">Delete</li></ul></div>',
            		            	        	    (ruleDtls[i].RulesetName ? ruleDtls[i].RulesetName : ""),
            		            	        	    (ruleDtls[i].ApplicationName ? ruleDtls[i].ApplicationName : ""),
            		            	        	    (ruleDtls[i].EffectiveFrom ? ruleDtls[i].EffectiveFrom : ""),
            		            	        	    (ruleDtls[i].EffectiveTo ? ruleDtls[i].EffectiveTo : "")
            		            	            ]);
            	        	
            	        	UTEADMIN.rulesetAdmin.searchRulesetDtlMap[ruleDtls[i].RulesetName] = ruleDtls[i];
            	        }
        				
        			}
        			else{
        				
        				ruleResultHtmlData.push([
        		            	        	    '<span class="vzuui-om-menu"></span><div id="popupBlock" class="vzuui-om-dropdown hidedropdown" data="' + ruleDtls.RulesetName + '"><ul id="vzuui-task-actions"><li class="editApp">Edit</li><li class="deleteApp">Delete</li></ul></div>',
        		            	        	    (ruleDtls.RulesetName ? ruleDtls.RulesetName : ""),
        		            	        	    (ruleDtls.ApplicationName ? ruleDtls.ApplicationName : ""),
        		            	        	    (ruleDtls.EffectiveFrom ? ruleDtls.EffectiveFrom : ""),
        		            	        	    (ruleDtls.EffectiveTo ? ruleDtls.EffectiveTo : "")
        		            	            ]);
        		            	        	
        				UTEADMIN.rulesetAdmin.searchRulesetDtlMap[ruleDtls.RulesetName] = ruleDtls;
        			
        			}
        	}
        	catch(e){
        		erroMsg = uteReturnData.Body.Fault.detail.UTEServiceFault.FaultDescription;
        	}
    	}
    	
    	UTEADMIN.rulesetAdmin.renderSearchDataTable(ruleResultHtmlData, erroMsg);
    	
    	
        $("#searchResultDiv").show();
		$("#searchLoadingDiv").hide();
    	
    }).error(function(){
    	$("#searchLoadingDiv").hide();
    	alertOption.displayMessage= "Failure in calling UTE Service";
    	homeWindow.alertDialog(alertOption);
    	
    }); //closes the ajax call
}


UTEADMIN.rulesetAdmin.saveWgDetails = function (wgDetails) {
	
    $.ajax({
        type: "POST",
        url: CONTEXT_PATH + "/ute/admin/rulesetadmin/save",
        data: wgDetails,
    }).done(function (uteReturnData) {
    	
    	var saveMsg = "Failed to store ruleset";
    	
    	if(uteReturnData){
    		try{
    			
    			var ruleReturnObj = null;
    			
    			if(uteReturnData.Body.modifyRulesResponse){
    				ruleReturnObj = uteReturnData.Body.modifyRulesResponse;
    			}
    			else if(uteReturnData.Body.addRulesResponse){
    				ruleReturnObj = uteReturnData.Body.addRulesResponse;
    			}
    			
    			if(ruleReturnObj){
    				if(ruleReturnObj.FaultCode == "UTE0000" || ruleReturnObj.FaultCode == "NO_ERROR"){
            			saveMsg = "Ruleset saved successfully";
            			
            			$("#createRuleDiv").show();
            			
            			UTEADMIN.rulesetAdmin.currentRuleSetObj = {
            														"ApplicationName": $("#detailsForm #ApplicationName").val(),
            														"RulesetName" : $("#detailsForm #JobfunctionName").val(), 
            														};
            			$("#detailsForm #ApplicationName,#detailsForm #Name,#detailsForm #JobfunctionName").prop('disabled', true);
            			$("#detailsForm #IsUpdate").val("Y");
            			
            			UTEADMIN.rulesetAdmin.resetFormSearch("#searchForm");
            			$("#searchForm #ApplicationName").val($("#detailsForm #ApplicationName").val());
            			
            			$("#searchBtn").trigger('click');
//            			$("#FormHeader").html("Add Ruleset");
            			
//            			UTEADMIN.rulesetAdmin.resetForm("#detailsForm");
//            	    	UTEADMIN.rulesetAdmin.enableForm("#detailsForm");
//            	    	$( "#accordionPage" ).accordion({ active: 0 });
            			
            		}
            		else{
            			saveMsg = ruleReturnObj.FaultDescription;
            		}
    			}
    			else{
    				saveMsg = uteReturnData.Body.Fault.detail.UTEServiceFault.FaultDescription;
    			}
        	}
        	catch(e){
        		saveMsg = uteReturnData.Body.Fault.detail.UTEServiceFault.FaultDescription;
        	}
    	}
    	
    	$("#searchLoadingDiv").hide();
    	
    	alertOption.displayMessage=saveMsg;
    	homeWindow.alertDialog(alertOption);
    	
        return false;
    	
    }).error(function(){
    	$("#searchLoadingDiv").hide();
    	alertOption.displayMessage= "Failure in calling UTE Service";
    	homeWindow.alertDialog(alertOption);
    	
    }); //closes the ajax call
}

UTEADMIN.rulesetAdmin.fetchDropdownDetails = function () {
	
	var paramList = ["STATUS", "CONTINUITY_LEVEL", "SCHEDULING_REQUIRED", "IS_SUBGROUP","SUBGROUP_TYPE","OVERFLOW_USER","ROUTING_POLICY", "USER_TYPE"];
	var paramDetails = [];
	paramDetails.push({name : "parameter", value : JSON.stringify(paramList)});
	
    $.ajax({
        type: "POST",
        url: CONTEXT_PATH + "/ute/admin/workgroupnew/dropdowndetails",
        data: paramDetails,
    }).done(function (dropdownDetails) {
    	
    	UTEADMIN.rulesetAdmin.dropdownMetaMap = dropdownDetails;
    	
    }).error(function(){
    	alertOption.displayMessage= "Failure in calling UTE Service";
    	homeWindow.alertDialog(alertOption);
    	
    }); 
}


UTEADMIN.rulesetAdmin.resetForm = function (formId) {
	
	$(formId +" input[type='text'], "+formId+" input[type='password'], "+formId+" input[type='hidden'], "+formId+" select, "+formId+" textarea" ).val("");
	
	$("#createRuleDiv,#lastUpdatedDiv").hide();
	
	$("#rulePanels").empty()
	
}

UTEADMIN.rulesetAdmin.resetFormSearch = function (formId) {
	
	$(formId +" input[type='text'], "+formId+" input[type='password'], "+formId+" input[type='hidden'], "+formId+" select, "+formId+" textarea" ).val("");
	
}

UTEADMIN.rulesetAdmin.disableForm = function (formId) {
	
	$(formId +" input[type='text'], "+formId+" input[type='password'], "+formId+" select, "+formId+" textarea, "+formId+" input[type='radio'], "+formId+" input[type='checkbox']" ).prop('disabled', true);
	$("#saveBtn").hide();
}

UTEADMIN.rulesetAdmin.enableForm = function (formId) {
	
	$(formId +" input[type='text'], "+formId+" input[type='password'], "+formId+" select, "+formId+" textarea, "+formId+" input[type='radio'], "+formId+" input[type='checkbox']" ).prop('disabled', false);
	$("#saveBtn").show();
}


UTEADMIN.rulesetAdmin.loadEditForm = function (rulesetDetails, isDisable) {
	UTEADMIN.rulesetAdmin.setLoadingGifPosition();
	$("#searchLoadingDiv").show();
	UTEADMIN.rulesetAdmin.resetForm("#detailsForm");
	
	$("#FormHeader").html("Edit Ruleset");
	$("#createRuleDiv,#lastUpdatedDiv").show();
	$( "#accordionPage" ).accordion({ active: 1 });
    
    $.each(rulesetDetails, function(elementId, elementValue){
        $("#detailsForm #"+ elementId).val(elementValue);
    });
    
    var lastUpdateStr = "";
    
    if(UTEADMIN.rulesetAdmin.currentDictDtlMap.ModifiedBy){
    	lastUpdateStr = UTEADMIN.rulesetAdmin.currentDictDtlMap.ModifiedBy + " | ";
    }
    
    if(UTEADMIN.rulesetAdmin.currentDictDtlMap.ModifiedTimeDisp){
    	lastUpdateStr = lastUpdateStr + UTEADMIN.rulesetAdmin.currentDictDtlMap.ModifiedTimeDisp;
    }
    
    $("#lastUpdatedSpan").html(lastUpdateStr);
    
    $("#detailsForm #JobfunctionName").val(rulesetDetails.RulesetName);
    
    $("#detailsForm #ApplicationName,#detailsForm #Name,#detailsForm #JobfunctionName").prop('disabled', true);
    
    $("#detailsForm #IsUpdate").val("Y");
    
    var searchParams = [
	                     {name : 'ApplicationName', value : rulesetDetails.ApplicationName},
	                     {name : 'JobfunctionName', value : rulesetDetails.RulesetName},
	                   ];
    
    $.ajax({
        type: "POST",
        url: CONTEXT_PATH + "/ute/admin/ruleadminnew/search",
        data: searchParams,
    }).done(function (uteReturnData) {
    	
    	var ruleResultHtmlData = [];
    	var erroMsg = "";
    	
    	if(uteReturnData){
    		try{
        			var ruleDtls = uteReturnData.Body.getAllRulesResponse.Rule;
        			
        			if($.type(ruleDtls) == "array"){
        				
        				UTEADMIN.rulesetAdmin.currentRulesArray = ruleDtls;
        			}
        			else{
        				
        				UTEADMIN.rulesetAdmin.currentRulesArray = [ruleDtls];
        			}
        			
        			UTEADMIN.rulesetAdmin.createRuleDrawers();
        	}
        	catch(e){
        		erroMsg = uteReturnData.Body.Fault.detail.UTEServiceFault.FaultDescription;
        	}
    	}
    	
    	$("#searchLoadingDiv").hide();
//        $("#searchResultDiv").show();
//		$("#searchLoadingDiv").hide();
    	
    }).error(function(){
    	$("#searchLoadingDiv").hide();
    	alertOption.displayMessage= "Failure in calling UTE Service";
    	homeWindow.alertDialog(alertOption);
    	
    }); //closes the ajax call
    
    
}


UTEADMIN.rulesetAdmin.createRuleDrawers = function () {
	
	$rulePanelDiv = $("#rulePanels").empty();
	
	$.each(UTEADMIN.rulesetAdmin.currentRulesArray, function(index, singleRule){
		
		var $div = $('<div class="appPanel" id="' + singleRule.Name + '" data-url="' + "/ute/admin/ruleadminnew/standalone?debug=" + debug + "&editTaskSource=" + singleRule.ApplicationName + 
					   "&editRulesetName=" + singleRule.JobfunctionName + "&editRuleName=" + singleRule.Name  + '"><div class="header" id="' + singleRule.Name + 'Head"><span class="openPanel" id="' + singleRule.Name + 'HeadSpan" title="Open/Close Panel"></span><b>Rule: </b>' + singleRule.Name + '<span class="deleteRule">Delete</span></div><div style="display:none" class="appMsg" id="' + singleRule.Name + 'Msg"></div><div style="display:none" class="body" id="' + singleRule.Name + 'Body"></div></div>');
		
		$rulePanelDiv.append($div);
		
	});
	
}


UTEADMIN.rulesetAdmin.createNewRuleBlock = function () {
	
	var ruleId = 'newRule' + (UTEADMIN.rulesetAdmin.newRuleCounter++);
	
	$rulePanelDiv = $("#rulePanels");
	
	var $div = $('<div class="appPanel" id="' + ruleId + '" data-url="/ute/admin/ruleadminnew/standalone?createNewRule=true&debug=' + debug 
				+ '&editTaskSource=' + UTEADMIN.rulesetAdmin.currentRuleSetObj.ApplicationName + 
			   "&editRulesetName=" + UTEADMIN.rulesetAdmin.currentRuleSetObj.RulesetName + '"><div class="header" id="' + ruleId + 'Head"><span class="openPanel" id="' + ruleId + 'HeadSpan" title="Open/Close Panel"></span><b>Rule: </b>New</div><div style="display:none" class="appMsg" id="' + ruleId + 'Msg"></div><div style="display:none" class="body" id="' + ruleId + 'Body"></div></div>');
	
	$rulePanelDiv.prepend($div).promise().done(function(){
		
		$div.children('.header').click();
	});
	
}


UTEADMIN.rulesetAdmin.handleNewRulesetAdd = function () {
	
	UTEADMIN.rulesetAdmin.resetForm("#detailsForm");
	UTEADMIN.rulesetAdmin.enableForm("#detailsForm");
	
	$("#FormHeader").html("Add Ruleset");
	$("#accordionPage" ).accordion({ active: 1 });
    
    $("#detailsForm #IsUpdate").val("N");
    
}

UTEADMIN.rulesetAdmin.renderSearchDataTable = function (rowData, erroMsg) {
	
	$('#searchResultDatagrid').dataTable({
		"aaData": rowData,
		"bPaginate": true, 
		"sPaginationType": "full_numbers", 
		"bLengthChange": true, 
		"bFilter": false, 
		"bSort":true, 
		"bInfo": false, 
		"bAutoWidth": false, 
		"bDestroy": true,
		"sDom":'<"top"f>rt<"bottom"ilp><"clear">',
        "aoColumns": [
						{
						    "sTitle": "Actions",
						     "sWidth": "1%",
						     "sClass": "action_column"
						},
				         {
				            "sTitle": "Ruleset Name",
				             "sWidth": "15%"
				        }, 
				        {
				            "sTitle": "Task Source",
				            "sWidth": "15%"
				        }, 
				        {
				            "sTitle": "Effective From",
				            "sWidth": "15%"
				        },
				        {
				            "sTitle": "Effective To",
				            "sWidth": "15%"
				        }, 
		        	],
	    "oLanguage": {
                        "sSearch": "Search",
                        "sZeroRecords": erroMsg,
                        "sProcessing": "Processing..."
            		},

    });
	
}


UTEADMIN.rulesetAdmin.renderOutcomeDataTable = function (rowData, erroMsg) {
	
	$('#outcomeMappingDatagrid').dataTable({
		"aaData": rowData,
		"bPaginate": true, 
		"sPaginationType": "full_numbers", 
		"bLengthChange": true, 
		"bFilter": false, 
		"bSort":true, 
		"bInfo": false, 
		"bAutoWidth": false, 
		"bDestroy": true,
		"sDom":'<"top"f>rt<"bottom"ilp><"clear">',
        "aoColumns": [
						{
						    "sTitle": "Outcome",
						     "sWidth": "30%",
						},
				         {
				            "sTitle": "Value",
				             "sWidth": "70%"
				        }
		        	],
	    "oLanguage": {
                        "sSearch": "Search",
                        "sZeroRecords": erroMsg,
                        "sProcessing": "Processing..."
            		},

    });
	
}

UTEADMIN.rulesetAdmin.getOptionsStr = function (value, optionsDtls, startOption){
	
	var optionStr = "";
	
	if(startOption){
		optionStr = optionStr + '<option value="">' + startOption + '</option>'; 
	}
	
	if($.type(optionsDtls) == "array"){
	
		$.each(optionsDtls, function(index, optionValue){
			optionStr = optionStr + '<option value="' + optionValue + '"' + ((optionValue == value) ? " selected ":" ") + '>' + optionValue + '</option>';
		});
	}
	else{
	
		$.each(optionsDtls, function(optionValue, optionDisplay){
			optionStr = optionStr + '<option value="' + optionValue + '"' + ((optionValue == value) ? " selected ":" ") + '>' + optionDisplay + '</option>';
		});
	
	}
	
	return optionStr;
}

UTEADMIN.rulesetAdmin.getOptionHTML = function (paramName, selectValue) {
	
	var propertyTypeOption = "";
	
	$.each(UTEADMIN.rulesetAdmin.dropdownMetaMap[paramName], function(key, value){
		
		propertyTypeOption = propertyTypeOption + '<option value="' + value + '"' + ((value == selectValue) ? " selected ":" ") + '>' + key + '</option>';	
 		
    });
	
	return propertyTypeOption;
	
}

UTEADMIN.rulesetAdmin.setLoadingGifPosition = function() {
	
	$("#searchLoadingDiv").css('top', ($(window).height()/2) - 10);
	$("#searchLoadingDiv").css('left',($(window).width()/2) - 10);
}