var alertOption = { title: "Info" };
window.UTEADMIN = window.UTEADMIN || {};
UTEADMIN.roleAdmin = UTEADMIN.roleAdmin || {};
UTEADMIN.util = UTEADMIN.util || {};
UTEADMIN.roleAdmin.userListSeq = 0;
UTEADMIN.roleAdmin.searchRoleDtlMap = {};
UTEADMIN.roleAdmin.dropdownMetaMap = {};
$(document).ready(function(){
	$('.mainbox').show();
	$('#editFormHeader').hide();
	$('#roleDetailsForm').validationEngine();
	$("#roleSearchBtn").click(function(){
		UTEADMIN.roleAdmin.setLoadingGifPosition();
		$("#roleSearchResultDiv").hide();
		$("#searchLoadingDiv").show();
		var searchParams = $('#rolesSearchForm').serializeArray();	
		UTEADMIN.roleAdmin.renderSearchResult(searchParams);
	});
	
	$("#roleClearBtn").click(function(){
		$("#roleName, #description").val('');
		
	});
	
	$('#roleSearchResultDiv').on('click', '.editMembers', function(evt) {
		$('#FormHeader').show();
		UTEADMIN.roleAdmin.enableForm("#roleDetailsForm");
		var roleId = $(this).parents(".vzuui-om-dropdown").attr('data');
		$(".hidedropdown").hide();
		var roleDtls = UTEADMIN.roleAdmin.searchRoleDtlMap[roleId];
		
		UTEADMIN.roleAdmin.loadEditForm(roleDtls, false);
		
	});
	
$("#roleSaveBtn").click(function(){
		
		if($('#roleDetailsForm').validationEngine('validate')){
			
			UTEADMIN.roleAdmin.enableForm("#roleDetailsForm");
			var roleDetails = $('#roleDetailsForm').serializeArray();
			var userInfos = [];
			var isValid = true;
			if(! isValid){
				alertOption.displayMessage= "Same User and Skillset combination is selected multiple times, Delete the unwanted entry";
		    	alertDialog(alertOption);
		    	return;
			}
			
			UTEADMIN.roleAdmin.saveRoleDetails(roleDetails);
		}

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
});

UTEADMIN.roleAdmin.setLoadingGifPosition = function() {
	
	$("#searchLoadingDiv").css('top', ($(window).height()/2) - 10);
	$("#searchLoadingDiv").css('left',($(window).width()/2) - 10);
}

UTEADMIN.roleAdmin.renderSearchResult = function (searchParams) {
	
    $.ajax({
        type: "POST",
        url: CONTEXT_PATH + "/ute/admin/role/search",
        data: searchParams,
    }).done(function (uteReturnData) {
    	
    	var roleResultHtmlData = [];
    	var erroMsg = "";
    	
    	if(uteReturnData){
    		try{
        		if(uteReturnData.Body.processWorkgroupInfoResponse.faultInfo.FaultCode == "UTE0000" || uteReturnData.Body.processWorkgroupInfoResponse.faultInfo.FaultCode == "NO_ERROR"){
        			
        			var roleDtls = uteReturnData.Body.processWorkgroupInfoResponse.Workgroup;
        			
        			if($.type(roleDtls) == "array"){
        				
        				for (var i = 0, c = roleDtls.length; i < c; i++) {
        					'<span class="vzuui-om-menu"></span><div id="popupBlock" class="vzuui-om-dropdown hidedropdown" data="' + workgroupDtls.WorkgroupId + '"><ul id="vzuui-task-actions"><li class="editMembers">Edit Members List</li>'
            	        }
        				
        			}
        			else{
        				'<span class="vzuui-om-menu"></span><div id="popupBlock" class="vzuui-om-dropdown hidedropdown" data="' + workgroupDtls.WorkgroupId + '"><ul id="vzuui-task-actions"><li class="editMembers">Edit Members List</li>'
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
    	
    	UTEADMIN.roleAdmin.renderSearchDataTable(roleResultHtmlData, erroMsg);
    	
    	
        $("#searchResultDiv").show();
		$("#searchLoadingDiv").hide();
    	
    }); //closes the ajax call
}

UTEADMIN.roleAdmin.renderSearchDataTable = function (rowData, erroMsg) {
	
	$('#roleSearchResultDatagrid').dataTable({
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
				            "sTitle": "Role Name",
				             "sWidth": "40%"
				        }, {
				            "sTitle": "Role Description",
				            "sWidth": "60%"
				        }
		        	],
	    "oLanguage": {
                        "sSearch": "Search",
                        "sZeroRecords": erroMsg,
                        "sProcessing": "Processing..."
            		},

    });
	
}

UTEADMIN.roleAdmin.loadEditForm = function(roleDetails){
	UTEADMIN.roleAdmin.resetForm("#roleDetailsForm");
    $("#accordionPage").accordion({ active: 1 });
    $.each(roleDetails, function(elementId, elementValue){
        $("#roleDetailsForm #"+ elementId).val(elementValue);
    });
    $("#roleDetailsForm #RoleName").prop('disabled', true);
    var roleUserList = [];
    
    if(roleDetails.roleUsers){
    	
   	 if($.type(roleDetails.roleUsers) === "object"){
   	    	
   	    	var id = roleDetails.roleUsers.VZId.toUpperCase();
   	    	var displayText = roleDetails.roleUsers.lastName + ", " + roleDetails.roleUsers.firstName;
   	    	roleUserList.push(UTEADMIN.roleAdmin.getUserRowData(id, displayText, roleDetails.roleUsers.userType));
   	    	
   	    }
   	    else{
   	    	$.each(roleDetails.roleUsers, function(index, userDtl){
   	        	
   	        	var id = userDtl.VZId.toUpperCase();
   	        	var displayText = userDtl.lastName + ", " + userDtl.firstName;
   	        	roleUserList.push(UTEADMIN.roleAdmin.getUserRowData(id, displayText, userDtl.userType));
   	        	
   		    });
   	    }
   	
   }
    UTEADMIN.roleAdmin.renderUserDataTable(roleUserList,"Click '+' icon to add users");
}

UTEADMIN.roleAdmin.renderUserDataTable = function (rowData, erroMsg) {
	
	$('#roleUsersDatagrid').dataTable({
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
				             "sWidth": "50%"
				        }, 
				        {
				            "sTitle": "User Type",
				            "sWidth": "50%"
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
				                    "sToolTip": "Add Users",
				                    "fnClick": function (nButton, oConfig, oFlash) {
				                    	UTEADMIN.roleAdmin.addUserDialog();
				                    }
				            },
				            {
				                    "sExtends": "text",
				                    "sButtonText": '<i class="trashIcon"></i>',
				                    "sToolTip": "Delete Users",
				                    "fnClick": function (nButton, oConfig, oFlash) {
				                    	UTEADMIN.roleAdmin.deleteUser();
				                    }
				            },
				       ]
		},

    });
	
}

UTEADMIN.roleAdmin.getUserRowData = function (ldapUserId, userNameDisplayText, userType) {
	
	return [
            '<input type="checkbox" class="row-id-box" id="' + (UTEADMIN.roleAdmin.userListSeq++) + '">',
            '<input name="LDAPUserInfoId" type="hidden" value="' + ldapUserId + '" />' + userNameDisplayText,
            '<select name="userType" class="type validate[required]"><option value="">Select User Type</option>' + UTEADMIN.roleAdmin.getOptionHTML("USER_TYPE", userType) + '</select>'
        ];
}

UTEADMIN.roleAdmin.getOptionHTML = function (paramName, selectValue) {
	
	var propertyTypeOption = "";
	
	$.each(UTEADMIN.roleAdmin.dropdownMetaMap[paramName], function(key, value){
		
		propertyTypeOption = propertyTypeOption + '<option value="' + value + '"' + ((value == selectValue) ? " selected ":" ") + '>' + key + '</option>';	
 		
    });
	
	return propertyTypeOption;
	
}


UTEADMIN.roleAdmin.addUserDialog = function () {
	
	var dbox = $("#dialog-user-add");
    dbox.find("#vgrid_container .vgrid-body").empty();
    dbox.dialog('open');
    doReset();   
	
}

UTEADMIN.roleAdmin.deleteUser = function () {
    var marked_delete = [];
    
    $("#roleUsersDatagrid tbody .row-id-box:checked").each(function () {
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
    	
    	$('#roleUsersDatagrid').dataTable().fnDeleteRow(obj);
 		
    });
    
}

function doReset(){
    $("#transfer-search,#first-name,#last-name").val("");
}

UTEADMIN.roleAdmin.resetForm = function (formId) {
	
	$(formId +" input[type='text'], "+formId+" input[type='password'], "+formId+" input[type='hidden'], "+formId+" select, "+formId+" textarea" ).val("");
	
	UTEADMIN.roleAdmin.renderUserDataTable([],"Click '+' icon to add users");
	
}

UTEADMIN.roleAdmin.disableForm = function (formId) {
	
	$(formId +" input[type='text'], "+formId+" input[type='password'], "+formId+" select, "+formId+" textarea, "+formId+" input[type='radio'], "+formId+" input[type='checkbox']" ).prop('disabled', true);
	$("#saveBtn").hide();
}

UTEADMIN.roleAdmin.enableForm = function (formId) {
	
	$(formId +" input[type='text'], "+formId+" input[type='password'], "+formId+" select, "+formId+" textarea, "+formId+" input[type='radio'], "+formId+" input[type='checkbox']" ).prop('disabled', false);
	$("#saveBtn").show();
}

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
                		
                		var t = $('#roleUsersDatagrid').dataTable().api();
                		t.row.add(UTEADMIN.roleAdmin.getUserRowData(id, displayText, "")).draw();
                		
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

UTEADMIN.roleAdmin.saveRoleDetails = function (roleDetails) {
	UTEADMIN.roleAdmin.setLoadingGifPosition();
	$("#searchLoadingDiv").show();
	
	var saveAlertOptions = {title: "Info"};
	
    $.ajax({
        type: "POST",
        url: CONTEXT_PATH + "/ute/admin/role/save",
        data: roleDetails
    }).done(function (uteReturnData) {
    	
    	var saveMsg = "Failed to store role info";
    	
    	if(uteReturnData){
    		try{
        		if(uteReturnData.Body.processWorkgroupInfoResponse.faultInfo.FaultCode == "UTE0000" || uteReturnData.Body.processWorkgroupInfoResponse.faultInfo.FaultCode == "NO_ERROR"){
        			saveMsg = "role details saved successfully";
        			
        			UTEADMIN.roleAdmin.resetForm("#searchForm");
        			$("#roleSearchForm #RoleName").val($("#roleDetailsForm #RoleName").val());
        			
        			UTEADMIN.roleAdmin.resetForm("#detailsForm");
        			$("#FormHeader").html("Add role");
        			
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