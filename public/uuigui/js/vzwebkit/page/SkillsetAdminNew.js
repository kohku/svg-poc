/**
 * 
 */


var alertOption = { title: "Info" };
$(document).ready(function(){
	/*var inst = $.remodal.lookup[$('[data-remodal-id=modal]').data('remodal')];
	inst.open();*/
	$('.mainbox').show();
	$('#FormHeader').hide();
	$('.remodal .remodal-close').hide();
	$('.remodal h2 .remodal-close,.action_notification .remodal-close').show();

	$('#detailsForm').validationEngine();
	
	UTEADMIN.skillsetAdmin.resetForm("#detailsForm");
	UTEADMIN.skillsetAdmin.fetchDropdownDetails();
	//UTEADMIN.skillsetAdmin.renderSearchDataTable([],"Enter criteria and do search ");
	UTEADMIN.skillsetAdmin.renderUserDataTable([],"Click '+' icon to add users");

	$("#searchBtn").click(function(){
		UTEADMIN.skillsetAdmin.setLoadingGifPosition();
		$("#searchResultDiv").hide();
		$("#searchLoadingDiv").show();

		var searchParams = $('#searchForm').serializeArray();	

		UTEADMIN.skillsetAdmin.renderSearchResult(searchParams);

	});
	
	$("#ClearBtn").click(function(){
		$("#SkillsetName, #SkillsetNameDesc, #FunctionId").val('');
		
	});
	
	$("#newSkillsetBtn").click(function(){
		$("#FormHeader").show();
		UTEADMIN.skillsetAdmin.resetForm("#detailsForm");
		$("#FormHeader").html("Create Skillset");
	    $( "#accordionPage" ).accordion({ active: 1 });
	    UTEADMIN.skillsetAdmin.enableForm("#detailsForm");
	});
	
	$("#skillsetUsersDatagrid").on("change", "#select_all", function() {
        $("#skillsetUsersDatagrid .row-id-box").prop("checked", $(this).prop("checked"));
    });

	
	$("#saveBtn").click(function(){
		
		if($('#detailsForm').validationEngine('validate')){
			UTEADMIN.skillsetAdmin.enableForm("#detailsForm");
			var wgDetails = $('#detailsForm').serializeArray();
			var userInfos = [];
			var isValid = true;
			
//			$.each($('#skillsetUsersGrid .vgrid-body .vgrid-row'), function(index, rowNode){
//				
//				var rowKey = "";
//
//				$.each($(rowNode).children('.vgrid-column'), function(indexChild, columnNode){
//					var $columnObj = $(columnNode);
//					var columnName = $columnObj.data('name');
//					
//					if(columnName == 'UserInfoId'){
//						columnValue = $columnObj.data('extra');
//						rowKey = columnValue;
//						var alreadyPresentId = $columnObj.data('userSkillsetId');
//						
//						if(! alreadyPresentId){
//							wgDetails.push({name : columnName, value : columnValue});
//						}
//					}
//					
//					
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
			
			if(! isValid){
				alertOption.displayMessage= "Same User is selected multiple times, Delete the unwanted entry";
		    	alertDialog(alertOption);
		    	return;
			}
			
			UTEADMIN.skillsetAdmin.saveWgDetails(wgDetails);
		}

	});
	
	$("#cancelBtn").click(function(){

		UTEADMIN.skillsetAdmin.resetForm("#detailsForm");
    	
    	$( "#accordionPage" ).accordion({ active: 0 });
    	$("#FormHeader").html("Create Skillset");
    	
    	UTEADMIN.skillsetAdmin.enableForm("#detailsForm");

	});
	
	
	$('#searchResultDiv').on('click', '.editApp', function(evt) {
		$("#FormHeader").show();
		var skillsetId = $(this).parents(".vzuui-om-dropdown").attr('data');
		$(".hidedropdown").hide();
		var skillsetDtl = UTEADMIN.skillsetAdmin.searchSkillsetDtlMap[skillsetId];
		
		UTEADMIN.skillsetAdmin.loadEditForm(skillsetDtl, false);
		
	});
	
	
	$('#searchResultDiv').on('click', '.deleteApp', function(evt) {
		
		var skillsetId = $(this).parents(".vzuui-om-dropdown").attr('data');
		var deleteRowRef = $(this).closest('tr')[0];
		
		if (!confirm("Delete Operation is irreversible, Do you want to delete the selected Skillset")) {
	        return false;
	    }
		
		UTEADMIN.skillsetAdmin.setLoadingGifPosition();
		$("#searchLoadingDiv").show();
		
		$.ajax({
	        type: "DELETE",
	        url: CONTEXT_PATH + "/ute/admin/skillsetnew/delete?skillsetId=" + skillsetId,
	    }).done(function (uteReturnData) {
	    	
	    	var deleteMsg = "Failed to delete the skillset";
	    	
	    	if(uteReturnData){
	    		try{
		    		if(uteReturnData.Body.processSkillsetInfoResponse.faultInfo.FaultCode == "UTE0000" || uteReturnData.Body.processSkillsetInfoResponse.faultInfo.FaultCode == "NO_ERROR"){
		    			deleteMsg = "Skillset deleted successfully";
		    			
		    			$('#searchResultDatagrid').dataTable().fnDeleteRow(deleteRowRef);
		    		}
		    		else{
		    			deleteMsg = uteReturnData.Body.processSkillsetInfoResponse.faultInfo.FaultDescription;
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
	                		
	                		var t = $('#skillsetUsersDatagrid').dataTable().api();
	                		t.row.add(UTEADMIN.skillsetAdmin.getUserRowData(id, displayText)).draw();
	                		
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
UTEADMIN.skillsetAdmin = UTEADMIN.skillsetAdmin || {};
UTEADMIN.util = UTEADMIN.util || {};
UTEADMIN.skillsetAdmin.userListSeq = 0;
UTEADMIN.skillsetAdmin.searchSkillsetDtlMap = {};
UTEADMIN.skillsetAdmin.dropdownMetaMap = {};


UTEADMIN.skillsetAdmin.renderSearchResult = function (searchParams) {
	
    $.ajax({
        type: "POST",
        url: CONTEXT_PATH + "/ute/admin/skillsetnew/search",
        data: searchParams,
    }).done(function (uteReturnData) {
    	
    	var skillsetResultHtmlData = [];
    	var erroMsg = "";
    	
    	if(uteReturnData){
    		try{
        		if(uteReturnData.Body.processSkillsetInfoResponse.faultInfo.FaultCode == "UTE0000" || uteReturnData.Body.processSkillsetInfoResponse.faultInfo.FaultCode == "NO_ERROR"){
        			
        			var skillsetDtls = uteReturnData.Body.processSkillsetInfoResponse.Skillset;
        			
        			if($.type(skillsetDtls) == "array"){
        				
        				for (var i = 0, c = skillsetDtls.length; i < c; i++) {
        					skillsetResultHtmlData.push([
            	        	    '<span class="vzuui-om-menu"></span><div id="popupBlock" class="vzuui-om-dropdown hidedropdown" data="' + skillsetDtls[i].SkillsetId + '"><ul id="vzuui-task-actions"><li class="editApp">Edit</li><li class="deleteApp">Delete</li></ul></div>',
            	        	    (skillsetDtls[i].SkillsetName ? skillsetDtls[i].SkillsetName : ""),
            	        	    (skillsetDtls[i].SkillsetNameDesc ? skillsetDtls[i].SkillsetNameDesc : ""),
            	            ]);
            	        	
            	        	UTEADMIN.skillsetAdmin.searchSkillsetDtlMap[skillsetDtls[i].SkillsetId] = skillsetDtls[i];
            	        }
        				
        			}
        			else{
        				
        				skillsetResultHtmlData.push([
        		            	        	    '<span class="vzuui-om-menu"></span><div id="popupBlock" class="vzuui-om-dropdown hidedropdown" data="' + skillsetDtls.SkillsetId + '"><ul id="vzuui-task-actions"><li class="editApp">Edit</li><li class="deleteApp">Delete</li></ul></div>',
        		            	        	    (skillsetDtls.SkillsetName ? skillsetDtls.SkillsetName : ""),
        		            	        	    (skillsetDtls.SkillsetNameDesc ? skillsetDtls.SkillsetNameDesc : ""),
        		            	            ]);
        		            	        	
        				UTEADMIN.skillsetAdmin.searchSkillsetDtlMap[skillsetDtls.SkillsetId] = skillsetDtls;
        			}
        		}
        		else{
        			erroMsg = uteReturnData.Body.processSkillsetInfoResponse.faultInfo.FaultDescription;
        		}
        	}
        	catch(e){
        		erroMsg = uteReturnData.Body.Fault.detail.AdminServiceFault.FaultDescription;
        	}
    	}
    	
    	UTEADMIN.skillsetAdmin.renderSearchDataTable(skillsetResultHtmlData, erroMsg);
    	
        $("#searchResultDiv").show();
		$("#searchLoadingDiv").hide();
    	
    }); //closes the ajax call
}


UTEADMIN.skillsetAdmin.saveWgDetails = function (wgDetails) {
	UTEADMIN.skillsetAdmin.setLoadingGifPosition();
	$("#searchLoadingDiv").show();
	var saveAlertOptions = {title: "Info"};
	
    $.ajax({
        type: "POST",
        url: CONTEXT_PATH + "/ute/admin/skillsetnew/save",
        data: wgDetails,
    }).done(function (uteReturnData) {
    	
    	var saveMsg = "Failed to store skillet info";
    	
    	if(uteReturnData){
    		try{
        		if(uteReturnData.Body.processSkillsetInfoResponse.faultInfo.FaultCode == "UTE0000" || uteReturnData.Body.processSkillsetInfoResponse.faultInfo.FaultCode == "NO_ERROR"){
        			saveMsg = "Skillset Saved successfully";
        			
        			UTEADMIN.skillsetAdmin.resetForm("#searchForm");
        			$("#searchForm #SkillsetName").val($("#detailsForm #SkillsetName").val());
        	    	$("#FormHeader").html("Create Skillset");
        	    	UTEADMIN.skillsetAdmin.resetForm("#detailsForm");
        			
        	    	
        	    	saveAlertOptions.buttons = {
            	            Ok: function() {
            	                $(this).dialog("close");
            	                $("#searchBtn").trigger('click');
                    	    	$( "#accordionPage" ).accordion({ active: 0 });
                    	    	
            	            }
            	        }
        	    	
        		}
        		else{
        			saveMsg = uteReturnData.Body.processSkillsetInfoResponse.faultInfo.FaultDescription;
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

UTEADMIN.skillsetAdmin.fetchDropdownDetails = function () {
	
	var paramList = ["STATUS", "CONTINUITY_LEVEL", "SCHEDULING_REQUIRED", "IS_SUBGROUP","SUBGROUP_TYPE","OVERFLOW_USER","ROUTING_POLICY", "USER_TYPE"];
	var paramDetails = [];
	paramDetails.push({name : "parameter", value : JSON.stringify(paramList)});
	
    $.ajax({
        type: "POST",
        url: CONTEXT_PATH + "/ute/admin/workgroupnew/dropdowndetails",
        data: paramDetails,
    }).done(function (dropdownDetails) {
    	
    	UTEADMIN.skillsetAdmin.dropdownMetaMap = dropdownDetails;
    	
    }); 
}



UTEADMIN.skillsetAdmin.resetForm = function (formId) {
	
	$(formId +" input[type='text'], "+formId+" input[type='password'], "+formId+" input[type='hidden'], "+formId+" select, "+formId+" textarea" ).val("");
	// set default values for dropdowns
	if(formId == "#detailsForm"){
		$(formId+" #IsActiveInd").val("Y");
	}
	UTEADMIN.skillsetAdmin.renderUserDataTable([],"Click '+' icon to add users");
	
}

UTEADMIN.skillsetAdmin.disableForm = function (formId) {
	
	$(formId +" input[type='text'], "+formId+" input[type='password'], "+formId+" select, "+formId+" textarea, "+formId+" input[type='radio'], "+formId+" input[type='checkbox']" ).prop('disabled', true);
	$("#saveBtn").hide();
}

UTEADMIN.skillsetAdmin.enableForm = function (formId) {
	
	$(formId +" input[type='text'], "+formId+" input[type='password'], "+formId+" select, "+formId+" textarea, "+formId+" input[type='radio'], "+formId+" input[type='checkbox']" ).prop('disabled', false);
	$("#saveBtn").show();
}


UTEADMIN.skillsetAdmin.loadEditForm = function (wgDetails, isDisable) {
	
	UTEADMIN.skillsetAdmin.resetForm("#detailsForm");
	
	$("#FormHeader").html("Edit Skillset");
	
    $( "#accordionPage" ).accordion({ active: 1 });
    
    $.each(wgDetails, function(elementId, elementValue){
        $("#detailsForm #"+ elementId).val(elementValue);
    });
    
    $("#detailsForm #SkillsetName,#detailsForm #IsActiveInd").prop('disabled', true);
    
    $.ajax({
        type: "GET",
        url: CONTEXT_PATH + "/ute/admin/skillsetnew/getskillsetusers",
        data: {skillsetId : wgDetails.SkillsetId},
    }).done(function (uteReturnData) {
    	
    	if(uteReturnData){
    		try{
    			var userSkillsetDtls = uteReturnData.Body.processUserSkillsetInfoResponse.UserSkillset;
    			var skillsetUserList = [];
    			
    			if(userSkillsetDtls){
    				if($.type(userSkillsetDtls) === "object"){
    	    	    	
    	    	    	var id = userSkillsetDtls.User.toUpperCase();
    	    	    	var displayText = userSkillsetDtls.UserLastName + ", " + userSkillsetDtls.UserFirstName;
    	    	    	skillsetUserList.push(UTEADMIN.skillsetAdmin.getUserRowData(id, displayText));
    	    	    	
    	    	    }
    	    	    else{
    	    	    	$.each(userSkillsetDtls, function(index, userDtl){
    	    	        	
    	    	    		var id = userDtl.User.toUpperCase();
        	    	    	var displayText = userDtl.UserLastName + ", " + userDtl.UserFirstName;
        	    	    	skillsetUserList.push(UTEADMIN.skillsetAdmin.getUserRowData(id, displayText));
    	    	        	
    	    		    });
    	    	    }
    			}
    			
    			UTEADMIN.skillsetAdmin.renderUserDataTable(skillsetUserList,"Click '+' icon to add users");
        	}
        	catch(e){
        	}
    	}
    }); //closes the ajax call
    
}

UTEADMIN.skillsetAdmin.renderSearchDataTable = function (rowData, erroMsg) {
	
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
				            "sTitle": "Skillset Name",
				             "sWidth": "30%"
				        },
				        {
				            "sTitle": "Skillset Description",
				            "sWidth": "40%"
				        }, 
		        	],
	    "oLanguage": {
                        "sSearch": "Search",
                        "sZeroRecords": erroMsg,
                        "sProcessing": "Processing..."
            		},

    });
	
}

UTEADMIN.skillsetAdmin.renderUserDataTable = function (rowData, erroMsg) {
	
	$('#skillsetUsersDatagrid').dataTable({
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
				                    	UTEADMIN.skillsetAdmin.addUserDialog();
				                    }
				            },
				            {
				                    "sExtends": "text",
				                    "sButtonText": '<i class="trashIcon"></i>',
				                    "sToolTip": "Delete Users",
				                    "fnClick": function (nButton, oConfig, oFlash) {
				                    	UTEADMIN.skillsetAdmin.deleteUser();
				                    }
				            },
				       ]
			
		},

    });
	
}

UTEADMIN.skillsetAdmin.getUserRowData = function (id, userNameDisplayText) {
	
	return [
            '<input type="checkbox" class="row-id-box" id="' + (UTEADMIN.skillsetAdmin.userListSeq++) + '">',
            '<input name="UserInfoId" type="hidden" value="' + id + '" />' + userNameDisplayText,
        ];
}

UTEADMIN.skillsetAdmin.addUserDialog = function () {
	
	var dbox = $("#dialog-user-add");
    dbox.find("#vgrid_container .vgrid-body").empty();
    dbox.dialog('open');
    doReset();   
	
}

UTEADMIN.skillsetAdmin.deleteUser = function () {
    var marked_delete = [];
    
    $("#skillsetUsersDatagrid tbody .row-id-box:checked").each(function () {
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
    	
    	$('#skillsetUsersDatagrid').dataTable().fnDeleteRow(obj);
 		
    });
    
}

UTEADMIN.skillsetAdmin.setLoadingGifPosition = function() {
	
	$("#searchLoadingDiv").css('top', (($(window).height() - 0 )/2) - 10);
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
   
  
  
   //if(user.length===7 && user.match(/[v||z][0-9]{6}/))
  //alert(" Please enter a VZID or first name, last name.");
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

