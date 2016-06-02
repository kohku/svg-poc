/**
 * 
 */


var alertOption = { title: "Info" };
$(document).ready(function(){
	$('.mainbox').show();
	$('#FormHeader').hide();
	$('.remodal .remodal-close').hide();
	$('.remodal h2 .remodal-close,.action_notification .remodal-close').show();
	$('#detailsForm').validationEngine();
	
	UTEADMIN.workGroupAdmin.resetForm("#detailsForm");
	UTEADMIN.workGroupAdmin.fetchDropdownDetails();
	//UTEADMIN.workGroupAdmin.renderSearchDataTable([],"Enter criteria and do search ");
	UTEADMIN.workGroupAdmin.renderUserDataTable([],"Click '+' icon to add users");
	UTEADMIN.workGroupAdmin.renderSkillsetDataTable([],"Click '+' icon to add skillset application mapping");

	$("#searchBtn").click(function(){
		UTEADMIN.workGroupAdmin.setLoadingGifPosition();
		$("#searchResultDiv").hide();
		$("#searchLoadingDiv").show();

		var searchParams = $('#searchForm').serializeArray();	

		UTEADMIN.workGroupAdmin.renderSearchResult(searchParams);

	});
	
	$("#ClearBtn").click(function(){
		$("#WorkgroupName, #OrganizationUnitId, #JobFunctionId").val('');
		
	});
	
	$("#newWgBtn").click(function(){
		UTEADMIN.workGroupAdmin.resetForm("#detailsForm");
		UTEADMIN.workGroupAdmin.enableForm("#detailsForm");
		$('#FormHeader').show();
		$("#FormHeader").html("Create New Workgroup");
	    $( "#accordionPage" ).accordion({ active: 1 });
	});
	
	$("#wgUsersDatagrid").on("change", "#select_all", function() {
        $("#wgUsersDatagrid .row-id-box").prop("checked", $(this).prop("checked"));
    });
	
	$("#skillsetAppDatagrid").on("change", "#select_all", function() {
        $("#skillsetAppDatagrid .row-id-box").prop("checked", $(this).prop("checked"));
    });

	
	$("#saveBtn").click(function(){
		
		if($('#detailsForm').validationEngine('validate')){
			
			UTEADMIN.workGroupAdmin.enableForm("#detailsForm");
			var wgDetails = $('#detailsForm').serializeArray();
			var userInfos = [];
			var isValid = true;
			
//			$.each($('#wgUsersGrid .vgrid-body .vgrid-row'), function(index, rowNode){
//				
//				var rowKey = "";
//
//				$.each($(rowNode).children('.vgrid-column'), function(indexChild, columnNode){
//					var $columnObj = $(columnNode);
//					var columnName = $columnObj.data('name');
//					var columnValue = $columnObj.find('input,select').val();
//					
//					if(columnName == 'LDAPUserInfoId'){
//						columnValue = $columnObj.data('extra');
//					}
//					
//					if(columnName == 'LDAPUserInfoId' || columnName == 'userType'){
//						
//						rowKey = rowKey + columnValue;
//					}
//					wgDetails.push({name : columnName, value : columnValue});
//				});
//				
//				if($.inArray(rowKey, userInfos ) > -1){
//					isValid = false;
//					return;
//				}
//				else{
//					userInfos.push(rowKey);
//				}
//				
//			});
			
			$.each($('#skillsetGrid .vgrid-body .vgrid-row'), function(index, rowNode){

				$.each($(rowNode).children('.vgrid-column'), function(indexChild, columnNode){
					var $columnObj = $(columnNode);
					wgDetails.push({name : $columnObj.data('name'), value : $columnObj.find('input,select').val()});
				});
			});
			
			if(! isValid){
				alertOption.displayMessage= "Same User and Skillset combination is selected multiple times, Delete the unwanted entry";
		    	alertDialog(alertOption);
		    	return;
			}
			
			UTEADMIN.workGroupAdmin.saveWgDetails(wgDetails);
		}

	});
	
	$("#cancelBtn").click(function(){

		UTEADMIN.workGroupAdmin.resetForm("#detailsForm");
    	
    	$( "#accordionPage" ).accordion({ active: 0 });
    	$("#FormHeader").html("Create New Workgroup");
    	
    	UTEADMIN.workGroupAdmin.enableForm("#detailsForm");

	});
	
	$('#searchResultDiv').on('click', '.editApp', function(evt) {
		$('#FormHeader').show();
		UTEADMIN.workGroupAdmin.enableForm("#detailsForm");
		var wgId = $(this).parents(".vzuui-om-dropdown").attr('data');
		$(".hidedropdown").hide();
		var wgDtls = UTEADMIN.workGroupAdmin.searchWgDtlMap[wgId];
		
		UTEADMIN.workGroupAdmin.loadEditForm(wgDtls, false);
		
	});
	
	$('#searchResultDiv').on('click', '.viewWGDetails', function(evt) {
		$('#FormHeader').show();
		var wgId = $(this).parents().find('.vzuui-om-dropdown').attr('data');
		var wgDtls = UTEADMIN.workGroupAdmin.searchWgDtlMap[wgId];
		UTEADMIN.workGroupAdmin.loadEditForm(wgDtls, false);
		UTEADMIN.workGroupAdmin.disableForm("#detailsForm");
	});
	
	
	$('#searchResultDiv').on('click', '.deleteApp', function(evt) {
		
		var wgId = $(this).parents(".vzuui-om-dropdown").attr('data');
		var deleteRowRef = $(this).closest('tr')[0];
		
		if (!confirm("Delete Operation is irreversible, Do you want to delete the selected workgroup")) {
	        return false;
	    }
		
		UTEADMIN.workGroupAdmin.setLoadingGifPosition();
		
		$("#searchLoadingDiv").show();
		
		$.ajax({
	        type: "DELETE",
	        url: CONTEXT_PATH + "/ute/admin/workgroupnew/delete?wgId=" + wgId,
	    }).done(function (uteReturnData) {
	    	
            var deleteMsg = "Failed to delete workgroup info";
        	
        	if(uteReturnData){
        		try{
            		if(uteReturnData.Body.processWorkgroupInfoResponse.faultInfo.FaultCode == "UTE0000" || uteReturnData.Body.processWorkgroupInfoResponse.faultInfo.FaultCode == "NO_ERROR"){
            			deleteMsg = "Workgroup deleted successfully";
            			
            			$('#searchResultDatagrid').dataTable().fnDeleteRow(deleteRowRef);
            			
            		}
            		else{
            			deleteMsg = uteReturnData.Body.processWorkgroupInfoResponse.faultInfo.FaultDescription;
            		}
            	}
            	catch(e){
            		deleteMsg = uteReturnData.Body.Fault.detail.AdminServiceFault.FaultDescription;
            	}
        	}
        	
        	$("#searchLoadingDiv").hide();
        	
        	alertOption.displayMessage=deleteMsg;
        	alertDialog(alertOption);
        	
            return false;
	    	
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

//	$('input[type="checkbox"],input[type="radio"]').vzuuiprettyCheckable();
	
	
	var dbox = $("#dialog-user-add");
	var selected_rows = null;

	dbox.dialog({
	        title: "Search User and Add",
	        resizable: false,
	        width: 892,
	        height:540,
	        modal: true,
	        autoOpen: false,
	        buttons: {	
	                AddUser: function(){
	                    
	                    dbox.find("#vgrid_container").vgrid('getSelectedRowsDataHashmap', function(rows,rowArr) {                            
	                        selected_rows = rowArr;                                  
	                    });         

	                    if (selected_rows.length == 0) {            
	                        //alert("Please select a row first");
	                        alertOption.displayMessage="Please select atleast one user to add.";
	                        alertDialog(alertOption);
	                        return false;
	                    }
	                    
	                    $.each(selected_rows, function(index, $selectedUserRow){
	                    	
	                    		
	                		var id = $selectedUserRow.find(".vgrid-column[data-name=id]").text().toUpperCase();
	                		var displayText = $selectedUserRow.find(".vgrid-column[data-name=lastname]").text() + ", " + $selectedUserRow.find(".vgrid-column[data-name=firstname]").text();
	                		
	                		var t = $('#wgUsersDatagrid').dataTable().api();
	                		t.row.add(UTEADMIN.workGroupAdmin.getUserRowData(id, displayText, "ASSIGNEE")).draw();
	                		
	                		$('#detailsForm').validationEngine();
	                    		
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


window.UTEADMIN = window.UTEADMIN || {};
UTEADMIN.workGroupAdmin = UTEADMIN.workGroupAdmin || {};
UTEADMIN.util = UTEADMIN.util || {};
UTEADMIN.workGroupAdmin.userListSeq = 0;
UTEADMIN.workGroupAdmin.searchWgDtlMap = {};
UTEADMIN.workGroupAdmin.dropdownMetaMap = {};
//UTEADMIN.workGroupAdmin.dropdownMetaMapReverse = {};

UTEADMIN.workGroupAdmin.renderSearchResult = function (searchParams) {
	
    $.ajax({
        type: "POST",
        url: CONTEXT_PATH + "/ute/admin/workgroupnew/search",
        data: searchParams,
    }).done(function (uteReturnData) {
    	
    	var wgResultHtmlData = [];
    	var erroMsg = "";
    	
    	if(uteReturnData){
    		try{
        		if(uteReturnData.Body.processWorkgroupInfoResponse.faultInfo.FaultCode == "UTE0000" || uteReturnData.Body.processWorkgroupInfoResponse.faultInfo.FaultCode == "NO_ERROR"){
        			
        			var workgroupDtls = uteReturnData.Body.processWorkgroupInfoResponse.Workgroup;
        			
        			if($.type(workgroupDtls) == "array"){
        				
        				for (var i = 0, c = workgroupDtls.length; i < c; i++) {
        					workgroupDtls[i].JobFunctionDisplayText ? workgroupDtls[i].JobFunctionDisplayText : "";
        					workgroupDtls[i].WorkgroupName ? workgroupDtls[i].WorkgroupName : "";
            	        	wgResultHtmlData.push([
            	        	    '<span class="vzuui-om-menu"></span><div id="popupBlock" class="vzuui-om-dropdown hidedropdown" data="' + workgroupDtls[i].WorkgroupId + '"><ul id="vzuui-task-actions"><li class="editApp">Edit</li><li class="deleteApp">Delete</li></ul></div>',
            	        	    '<a href="#" class="viewWGDetails">'+workgroupDtls[i].WorkgroupName+'</a>',
            	        	    (workgroupDtls[i].StatusDisplayText ? workgroupDtls[i].StatusDisplayText : ""),
            	        	    (workgroupDtls[i].OrganizationUnitDisplayText ? workgroupDtls[i].OrganizationUnitDisplayText : ""),
            	        	    '<label class="partialText" style="font-weight:normal;" title="'+workgroupDtls[i].JobFunctionFullText+'">'+workgroupDtls[i].JobFunctionDisplayText+'</label>',
            	        	    (workgroupDtls[i].RoutingPolicyDisplayText ? workgroupDtls[i].RoutingPolicyDisplayText : ""),
            	            ]);
            	        	
            	        	UTEADMIN.workGroupAdmin.searchWgDtlMap[workgroupDtls[i].WorkgroupId] = workgroupDtls[i];
            	        }
        				
        			}
        			else{
        				workgroupDtls.JobFunctionDisplayText ? workgroupDtls.JobFunctionDisplayText : "";
        				workgroupDtls.WorkgroupName ? workgroupDtls.WorkgroupName : "";
        				wgResultHtmlData.push([
        		            	        	    '<span class="vzuui-om-menu"></span><div id="popupBlock" class="vzuui-om-dropdown hidedropdown" data="' + workgroupDtls.WorkgroupId + '"><ul id="vzuui-task-actions"><li class="editApp">Edit</li><li class="deleteApp">Delete</li></ul></div>',
        		            	        	    '<a href="#" class="viewWGDetails">'+workgroupDtls.WorkgroupName+'</a>',
        		            	        	    (workgroupDtls.StatusDisplayText ? workgroupDtls.StatusDisplayText : ""),
        		            	        	    (workgroupDtls.OrganizationUnitDisplayText ? workgroupDtls.OrganizationUnitDisplayText : ""),
        		            	        	    '<label class="partialText" style="font-weight:normal;" title="'+workgroupDtls.JobFunctionFullText+'">'+workgroupDtls.JobFunctionDisplayText+'</label>',
        		            	        	    (workgroupDtls.RoutingPolicyDisplayText ? workgroupDtls.RoutingPolicyDisplayText : ""),
        		            	            ]);
        		            	        	
        				UTEADMIN.workGroupAdmin.searchWgDtlMap[workgroupDtls.WorkgroupId] = workgroupDtls;
        			
        			}
        		}
        		else{
        			erroMsg = uteReturnData.Body.processWorkgroupInfoResponse.faultInfo.FaultDescription;
        		}
        	}
        	catch(e){
        		erroMsg = uteReturnData.Body.Fault.detail.AdminServiceFault.FaultDescription;
        	}
    	}
    	
    	UTEADMIN.workGroupAdmin.renderSearchDataTable(wgResultHtmlData, erroMsg);
    	
    	
        $("#searchResultDiv").show();
		$("#searchLoadingDiv").hide();
    	
    }); //closes the ajax call
}


UTEADMIN.workGroupAdmin.saveWgDetails = function (wgDetails) {
	UTEADMIN.workGroupAdmin.setLoadingGifPosition();
	$("#searchLoadingDiv").show();
	
	var saveAlertOptions = {title: "Info"};
	
    $.ajax({
        type: "POST",
        url: CONTEXT_PATH + "/ute/admin/workgroupnew/save",
        data: wgDetails,
    }).done(function (uteReturnData) {
    	
    	var saveMsg = "Failed to store workgroup info";
    	
    	if(uteReturnData){
    		try{
        		if(uteReturnData.Body.processWorkgroupInfoResponse.faultInfo.FaultCode == "UTE0000" || uteReturnData.Body.processWorkgroupInfoResponse.faultInfo.FaultCode == "NO_ERROR"){
        			saveMsg = "Workgroup details saved successfully";
        			
        			UTEADMIN.workGroupAdmin.resetForm("#searchForm");
        			$("#searchForm #WorkgroupName").val($("#detailsForm #WorkgroupName").val());
        			
        			UTEADMIN.workGroupAdmin.resetForm("#detailsForm");
        			$("#FormHeader").html("Add Workgroup");
        			
        			saveAlertOptions.buttons = {
        	            Ok: function() {
        	                $(this).dialog("close");
        	                
        	                $("#searchBtn").trigger('click');
                			
                	    	$( "#accordionPage" ).accordion({ active: 0 });
                	    	
        	            }
        	        }
        			
        		}
        		else{
        			saveMsg = uteReturnData.Body.processWorkgroupInfoResponse.faultInfo.FaultDescription;
        		}
        	}
        	catch(e){
        		saveMsg = uteReturnData.Body.Fault.detail.AdminServiceFault.FaultDescription;
        	}
    	}
    	$("#searchLoadingDiv").hide();
    	saveAlertOptions.displayMessage=saveMsg;
    	alertDialog(saveAlertOptions);
    	
        return false;
    	
    }); //closes the ajax call
}


UTEADMIN.workGroupAdmin.fetchDropdownDetails = function () {
	
	var paramList = ["STATUS", "CONTINUITY_LEVEL", "SCHEDULING_REQUIRED", "IS_SUBGROUP","SUBGROUP_TYPE","OVERFLOW_USER","ROUTING_POLICY", "USER_TYPE"];
	var paramDetails = [];
	paramDetails.push({name : "parameter", value : JSON.stringify(paramList)});
	
    $.ajax({
        type: "POST",
        url: CONTEXT_PATH + "/ute/admin/workgroupnew/dropdowndetails",
        data: paramDetails,
    }).done(function (dropdownDetails) {
    	
    	UTEADMIN.workGroupAdmin.dropdownMetaMap = dropdownDetails;
//    	$.each(dropdownDetails, function(optionName, optionMap){
//    		
//    		var tempMap = {};
//    		
//    		$.each(optionMap, function(optionDesc, optionValue){
//    			tempMap[optionValue] = optionDesc;
//        	});
//    		
//    		UTEADMIN.workGroupAdmin.dropdownMetaMapReverse[optionName] = tempMap;
//    	});
    	
    }); 
}


UTEADMIN.workGroupAdmin.resetForm = function (formId) {
	
	$(formId +" input[type='text'], "+formId+" input[type='password'], "+formId+" input[type='hidden'], "+formId+" select, "+formId+" textarea" ).val("");
	// set default values for dropdowns
	if(formId == "#detailsForm"){
		$(formId+" #RoutingPolicy").val("SKILLSET");
	}
	
	
	UTEADMIN.workGroupAdmin.renderUserDataTable([],"Click '+' icon to add users");
	UTEADMIN.workGroupAdmin.renderSkillsetDataTable([],"Click '+' icon to add skillset application mapping");
	
}

UTEADMIN.workGroupAdmin.disableForm = function (formId) {
	
	$(formId +" input[type='text'], "+formId+" input[type='password'], "+formId+" select, "+formId+" textarea, "+formId+" input[type='radio'], "+formId+" input[type='checkbox']" ).prop('disabled', true);
	$("#saveBtn").hide();
}

UTEADMIN.workGroupAdmin.enableForm = function (formId) {
	
	$(formId +" input[type='text'], "+formId+" input[type='password'], "+formId+" select, "+formId+" textarea, "+formId+" input[type='radio'], "+formId+" input[type='checkbox']" ).prop('disabled', false);
	$("#saveBtn").show();
}


UTEADMIN.workGroupAdmin.loadEditForm = function (wgDetails, isDisable) {
	
	UTEADMIN.workGroupAdmin.resetForm("#detailsForm");
	
	$("#FormHeader").html("Edit Workgroup");
	
    $( "#accordionPage" ).accordion({ active: 1 });
    
    $.each(wgDetails, function(elementId, elementValue){
        $("#detailsForm #"+ elementId).val(elementValue);
    });
    
    $("#detailsForm #WorkgroupName,#detailsForm #OrganizationUnitId").prop('disabled', true);
    
    var wgUserList = [];
    var skillsetAppList = [];
    
    if(wgDetails.workGroupUsers){
    	
    	 if($.type(wgDetails.workGroupUsers) === "object"){
    	    	
    	    	var id = wgDetails.workGroupUsers.VZId.toUpperCase();
    	    	var displayText = wgDetails.workGroupUsers.lastName + ", " + wgDetails.workGroupUsers.firstName;
    	    	wgUserList.push(UTEADMIN.workGroupAdmin.getUserRowData(id, displayText, wgDetails.workGroupUsers.userType));
    	    	
    	    }
    	    else{
    	    	$.each(wgDetails.workGroupUsers, function(index, userDtl){
    	        	
    	        	var id = userDtl.VZId.toUpperCase();
    	        	var displayText = userDtl.lastName + ", " + userDtl.firstName;
    	        	wgUserList.push(UTEADMIN.workGroupAdmin.getUserRowData(id, displayText, userDtl.userType));
    	        	
    		    });
    	    }
    	
    }
    
    if(wgDetails.Skillsets){
    	
    	if($.type(wgDetails.Skillsets) === "object"){
        	skillsetAppList.push(UTEADMIN.workGroupAdmin.getSkillRowData(wgDetails.Skillsets.SkillsetId, wgDetails.Skillsets.ApplicationId));
        }
        else{
        	$.each(wgDetails.Skillsets, function(index, userDtl){
            	skillsetAppList.push(UTEADMIN.workGroupAdmin.getSkillRowData(userDtl.SkillsetId, userDtl.ApplicationId));
    	    });
        }
    }
    
    UTEADMIN.workGroupAdmin.renderUserDataTable(wgUserList,"Click '+' icon to add users");
    UTEADMIN.workGroupAdmin.renderSkillsetDataTable(skillsetAppList,"Click '+' icon to add skillset application mapping");
    
}

UTEADMIN.workGroupAdmin.renderSearchDataTable = function (rowData, erroMsg) {
	
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
				            "sTitle": "Workgroup Name",
				             "sWidth": "15%"
				        }, {
				            "sTitle": "Status",
				            "sWidth": "7%"
				        }, {
				            "sTitle": "Organization",
				            "sWidth": "10%"
				        }, {
				            "sTitle": "Job Function",
				            "sWidth": "20%"
				        }, {
				            "sTitle": "Routing Policy",
				            "sWidth": "8%"
				        }, 
		        	],
	    "oLanguage": {
                        "sSearch": "Search",
                        "sZeroRecords": erroMsg,
                        "sProcessing": "Processing..."
            		},

    });
	
	$('.partialText').tooltip();
	
}


UTEADMIN.workGroupAdmin.renderUserDataTable = function (rowData, erroMsg) {
	
	$('#wgUsersDatagrid').dataTable({
		"aaData": rowData,
		"bPaginate": true, 
		"sPaginationType": "full_numbers", 
		"bLengthChange": true, 
		"bFilter": true, 
		"bSort":false, 
		"bInfo": false, 
		"bAutoWidth": false, 
		"bDestroy": true,
		"sDom":'<"top"fT>rt<"bottom"ilp><"clear">',
        "aoColumns": [
						{
						    "sTitle": '<input type="checkbox" class="uniform" id="select_all">',
						     "sWidth": "2%",
						     "sClass": "checkbox_column"
						},
				        {
				            "sTitle": "User Name",
				             "sWidth": "30%"
				        }, 
				        {
				            "sTitle": "User Type",
				            "sWidth": "10%"
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
				                    "sToolTip": "Add Users",
				                    "fnClick": function (nButton, oConfig, oFlash) {
				                    	UTEADMIN.workGroupAdmin.addUserDialog();
				                    }
				            },
				            {
				                    "sExtends": "text",
				                    "sButtonText": '<i class="trashIcon"></i>',
				                    "sToolTip": "Delete Users",
				                    "fnClick": function (nButton, oConfig, oFlash) {
				                    	UTEADMIN.workGroupAdmin.deleteUser();
				                    }
				            },
				       ]
			
		},

    });
	
}

UTEADMIN.workGroupAdmin.renderSkillsetDataTable = function (rowData, erroMsg) {
	
	$('#skillsetAppDatagrid').dataTable({
		"aaData": rowData,
		"bPaginate": true, 
		"sPaginationType": "full_numbers", 
		"bLengthChange": true, 
		"bFilter": true, 
		"bSort":false, 
		"bInfo": false, 
		"bAutoWidth": false, 
		"bDestroy": true,
		"sDom":'<"top"fT>rt<"bottom"ilp><"clear">',
        "aoColumns": [
						{
						    "sTitle": '<input type="checkbox" class="uniform" id="select_all">',
						     "sWidth": "2%",
						     "sClass": "checkbox_column"
						},
				        {
				            "sTitle": "Skillset",
				             "sWidth": "30%"
				        }, 
				        {
				            "sTitle": "Source Application",
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
				                    "sToolTip": "Add Skillset Mapping",
				                    "fnClick": function (nButton, oConfig, oFlash) {
				                    	UTEADMIN.workGroupAdmin.addSkillset();
				                    }
				            },
				            {
				                    "sExtends": "text",
				                    "sButtonText": '<i class="trashIcon"></i>',
				                    "sToolTip": "Delete Skillset Mapping",
				                    "fnClick": function (nButton, oConfig, oFlash) {
				                    	UTEADMIN.workGroupAdmin.deleteSkillset();
				                    }
				            },
				       ]
			
		},

    });
	
}


UTEADMIN.workGroupAdmin.getUserRowData = function (ldapUserId, userNameDisplayText, userType) {
	
	return [
            '<input type="checkbox" class="row-id-box" id="' + (UTEADMIN.workGroupAdmin.userListSeq++) + '">',
            '<input name="LDAPUserInfoId" type="hidden" value="' + ldapUserId + '" />' + userNameDisplayText,
            '<select name="userType" class="type validate[required]">' + UTEADMIN.workGroupAdmin.getOptionHTML("USER_TYPE", userType) + '</select>',
        ];
}

UTEADMIN.workGroupAdmin.addUserDialog = function () {
	
	var dbox = $("#dialog-user-add");
    dbox.find("#vgrid_container .vgrid-body").empty();
    dbox.dialog('open');
    doReset();   
	
}

UTEADMIN.workGroupAdmin.deleteUser = function () {
    var marked_delete = [];
    
    $("#wgUsersDatagrid tbody .row-id-box:checked").each(function () {
        marked_delete.push($(this).closest('tr')[0]);
    });
    
    var sel = marked_delete.length;
    var p = sel > 1 ? "s" : "";
    if (!sel) {
        //alert("Please select at least one paramater to perform delete operation!");
        alertOption.displayMessage="Please select at least one user to perform delete operation!";
        alertDialog(alertOption);
        return false;
    }
    if (!confirm("Delete Operation is irreversible, Do you want to delete the selected " + sel + " User" + p)) {
        return false;
    }
    
    $.each(marked_delete, function(index, obj){
    	
    	$('#wgUsersDatagrid').dataTable().fnDeleteRow(obj);
 		
    });
    
}

UTEADMIN.workGroupAdmin.addSkillset = function () {
	
	var t = $('#skillsetAppDatagrid').dataTable().api();
	t.row.add(UTEADMIN.workGroupAdmin.getSkillRowData("", "")).draw();
	
	$('#detailsForm').validationEngine();
	
}

UTEADMIN.workGroupAdmin.deleteSkillset = function () {
    var marked_delete = [];
    
    $("#skillsetAppDatagrid tbody .row-id-box:checked").each(function () {
        marked_delete.push($(this).closest('tr')[0]);
    });
    
    var sel = marked_delete.length;
    var p = sel > 1 ? "s" : "";
    if (!sel) {
        //alert("Please select at least one paramater to perform delete operation!");
        alertOption.displayMessage="Please select at least one Skillset Application mapping to perform delete operation!";
        alertDialog(alertOption);
        return false;
    }
    if (!confirm("Delete Operation is irreversible, Do you want to delete the selected " + sel + " mapping" + p)) {
        return false;
    }
    
    $.each(marked_delete, function(index, obj){
    	
    	$('#skillsetAppDatagrid').dataTable().fnDeleteRow(obj);
 		
    });
    
}

UTEADMIN.workGroupAdmin.getSkillRowData = function (skillsetId, applicationId) {
	
	return [
            '<input type="checkbox" class="row-id-box" id="' + (UTEADMIN.workGroupAdmin.userListSeq++) + '">',
            '<select name="SkillsetId" class="type validate[required]"><option value="">Select Skillset</option>' + UTEADMIN.workGroupAdmin.getOptionHTML("Skillset", skillsetId) + '</select>',
            '<select name="ApplicationId" class="type validate[required]"><option value="">Select Application</option>' + UTEADMIN.workGroupAdmin.getOptionHTML("Application", applicationId) + '</select>',
        ];
}


UTEADMIN.workGroupAdmin.getOptionHTML = function (paramName, selectValue) {
	
	var propertyTypeOption = "";
	
	$.each(UTEADMIN.workGroupAdmin.dropdownMetaMap[paramName], function(key, value){
		
		propertyTypeOption = propertyTypeOption + '<option value="' + value + '"' + ((value == selectValue) ? " selected ":" ") + '>' + key + '</option>';	
 		
    });
	
	return propertyTypeOption;
	
}


UTEADMIN.workGroupAdmin.setLoadingGifPosition = function() {
	
	$("#searchLoadingDiv").css('top', ($(window).height()/2) - 10);
	$("#searchLoadingDiv").css('left',($(window).width()/2) - 10);
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
          $('#dialog-user-add #vgrid-wrapper #vgrid_container .vgrid-selector-checkbox').off();
          $("#content-spinny").hide();
      },
      fail:function(){
           $("#content-spinny").hide();
      }
  });

}

