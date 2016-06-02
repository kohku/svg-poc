/**
 * 
 */


var alertOption = { title: "Info" };

var homeWindow = $(window).getHome();

if(! homeWindow){
	homeWindow = window;
}

$(document).ready(function(){
	
	$('.remodal .remodal-close').hide();
	$('.remodal h2 .remodal-close,.action_notification .remodal-close').show();

	$('#detailsForm, #searchForm').validationEngine();
	
	UTEADMIN.priorityRuleAdmin.resetForm("#detailsForm");
//	UTEADMIN.priorityRuleAdmin.fetchDropdownDetails();
	UTEADMIN.priorityRuleAdmin.renderSearchDataTable([],"Enter criteria and do search ");
	UTEADMIN.priorityRuleAdmin.createHeader($("#conditionStartNode"));
	UTEADMIN.priorityRuleAdmin.renderOrderByConditionDataTable([],"");
//	
//	$(".ui-daterangepickercontain").css('left', ($("#EffectiveRange").offset().left));
//	$(".ui-daterangepickercontain").css('top', ($("#EffectiveRange").offset().top + 28));
	
//	$('.datetime').datetimepicker();
	
	$('body').css('height','auto');
	
	if(window.createNewRule == 'true'){
		
		UTEADMIN.priorityRuleAdmin.standAloneAddNew = true;
		
		UTEADMIN.priorityRuleAdmin.loadStandaloneAddNew();
	}
	else if(window.editTaskSource && window.editRulesetName && window.editRuleName){
		
		UTEADMIN.priorityRuleAdmin.standAloneEdit = true;
		
		UTEADMIN.priorityRuleAdmin.loadStandaloneForm();
	}
	
//	$('.datetime').datepicker({
//		dateFormat: "yy-mm-dd"
//	});

	$("#searchBtn").click(function(){

		if($('#searchForm').validationEngine('validate')){
			
			$("#searchResultDiv").hide();
			UTEADMIN.priorityRuleAdmin.setLoadingGifPosition();
			$("#searchLoadingDiv").show();

			var searchParams = $('#searchForm').serializeArray();	

			UTEADMIN.priorityRuleAdmin.renderSearchResult(searchParams);
			
		}
		
	});
	
	$("#saveBtn").click(function(){
		
		if($('#detailsForm').validationEngine('validate')){
			UTEADMIN.priorityRuleAdmin.setLoadingGifPosition();
			$("#searchLoadingDiv").show();
			UTEADMIN.priorityRuleAdmin.enableForm("#detailsForm");
			var wgDetails = $('#detailsForm').serializeArray();
			
			wgDetails.push({name : 'ruleCondition', value : JSON.stringify(UTEADMIN.priorityRuleAdmin.getConditions($("#conditionStartNode")))});
			
			UTEADMIN.priorityRuleAdmin.saveWgDetails(wgDetails);
		}

	});
	
	$("#cancelBtn").click(function(){
		
		if(UTEADMIN.priorityRuleAdmin.standAloneEdit){
			UTEADMIN.priorityRuleAdmin.loadStandaloneForm();
		}
		else{
			UTEADMIN.priorityRuleAdmin.resetForm("#detailsForm");
	    	$( "#accordionPage" ).accordion({ active: 0 });
	    	$("#FormHeader").html("Add Rule");
	    	UTEADMIN.priorityRuleAdmin.enableForm("#detailsForm");
		}
	});
	
	$('#searchResultDiv').on('click', '.editApp', function(evt) {
		
		var ruleId = $(this).parents(".vzuui-om-dropdown").attr('data');
		$(".hidedropdown").hide();
		var ruleDtlsObj = UTEADMIN.priorityRuleAdmin.searchRuleDtlMap[ruleId];
		
		UTEADMIN.priorityRuleAdmin.loadEditForm(ruleDtlsObj, false);
		
	});
	
	
	$('#searchResultDiv').on('click', '.deleteApp', function(evt) {
		
		var ruleId = $(this).parents(".vzuui-om-dropdown").attr('data');
		var ruleDtlsObj = UTEADMIN.priorityRuleAdmin.searchRuleDtlMap[ruleId];
		var deleteRowRef = $(this).closest('tr')[0];
		
		if (!confirm("Delete Operation is irreversible, Do you want to delete the selected Rule")) {
	        return false;
	    }
		
		$.ajax({
	        type: "POST",
	        url: CONTEXT_PATH + "/ute/admin/ruleadminnew/delete",
	        data : {
	        		"RuleName" : ruleDtlsObj.Name,
	        		"ApplicationName" : ruleDtlsObj.ApplicationName,
	        		"JobFunctionName" : ruleDtlsObj.JobfunctionName,
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
		
		UTEADMIN.priorityRuleAdmin.fetchRuleAttrDetails($(this).val());
		
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
	
	$("#conditionStartNode").on('click', '.addChildCondition', function(){
		
		var $addli = $(this).closest('li');
		
		var $li = UTEADMIN.priorityRuleAdmin.getNestedCondition($addli.data('level'), {});
		$li.insertAfter($addli);
		
		var $ul = $li.find('ul:first');
//		
//		if($ul.size() > 0){
//		
//		}
//		else{
//			$ul = $("<ul>");
//			$ul.data('level', $li.data('level') + 1);
//			$li.find('span.toggleHolder').empty().append('<i class="minusIcon"></i></span>');
//			$ul.appendTo($li);
//		}
		
		$ul.append(UTEADMIN.priorityRuleAdmin.addNewCondition($ul));
		
	});
	
	$("#conditionStartNode").on('click', '.addSiblingCondition', function(){
		
		var $addli = $(this).closest('li');
		
		var $li = UTEADMIN.priorityRuleAdmin.addNewCondition($addli);
		$li.insertAfter($addli);
		
	});
	
	$("#conditionStartNode").on('click', '.addCondition', function(){
		
		var $ul = $(this).closest('li').find('ul:first');
		
		$ul.append(UTEADMIN.priorityRuleAdmin.addNewCondition($ul));
		
	});
	
	
	$("#conditionStartNode").on('click', '.addTopCondition', function(){
	
		var $ul = $(this).closest('ul');
		$ul.append(UTEADMIN.priorityRuleAdmin.addNewCondition($ul));
		
	});
	
	$("#conditionStartNode").on('click', '.removeCondition', function(){
		
		$(this).closest('li.body').remove();
		
	});
	
	$("#conditionStartNode").on('click', '.minusIcon', function(){
		
		var $this = $(this);
		$this.closest('li.body').children('ul').hide();
		$this.removeClass('minusIcon').addClass('plusIcon');
		
	});
	
	$("#conditionStartNode").on('click', '.plusIcon', function(){
		
		var $this = $(this);
		$this.closest('li.body').children('ul').show();
		$this.removeClass('plusIcon').addClass('minusIcon');
		
	});
	
	
//	$("#conditionStartNode").on('change', '.leftOperand3', function(){
//		
//		var $this = $(this);
//		var optionsDtls = [];
//		var firstComponentName = "";
//		
//		for(var k in UTEADMIN.priorityRuleAdmin.ruleAttributesMap['TreeStructure'][$this.val()]){
//			optionsDtls.push(k);
//			
//			if(! firstComponentName){
//				firstComponentName = k;
//			}
//		}
//		
//		var $singleRuleDiv = $this.closest('li.body > div');
//		
//		$singleRuleDiv.find('.leftOperand2:first').html(UTEADMIN.priorityRuleAdmin.getOptionsStr("", optionsDtls));
//		$singleRuleDiv.find('.leftOperand1:first').html(UTEADMIN.priorityRuleAdmin.getOptionsStr("", UTEADMIN.priorityRuleAdmin.ruleAttributesMap['TreeStructure'][$this.val()][firstComponentName])).promise().done(function(){
//			
//			UTEADMIN.priorityRuleAdmin.changeRightOperatorControl(($singleRuleDiv.find('.leftOperand1:first').val() + firstComponentName + $this.val()), $this.parents('.leftOperandDiv').siblings('.RightOperandDiv'), '');
//			
//		});
//		
//	});
//	
//	$("#conditionStartNode").on('change', '.leftOperand2', function(){
//		
//		var $this = $(this);
//		var optionsDtls = [];
//		var firstComponentName = "";
//		
//		$this.closest('li.body > div').find('.leftOperand1:first').html(UTEADMIN.priorityRuleAdmin.getOptionsStr("", UTEADMIN.priorityRuleAdmin.ruleAttributesMap['TreeStructure'][$this.closest('li.body > div').find('.leftOperand3:first').val()][$this.val()]));
//		
//	});
	
	
	$("#conditionStartNode").on('change', '.leftOperand1', function(){
		
		var $this = $(this);
		var optionsDtls = [];
		var firstComponentId = "";
		
		for(var k in UTEADMIN.priorityRuleAdmin.ruleAttributesMap['TreeStructure'][$this.val()]){
			optionsDtls.push(k);
			
			if(! firstComponentId){
				firstComponentId = k;
			}
		}
		
		var $singleRuleDiv = $this.closest('li.body > div');
		
		$singleRuleDiv.find('.leftOperand2:first').html(UTEADMIN.priorityRuleAdmin.getOptionsStr("", optionsDtls));
		$singleRuleDiv.find('.leftOperand3:first').html(UTEADMIN.priorityRuleAdmin.getOptionsStr("", UTEADMIN.priorityRuleAdmin.ruleAttributesMap['TreeStructure'][$this.val()][firstComponentId])).promise().done(function(){
			
			UTEADMIN.priorityRuleAdmin.changeRightOperatorControl(($this.val() + firstComponentId + $singleRuleDiv.find('.leftOperand3:first').val()), $this.parents('.leftOperandDiv').siblings('.RightOperandDiv'), '');
			
		});
		
	});
	
	$("#conditionStartNode").on('change', '.leftOperand2', function(){
		
		var $this = $(this);
		var optionsDtls = [];
		
		var $singleRuleDiv = $this.closest('li.body > div');
		
		$singleRuleDiv.find('.leftOperand3:first').html(UTEADMIN.priorityRuleAdmin.getOptionsStr("", UTEADMIN.priorityRuleAdmin.ruleAttributesMap['TreeStructure'][$singleRuleDiv.find('.leftOperand1:first').val()][$this.val()])).promise().done(function(){
			
			UTEADMIN.priorityRuleAdmin.changeRightOperatorControl(($singleRuleDiv.find('.leftOperand1:first').val() + $this.val() + $singleRuleDiv.find('.leftOperand3:first').val()), $this.parents('.leftOperandDiv').siblings('.RightOperandDiv'), '');
			
		});
		
	});
	
	$("#conditionStartNode").on('change', '.leftOperand3', function(){
		var $this = $(this);
		var $singleRuleDiv = $this.closest('li.body > div');
		
		UTEADMIN.priorityRuleAdmin.changeRightOperatorControl(($singleRuleDiv.find('.leftOperand1:first').val() + $singleRuleDiv.find('.leftOperand2:first').val() + $this.val()), $this.parents('.leftOperandDiv').siblings('.RightOperandDiv'), '');
		
	});
	
	
	$("body").on('change', '.outcomeTypeSelect', function(){
		var $this = $(this);
		
		UTEADMIN.priorityRuleAdmin.changeOutcomeValueControl($this);
	});
	
	
	$("body").on('change', '#outcomeType', function(){
		var $this = $(this);
		
		UTEADMIN.priorityRuleAdmin.changeOutcomeValueControl($this);
	});
	
	$("#EffectiveRange").daterangepicker({
		dateFormat : "yy-mm-dd",
		posX : $("#EffectiveRange").offset().left,
		posY : $("#EffectiveRange").offset().top + 28,
		rangeSplitter : "to",
		presets : {
			dateRange: 'Date Range'
		},
		presetRanges: [
		   			], 
		onOpen : function(){
			$(".ui-daterangepickercontain").css('left', ($("#EffectiveRange").offset().left));
			$(".ui-daterangepickercontain").css('top', ($("#EffectiveRange").offset().top + 28));
		}
	});
	
	$('#addUserLink').click(function(evt) {
		
		evt.stopPropagation();
       
		UTEADMIN.priorityRuleAdmin.addUserDialog();
		
		return false;
		
	});
	
	
	$("#dialog-user-add").on('change', ".vgrid-selector-checkbox", function(){
		  $this = $(this);
		  var currState = $this.prop('checked');
		  $(".vgrid-selector-checkbox").prop('checked', false);
		  $this.prop('checked', currState);
	});
	
	
	var dbox = $("#dialog-user-add");
	var selected_rows = null;

	dbox.dialog({
	        title: "Search and Select User",
	        resizable: false,
	        width: 892,
	        height:540,
	        modal: true,
	        autoOpen: false,
	        buttons: {	
	                SelectUser: function(){
	                    
	                    dbox.find("#vgrid_container").vgrid('getSelectedRowsDataHashmap', function(rows,rowArr) {                            
	                        selected_rows = rowArr;                                  
	                    });         

	                    if (selected_rows.length == 0) {            
	                        //alert("Please select a row first");
	                        alertOption.displayMessage="Please select atleast one user.";
	                        alertDialog(alertOption);
	                        return false;
	                    }
	                    
	                    $.each(selected_rows, function(index, $selectedUserRow){
	                    	
	                		var id = $selectedUserRow.find(".vgrid-column[data-name=id]").text().toUpperCase();
	                		var displayText = $selectedUserRow.find(".vgrid-column[data-name=lastname]").text() + ", " + $selectedUserRow.find(".vgrid-column[data-name=firstname]").text();
	                		
	                		$("#detailsForm #userId").val(id);
	                    	$("#detailsForm #userName").val(displayText);
	                    	
	                    	$("#detailsForm #userNameDispSpan").html(displayText);
	                    	
	                    	$("#detailsForm #addUserLink").html('Change User');
	                    		
	                    });
	                    
	                    dbox.dialog("close");

	                },
	                Cancel: function() {
	                        //$(this).dialog("close");
	                        dbox.dialog("close");
	                }
	        }
	       });
	       
	       
	dbox.find("#transfer-search").keypress(function (e) {
	    var key = e.which;
	    if(key == 13){doSearch();}
	});

});

function customRange(input) {
  if (input.id == 'EffectiveTo') {
    return {
      minDate: $('#EffectiveFrom').datepicker("getDate")
    };
  } else if (input.id == 'EffectiveFrom') {
    return {
      maxDate: $('#EffectiveTo').datepicker("getDate")
    };
  }
}


window.UTEADMIN = window.UTEADMIN || {};
UTEADMIN.priorityRuleAdmin = UTEADMIN.priorityRuleAdmin || {};
UTEADMIN.util = UTEADMIN.util || {};
UTEADMIN.priorityRuleAdmin.searchRuleDtlMap = {};
UTEADMIN.priorityRuleAdmin.dropdownMetaMap = {};
UTEADMIN.priorityRuleAdmin.ruleAttributesMap = {};


UTEADMIN.priorityRuleAdmin.fetchRuleAttrDetails = function (applicationId, callbackFunction) {
	
	var paramDetails = {"applicationId" : applicationId};
	
    $.ajax({
        type: "GET",
        url: CONTEXT_PATH + "/ute/admin/ruleadminnew/getruleattrdetails",
        data: paramDetails,
    }).done(function (dropdownDetails) {
    	
    	UTEADMIN.priorityRuleAdmin.ruleAttributesMap = dropdownDetails;
    	
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


UTEADMIN.priorityRuleAdmin.fetchRuleAttrDetailsReverse = function (applicationId, callbackFunction) {
	
	var paramDetails = {"applicationId" : applicationId};
	
    $.ajax({
        type: "GET",
        url: CONTEXT_PATH + "/ute/admin/ruleadminnew/getruleattrreverse",
        data: paramDetails,
    }).done(function (dropdownDetails) {
    	
    	UTEADMIN.priorityRuleAdmin.ruleAttributesMap = dropdownDetails;
    	
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
    	$("#searchLoadingDiv").hide();
    	alertOption.displayMessage= "Failure in calling UTE Service";
    	homeWindow.alertDialog(alertOption);
    	
    }); 
}



UTEADMIN.priorityRuleAdmin.renderSearchResult = function (searchParams) {
	
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
        				
        				for (var i = 0, c = ruleDtls.length; i < c; i++) {
            	        	ruleResultHtmlData.push([
            	        	    '<span class="vzuui-om-menu"></span><div id="popupBlock" class="vzuui-om-dropdown hidedropdown" data="' + ruleDtls[i].Name + '"><ul id="vzuui-task-actions"><li class="editApp">Edit</li><li class="deleteApp">Delete</li></ul></div>',
            	        	    (ruleDtls[i].Name ? ruleDtls[i].Name : ""),
            	        	    (ruleDtls[i].StatusDisplay ? ruleDtls[i].StatusDisplay : ""),
            	        	    (ruleDtls[i].WorkgroupDisplayTxt ? ruleDtls[i].WorkgroupDisplayTxt : ""),
            	        	    (ruleDtls[i].SkillsetDisplayTxt ? ruleDtls[i].SkillsetDisplayTxt : ""),
            	        	    (ruleDtls[i].Priority ? ruleDtls[i].Priority : ""),
            	        	    (ruleDtls[i].EffectiveFrom ? ruleDtls[i].EffectiveFrom : ""),
            	        	    (ruleDtls[i].EffectiveTo ? ruleDtls[i].EffectiveTo : ""),
            	            ]);
            	        	
            	        	UTEADMIN.priorityRuleAdmin.searchRuleDtlMap[ruleDtls[i].Name] = ruleDtls[i];
            	        }
        				
        			}
        			else{
        				
        				ruleResultHtmlData.push([
        		            	        	    '<span class="vzuui-om-menu"></span><div id="popupBlock" class="vzuui-om-dropdown hidedropdown" data="' + ruleDtls.Name + '"><ul id="vzuui-task-actions"><li class="editApp">Edit</li><li class="deleteApp">Delete</li></ul></div>',
        		            	        	    (ruleDtls.Name ? ruleDtls.Name : ""),
        		            	        	    (ruleDtls.StatusDisplay ? ruleDtls.StatusDisplay : ""),
        		            	        	    (ruleDtls.WorkgroupDisplayTxt ? ruleDtls.WorkgroupDisplayTxt : ""),
        		            	        	    (ruleDtls.SkillsetDisplayTxt ? ruleDtls.SkillsetDisplayTxt : ""),
        		            	        	    (ruleDtls.Priority ? ruleDtls.Priority : ""),
        		            	        	    (ruleDtls.EffectiveFrom ? ruleDtls.EffectiveFrom : ""),
        		            	        	    (ruleDtls.EffectiveTo ? ruleDtls.EffectiveTo : ""),
        		            	            ]);
        		            	        	
        				UTEADMIN.priorityRuleAdmin.searchRuleDtlMap[ruleDtls.Name] = ruleDtls;
        			
        			}
        	}
        	catch(e){
        		erroMsg = uteReturnData.Body.Fault.detail.UTEServiceFault.FaultDescription;
        	}
    	}
    	
    	UTEADMIN.priorityRuleAdmin.renderSearchDataTable(ruleResultHtmlData, erroMsg);
    	
    	
        $("#searchResultDiv").show();
		$("#searchLoadingDiv").hide();
    	
    }).error(function(){
    	$("#searchLoadingDiv").hide();
    	alertOption.displayMessage= "Failure in calling UTE Service";
    	homeWindow.alertDialog(alertOption);
    	
    }); //closes the ajax call
}


UTEADMIN.priorityRuleAdmin.loadStandaloneForm = function () {
	UTEADMIN.priorityRuleAdmin.setLoadingGifPosition();
	$("#searchLoadingDiv").show();
	var searchParams = [
	                     {name : 'ApplicationName', value : editTaskSource},
	                     {name : 'JobfunctionName', value : editRulesetName},
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
        				
        				for (var i = 0, c = ruleDtls.length; i < c; i++) {
            	        	UTEADMIN.priorityRuleAdmin.searchRuleDtlMap[ruleDtls[i].Name] = ruleDtls[i];
            	        }
        				
        			}
        			else{
        				UTEADMIN.priorityRuleAdmin.searchRuleDtlMap[ruleDtls.Name] = ruleDtls;
        			}
        			
        			var ruleDtlsObj = UTEADMIN.priorityRuleAdmin.searchRuleDtlMap[editRuleName];
        			UTEADMIN.priorityRuleAdmin.loadEditForm(ruleDtlsObj, false);
        			
        	}
        	catch(e){
        		erroMsg = uteReturnData.Body.Fault.detail.UTEServiceFault.FaultDescription;
        	}
    	}
    	
		$("#searchLoadingDiv").hide();
    	
    }).error(function(){
    	$("#searchLoadingDiv").hide();
    	alertOption.displayMessage= "Failure in calling UTE Service";
    	homeWindow.alertDialog(alertOption);
    	
    }); //closes the ajax call
}


