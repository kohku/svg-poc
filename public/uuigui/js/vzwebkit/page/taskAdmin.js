window.UTEADMIN = window.UTEADMIN || {};
UTEADMIN.taskAdmin = UTEADMIN.taskAdmin || {};
UTEADMIN.util = UTEADMIN.util || {};
UTEADMIN.taskAdmin.userListSeq = 0;
UTEADMIN.taskAdmin.searchTaskDtlMap = {};
UTEADMIN.taskAdmin.addRuleset = {};
UTEADMIN.taskAdmin.deleteRuleset = {};
UTEADMIN.taskAdmin.renderRulesetDataTable = {};
populateRulesetDetails = [];
populateRulesList = [];
tempSLAArray = [];
tempNtfctnArray = [];
tempStngsArray = [];
var tasksMetadataCreateContnt = "";
var alertOption = {title: "Info"};
UTEADMIN.taskAdmin.dropdownMetaMap = {
		"taskDurationSettings" : {"Escalate After":"Escalate After","Expire After":"Expire After","Never Expire":"Never Expire","Renew After":"Renew After"},
		"statusDropdown" : {"Alerted":"ALERT","Assign":"ASSIGN","All other actions":"ALL_OTHER_ACTIONS","Complete":"COMPLETE","Error":"ERROR","Expire":"EXPIRE","Request_Info":"INFO_REQUEST","Resume":"RESUME","Suspend":"SUSPEND","Update":"UPDATE","Update Outcome":"OUTCOME_UPDATE","Withdraw":"WITHDRAW"},
		"recipientDropdown" : {"Assignees":"ASSIGNEES","Approvers":"APPROVERS","Initiator":"CREATOR","Owner":"OWNER","Reviewer":"REVIEWERS"}
};

$(document).ready(function(){
	$('.mainbox').show();
	tasksMetadataCreateContnt = $(".TasksMetadata" ).html();
	$(document).off();
	$("#FormHeader").hide();
	UTEADMIN.taskAdmin.initPage();	
	
	$("#taskSearchBtn").click(function(){
		UTEADMIN.taskAdmin.setLoadingGifPosition();
		$("#searchResultDiv").hide();
		$("#searchLoadingDiv").show();

		var searchParams = $('#tasksearchForm').serializeArray();	

		UTEADMIN.taskAdmin.renderSearchResult(searchParams);
		//UTEADMIN.taskAdmin.assignEditDeleteClickEvt();

	});
	
	$("#taskClearBtn").click(function(){
		$("#TaskName_search").val('');
	});
	
	$("#createTaskBtn").click(function(){
		$(".TasksMetadata").html(tasksMetadataCreateContnt);
		$("#FormHeader").show();
		$(document).off();
    	UTEADMIN.taskAdmin.initPage();
    	$("#FormHeader").html("Create Task Metadata");
    	$( "#taskAccordionPage").accordion({active: 1});
	});
	
});

	$('#searchResultDiv').on('click', '.deleteApp', function(evt) {
		
		var taskName = $(this).parents(".vzuui-om-dropdown").find(':hidden').val();
		var deleteRowRef = $(this).closest('tr')[0];
		
		if (!confirm("Delete Operation is irreversible, Do you want to delete the selected Task")) {
	        return false;
	    }
		
		UTEADMIN.taskAdmin.setLoadingGifPosition();
		
		$("#searchLoadingDiv").show();
		
		$.ajax({
	        type: "DELETE",
	        url: CONTEXT_PATH + "/ute/admin/taskAdmin/delete?taskName=" + taskName,
	    }).done(function (uteReturnData) {
	    	
	        var deleteMsg = "Failed to delete task";
	    	
	    	if(uteReturnData){
	    		try{
	        		if(uteReturnData.Body.processTaskInfoResponse.faultInfo.FaultCode == "UTE0000" || uteReturnData.Body.processTaskInfoResponse.faultInfo.FaultCode == "NO_ERROR"){
	        			deleteMsg = "Task deleted successfully";
	        			
	        			$('#searchResultDatagrid').dataTable().fnDeleteRow(deleteRowRef);
	        			
	        		}
	        		else{
	        			deleteMsg = uteReturnData.Body.processTaskInfoResponse.faultInfo.FaultDescription;
	        		}
	        	}
	        	catch(e){
	        		deleteMsg = deleteMsg;
	        	}
	    	}
	    	
	    	$("#searchLoadingDiv").hide();
	    	
	    	alertOption.displayMessage=deleteMsg;
	    	alertDialog(alertOption);
	    	
	        return false;
	    	
	    }); //closes the ajax call
		$("#searchLoadingDiv").hide();
	});
	
	
$('#searchResultDiv').on('click', '.editApp', function(evt) {
		$("#FormHeader").show();
		var taskId = $(this).parents(".vzuui-om-dropdown").attr('data');
		$(".hidedropdown").hide();
		var taskDtls = UTEADMIN.taskAdmin.searchTaskDtlMap[taskId];
		UTEADMIN.taskAdmin.loadEditForm(taskDtls, false);
		
});
	
$('#searchResultDiv').on('click', '.viewTaskDetails', function(evt) {
		$("#FormHeader").show();
		var taskId = $(this).parents().find('.vzuui-om-dropdown').attr('data');
		$(".hidedropdown").hide();
		var taskDtls = UTEADMIN.taskAdmin.searchTaskDtlMap[taskId];
		UTEADMIN.taskAdmin.loadEditForm(taskDtls, false);
		$("#FormHeader").html("View Task Metadata");
		UTEADMIN.taskAdmin.disableForm("#taskDetailsForm");
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


UTEADMIN.taskAdmin.initPage = function (){

			$('.remodal .remodal-close').hide();
			$('.remodal h2 .remodal-close,.action_notification .remodal-close').show();
			$('input[type="checkbox"]').vzuuiprettyCheckable();
			$('#taskDetailsForm').validationEngine();
			
			UTEADMIN.taskAdmin.renderRulesetDataTable([],"Click '+' icon to add Ruleset application mapping");
			var slaDefaultRow = [];
			slaDefaultRow.push(['<input type="checkbox" name="defaultSLACheckbox" class="row-id-box-default" disabled id="">',
			                     '<label>Default</label>',
			                     '<select name="taskDurationSettings" class="type validate[required] durationSelect"><option value="">Select duration</option>'+UTEADMIN.taskAdmin.getOptionHTML("taskDurationSettings", "Never Expire")+'</select>',
			                     '<div class="daysdiv"><label>NA</label></div>',
			                     '<div class="hoursdiv"><label>NA</label></div>',
			                     '<div class="minutesdiv"><label>NA</label></div>',
			                     '<div class="maxrenewaldiv"><label>NA</label></div>',
			                     '<label></label>'
			                     ]);
			UTEADMIN.taskAdmin.renderSLAAttributesDataTable(slaDefaultRow,"Click '+' icon to add SLA Attributes");
			UTEADMIN.taskAdmin.statusChangeNtfctnTable([],"");
			
			$("#taskAssRlsDatagrid").on("change", "#select_all", function() {
		        $("#taskAssRlsDatagrid .row-id-box").prop("checked", $(this).prop("checked"));
		    });
			
			$("#rulesListTable").on("change", "#select_all_rules", function() {
		        $("#rulesListTable .row-id-box").prop("checked", $(this).prop("checked"));
		    });
			
			$("#slaAttrDatagrid").on("change", "#select_all_slaAttr", function() {
		        $("#slaAttrDatagrid .row-id-box").prop("checked", $(this).prop("checked"));
		    });
			
			
			$("#statusChangeDatagrid").on("change", "#select_all_statusChange", function() {
		        $("#statusChangeDatagrid .row-id-box").prop("checked", $(this).prop("checked"));
		    });
			
			
			$("#slaAttrDatagrid").on("change", ".durationSelect", function() {
			if($(this).val() == "Never Expire"){
				$(this).parents().siblings().children(".daysdiv , .hoursdiv, .minutesdiv, .maxrenewaldiv").empty().html('<label>NA</label>');
			}
			else{
				$(this).parents().siblings().children(".daysdiv").empty().html('<input type="number" min="0" name="daysInput" class="" id="">');
				$(this).parents().siblings().children(".hoursdiv").empty().html('<input type="number" min="0" name="hoursInput" class="" id="">');
				$(this).parents().siblings().children(".minutesdiv").empty().html('<input type="number" min="0" name="minutesInput" class="" id="">');
				$(this).parents().siblings().children(".maxrenewaldiv").empty().html('<input type="number" min="0" name="maxrenewalInput" class="" id="">');
			}
			if($(this).val() == "Expire After"){
				$(this).parents().siblings().children(".maxrenewaldiv").empty().html('<input type="number" min="0" name="maxrenewalInput" class="" id="" disabled>');
			}
			});
			
			$("#taskDetailsForm").on('click','.chooseSLAAttrbts, .chooseNotificationAttrbts, .slaSettingsBtn', function(){
				if($(this).siblings().val())
				{   
					tempSLAArray = [];
					tempNtfctnArray = [];
					tempStngsArray = [];
					
					var keyValArr = [];
					var keyArr = [];
					var alreadySelected = $(this).siblings().val();
					var singleAttrArr =  alreadySelected.split(',');
					if(singleAttrArr!=null || singleAttrArr!=""){
						for(var i=0;i<singleAttrArr.length;i++){
						if(singleAttrArr[i].indexOf('~')!= -1){
							keyValArr.push(singleAttrArr[i].split('~'));
						}
						else{
							keyArr.push(singleAttrArr[i]);
						}
						}
					}
					else{
						keyValArr.push(alreadySelected.split('~'));
					}
				}
				$(".clickedtd").parents("table").find(".clickedtd").removeClass("clickedtd");
				$(this).parent("td").addClass("clickedtd");
				var applicationName = $('#applicationName').val();
				if($(this).hasClass("chooseSLAAttrbts")){
					var slaFlag = "Y";
				}
				else{
					var slaFlag = "";
				}
				var paramDetails = {"applicationName" : applicationName, "slaFlg" : slaFlag};
				var currentAnchObj = $(this);
				var errorMsg = "";
				$.ajax({
			        type: "GET",
			        url: CONTEXT_PATH + "/ute/admin/taskAdmin/addSLANtfctnAttr",
			        data: paramDetails
			    }).done(function (uteReturnData) {
			    	var attrResultHtmlData = [];
			    	var ntfctnAttrHtmlData = [];
			    	var erroMsg = "";
			    	if(uteReturnData.Body){
			    		try{
			    			//console.log(uteReturnData);
			    			if(uteReturnData.Body.processHumantaskParamMapInfoResponse.HumantaskParamMapTypeList.faultInfo.FaultCode == "UTE0000" || uteReturnData.Body.processHumantaskParamMapInfoResponse.HumantaskParamMapTypeList.faultInfo.FaultCode == "NO_ERROR"){
			    				var HumantaskParamMapResponseList = uteReturnData.Body.processHumantaskParamMapInfoResponse.HumantaskParamMapTypeList;
			    				var HumantaskParamMapResponse = HumantaskParamMapResponseList.HumantaskParamMapResponse;
			    				if($.type(HumantaskParamMapResponse) == "array"){
	    					var j=0; var k=0; var l=0;
		        					for (var i = 0, c = HumantaskParamMapResponse.length; i < c; i++) {
		        						if(HumantaskParamMapResponse[i].paramName){
		        							if(keyValArr!= null && keyValArr.length > 0){
			        							for(var kvIndex=0; kvIndex < keyValArr.length; kvIndex++){
		        									if(keyValArr[kvIndex][0] == HumantaskParamMapResponse[i].paramName){
		        										tempSLAArray[i] = true;
		        										break;
		        									}
		        								}
		        							}
		        							
		        							if(HumantaskParamMapResponse[i].htAttrName.indexOf("TEXTATTRIBUTE")>=0){
		        								var paramValues = HumantaskParamMapResponse[i].value;
		        								if($.type(paramValues)!=="object" && paramValues!=null && paramValues!=""){
		        								var paramValuesArray = paramValues.split(",");
		        								var fieldType = '<select name="slaValDropdown" class="paramValues">';
		        								for(var options=0;options<paramValuesArray.length;options++){
        									fieldType = fieldType+UTEADMIN.taskAdmin.createOptionElement(paramValuesArray[options], paramValuesArray[options], tempSLAArray, keyValArr, i, j);
		        								}
		        								fieldType = fieldType+'</select>';
		        								}
		        								else{
        									var fieldType = UTEADMIN.taskAdmin.createInputElement("text", "slaAttrTextVal", tempSLAArray, keyValArr, i, j);
		        								}	
		        							}
		        							else if(HumantaskParamMapResponse[i].htAttrName.indexOf("DATEATTRIBUTE")>=0){
        								var fieldType = UTEADMIN.taskAdmin.createInputElement("date", "slaAttrDateVal", tempSLAArray, keyValArr, i, j);
		        							}
		        							
		        							else if(HumantaskParamMapResponse[i].htAttrName.indexOf("NUMBERATTRIBUTE")>=0){
        								var fieldType = UTEADMIN.taskAdmin.createInputElement("number", "slaAttrNumVal", tempSLAArray, keyValArr, i, j);
		        							}
		        							else{
        								var fieldType = UTEADMIN.taskAdmin.createInputElement("text", "slaAttrTextVal", tempSLAArray, keyValArr, i, j);
		        							}
		        							
		        							if(tempSLAArray[i] && keyValArr!=undefined && keyValArr.length>0){
		        								    //var valHtml = $(fieldType);
        								$(fieldType).val(keyValArr[j][1]);
		        									j++;
        									//console.log("j val"+j);
		    									attrResultHtmlData.push([
			        							 '<input type="checkbox" name="slaAttrChkboxVal" class="row-id-box" checked id="">',	        	    
			                	        	    (HumantaskParamMapResponse[i].paramName ? HumantaskParamMapResponse[i].paramName : ""),
			                	        	    fieldType ? fieldType : ""
						                	     ]);	
		        							}
		        							else{
											attrResultHtmlData.push([
			        							 '<input type="checkbox" name="slaAttrChkboxVal" class="row-id-box" id="">',	        	    
			                	        	    (HumantaskParamMapResponse[i].paramName ? HumantaskParamMapResponse[i].paramName : ""),
			                	        	    fieldType ? fieldType : ""
						                	     ]);
											//console.log("in else"+i)
		        							}
		        							if(keyArr != null && keyArr.length > 0){
		        								for(var kvIndex=0; kvIndex < keyArr.length; kvIndex++){
		        									if(keyArr[kvIndex] == HumantaskParamMapResponse[i].paramName){
		        										tempNtfctnArray[i] = true;
		        										tempStngsArray[i] = true;
		        										break;
		        									}
		        								}
		        							}
		        							if($(currentAnchObj).parents('table:first').is("#statusChangeDatagrid") && tempNtfctnArray[i] && keyArr!=undefined && keyArr.length>0){
		        									k++;
		        								 ntfctnAttrHtmlData.push([
			        							 '<input type="checkbox" name="ntfctnAttrChkboxVal" class="row-id-box" checked id="">',	        	    
			                	        	    (HumantaskParamMapResponse[i].paramName ? HumantaskParamMapResponse[i].paramName : ""),
						                	     ]);	
		        							}
		        							else if($(currentAnchObj).hasClass("slaSettingsBtn") && tempStngsArray[i] && keyArr!=undefined && keyArr.length>0){
		        								l++;
		        								 ntfctnAttrHtmlData.push([
			        							 '<input type="checkbox" name="ntfctnAttrChkboxVal" class="row-id-box" checked id="">',	        	    
			                	        	    (HumantaskParamMapResponse[i].paramName ? HumantaskParamMapResponse[i].paramName : ""),
						                	     ]);
		        							}
		        							else{
		        							ntfctnAttrHtmlData.push([
					                         '<input type="checkbox" name="ntfctnAttrChkboxVal" class="row-id-box" id="">',	        	    
			                	        	    (HumantaskParamMapResponse[i].paramName ? HumantaskParamMapResponse[i].paramName : "")                   
		        							]);
		        							}
		            					}
		        					}
		                	        	
		        					
		        				}
		        				else{
		        					if(HumantaskParamMapResponse.paramName){
		    							if(HumantaskParamMapResponse.htAttrName.indexOf("TEXTATTRIBUTE")>=0){
		    								var paramValues = HumantaskParamMapResponse.value;
		    								if($.type(paramValues)!=="object" && paramValues!=null && paramValues!=""){
		    								var paramValuesArray = paramValues.split(",");
		    								var fieldType = '<select name="slaValDropdown" class="paramValues">';
		    								for(var options=0;options<paramValuesArray.length;options++){
		    									fieldType = fieldType+'<option value = '+paramValuesArray[options]+'>'+paramValuesArray[options]+'</option>';
		    								}
		    								fieldType = fieldType+'</select>';
		    								}
		    								else{
		    								var fieldType = '<input type="text" name="slaAttrTextVal" value=""></input>'
		    								}	
		    							}
		    							else if(HumantaskParamMapResponse.htAttrName.indexOf("DATEATTRIBUTE")>=0){
		    								var fieldType = '<input type="date" name="slaAttrDateVal" value=""></input>'
		    							}
		    							else if(HumantaskParamMapResponse.htAttrName.indexOf("NUMBERATTRIBUTE")>=0){
		    								var fieldType = '<input type="number" min="0" name="slaAttrNumVal" value=""></input>'
		    							}
		    							else{
		    								var fieldType = '<input type="text" name="slaAttrTextVal" value=""></input>'
		    							}
		    							attrResultHtmlData.push([
		    							 '<input type="checkbox" name="slaAttrChkboxVal" class="row-id-box" id="">',	        	    
		            	        	    (HumantaskParamMapResponse.paramName ? HumantaskParamMapResponse.paramName : ""),
		            	        	    	fieldType ? fieldType : ""
				                	     ]);
		    							ntfctnAttrHtmlData.push([
				                         '<input type="checkbox" name="ntfctnAttrChkboxVal" class="row-id-box" id="">',	        	    
		                	        	    (HumantaskParamMapResponse.paramName ? HumantaskParamMapResponse.paramName : "")                   
		    							]);
		    							
		        					}
		        				}
			    			}
			    			else{
			    				errorMsg = uteReturnData.Body.Fault.detail.AdminServiceFault.FaultDescription;
			    			}
			    		}
			    		catch(e){
			    			errorMsg = uteReturnData.Body.Fault.detail.AdminServiceFault.FaultDescription;
			    		}
			    		
			    	}else{
			    		errorMsg = uteReturnData.WSStatus;
			    	}
		
		    		if($(currentAnchObj).hasClass("chooseSLAAttrbts")){
						openSLAAttrTooltip(attrResultHtmlData, errorMsg);
					}
					else if($(currentAnchObj).parents('table:first').is("#statusChangeDatagrid")){
						openNtfctnAttrTooltip(ntfctnAttrHtmlData, errorMsg);
					}
					else if($(currentAnchObj).hasClass("slaSettingsBtn")){
						openSettingsTooltip(ntfctnAttrHtmlData, errorMsg);
					}
						
			    });
			});
			
			
			$('#accordion1,#accordion2,#accordion3').accordion({
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
		
		$('#taskAccordionPage').accordion({
			heightStyle: "content",
			collapsible:false,
			active: 0,
		});
	
		$('#taskAssRlsDatagrid').on('change', '.RulesetId', function(evt) {
			
			/*UTEADMIN.taskAdmin.fetchRuleDetails($(this).val());*/
			RulesetName = $(this).val();
			populateRulesList = [];
			var applicationName = $("#applicationName").val();
			var paramDetails = {"applicationName" : applicationName, "RulesetName" : RulesetName};
			var currentRuleset = $(this);
		    $.ajax({
		        type: "GET",
		        url: CONTEXT_PATH + "/ute/admin/taskAdmin/getRulesByAppnAndRuleset",
		        data: paramDetails,
		    }).done(function (rulesList) {
		    	if(rulesList.Body){
		    	if(rulesList.Body.getAllRulesResponse){
		    	if(rulesList.Body.getAllRulesResponse.Rule){
		    		var ruleDtls = rulesList.Body.getAllRulesResponse.Rule;
					
					if($.type(ruleDtls) == "array"){
						for (var i = 0, c = ruleDtls.length; i < c; i++) {
							populateRulesList.push(ruleDtls[i].Name);
						}
					}
					else{
						populateRulesList.push(ruleDtls.Name);
						}
					var pushRules = '<a href="#" class="addNewRule">Add Rule</a>|';
				    for(var j=0;j<populateRulesList.length;j++){
				    	pushRules = pushRules + '<a href="#" class="editRuleLink">'+populateRulesList[j]+'</a>|';
				    }
				    $(currentRuleset).parent().siblings().children('div').html(pushRules);
					}
		    	else{
		    		var pushRules = '<a href="#" class="addNewRule">Add Rule</a>|';
		    		$(currentRuleset).parent().siblings().children('div').html(pushRules);
		    	}
		    	}
		    	}
		    	else{
		    		alertOption.displayMessage='error in fetching rules';
			    	alertDialog(alertOption);
		    	}
		    });
		    
		});

		$('#taskAssRlsDatagrid').on('click', '.editRuleLink', function(){
			var currentAnchor = $(this);
			var ruleName = $(this).html();
			var ruleSetName = $(currentAnchor).parents('td').siblings().children('select').val();
			var applicationName = $("#applicationName").val();
			var diag = window.iframeDialog({
		        title: "Edit Rule",
		        url: CONTEXT_PATH + '/ute/admin/ruleadminnew/standalone?editTaskSource='+applicationName+'&editRulesetName='+ruleSetName+'&editRuleName='+ruleName,
		        modal: true,
		        height:600,
		        width:800
		    })
		    
		});

		$('#taskAssRlsDatagrid').on('click', '.addNewRule', function(){
			var currentAnchor = $(this);
			var ruleSetName = $(currentAnchor).parents('td').siblings().children('select').val();
			var applicationName = $("#applicationName").val();
			var diag = window.iframeDialog({
		        title: "Add Rule",
		        url: CONTEXT_PATH + '/ute/admin/ruleadminnew/standalone?editTaskSource='+applicationName+'&editRulesetName='+ruleSetName+'&createNewRule=true&fromTaskAdmin=true',
		        modal: true,
		        height:600,
		        width:800
		    })
		   
		    vzuui.messenger.unregister("RULE_DETAILS_FETCH"); 
		    vzuui.messenger.register("RULE_DETAILS_FETCH", function(e) {
		    	$('.RulesetId').trigger('change');
		    	diag.dialog('close');
		    });
		});
		
		$('#taskDetailsForm').on('change', '#applicationName', function(evt) {
			
			UTEADMIN.taskAdmin.fetchRulesetDetails($(this).val());
			
			var removeAlreadyExistingRows = true;
			
			UTEADMIN.taskAdmin.deleteRuleset(removeAlreadyExistingRows);
			UTEADMIN.taskAdmin.deleteslaAttributes(removeAlreadyExistingRows);
			UTEADMIN.taskAdmin.deleteStatusChangeNtfctn(removeAlreadyExistingRows);
			
			populateRulesList = [];
			
		});

		
		$(document).on('click', '.cancelSLA, .cancelNotification, .cancelSettings', function(){
			$(this).parent().dialog('close');
		});

		$(document).on('click', '.AddSLA', function(){
			tempSLAArray = [];
				var marked_add_SLA = "";
				var attrKey = "";
				var attrVal = "";
				var dataTable = $(this).siblings('div').find('table').dataTable();
				var dataRequired = false;
				$(dataTable.fnGetNodes()).find('.row-id-box').each(function (index) {
					if($(this).is(':checked')){	
						attrKey = $($(this).closest('td').siblings()[0]).text();
						attrVal = $($(this).closest('td').siblings()[1]).children().val();
						if(!(attrVal == "" || attrVal == null || attrVal == undefined)){
							if(marked_add_SLA == ""){
								marked_add_SLA = attrKey+'~'+attrVal;
							}else{
								marked_add_SLA = marked_add_SLA + ","+ attrKey+'~'+attrVal;
							}
							tempSLAArray[index] = true;
						}else{
							dataRequired = true;
						}

					}
				});
				if(dataRequired){
					var errDlgOpt = {title: "Info"};
			 		errDlgOpt.displayMessage = "Please enter the values for the option selected!";
			    	alertDialog(errDlgOpt);
			        return false;
				}
				 	//console.log("temp lenght"+tempSLAArray.length);
				 	var trimmedTaskList = "";
			 	if(marked_add_SLA!=undefined && marked_add_SLA.length>25){
					trimmedTaskList = marked_add_SLA.substring(0,25)+'..<a href="#" title="'+marked_add_SLA+'">View All</a>';
				}
				else if(marked_add_SLA!=undefined && marked_add_SLA.length<=25){
					trimmedTaskList = marked_add_SLA;
				}
				$('.clickedtd').find('.saveSelectedSLA').val(marked_add_SLA);
				$('.clickedtd').find('.viewOnlyTaskAttributes').html(trimmedTaskList);
			    if (marked_add_SLA=="") {
			    	alertOption.displayMessage = "Please select at least one parameter to perform add operation!";
			    	alertDialog(alertOption);
			        return false;
			    }
			    $('.SLAAttrDialog').dialog('close');
		});

		$(document).on('click', '.AddNotification', function(){
			tempNtfctnArray = [];
			var marked_add_SLA ="";
			var attrKey = "";
			var dataTable = $(this).siblings('div').find('table').dataTable();
			 	$(dataTable.fnGetNodes()).find('.row-id-box').each(function (index) {
			 		if($(this).is(':checked')){	
			 		attrKey= $(this).closest('td').siblings().text();
			 		if(marked_add_SLA == ""){
			    		marked_add_SLA = attrKey;
			    	}else{
			    		marked_add_SLA = marked_add_SLA + ","+ attrKey;
			    	}
			 		tempNtfctnArray[index] = true;
			 		}
		    });
		 	var trimmedNtfctnList = "";
		 	if(marked_add_SLA!=undefined && marked_add_SLA.length>40){
				trimmedNtfctnList = marked_add_SLA.substring(0,40)+'..<a href="#" title="'+marked_add_SLA+'">View All</a>';
			}
			else if(marked_add_SLA!=undefined && marked_add_SLA.length<=40){
				trimmedNtfctnList = marked_add_SLA;
			}
			$('.clickedtd').find('.saveSelectedNotification').val(marked_add_SLA );
			$('.clickedtd').find('.viewOnlyNotificationAttributes').html(trimmedNtfctnList);
			if (marked_add_SLA=="") {
				alertOption.displayMessage="Please select at least one parameter to perform add operation!";
		    	alertDialog(alertOption);
		        return false;
		    }
		    $('.notificationAttrDialog').dialog('close');
		});

		$(document).on('click', '.saveSettings', function(index){
			tempStngsArray = [];
			var marked_add_SLA ="";
			var attrKey = "";
			var dataTable = $(this).siblings('div').find('table').dataTable();
			 	$(dataTable.fnGetNodes()).find('.row-id-box').each(function (index) {
			 		if($(this).is(':checked')){	
			 		attrKey= $(this).closest('td').siblings().text();
			 		if(marked_add_SLA == ""){
			    		marked_add_SLA = attrKey;
			    	}else{
			    		marked_add_SLA = marked_add_SLA + ","+ attrKey;
			    	}
			 		tempStngsArray[index]=true;
			 		}
		    });
			$('.clickedtd').find('.reminderH').val($(this).siblings('div').find(".reminder").val());
			$('.clickedtd').find('.daysInputH').val($(this).siblings('div').find(".daysInput").val());
			$('.clickedtd').find('.hoursInputH').val($(this).siblings('div').find(".hoursInput").val());
			$('.clickedtd').find('.minutesInputH').val($(this).siblings('div').find(".minutesInput").val());
			$('.clickedtd').find('.ExpirationH').val($(this).siblings('div').find(".Expiration").val());
			$('.clickedtd').find('.saveSelectedSettings').val(marked_add_SLA );
			
			var trimmedNtfctnList = "";
		 	if(marked_add_SLA!=undefined && marked_add_SLA.length>25){
				trimmedNtfctnList = marked_add_SLA.substring(0,25)+'..<a href="#" title="'+marked_add_SLA+'">View All</a>';
			}
			else if(marked_add_SLA!=undefined && marked_add_SLA.length<=25){
				trimmedNtfctnList = marked_add_SLA;
			}
		 	
			$('.clickedtd').find('.viewOnlySettingsAttributes').html(trimmedNtfctnList);
		    $('.emailSettingsDialog').dialog('close');
		});

		$(document).on('click', '#saveBtn', function(){
			$("#searchLoadingDiv").show();
			if($('#taskDetailsForm').validationEngine('validate')){
				var applicationName = $('#applicationName').val();
				var taskName = $('#TaskName').val();
				var taskDescription = $('#TaskDesc').val();
				var jobFunction = $('#JobFunctionName').val();
				var TaskMetaId = $('#TaskMetaId').val();
				var taskDetails = {"applicationName" : applicationName, "TaskName": taskName, "TaskDesc" : taskDescription,
						"JobFunctionName" : jobFunction, "slaDetails": "", "ntfctnDetails":"", "TaskMetaId": TaskMetaId};
				//taskDetails = $.map(taskDetails, function(el) { return el; });
				//console.log(taskDetails);
			var slaDetails = [];
			var ntfctnDetails = [];
			var noSlaAttribute = false;
			
			$.each($('#slaAttrDatagrid tbody tr'), function(index, rowNode){
				var tr = $(this);
				if(tr.hasClass("even")||tr.hasClass("odd")){
			    var row = $('#slaAttrDatagrid').dataTable().api().row(tr);
			    	var rowDetails = [];
			    	if($(rowNode).find('.durationSelect').val() != "Never Expire"){
			    		$.each($(rowNode).find(':input'), function(indexChild, columnNode){
							if(index!=0 && $(this).attr("name")=="slaAttributes" && $(this).val()==""){
								alertOption.displayMessage="Please include atleast one task attribute in row number "+index+" of SLA & Notifications table or delete it!";
						    	alertDialog(alertOption);
									noSlaAttribute = true;
							}
							else{
							var obj = {"name":$(this).attr("name"), "value":$(this).val()};
							rowDetails.push(obj);
							}
						});
						slaDetails.push(rowDetails);
			    	} 
			}	
			});
			
			$.each($('#statusChangeDatagrid tbody tr'), function(index, rowNode){
				var tr = $(this);
				if(tr.hasClass("even")||tr.hasClass("odd")){
			    var row = $('#statusChangeDatagrid').dataTable().api().row(tr);
			    	var rowDetails = [];
					$.each($(rowNode).find(':input'), function(indexChild, columnNode){
						var obj = {"name":$(this).attr("name"), "value":$(this).val()};
						rowDetails.push(obj);
						//console.log(rowDetails);
					});
					ntfctnDetails.push(rowDetails);
			}	
			});
			taskDetails.slaDetails = slaDetails;
			taskDetails.ntfctnDetails = ntfctnDetails;
			//console.log(slaDetails);
			
			if(!noSlaAttribute){
			$.ajax({
		        type: "POST",
		        url: CONTEXT_PATH + "/ute/admin/taskAdmin/saveTask",
		        data: JSON.stringify(taskDetails),
		        contentType: "application/json"
		    }).done(function (savedTask) {
		    	var saveTaskAlertOptions = {title: "Info"};
		    	var errorCode = savedTask.Body.processTaskInfoResponse.faultInfo.FaultCode;
		    	if(errorCode == "UTE0000"||errorCode=="NO_ERROR"){
		    		$("#tasksearchForm #TaskName_search").val($("#taskDetailsForm #TaskName").val());
		    		$("#taskSearchBtn").trigger('click');
		    		//UTEADMIN.taskAdmin.resetForm("#detailsForm");
					//$("#FormHeader").html("Create Task Metadata");
		    		var hiddenTaskId = savedTask.Body.processTaskInfoResponse.Task.TaskMetaId;
		    		$('#TaskMetaId').val(hiddenTaskId);
		    		UTEADMIN.taskAdmin.disableForm("#taskDetailsForm");
		    	}
				saveTaskAlertOptions.buttons = {
			            Ok: function() {
			                $(this).dialog("close");
			            }
			     }
		    	saveTaskAlertOptions.displayMessage=savedTask.Body.processTaskInfoResponse.faultInfo.FaultDescription;
		    	alertDialog(saveTaskAlertOptions);
		        return false;
		    });
			}
			
		}
			$("#searchLoadingDiv").hide();
		});

		$(document).on('click', '#editBtn', function(){
		UTEADMIN.taskAdmin.enableForm("#taskDetailsForm");
		});
		
		$(document).on('click', '#cancelTaskBtn', function(){
			$("#FormHeader").hide();
			$("#taskAccordionPage").accordion({active: 0});
		});
		
}

UTEADMIN.taskAdmin.loadEditForm = function(taskDtls,flag){
	$(".TasksMetadata" ).html(tasksMetadataCreateContnt);
	$("#FormHeader").html("Edit Task Metadata");
	$(document).off();
	UTEADMIN.taskAdmin.initPage();
	$("#taskAccordionPage").accordion({active: 1});
	// global section values 
	 $.each(taskDtls, function(elementId, elementValue){
	        $("#taskDetailsForm #"+ elementId).val(elementValue);
	 });
	 $('#applicationName').trigger('change');
	 // sla rows
	 var slaRowsList = [];
	 var notificationRowsList = [];
	 var maxRenewal = "";
	 var numberOfDays = "";
	 var numberOfHours = "";
	 var numberOfMinutes = "";
	 var selectedTaskDurationSettings = "";
	 var daysAndTimeString = "";
	 var status = "";
	 var recipient = "";
	 var notificationVals = "";
	 var labelDefault = '<label>Default<label>';
	 var inputBox = '<input type="checkbox" name="defaultSLACheckbox" class="row-id-box-default" disabled id="">';
	 var notificationLink = '<label></label>';
	 var isDefaultRowCreated = false;
	 if(taskDtls.routingSlip){
		 if($.type(taskDtls.routingSlip) === "object"){
    	    	
			 if(taskDtls.routingSlip.globalConfiguration && $.type(taskDtls.routingSlip.globalConfiguration) === "object"){
				 	if(taskDtls.routingSlip.globalConfiguration.renewalPolicy && taskDtls.routingSlip.globalConfiguration.renewalPolicy.numberOfTimesRenewed !=undefined){
				 	 selectedTaskDurationSettings = "Renew After";
				 	 daysAndTimeString = taskDtls.routingSlip.globalConfiguration.renewalPolicy.renewalDuration;
				 	  maxRenewal = taskDtls.routingSlip.globalConfiguration.renewalPolicy.numberOfTimesRenewed.VALUE;
				 	}
				 	else if(taskDtls.routingSlip.globalConfiguration.escalationPolicy && taskDtls.routingSlip.globalConfiguration.escalationPolicy.numberOfTimesEscalated !=undefined){
				 	 selectedTaskDurationSettings = "Escalate After";	
				 	 daysAndTimeString = taskDtls.routingSlip.globalConfiguration.escalationPolicy.renewalDuration;
				 	 maxRenewal = taskDtls.routingSlip.globalConfiguration.escalationPolicy.numberOfTimesEscalated.VALUE;
					 }
				 	else if(taskDtls.routingSlip.globalConfiguration.expirationDuration.duration != undefined && taskDtls.routingSlip.globalConfiguration.escalationPolicy == undefined && taskDtls.routingSlip.globalConfiguration.renewalPolicy == undefined){
				 		selectedTaskDurationSettings = "Expire After";	
					 	 daysAndTimeString = taskDtls.routingSlip.globalConfiguration.expirationDuration.duration;
				 	}
				 	else{
				 		selectedTaskDurationSettings = "Never Expire";	
				 	}
				 	if(daysAndTimeString.indexOf("P")!=-1 && daysAndTimeString.indexOf("D")!=-1){
				 		numberOfDays = daysAndTimeString.split("P").pop().split("D").shift();
				 	}
				 	if(daysAndTimeString.indexOf("T")!=-1 && daysAndTimeString.indexOf("H")!=-1){
				 		numberOfHours = daysAndTimeString.split("T").pop().split("H").shift();
				 	}
				 	
				 	if(daysAndTimeString.indexOf("H")!=-1 && daysAndTimeString.indexOf("M")!=-1){
				 		numberOfMinutes = daysAndTimeString.split("H").pop().split("M").shift();
				 	}
				 	else if(daysAndTimeString.indexOf("T")!=-1 && daysAndTimeString.indexOf("H")==-1 && daysAndTimeString.indexOf("M")!=-1){
				 		numberOfMinutes = daysAndTimeString.split("T").pop().split("M").shift();
				 	}
				 
				 	// set default row
				 	isDefaultRowCreated = true;
				 	slaRowsList.push(UTEADMIN.taskAdmin.getslaAttributes(inputBox, maxRenewal, numberOfDays, numberOfHours, numberOfMinutes, selectedTaskDurationSettings, labelDefault,"", notificationLink));
			 }
		 	if(taskDtls.routingSlip.notification){
		 		if($.type(taskDtls.routingSlip.notification.action)=="array"){
			 		for(var i=0;i<taskDtls.routingSlip.notification.action.length;i++){
			 			status =  taskDtls.routingSlip.notification.action[i].name;
			 			recipient = taskDtls.routingSlip.notification.action[i].recipient;
			 			notificationVals = $.trim(taskDtls.routingSlip.notification.action[i].VALUE);
			 			notificationRowsList.push(UTEADMIN.taskAdmin.getstatusBasedRow(status, recipient, notificationVals));
			 		}
			 	}
			 	else{
			 		status =  taskDtls.routingSlip.notification.action.name;
		 			recipient = taskDtls.routingSlip.notification.action.recipient;
		 			notificationVals = $.trim(taskDtls.routingSlip.notification.action.VALUE);
		 			notificationRowsList.push(UTEADMIN.taskAdmin.getstatusBasedRow(status, recipient, notificationVals));
			 	}
		 		UTEADMIN.taskAdmin.statusChangeNtfctnTable(notificationRowsList, "No default SLA notification Rows Present");	
		 	}
    	}
	 }
	 
	 if(!isDefaultRowCreated){
	    	selectedTaskDurationSettings = "Never Expire";
	    	slaRowsList.push(UTEADMIN.taskAdmin.getslaAttributes(inputBox, maxRenewal, numberOfDays, numberOfHours, numberOfMinutes, selectedTaskDurationSettings, labelDefault,"", notificationLink));
	 }
	 
	 if(taskDtls.RoutingSlipMap){
		 if($.type(taskDtls.RoutingSlipMap) == "array"){
			 for(var i=0;i<taskDtls.RoutingSlipMap.length;i++){
				 UTEADMIN.taskAdmin.slaRowData(taskDtls.RoutingSlipMap[i], slaRowsList);
			 }
		 }else{
			 UTEADMIN.taskAdmin.slaRowData(taskDtls.RoutingSlipMap, slaRowsList)
		 } 
	 }
	 
	 UTEADMIN.taskAdmin.renderSLAAttributesDataTable(slaRowsList, "No SLA Rows Present");
	 
	 $(".durationSelect").each(function(){
		 if($(this).val() == "Never Expire"){
				$(this).parents().siblings().children(".daysdiv , .hoursdiv, .minutesdiv, .maxrenewaldiv").empty().html('<label>NA</label>');
			}
		 if($(this).val() == "Expire After"){
				$(this).parents().siblings().children(".maxrenewaldiv").empty().html('<input type="number" min="0" name="maxrenewalInput" class="" id="" disabled>');
			}
	 });
}

UTEADMIN.taskAdmin.slaRowData = function(RoutingSlipMap, slaRowsList){
	 var notificationRowsList = [];
	 var maxRenewal = "";
	 var numberOfDays = "";
	 var numberOfHours = "";
	 var numberOfMinutes = "";
	 var selectedTaskDurationSettings = "";
	 var daysAndTimeString = "";
	 var notificationVals = "";
	 var reminderDuration = "";
	 var emailDays = "";
	 var emailHours = "";
	 var emailMinutes = "";
	 var recurrence = "";
	 var relativeDate = "";
	 
	if($.type(RoutingSlipMap.routingSlip) === "object"){
		if(RoutingSlipMap.routingSlip.globalConfiguration.renewalPolicy && RoutingSlipMap.routingSlip.globalConfiguration.renewalPolicy.numberOfTimesRenewed !=undefined){
			selectedTaskDurationSettings = "Renew After";
			daysAndTimeString = RoutingSlipMap.routingSlip.globalConfiguration.renewalPolicy.renewalDuration;
			maxRenewal = RoutingSlipMap.routingSlip.globalConfiguration.renewalPolicy.numberOfTimesRenewed.VALUE;
		}
		else if(RoutingSlipMap.routingSlip.globalConfiguration.escalationPolicy && RoutingSlipMap.routingSlip.globalConfiguration.escalationPolicy.numberOfTimesEscalated !=undefined){
			selectedTaskDurationSettings = "Escalate After";	
			daysAndTimeString = RoutingSlipMap.routingSlip.globalConfiguration.escalationPolicy.renewalDuration;
			maxRenewal = RoutingSlipMap.routingSlip.globalConfiguration.escalationPolicy.numberOfTimesEscalated.VALUE;
		}
		else if(RoutingSlipMap.routingSlip.globalConfiguration.expirationDuration.duration != undefined && RoutingSlipMap.routingSlip.globalConfiguration.escalationPolicy == undefined && RoutingSlipMap.routingSlip.globalConfiguration.renewalPolicy == undefined){
			selectedTaskDurationSettings = "Expire After";	
			daysAndTimeString = RoutingSlipMap.routingSlip.globalConfiguration.expirationDuration.duration;
		}
		else{
			selectedTaskDurationSettings = "Never Expire";	
		}
		if(daysAndTimeString.indexOf("P")!=-1 && daysAndTimeString.indexOf("D")!=-1){
			numberOfDays = daysAndTimeString.split("P").pop().split("D").shift();
		}

		if(daysAndTimeString.indexOf("T")!=-1 && daysAndTimeString.indexOf("H")!=-1){
			numberOfHours = daysAndTimeString.split("T").pop().split("H").shift();
		}

		if(daysAndTimeString.indexOf("H")!=-1 && daysAndTimeString.indexOf("M")!=-1){
			numberOfMinutes = daysAndTimeString.split("H").pop().split("M").shift();
		}
		else if(daysAndTimeString.indexOf("T")!=-1 && daysAndTimeString.indexOf("H")==-1 && daysAndTimeString.indexOf("M")!=-1){
			numberOfMinutes = daysAndTimeString.split("T").pop().split("M").shift();
		}

		if($.type(RoutingSlipMap.TaskAttributes) === "object"){
			var slaTaskAttributes = RoutingSlipMap.TaskAttributes.attribute;
			var taskAttributes = "";
			if($.type(slaTaskAttributes) == "array"){
				for(var j=0;j<slaTaskAttributes.length;j++){
					if(taskAttributes == ""){
						taskAttributes = slaTaskAttributes[j].Name+'~'+slaTaskAttributes[j].Value;
					}else{
						taskAttributes = taskAttributes +","+slaTaskAttributes[j].Name+'~'+slaTaskAttributes[j].Value;
					}
				}
			}
			else{
				taskAttributes = slaTaskAttributes.Name+'~'+slaTaskAttributes.Value;
			}
		}
		if(RoutingSlipMap.routingSlip.notification){
			if(RoutingSlipMap.routingSlip.notification.reminder){
				reminderDuration = RoutingSlipMap.routingSlip.notification.reminder.reminderDuration;
				if(reminderDuration.indexOf("P")!=-1 && reminderDuration.indexOf("D")!=-1){
					emailDays = reminderDuration.split("P").pop().split("D").shift();
				}

				if(reminderDuration.indexOf("T")!=-1 && reminderDuration.indexOf("H")!=-1){
					emailHours = reminderDuration.split("T").pop().split("H").shift();
				}

				if(reminderDuration.indexOf("H")!=-1 && reminderDuration.indexOf("M")!=-1){
					emailMinutes = reminderDuration.split("H").pop().split("M").shift();
				}
				else if(reminderDuration.indexOf("T")!=-1 && reminderDuration.indexOf("H")==-1 && reminderDuration.indexOf("M")!=-1){
					emailMinutes = reminderDuration.split("T").pop().split("M").shift();
				}
				recurrence = RoutingSlipMap.routingSlip.notification.reminder.recurrence;
				relativeDate = RoutingSlipMap.routingSlip.notification.reminder.relativeDate;
			}
			if(RoutingSlipMap.routingSlip.notification.action){
		 	if($.type(RoutingSlipMap.routingSlip.notification.action)=="array"){
		 	notificationVals = $.trim(RoutingSlipMap.routingSlip.notification.action[0]);
		 	}
		 	else{
		 		notificationVals = $.trim(RoutingSlipMap.routingSlip.notification.action);
		 	}
		 	}
		}
		var inputBox = '<input type="checkbox" class="row-id-box" name="slaRowChkbox" id="">';
		var anchorLink = '<a href="#" id="" class="chooseSLAAttrbts addRules">Add</a>';
		var notificationLink = '<a href="#" class="slaSettingsBtn"></a>';
		slaRowsList.push(UTEADMIN.taskAdmin.getslaAttributes(inputBox, maxRenewal, numberOfDays, numberOfHours, numberOfMinutes, selectedTaskDurationSettings, anchorLink, taskAttributes, notificationLink, notificationVals, emailDays, emailHours, emailMinutes, recurrence, relativeDate));
	}
	
}

UTEADMIN.taskAdmin.renderSearchResult = function (searchParams) {
	
    $.ajax({
        type: "POST",
        url: CONTEXT_PATH + "/ute/admin/taskAdmin/search",
        data: searchParams
    }).done(function (uteReturnData) {
    	
    	var taskResultHtmlData = [];
    	var erroMsg = "";
    	
    	if(uteReturnData.Body){
    		try{
    			//console.log(uteReturnData);
    			if(uteReturnData.Body.processTaskInfoResponse.faultInfo.FaultCode == "UTE0000" || uteReturnData.Body.processTaskInfoResponse.faultInfo.FaultCode == "NO_ERROR"){
        			
        			var taskDtls = uteReturnData.Body.processTaskInfoResponse.Task;
        				if($.type(taskDtls) == "array"){
        				for (var i = 0, c = taskDtls.length; i < c; i++) {
        					taskDtls[i].TaskName ? taskDtls[i].TaskName : "";
            	        	taskResultHtmlData.push([
            	        	    '<span class="vzuui-om-menu"></span><div id="popupBlock" class="vzuui-om-dropdown hidedropdown" data="'+taskDtls[i].TaskMetaId+'"><ul id="vzuui-task-actions"><li class="editApp">Edit</li><li class="deleteApp">Delete</li></ul><input type="hidden" name="tskName" value="'+taskDtls[i].TaskName+'"></div>',
            	        	    '<a href="#" class="viewTaskDetails">'+taskDtls[i].TaskName+'</a>'
            	            ]);
            	        	
            	        	UTEADMIN.taskAdmin.searchTaskDtlMap[taskDtls[i].TaskMetaId] = taskDtls[i];
            	        }
        				
        			}
        				else{
        					taskDtls.TaskName ? taskDtls.TaskName : "";
                	        	taskResultHtmlData.push([
                	        	    '<span class="vzuui-om-menu"></span><div id="popupBlock" class="vzuui-om-dropdown hidedropdown" data="'+taskDtls.TaskMetaId+'"><ul id="vzuui-task-actions"><li class="editApp">Edit</li><li class="deleteApp">Delete</li></ul><input type="hidden" name="tskName" value="'+taskDtls.TaskName+'"></div>',
                	        	    '<a href="#" class="viewTaskDetails">'+taskDtls.TaskName+'</a>',
                	            ]);
                	        	
                	        UTEADMIN.taskAdmin.searchTaskDtlMap[taskDtls.TaskMetaId] = taskDtls;
        				}
    			}
    			else{
        			erroMsg = uteReturnData.Body.processTaskInfoResponse.faultInfo.FaultDescription;
        		}
    		}
        	catch(e){
        		//console.log(e);
        		erroMsg = uteReturnData.Body.Fault.detail.AdminServiceFault.FaultDescription;
        	}
    	}else if(uteReturnData.ErrorMsg){
    		erroMsg = uteReturnData.ErrorMsg;
    	}else{
    		erroMsg = uteReturnData.WSStatus;
    	}
    	
    	UTEADMIN.taskAdmin.renderSearchDataTable(taskResultHtmlData, erroMsg);
    	
    	
        $("#searchResultDiv").show();
		$("#searchLoadingDiv").hide();
    	
    }); //closes the ajax call
}

UTEADMIN.taskAdmin.renderSearchDataTable = function (rowData, erroMsg) {
	
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
						     "sWidth": "1%"
						},
				         {
				            "sTitle": "Task Name",
				             "sWidth": "60%"
				        }
		        	],
	    "oLanguage": {
                        "sSearch": "Search",
                        "sZeroRecords": erroMsg,
                        "sProcessing": "Processing..."
            		}

    });
	
}