UTEADMIN.priorityRuleAdmin.loadStandaloneAddNew = function () {
	
	UTEADMIN.priorityRuleAdmin.fetchRuleAttrDetails(window.editTaskSource);
	$("#detailsForm #ApplicationName").val(window.editTaskSource);
	$("#detailsForm #JobfunctionName").val(window.editRulesetName);
	
	$("#detailsForm #ApplicationName, #detailsForm #JobfunctionName").prop('disabled', true);
    
    $("#detailsForm #IsUpdate").val("N");
}

UTEADMIN.priorityRuleAdmin.saveWgDetails = function (wgDetails) {
	
    $.ajax({
        type: "POST",
        url: CONTEXT_PATH + "/ute/admin/ruleadminnew/save",
        data: wgDetails,
    }).done(function (uteReturnData) {
    	
    	var saveMsg = "Failed to store rule";
    	
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
            			saveMsg = "Rule saved successfully";
            			
            			if(! (UTEADMIN.priorityRuleAdmin.standAloneEdit || UTEADMIN.priorityRuleAdmin.standAloneAddNew)){
            				$("#searchBtn").trigger('click');
                			$("#FormHeader").html("Add Rule");
                			
                			UTEADMIN.priorityRuleAdmin.resetForm("#detailsForm");
                	    	UTEADMIN.priorityRuleAdmin.enableForm("#detailsForm");
                	    	$( "#accordionPage" ).accordion({ active: 0 });
            			}
            			else{
            				$("#detailsForm #IsUpdate").val("Y");
            			}
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
    	
    	if(UTEADMIN.priorityRuleAdmin.standAloneEdit){
    		$("#detailsForm #ApplicationName,#detailsForm #Name,#detailsForm #JobfunctionName").prop('disabled', true);
    	}
    	else if(UTEADMIN.priorityRuleAdmin.standAloneAddNew){
    		$("#detailsForm #ApplicationName,#detailsForm #JobfunctionName").prop('disabled', true);
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

UTEADMIN.priorityRuleAdmin.fetchDropdownDetails = function () {
	
	var paramList = ["STATUS", "CONTINUITY_LEVEL", "SCHEDULING_REQUIRED", "IS_SUBGROUP","SUBGROUP_TYPE","OVERFLOW_USER","ROUTING_POLICY", "USER_TYPE"];
	var paramDetails = [];
	paramDetails.push({name : "parameter", value : JSON.stringify(paramList)});
	
    $.ajax({
        type: "POST",
        url: CONTEXT_PATH + "/ute/admin/workgroupnew/dropdowndetails",
        data: paramDetails,
    }).done(function (dropdownDetails) {
    	
    	UTEADMIN.priorityRuleAdmin.dropdownMetaMap = dropdownDetails;
    	
    	UTEADMIN.priorityRuleAdmin.dropdownMetaMap['OutcomeType'] = {
    														 "User": "User",
    	                                                     "Workgroup/Skillset": "Workgroup/Skillset",
    	                                                     "Role": "Role",
    	                                                     "Workgroup": "Workgroup"
    														};
    	UTEADMIN.priorityRuleAdmin.renderOrderByConditionDataTable(UTEADMIN.priorityRuleAdmin.getOutcomeMappingRow(""),"");
    	
//    	
//    	if(UTEADMIN.priorityRuleAdmin.standAloneEdit){
//    		UTEADMIN.priorityRuleAdmin.loadStandaloneForm();
//    	}
    	
    }).error(function(){
    	alertOption.displayMessage= "Failure in calling UTE Service";
    	homeWindow.alertDialog(alertOption);
    	
    }); 
}


UTEADMIN.priorityRuleAdmin.resetForm = function (formId) {
	
	$(formId +" input[type='text'], "+formId+" input[type='password'], "+formId+" input[type='hidden'], "+formId+" select, "+formId+" textarea" ).val("");
	
	$("#conditionStartNode > li.body").remove();
	
	$("#detailsForm #addUserLink").html('Add User');
	
//	var $ul = $("#conditionStartNode");
//	$ul.append(UTEADMIN.priorityRuleAdmin.addNewCondition($ul));
	
}

UTEADMIN.priorityRuleAdmin.disableForm = function (formId) {
	
	$(formId +" input[type='text'], "+formId+" input[type='password'], "+formId+" select, "+formId+" textarea, "+formId+" input[type='radio'], "+formId+" input[type='checkbox']" ).prop('disabled', true);
	$("#saveBtn").hide();
}

UTEADMIN.priorityRuleAdmin.enableForm = function (formId) {
	
	$(formId +" input[type='text'], "+formId+" input[type='password'], "+formId+" select, "+formId+" textarea, "+formId+" input[type='radio'], "+formId+" input[type='checkbox']" ).prop('disabled', false);
	$("#saveBtn").show();
}


UTEADMIN.priorityRuleAdmin.loadEditForm = function (ruleDetails, isDisable) {
	
	UTEADMIN.priorityRuleAdmin.resetForm("#detailsForm");
	
	$("#FormHeader").html("Edit Rule");
	
	$( "#accordionPage" ).accordion({ active: 1 });
    
    $.each(ruleDetails, function(elementId, elementValue){
        $("#detailsForm #"+ elementId).val(elementValue);
    });
    
    $("#detailsForm #ApplicationName,#detailsForm #Name,#detailsForm #JobfunctionName").prop('disabled', true);
    
    $("#detailsForm #IsUpdate").val("Y");
    
    var outcomeType = "";
    
    var ruleOutcomeObj = {}
    
    if(ruleDetails.RuleOutcomeList && ruleDetails.RuleOutcomeList.ruleOutcome){
    	ruleOutcomeObj = ruleDetails.RuleOutcomeList.ruleOutcome;
    }
    
    $("#detailsForm #workgroup,#detailsForm #skillset,#detailsForm #userSelectionDiv").hide();
    
    if(ruleOutcomeObj.workgroup){
    	
    	outcomeType = "Workgroup";
    	$("#detailsForm #workgroup").val(ruleOutcomeObj.workgroup).show();
    	
    	if(ruleOutcomeObj.skillset){
    		outcomeType = "Workgroup/Skillset";
    		$("#detailsForm #skillset").val(ruleOutcomeObj.skillset).show();
    	}
    }
    else if(ruleOutcomeObj.user){
    	
    	outcomeType = "User";
    	
    	$("#detailsForm #userSelectionDiv").show();
    	$("#detailsForm #userId").val(ruleOutcomeObj.user);
    	$("#detailsForm #userName").val(ruleOutcomeObj.userName);
    	
    	$("#detailsForm #userNameDispSpan").html(ruleOutcomeObj.userName);
    	
    	$("#detailsForm #addUserLink").html('Change User');
    }
    else if(ruleOutcomeObj.applicationRole){
    	
    	outcomeType = "Role";
    	
    	$("#detailsForm #applicationRole").val(ruleOutcomeObj.applicationRole).show();
    }
    
    $("#detailsForm #outcomeType").val(outcomeType);
    
    UTEADMIN.priorityRuleAdmin.fetchRuleAttrDetails(ruleDetails.ApplicationName, function(){
    	
    	UTEADMIN.priorityRuleAdmin.createConditionInDom(ruleDetails.Condition);
    	
    });
}

UTEADMIN.priorityRuleAdmin.changeRightOperatorControl = function (fullLeftOperandKey, $rightOperandDiv, currentValue) {
	
	var singleAttrDtls = UTEADMIN.priorityRuleAdmin.ruleAttributesMap.CompleteData[fullLeftOperandKey];
	
//	var $rightOperandDiv =  $leftOperandNode.parent('.leftOperandDiv').siblings('.RightOperandDiv');
	
	if(singleAttrDtls){
		if(singleAttrDtls.RuleAttributeType == 'CUSTOM_STRING'){
			
			var $control = UTEADMIN.priorityRuleAdmin.getInputAlone('RightOperand', 'text', currentValue);
			
		}
		else if(singleAttrDtls.RuleAttributeType == 'STRING'){
			
			var $control = UTEADMIN.priorityRuleAdmin.getSelectBox('RightOperand', currentValue, '', singleAttrDtls.RuleAttributeValues.Value, 'Select Right Operand', false, 'validate[required]');
			
		}
	}
	else{
		var $control = UTEADMIN.priorityRuleAdmin.getInputAlone('RightOperand', 'text', currentValue);
	}
	
	$rightOperandDiv.html($control);
}


UTEADMIN.priorityRuleAdmin.changeOutcomeValueControl = function ($outcomeType, outcomeDetails) {
	
	var $tdToInsert = $outcomeType.parent().next();
	
	$tdToInsert.children().hide();
	
	if($outcomeType.val() == "Workgroup"){
		$tdToInsert.children('#workgroup').show();
	}
	else if($outcomeType.val() == "Role"){
		
		$tdToInsert.children('#applicationRole').show();
	}
	else if($outcomeType.val() == "Workgroup/Skillset"){
		
		$tdToInsert.children('#workgroup,#skillset').show();
	}
	else{
		$tdToInsert.children('#userSelectionDiv').show();
	}
	
}


UTEADMIN.priorityRuleAdmin.changeOutcomeValueControlOld = function ($outcomeType, outcomeDetails) {
	
	var $tdToInsert = $outcomeType.parent().next();
	
	if($outcomeType.val() == "Workgroup"){
		var workGroupName = [];
		
		$.each(UTEADMIN.priorityRuleAdmin.dropdownMetaMap["WorkgroupName"], function(key, value){
			workGroupName.push(key);
		});
		$tdToInsert.html(UTEADMIN.priorityRuleAdmin.getSelectBox('OutcomeValue', currentValue, '', workGroupName, 'Select Workgroup', true));
	}
	else if($outcomeType.val() == "Role"){
		
		$tdToInsert.html(UTEADMIN.priorityRuleAdmin.getSelectBox('OutcomeValue', currentValue, '', UTEADMIN.priorityRuleAdmin.dropdownMetaMap["Role"], 'Select Role', true));
	}
	else if($outcomeType.val() == "Workgroup/Skillset"){
		
		var workGroupName = [];
		
		$.each(UTEADMIN.priorityRuleAdmin.dropdownMetaMap["WorkgroupName"], function(key, value){
			workGroupName.push(key);
		});
		
		var skillsetName = [];
		
		$.each(UTEADMIN.priorityRuleAdmin.dropdownMetaMap["Skillset"], function(key, value){
			skillsetName.push(key);
		});
		
		$tdToInsert.html(UTEADMIN.priorityRuleAdmin.getSelectBox('OutcomeValue1', currentValue, '', workGroupName, 'Select Workgroup', true));
		$tdToInsert.append(UTEADMIN.priorityRuleAdmin.getSelectBox('OutcomeValue2', currentValue, '', skillsetName, 'Select Skillset', true));
	}
	else{
		var $control = UTEADMIN.priorityRuleAdmin.getInputAlone('RightOperand', 'text', currentValue);
	}
	
}

UTEADMIN.priorityRuleAdmin.renderSearchDataTable = function (rowData, erroMsg) {
	
	$('#priorityRuleSearchResultDatagrid').dataTable({
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
				            "sTitle": "Rule Name",
				             "sWidth": "10%"
				        }, 
				        {
				            "sTitle": "Status",
				            "sWidth": "7%"
				        },
				        {
				            "sTitle": "Workgroup Name",
				            "sWidth": "10%"
				        }, {
				            "sTitle": "Skillset Name",
				            "sWidth": "10%"
				        }, {
				            "sTitle": "Priority",
				            "sWidth": "8%"
				        }, 
				        {
				            "sTitle": "Effective From",
				            "sWidth": "10%"
				        },
				        {
				            "sTitle": "Effective To",
				            "sWidth": "10%"
				        }, 
		        	],
	    "oLanguage": {
                        "sSearch": "Search",
                        "sZeroRecords": erroMsg,
                        "sProcessing": "Processing..."
            		},

    });
	
}


UTEADMIN.priorityRuleAdmin.renderOrderByConditionDataTable = function (rowData, erroMsg) {
	
	$('#conditionOrderDatagrid').dataTable({
//		"aaData": rowData,
		"bPaginate": false, 
		"sPaginationType": "full_numbers", 
		"bLengthChange": false, 
		"bFilter": false, 
		"bSort":false, 
		"bInfo": false, 
		"bAutoWidth": false, 
		"bDestroy": true,
		"sDom":'<"top"f>rt<"bottom"i><"clear">',
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




UTEADMIN.priorityRuleAdmin.getSingleCondition = function (liNode){
	
	var innerCondition = {};
	
	$.each($(liNode).children('div').children('div').children('input,select'), function(i, input){
		innerCondition[$(input).data('name')] = $(input).val();
	});
	
	if($(liNode).children('ul').size() > 0){
		innerCondition.Condition = UTEADMIN.priorityRuleAdmin.getConditions($(liNode).children('ul:first'))
	}
	
	return innerCondition;
}

UTEADMIN.priorityRuleAdmin.getConditions = function ($ul){
	
	var innerConditions = [];
	
	$.each($ul.children('li.body'), function(i, li){
		innerConditions.push(UTEADMIN.priorityRuleAdmin.getSingleCondition(li));
	});
	
	return innerConditions;
}

UTEADMIN.priorityRuleAdmin.addNewCondition = function ($ul, condition){
	
	var dropdownDetails = UTEADMIN.priorityRuleAdmin.ruleAttributesMap;
	
	if(! (dropdownDetails && dropdownDetails.CompleteData && Object.keys(dropdownDetails.CompleteData).length)){
		
		alertOption.displayMessage="Selected Task Source first before adding rule";
    	homeWindow.alertDialog(alertOption);
	}
	
	var level = $ul.data('level');
	var $li = $('<li class="body"></li>');
	var $div = $("<div>");

	$li.data('level', level);
	$li.addClass('level' + level);
	
	if(! condition){
		condition = {};
	}
	
	$li.append($div);
	
	$div.append(UTEADMIN.priorityRuleAdmin.getInvisibleBlock('addTopDiv adhocInlineBlock invisibleBlock'));
	
	var $leftOperandInput = UTEADMIN.priorityRuleAdmin.getLeftOperandBlock(condition);
	
	$leftOperandInput.prepend('<span class="toggleHolder"><i class="arrowIcon"></i></span>');
	
	for(var iter = 1; iter < level; iter++){
		$leftOperandInput.prepend('<span><i class="lineIcon"></i></span>');
	}
	
	$div.append($leftOperandInput);
	$div.append(UTEADMIN.priorityRuleAdmin.getSelectBlock('Operator', condition.Operator, 'Operator : ', {'EQ': 'Equal (==)','NE': 'Not Equal (!=)','GT': 'Greater Than (>)', 'LT': 'Lesser Than (<)','GE': 'Greater Than or Equal (>=)', 'LE': 'Lesser Than or Equal (<=)','IN': 'In','ENDSWITH': 'Ends With','STARTSWITH': 'Starts With', 'EQIGNORECASE':'Equals Ignore Case', 'LIKE':'Like'}));
	var $dummyDiv = UTEADMIN.priorityRuleAdmin.getInputBlock('text', 'RightOperand', condition.RightOperand, 'Right Operand : ');
	
	UTEADMIN.priorityRuleAdmin.changeRightOperatorControl(UTEADMIN.priorityRuleAdmin.currentSelectedAttrKey, $dummyDiv, condition.RightOperand)
	
	$div.append($dummyDiv);
	$div.append(UTEADMIN.priorityRuleAdmin.getSelectBlock('Connective', condition.Connective, 'Connective : ', ['AND','OR']));
	
	$div.append('<div class="ActionDiv adhocInlineBlock"><span class="addChildCondition" title="Add Child Condition"><i class="addNestedIcon"></i></span><span class="addSiblingCondition" title="Add Sibling Condition"><i class="addIcon"></i></span><span class="removeCondition" title="Delete Condition"><i class="trashIcon"></i></span></div>');
	
	return $li;
}


UTEADMIN.priorityRuleAdmin.getNestedCondition = function (level, condition){
	
	$li = $('<li class="body nestedDummyLi"></li>');
	var $div = $("<div>");
	var $enddiv = $("<div>");

	$li.data('level', level);
	$li.addClass('level' + level);
	
	if(! condition){
		condition = {};
	}
	
	$li.append($div);
	
	$ul = $("<ul>");
	$ul.data('level', $li.data('level') + 1);
	$ul.appendTo($li);
	
	$li.append($enddiv);
	
	$div.append(UTEADMIN.priorityRuleAdmin.getInvisibleBlock('addTopDiv adhocInlineBlock invisibleBlock'));
	var $operatorInput = UTEADMIN.priorityRuleAdmin.getSelectBlock('Operator', condition.Operator, 'Operator : ', {'NESTED':'(...)', 'NESTED_NOT':'NOT (...)'});
	
	$operatorInput.prepend('<span><i class="braceOpen"></i></span>');
	
	$operatorInput.prepend('<span class="toggleHolder"><i class="minusIcon"></i></span>');
	
	for(var iter = 1; iter < level; iter++){
		$operatorInput.prepend('<span><i class="lineIcon"></i></span>');
	}
	
	$div.append($operatorInput);
	$div.append('<div class="ActionDiv adhocInlineBlock"><span class="addChildCondition" title="Add Child Condition"><i class="addNestedIcon"></i></span><span class="addSiblingCondition" title="Add Sibling Condition"><i class="addIcon"></i></span><span class="removeCondition" title="Delete Condition"><i class="trashIcon"></i></span></div>');
	
	var $connectiveInput = UTEADMIN.priorityRuleAdmin.getSelectBlock('Connective', condition.Connective, 'Connective : ', ['AND','OR']);
	$connectiveInput.prepend('<span><i class="braceClose"></i></span>');
	
	for(var iter = 1; iter <= level; iter++){
		$connectiveInput.prepend('<span><i class="lineIcon"></i></span>');
	}
	
	$enddiv.append(UTEADMIN.priorityRuleAdmin.getInvisibleBlock('addTopDiv adhocInlineBlock invisibleBlock'));
	
	$enddiv.append($connectiveInput);
	
	return $li;
}


UTEADMIN.priorityRuleAdmin.createHeader = function ($ul){
	
	var $li = $('<li class="header"></li>');
	var $div = $("<div>");
	
	$div.append('<div class="addTopDiv adhocInlineBlock"><span class="addTopCondition" title="To Add condition"><i class="addIcon"></i></span></div>');
	$div.append('<div class="leftOperandDiv adhocInlineBlock">Left Operand</div>');
	$div.append('<div class="OperatorDiv adhocInlineBlock">Operator</div>');
	$div.append('<div class="RightOperandDiv adhocInlineBlock">Right Operand</div>');
	$div.append('<div class="ConnectiveDiv adhocInlineBlock">Connective</div>');
	$div.append('<div class="ActionDiv adhocInlineBlock">Action</div>');

	$li.append($div);
	$ul.append($li);
	
//	$ul.append(UTEADMIN.priorityRuleAdmin.addNewCondition($ul));
	
	return $li;
}

UTEADMIN.priorityRuleAdmin.getInputBlock = function (type, name, value, label){
	
	var $div = $('<div class="adhocInlineBlock"></div>');
	$div.addClass(name + "Div");
	
	$div.append(UTEADMIN.priorityRuleAdmin.getInputAlone(name, type, value));
	
	return $div;
}

UTEADMIN.priorityRuleAdmin.getSelectBlock = function (name, value, label, optionsDtls, selectClass){
	
	var $div = $('<div class="adhocInlineBlock"></div>');
	$div.addClass(name + "Div");
	
	$div.append(UTEADMIN.priorityRuleAdmin.getSelectBox(name, value, label, optionsDtls,false, false, selectClass));
	
	return $div;
}


UTEADMIN.priorityRuleAdmin.getInvisibleBlock = function (divClass){
	
	var $div = $('<div class="' + divClass + '"></div>');
	
	return $div;
}


//UTEADMIN.priorityRuleAdmin.getLeftOperandBlock = function (condition){
//	
//	var $div = $('<div class="adhocInlineBlock"></div>');
//	$div.addClass("leftOperandDiv");
//	
//	var attributeList = [];
//	var componentNameList = [];
//	var componentIdList = [];
//	
//	var firstAttr = "";
//	var firstCompName = "";
//	
//	for(var k in UTEADMIN.priorityRuleAdmin.ruleAttributesMap['TreeStructure']){
//		attributeList.push(k);
//		
//		if(! firstAttr){
//			firstAttr = k;
//		}
//	}
//	
//		
//	for(var k in UTEADMIN.priorityRuleAdmin.ruleAttributesMap['TreeStructure'][(condition.leftOperand3 ? condition.leftOperand3 : firstAttr)]){
//		componentNameList.push(k);
//		
//		if(! firstCompName){
//			firstCompName = k;
//		}
//	}
//	
//	componentIdList = UTEADMIN.priorityRuleAdmin.ruleAttributesMap['TreeStructure'][(condition.leftOperand3 ? condition.leftOperand3 : firstAttr)][(condition.leftOperand2 ? condition.leftOperand2 : firstCompName)];
//	
//	$div.append(UTEADMIN.priorityRuleAdmin.getSelectBox("leftOperand3", condition.leftOperand3, "Left Operand3 :", attributeList));
//	$div.append(UTEADMIN.priorityRuleAdmin.getSelectBox("leftOperand2", condition.leftOperand2, "Left Operand2 :", componentNameList));
//	$div.append(UTEADMIN.priorityRuleAdmin.getSelectBox("leftOperand1", condition.leftOperand1, "Left Operand1 :", componentIdList));
//	
//	return $div;
//}


UTEADMIN.priorityRuleAdmin.getLeftOperandBlock = function (condition){
	
	var $div = $('<div class="adhocInlineBlock"></div>');
	$div.addClass("leftOperandDiv");
	
	var componentNameList = [];
	var componentIdList = [];
	var attributeList = [];
	
	var firstCompName = "";
	var firstCompId = "";
	
	for(var k in UTEADMIN.priorityRuleAdmin.ruleAttributesMap['TreeStructure']){
		componentNameList.push(k);
		
		if(! firstCompName){
			firstCompName = k;
		}
	}
	
	var componentNameUsed = (condition.leftOperand1 ? condition.leftOperand1 : firstCompName);
		
	for(var k in UTEADMIN.priorityRuleAdmin.ruleAttributesMap['TreeStructure'][componentNameUsed]){
		componentIdList.push(k);
		
		if(! firstCompId){
			firstCompId = k;
		}
	}
	
	var componentIdUsed = (condition.leftOperand2 ? condition.leftOperand2 : firstCompId);
	
	attributeList = UTEADMIN.priorityRuleAdmin.ruleAttributesMap['TreeStructure'][componentNameUsed][componentIdUsed];
	
	$div.append(UTEADMIN.priorityRuleAdmin.getSelectBox("leftOperand1", condition.leftOperand1, "Left Operand1 :", componentNameList));
	$div.append(UTEADMIN.priorityRuleAdmin.getSelectBox("leftOperand2", condition.leftOperand2, "Left Operand2 :", componentIdList));
	$div.append(UTEADMIN.priorityRuleAdmin.getSelectBox("leftOperand3", condition.leftOperand3, "Left Operand3 :", attributeList));
	
	UTEADMIN.priorityRuleAdmin.currentSelectedAttrKey = componentNameUsed + componentIdUsed + (condition.leftOperand3 ? condition.leftOperand3 : attributeList[0]);
	
	return $div;
}


UTEADMIN.priorityRuleAdmin.getSelectBox = function (name, value, label, optionsDtls, firstDummyOption, setNameAttr, selectClass){
	
	var $select = $("<select>");
	
	$select.addClass(name);
	
	if(selectClass){
		$select.addClass(selectClass);
	}
	
	$select.data('name', name);
	
	if(setNameAttr){
		$select.attr('name', name);
	}
		
	$select.html(UTEADMIN.priorityRuleAdmin.getOptionsStr(value, optionsDtls, firstDummyOption));
	
	return $select;
}


UTEADMIN.priorityRuleAdmin.getInputAlone = function (name, type, value){
	var $input = $("<input>");
	$input.addClass(name);
	
	$input.data('name', name);
	$input.attr('type', type);
	$input.val(value);
	
	return $input;
}


UTEADMIN.priorityRuleAdmin.getOptionsStr = function (value, optionsDtls, startOption){
	
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

UTEADMIN.priorityRuleAdmin.createConditionInDom = function (conditions){
	
	$("#conditionStartNode").children('li.body').remove();
	UTEADMIN.priorityRuleAdmin.putAllConditionsInDom(conditions, $("#conditionStartNode"));
}

UTEADMIN.priorityRuleAdmin.putAllConditionsInDom = function (conditions, $ul){
	
    if($.type(conditions) != "array"){
    	conditions = [conditions]
    }
	
	$.each(conditions, function(index, singleCondition){
		UTEADMIN.priorityRuleAdmin.putSingleConditionInDom(singleCondition, $ul);
	});
}

UTEADMIN.priorityRuleAdmin.putSingleConditionInDom = function (singleCondition, $ulToAddCondition){
	
	if(singleCondition.Condition){
		var $li = UTEADMIN.priorityRuleAdmin.getNestedCondition($ulToAddCondition.data('level'), singleCondition);
		$ulToAddCondition.append($li);
		
		var $ul = $li.find('ul:first');
	
		UTEADMIN.priorityRuleAdmin.putAllConditionsInDom(singleCondition.Condition, $ul);
	}
	else{
		$ulToAddCondition.append(UTEADMIN.priorityRuleAdmin.addNewCondition($ulToAddCondition, singleCondition));
	}
	
}


UTEADMIN.priorityRuleAdmin.getOutcomeMappingRow = function (outcomeType) {
	
	return [
	        [
            '<select name="outcomeType" class="type validate[required] outcomeTypeSelect"><option value="">Select Outcome Type</option>' + 
            			UTEADMIN.priorityRuleAdmin.getOptionsStr(outcomeType, UTEADMIN.priorityRuleAdmin.dropdownMetaMap["OutcomeType"]) + '</select>',
            '']
		   ];
}

UTEADMIN.priorityRuleAdmin.getOptionHTML = function (paramName, selectValue) {
	
	var propertyTypeOption = "";
	
	$.each(UTEADMIN.priorityRuleAdmin.dropdownMetaMap[paramName], function(key, value){
		
		propertyTypeOption = propertyTypeOption + '<option value="' + value + '"' + ((value == selectValue) ? " selected ":" ") + '>' + key + '</option>';	
 		
    });
	
	return propertyTypeOption;
	
}


UTEADMIN.priorityRuleAdmin.addUserDialog = function () {
	
	var dbox = $("#dialog-user-add");
    dbox.find("#vgrid_container .vgrid-body").empty();
    dbox.dialog('open');
    doReset();   
	
}



function doReset(){
    $("#transfer-search,#first-name,#last-name").val("");
}

function doSearch(){
  
 
  $("#content-spinny").show();
  
  var user=$("#transfer-search").val();
  user=$.trim(user);
  
  var vzid=user;
  var fname = $.trim($("#first-name").val());
  var lname = $.trim($("#last-name").val());
  
  
  if(user.indexOf(",")!=-1){
      var na=user.split(",");
      fname=$.trim(na[0]);
      lname=$.trim(na[1]);
  }
  else{      
      vzid=user;
  }
   
  $.ajax({
      url: CONTEXT_PATH +  "/ute/apps/user/search",
      data:{vzid:vzid,firstName:fname,lastName:lname},
      type:"POST",
      success: function(data) {
          var vgw=$("#vgrid-wrapper");
          vgw.empty();
          vgw.append(data);
          $("#vgrid_container").vgrid({
              trackGridHorizScroll: true,
              settingsMenu: false,
              multiSelect:false,
              sortJs: true
          });
          
          $("#content-spinny").hide();
      },
      fail:function(){
           $("#content-spinny").hide();
      }
  });

}


UTEADMIN.priorityRuleAdmin.setLoadingGifPosition = function() {
	
	$("#searchLoadingDiv").css('top', ($(window).height()/2) - 10);
	$("#searchLoadingDiv").css('left',($(window).width()/2) - 10);
}