UTEADMIN.taskAdmin.fetchRulesetDetails = function (applicationName) {
	
	var paramDetails = {"applicationName" : applicationName};
	
    $.ajax({
        type: "GET",
        url: CONTEXT_PATH + "/ute/admin/taskAdmin/getrulesetdetails",
        data: paramDetails,
    }).done(function (rulesetList) {
    	if(rulesetList.Body){
    	try{	
    	populateRulesetDetails = rulesetList.Body.getRulesetsNameByApplicationResponse.rulesetName;
    	}
    	catch(e){
    		alertOption.displayMessage="No ruleset present";
	    	alertDialog(alertOption);
    	}
    	}
    	else{
    		alertOption.displayMessage="Can not fetch ruleset details";
	    	alertDialog(alertOption);
    	}
    }); 
}


UTEADMIN.taskAdmin.renderRulesetDataTable = function (rowData, erroMsg) {
	
	$('#taskAssRlsDatagrid').dataTable({
		"aaData": rowData,
		"bPaginate": true, 
		"sPaginationType": "full_numbers", 
		"bLengthChange": true, 
		"bFilter": true, 
		"bSort":false, 
		"bInfo": false, 
		"bAutoWidth": false, 
		"bDestroy": true,
		"sDom":'<"top"T>rt<"bottom"ilp><"clear">',
        "aoColumns": [
						{
						    "sTitle": '<input type="checkbox" name="rulesetChkbox" class="uniform" id="select_all">',
						     "sWidth": "2%"
						},
				        {
				            "sTitle": "Ruleset",
				             "sWidth": "30%"
				        }, 
				        {
				            "sTitle": "Assignment Rules",
				            "sWidth": "30%"
				        }, 
		        	],
    	 "oLanguage": {
                "sSearch": "Search",
                "sZeroRecords": erroMsg,
                "sProcessing": "Processing..."
    		},        	
		"oTableTools": {
            "aButtons": [
				            {
				                    "sExtends": "text",
				                    "sButtonText": '<i class="addIcon"></i>',
				                    "sToolTip": "Add Ruleset",
				                    "fnClick": function (nButton, oConfig, oFlash) {
				                    	UTEADMIN.taskAdmin.addRuleset();
				                    }
				            },
				            {
				                    "sExtends": "text",
				                    "sButtonText": '<i class="trashIcon"></i>',
				                    "sToolTip": "Delete Ruleset",
				                    "fnClick": function (nButton, oConfig, oFlash) {
				                    	UTEADMIN.taskAdmin.deleteRuleset();
				                    }
				            },
				       ]
			
		},

    });
	
}


UTEADMIN.taskAdmin.addRuleset = function () {
	setTimeout(function(){
	var t = $('#taskAssRlsDatagrid').dataTable().api();
	t.row.add(UTEADMIN.taskAdmin.getRulesetRowData("")).draw();
	$('#taskDetailsForm').validationEngine();
	}, 500);
}

UTEADMIN.taskAdmin.deleteRuleset = function (removeAlreadyExistingRows) {
    var marked_delete = [];
    var alertOption = {title: "Delete Info"};
    if(removeAlreadyExistingRows){
    	$("#taskAssRlsDatagrid tbody .row-id-box").prop('checked', true);
    }
    
    $("#taskAssRlsDatagrid tbody .row-id-box:checked").each(function () {
        marked_delete.push($(this).closest('tr')[0]);
    });
    
    var sel = marked_delete.length;
    var p = sel > 1 ? "s" : "";
    if (!sel && !removeAlreadyExistingRows) {
        //alert("Please select at least one paramater to perform delete operation!");
        alertOption.displayMessage="Please select at least one Row to perform delete operation!";
        alertDialog(alertOption);
        return false;
    }
    
    if(!removeAlreadyExistingRows){
    if (!confirm("Delete Operation is irreversible, Do you want to delete the selected " + sel + " mapping" + p)) {
        return false;
    }
    }
    
    $.each(marked_delete, function(index, obj){
    	
    	$('#taskAssRlsDatagrid').dataTable().fnDeleteRow(obj);
 		
    });
    
}

UTEADMIN.taskAdmin.getRulesetRowData = function (rulesetId) {
	
	return [
            '<input type="checkbox" name="rulesetRowChkbox" class="row-id-box" id="">',
            '<select id="" name="RulesetId" class="type validate[required] RulesetId"><option value="">Select Ruleset</option>' + UTEADMIN.taskAdmin.getRulesetOptionHTML("Ruleset", rulesetId) + '</select>',
            '<div class="rulesPlaceHolder"><a href="#" class="addRules" onclick="openRulesTooltip()">Add</a></div>'
        ];
}


UTEADMIN.taskAdmin.getRulesetOptionHTML = function(paramName, selectValue){
	var propertyTypeOption = "";
	if($.type(populateRulesetDetails) == "array"){
	for(i=0;i<populateRulesetDetails.length;i++){
		propertyTypeOption = propertyTypeOption + '<option value="' + populateRulesetDetails[i] + '"' + ((populateRulesetDetails[i] == selectValue) ? " selected ":" ") + '>' + populateRulesetDetails[i] + '</option>';
	}
	}
	else{
		propertyTypeOption = propertyTypeOption + '<option value="' + populateRulesetDetails + '"' + ((populateRulesetDetails == selectValue) ? " selected ":" ") + '>' + populateRulesetDetails + '</option>';
	}
	return propertyTypeOption;
}


UTEADMIN.taskAdmin.getOptionHTML = function (paramName, selectValue) {
	
	var propertyTypeOption = "";
	
	$.each(UTEADMIN.taskAdmin.dropdownMetaMap[paramName], function(key, value){
		
		propertyTypeOption = propertyTypeOption + '<option value="' + value + '"' + ((value == selectValue) ? " selected ":" ") + '>' + key + '</option>';	
 		
    });
	
	return propertyTypeOption;
	
}


UTEADMIN.taskAdmin.renderSLAAttributesDataTable = function (rowData, erroMsg) {
	
	var slaAttrTable = $('#slaAttrDatagrid').dataTable({
				"aaData": rowData,
				"bPaginate": true, 
				"sPaginationType": "full_numbers", 
				"bLengthChange": true, 
				"bFilter": true, 
				"bSort":true, 
				"bInfo": false, 
				"bAutoWidth": false, 
				"bDestroy": true,
				"sDom":'<"top"T>rt<"bottom"ilp><"clear">',
		        "aoColumns": [
								{
								    "sTitle": '<input type="checkbox" name="allSLASelectChkbox" class="uniform" id="select_all_slaAttr">',
								     "sWidth": "2%"
								}, 
						        {
						            "sTitle": "Task Attributes",
						            "sWidth": "20%"
						        }, 
						        {
						            "sTitle": "Task Duration Settings",
						            "sWidth": "30%"
						        }, 
						        {
						            "sTitle": "Days",
						            "sWidth": "30%"
						        }, 
						        {
						            "sTitle": "Hours",
						            "sWidth": "30%"
						        }, 
						        {
						            "sTitle": "Minutes",
						            "sWidth": "30%"
						        }, 
						        {
						            "sTitle": "Max Renewal",
						            "sWidth": "30%"
						        }, 
						        {
						            "sTitle": "Reminder Notification",
						            "sWidth": "30%"
						        }
				        	],
	        	 "oLanguage": {
	                 "sSearch": "Search",
	                 "sZeroRecords": erroMsg,
	                 "sProcessing": "Processing..."
	     		},         	
				"oTableTools": {
		            "aButtons": [
						            {
						                    "sExtends": "text",
						                    "sButtonText": '<i class="addIcon"></i>',
						                    "sToolTip": "Add SLA Attributes",
						                    "fnClick": function (nButton, oConfig, oFlash) {
						                    	UTEADMIN.taskAdmin.addslaAttributes();
						                    }
						            },
						            {
						                    "sExtends": "text",
						                    "sButtonText": '<i class="trashIcon"></i>',
						                    "sToolTip": "Delete SLA Attributes",
						                    "fnClick": function (nButton, oConfig, oFlash) {
						                    	UTEADMIN.taskAdmin.deleteslaAttributes();
						                    }
						            },
						       ]
					
				}
		    });
			
		}

UTEADMIN.taskAdmin.addslaAttributes = function () {
	
	var t = $('#slaAttrDatagrid').dataTable().api();
	var inputBox = '<input type="checkbox" class="row-id-box" name="slaRowChkbox" id="">';
	var anchorLink = '<a href="#" id="" class="chooseSLAAttrbts addRules">Add</a>';
	var notificationLink = '<a href="#" class="slaSettingsBtn"></a>';
	t.row.add(UTEADMIN.taskAdmin.getslaAttributes(inputBox,"","","","","",anchorLink,"",notificationLink,"","","","","","")).draw();
	$('#taskDetailsForm').validationEngine();
}

UTEADMIN.taskAdmin.getslaAttributes = function (inputBox, maxRenewal, numberOfDays, numberOfHours, numberOfMinutes, selectedTaskDurationSettings, anchorLink, taskAttributes,notificationLink,notificationVals, emailDays, emailHours, emailMinutes, recurrence, relativeDate) {
	var trimmedTaskList = "";
	var trimmedNtfctnList = "";
	if(taskAttributes!=undefined && taskAttributes.length>25){
		trimmedTaskList = taskAttributes.substring(0,25)+'..<a href="#" title="'+taskAttributes+'">View All</a>';
	}
	else if(taskAttributes!=undefined && taskAttributes.length<=25){
		trimmedTaskList = taskAttributes;
	}
	if(notificationVals!=undefined && notificationVals.length>25){
		trimmedNtfctnList = notificationVals.substring(0,25)+'..<a href="#" title="'+notificationVals+'">View All</a>';
	}
	else if(notificationVals!=undefined && notificationVals.length<=25){
		trimmedNtfctnList = notificationVals;
	}
	
	return[
	 inputBox,
	 anchorLink+'<input type="hidden" name="slaAttributes" value="'+taskAttributes+'" class="saveSelectedSLA"><label class="viewOnlyTaskAttributes" style="display:none;">'+trimmedTaskList+'</label>',
    '<select id="" name="taskDurationSettings" class="type validate[required] durationSelect"><option value="">Select duration</option>'+UTEADMIN.taskAdmin.getOptionHTML("taskDurationSettings",selectedTaskDurationSettings)+'</select>',
    '<div class="daysdiv"><input type="number" min="0" name="daysInput" class="" value="'+numberOfDays+'"></div>',
    '<div class="hoursdiv"><input type="number" min="0" name="hoursInput" class="" value="'+numberOfHours+'"></div>',
    '<div class="minutesdiv"><input type="number" min="0" name="minutesInput" class="" value="'+numberOfMinutes+'"></div>',
    '<div class="maxrenewaldiv"><input type="number" min="0" name="maxrenewalInput" class="" value="'+maxRenewal+'"></div>',
    notificationLink+'<input type="hidden" name="notificationAttributes" value="'+notificationVals+'" class="saveSelectedSettings"/><label class="viewOnlySettingsAttributes" style="display:none;">'+trimmedNtfctnList+'</label><input type="hidden" name="reminder" value="'+recurrence+'" class="reminderH" /><input type="hidden" name="emailDays" value="'+emailDays+'" class="daysInputH" /><input type="hidden" name="emailHours" value="'+emailHours+'" class="hoursInputH" /><input type="hidden" name="emailMinutes" value="'+emailMinutes+'" class="minutesInputH" /><input type="hidden" name="Expiration" value="'+relativeDate+'" class="ExpirationH" />'
	];
}

UTEADMIN.taskAdmin.deleteslaAttributes = function (removeAlreadyExistingRows) {
    var marked_delete = [];
    var alertOption = {title:"Delete Info"};
    if(removeAlreadyExistingRows){
    	$("#slaAttrDatagrid tbody .row-id-box").prop('checked', true);
    }
    
    $("#slaAttrDatagrid tbody .row-id-box:checked").each(function () {
        marked_delete.push($(this).closest('tr')[0]);
    });
    
    var sel = marked_delete.length;
    var p = sel > 1 ? "s" : "";
    if (!sel && !removeAlreadyExistingRows) {
        alertOption.displayMessage="Please select at least one Row to perform delete operation!";
        alertDialog(alertOption);
        return false;
    }
    
    if(!removeAlreadyExistingRows){
    if (!confirm("Delete Operation is irreversible, Do you want to delete the selected " + sel + " mapping" + p)) {
        return false;
    }
    }
    
    $.each(marked_delete, function(index, obj){
    	
    	$('#slaAttrDatagrid').dataTable().fnDeleteRow(obj);
 		
    });
    
}


UTEADMIN.taskAdmin.statusChangeNtfctnTable = function (rowData, erroMsg) {
	
	$('#statusChangeDatagrid').dataTable({
		"aaData": rowData,
		"bPaginate": true, 
		"sPaginationType": "full_numbers", 
		"bLengthChange": true, 
		"bFilter": true, 
		"bSort":true, 
		"bInfo": false, 
		"bAutoWidth": false, 
		"bDestroy": true,
		"sDom":'<"top"T>rt<"bottom"ilp><"clear">',
        "aoColumns": [
						{
						    "sTitle": '<input type="checkbox" name="statusChngHdrChkBox" class="uniform" id="select_all_statusChange">',
						     "sWidth": "2%"
						},
				        {
				            "sTitle": "Status",
				            "sWidth": "50%"
				        }, 
				        {
				            "sTitle": "Recipient",
				            "sWidth": "50%"
				        }, 
				        {
				            "sTitle": "Notification Attributes",
				            "sWidth": "70%"
				        }
		        	],
    	 "oLanguage": {
             "sSearch": "Search",
             "sZeroRecords": erroMsg,
             "sProcessing": "Processing..."
 		},       	
		"oTableTools": {
            "aButtons": [
				            {
				                    "sExtends": "text",
				                    "sButtonText": '<i class="addIcon"></i>',
				                    "sToolTip": "Add Status Change",
				                    "fnClick": function (nButton, oConfig, oFlash) {
				                    	UTEADMIN.taskAdmin.addStatusChangeNtfctn();
				                    }
				            },
				            {
				                    "sExtends": "text",
				                    "sButtonText": '<i class="trashIcon"></i>',
				                    "sToolTip": "Delete Status Change",
				                    "fnClick": function (nButton, oConfig, oFlash) {
				                    	UTEADMIN.taskAdmin.deleteStatusChangeNtfctn();
				                    }
				            },
				       ]
			
		}

    });
	
}

UTEADMIN.taskAdmin.addStatusChangeNtfctn = function () {
	
	var t = $('#statusChangeDatagrid').dataTable().api();
	t.row.add(UTEADMIN.taskAdmin.getstatusBasedRow("","","")).draw();
	$('#taskDetailsForm').validationEngine();
	
}

UTEADMIN.taskAdmin.getstatusBasedRow = function(status, recipient, notificationValues){
	var trimmedNtfctnList = "";
	if(notificationValues!=undefined && notificationValues.length>40){
		trimmedNtfctnList = notificationValues.substring(0,40)+'..<a href="#" title="'+notificationValues+'">View All</a>';
	}
	else if(notificationValues!=undefined && notificationValues.length<=40){
		trimmedNtfctnList = notificationValues;
	}
	return[
	   	'<input type="checkbox" name="statusRowChkbox" class="row-id-box" id="">',
	       '<select name="status" class="type validate[required]"><option value="">Select Status</option>'+UTEADMIN.taskAdmin.getOptionHTML("statusDropdown",status)+'</select>',
	       '<select name="recipient" class="type validate[required]"><option value="">Select Recipient</option>'+UTEADMIN.taskAdmin.getOptionHTML("recipientDropdown",recipient)+'</select>',
	       '<a href="#" class="chooseNotificationAttrbts">Add</a><input type="hidden" name="d_notificationAttributes" value="'+notificationValues+'" class="saveSelectedNotification"><label class="viewOnlyNotificationAttributes" style="display:none;">'+trimmedNtfctnList+'</label>'
	   	];
}

UTEADMIN.taskAdmin.deleteStatusChangeNtfctn = function (removeAlreadyExistingRows) {
    var marked_delete = [];
    var alertOption = {title:"Delete Info"};
    if(removeAlreadyExistingRows){
    	$("#statusChangeDatagrid tbody .row-id-box").prop('checked', true);
    }
    
    $("#statusChangeDatagrid tbody .row-id-box:checked").each(function () {
        marked_delete.push($(this).closest('tr')[0]);
    });
    
    var sel = marked_delete.length;
    var p = sel > 1 ? "s" : "";
    if (!sel && !removeAlreadyExistingRows) {
        //alert("Please select at least one paramater to perform delete operation!");
        alertOption.displayMessage="Please select at least one Row to perform delete operation!";
        alertDialog(alertOption);
        return false;
    }
    
    if(!removeAlreadyExistingRows){
    if (!confirm("Delete Operation is irreversible, Do you want to delete the selected " + sel + " mapping" + p)) {
        return false;
    }
    }
    
    $.each(marked_delete, function(index, obj){
    	
    	$('#statusChangeDatagrid').dataTable().fnDeleteRow(obj);
 		
    });
    
}

UTEADMIN.taskAdmin.setLoadingGifPosition = function() {
	
	$("#searchLoadingDiv").css('top', ($(window).height()/2) - 10);
	$("#searchLoadingDiv").css('left',($(window).width()/2) - 10);
}

function openSLAAttrTooltip(attrResultHtmlData, errorMsg){
	UTEADMIN.taskAdmin.slaAttributesDataGrid(attrResultHtmlData, errorMsg);
	$(function() {
		$( ".SLAAttrDialog" ).dialog({
			title: "SLA Attributes",
	        resizable: false,
	        width: 700,
	        height:600,
			modal: true,
			close: function(event, ui){
				$(this).dialog("destroy");
			}
	      });
	});
}

UTEADMIN.taskAdmin.slaAttributesDataGrid = function (rowData, erroMsg) {
	
	$('.slaAttributesTable').dataTable({
		"aaData": rowData,
		"bPaginate": true, 
		"sPaginationType": "full_numbers", 
		"bLengthChange": true, 
		"bFilter": true, 
		"bSort":true, 
		"bInfo": false, 
		"bAutoWidth": false, 
		"bDestroy": true,
		"sDom":'<"top"f>rt<"bottom"ilp><"clear">',
        "aoColumns": [
						{
						    "sTitle": '<label></label>',
						     "sWidth": "2%"
						},
				        {
				            "sTitle": "Name",
				            "sWidth": "30%"
				        }, 
				        {
				            "sTitle": "Value",
				            "sWidth": "30%"
				        }
		        	],
    	 "oLanguage": {
             "sSearch": "Search",
             "sZeroRecords": erroMsg,
             "sProcessing": "Processing..."
 		}

    });
	
}

function openNtfctnAttrTooltip(ntfctnAttrHtmlData, errorMsg){
	UTEADMIN.taskAdmin.notificationAttributesDataGrid(ntfctnAttrHtmlData, errorMsg);
	$(function() {
		$( ".notificationAttrDialog" ).dialog({
			title: "Notification Attributes",
	        resizable: false,
	        width: 600,
	        height:600,
			modal: true,
			close: function(event, ui){
				$(this).dialog("destroy");
			}
	      });
	});
}

UTEADMIN.taskAdmin.notificationAttributesDataGrid = function (rowData, erroMsg) {
	
	$('.notificationAttributesTable').dataTable({
		"aaData": rowData,
		"bPaginate": true, 
		"sPaginationType": "full_numbers", 
		"bLengthChange": true, 
		"bFilter": true, 
		"bSort":true, 
		"bInfo": false, 
		"bAutoWidth": false, 
		"bDestroy": true,
		"sDom":'<"top"f>rt<"bottom"ilp><"clear">',
        "aoColumns": [
						{
						    "sTitle": '<label></label>',
						     "sWidth": "2%"
						},
				        {
				            "sTitle": "Name",
				            "sWidth": "30%"
				        }
		        	],
    	 "oLanguage": {
             "sSearch": "Search",
             "sZeroRecords": erroMsg,
             "sProcessing": "Processing..."
 		}        	

    });
	
}

function openSettingsTooltip(ntfctnAttrHtmlData, errorMsg){
	UTEADMIN.taskAdmin.notificationAttributesDataGrid(ntfctnAttrHtmlData, errorMsg);
	$(function() {
		$( ".emailSettingsDialog" ).dialog({
			title: "Notification Settings",
	        resizable: false,
	        width: 800,
	        height:600,
			modal: true,
			close: function(event, ui){
				$(this).dialog("destroy");
			}
	      });
	});
	
	$('.reminder').val($('.clickedtd .reminderH').val());
	$('.daysInput').val($('.clickedtd .daysInputH').val());
	$('.hoursInput').val($('.clickedtd .hoursInputH').val());
	$('.minutesInput').val($('.clickedtd .minutesInputH').val());
	$('.Expiration').val($('.clickedtd .ExpirationH').val());
}


UTEADMIN.taskAdmin.disableForm = function (formId) {
	
	$(formId +" input, "+formId+" select" ).prop('disabled', true);
	$("#saveBtn, #cancelTaskBtn , .chooseSLAAttrbts, .slaSettingsBtn, .chooseNotificationAttrbts").hide();
	$("#editBtn").show();
	$("#slaAttrDatagrid tr .viewOnlySettingsAttributes").show();
	$("#slaAttrDatagrid tr .viewOnlySettingsAttributes").tooltip({  tooltipClass:'tooltip'});
	$("#slaAttrDatagrid tr .viewOnlyTaskAttributes").show();
	$("#slaAttrDatagrid tr .viewOnlyTaskAttributes").tooltip({  tooltipClass:'tooltip'});
	$("#statusChangeDatagrid tr .viewOnlyNotificationAttributes").show();
	$("#statusChangeDatagrid tr .viewOnlyNotificationAttributes").tooltip({  tooltipClass:'tooltip'});
	$('.addRules').removeClass('addRules').addClass('disableaddRules');
	$('.editRuleLink').removeClass('editRuleLink').addClass('disableeditRuleLink');
	$('.addNewRule').removeClass('addNewRule').addClass('disableaddNewRule');
	$(".DTTT_container").hide();
	
}

UTEADMIN.taskAdmin.enableForm = function (formId) {
	$(formId +" input, "+formId+" select" ).prop('disabled', false);
	$(".row-id-box-default" ).prop('disabled', 'disabled');
	$("#saveBtn, #cancelTaskBtn, .chooseSLAAttrbts, .slaSettingsBtn, .chooseNotificationAttrbts").show();
	$("#editBtn, .viewOnlyNotificationAttributes, .viewOnlySettingsAttributes, .viewOnlyTaskAttributes").hide();
	$('.disableaddRules').removeClass('disableaddRules').addClass('addRules');
	$('.disableeditRuleLink').removeClass('disableeditRuleLink').addClass('editRuleLink');
	$('.disableaddNewRule').removeClass('disableaddNewRule').addClass('addNewRule');
	$(".DTTT_container").show();
}

UTEADMIN.taskAdmin.createInputElement = function (inputType, name, tempSLAArray, keyValArr, i, j){
	var value = "";
	if(tempSLAArray[i] && keyValArr!=undefined && keyValArr.length>0){
		value = keyValArr[j][1];
	}
	var inputElem = '<input type="'+inputType+'" name="'+name+'" value="'+value+'"/>'
	return inputElem;
}

UTEADMIN.taskAdmin.createOptionElement = function (labelName, value, tempSLAArray, keyValArr, i, j) {
	var optionSelected = "";
	if(tempSLAArray[i] && keyValArr!=undefined && keyValArr.length>0){
		if(keyValArr[j][1] == value){
			optionSelected = ' selected';
		}
	}
	var optionElem = '<option value= "'+value+'"'+optionSelected+'>'+labelName+'</option>';
	return optionElem;
}