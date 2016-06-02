/**
 * 
 */


var alertOption = { title: "Info" };
$(document).ready(function(){
	/*var inst = $.remodal.lookup[$('[data-remodal-id=modal]').data('remodal')];
	inst.open();*/
	$('.remodal .remodal-close').hide();
	$('.remodal h2 .remodal-close,.action_notification .remodal-close').show();

	$('#detailsForm').validationEngine();
	
	UTEADMIN.workGroupAdmin.resetForm("#detailsForm");

	$("#searchBtn").click(function(){

		$("#searchResultDiv").hide();
		$("#searchLoadingDiv").show();

		var searchParams = $('#searchForm').serializeArray();	

		UTEADMIN.workGroupAdmin.renderSearchResult(searchParams);

	});
	
	$("#parameterInputTable").on("change", "#select_all", function() {
        $(".row-id-box").prop("checked", $(this).prop("checked"));
    });

	
	$("#saveBtn").click(function(){
		
		if($('#detailsForm').validationEngine('validate')){
			UTEADMIN.workGroupAdmin.enableForm("#detailsForm");
			var wgDetails = $('#detailsForm').serializeArray();
			var userInfos = [];
			var isValid = true;
			
			$.each($('#wgUsersGrid .vgrid-body .vgrid-row'), function(index, rowNode){
				
				var rowKey = "";

				$.each($(rowNode).children('.vgrid-column'), function(indexChild, columnNode){
					var $columnObj = $(columnNode);
					var columnName = $columnObj.data('name');
					var columnValue = $columnObj.find('input,select').val();
					
					if(columnName == 'LDAPUserInfoId'){
						columnValue = $columnObj.data('extra');
					}
					
					if(columnName == 'LDAPUserInfoId' || columnName == 'userType'){
						
						rowKey = rowKey + columnValue;
					}
					wgDetails.push({name : columnName, value : columnValue});
				});
				
				if($.inArray(rowKey, userInfos ) > -1){
					isValid = false;
					return;
				}
				else{
					userInfos.push(rowKey);
				}
				
			});
			
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
    	$("#FormHeader").html("Add Workgroup");
    	
    	UTEADMIN.workGroupAdmin.enableForm("#detailsForm");

	});
	
	$('#wgUsersGrid, #wgResultGrid, #skillsetGrid').vgrid({
        sortJs: true
    });

	
	$('.action-CREATE').click(function(evt) {
        evt.preventDefault();
        $('#wgUsersGrid').vgrid('insertRowJustCancel', null, null);
        return false;
    });
	
	
	$('#searchUserAdd').click(function(evt) {
        evt.preventDefault();
        
        var dbox = $("#dialog-user-add");
        
        dbox.find("#vgrid_container .vgrid-body").empty();
        
        dbox.dialog('open');
                 
        doReset();       
        
    });
	
	$('.actionSkillset-CREATE').click(function(evt) {
        evt.preventDefault();
        $('#skillsetGrid').vgrid('insertRowJustCancel', null, null);
        return false;
    });
	
	
	$('#searchResultDiv').on('click', '.actionwg-EDIT', function(evt) {
		
		var row = $(this).closest('.vgrid-row');
//		var wgDtls = $(row).find('[data-name=workGroupName]').data('extra');
		var wgDtls = $(this).data('extra');
		
		UTEADMIN.workGroupAdmin.loadEditForm(wgDtls, false);
		
	});
	
	
	$('#searchResultDiv').on('click', '.actionwg-DELETE', function(evt) {
		
		var row = $(this).closest('.vgrid-row');
		var wgId = $(row).find('[data-name=workGroupName]').data('extra');
		
		if (!confirm("Delete Operation is irreversible, Do you want to delete the selected App/Panel")) {
	        return false;
	    }
		
		$.ajax({
	        type: "DELETE",
	        url: CONTEXT_PATH + "/ute/admin/workgroup/delete?wgId=" + wgId,
	    }).done(function (uteReturnData) {
	    	
            var deleteMsg = "Failed to delete workgroup info";
        	
        	if(uteReturnData){
        		try{
            		if(uteReturnData.Body.processWorkgroupInfoResponse.faultInfo.FaultCode == "UTE0000" || uteReturnData.Body.processWorkgroupInfoResponse.faultInfo.FaultCode == "NO_ERROR"){
            			deleteMsg = "Workgroup deleted successfully";
            			
            			row.slideUp({
                            complete: function() {
                                row.remove();
                            }
                        });
            			
            		}
            		else{
            			deleteMsg = uteReturnData.Body.processWorkgroupInfoResponse.faultInfo.FaultDescription;
            		}
            	}
            	catch(e){
            		deleteMsg = uteReturnData.Body.Fault.detail.AdminServiceFault.FaultDescription;
            	}
        	}
        	
        	alertOption.displayMessage=deleteMsg;
        	alertDialog(alertOption);
        	
            return false;
	    	
	    }); //closes the ajax call
		
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
	                    	
	                    	$('#wgUsersGrid').vgrid('insertRowJustCancel', function($row){
	                    		
	                    		$row.find(".vgrid-column[data-name=LDAPUserInfoId]").html($selectedUserRow.find(".vgrid-column[data-name=lastname]").text() + ", " + $selectedUserRow.find(".vgrid-column[data-name=firstname]").text()).data("extra", $selectedUserRow.find(".vgrid-column[data-name=id]").text().toUpperCase());
	                    		
	                    	}, null);
	                    	
	                    });
	                    
	                    

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
UTEADMIN.workGroupAdmin.parameterSeq = 0;
UTEADMIN.workGroupAdmin.searchAppDtlMap = {};


UTEADMIN.workGroupAdmin.renderSearchResult = function (searchParams) {
	
    $.ajax({
        type: "POST",
        url: CONTEXT_PATH + "/ute/admin/workgroup/search",
        data: searchParams,
        dataType: "html",
    }).done(function (searchResults) {
    	
    	$("#searchResultDiv").html(searchResults).promise().done(function(){
    		
    		$('#wgResultGrid').vgrid({
    	        sortJs: true
    	    });
    		
    	});
        $("#searchResultDiv").show();
		$("#searchLoadingDiv").hide();
    	
    }); //closes the ajax call
}


UTEADMIN.workGroupAdmin.saveWgDetails = function (wgDetails) {
	
    $.ajax({
        type: "POST",
        url: CONTEXT_PATH + "/ute/admin/workgroup/save",
        data: wgDetails,
    }).done(function (uteReturnData) {
    	
    	var saveMsg = "Failed to store workgroup info";
    	
    	if(uteReturnData){
    		try{
        		if(uteReturnData.Body.processWorkgroupInfoResponse.faultInfo.FaultCode == "UTE0000" || uteReturnData.Body.processWorkgroupInfoResponse.faultInfo.FaultCode == "NO_ERROR"){
        			saveMsg = "Workgroup details saved successfully";
        			
        			UTEADMIN.workGroupAdmin.resetForm("#detailsForm");
        	    	$( "#accordionPage" ).accordion({ active: 0 });
        	    	$("#FormHeader").html("Add Workgroup");
        			
        		}
        		else{
        			saveMsg = uteReturnData.Body.processWorkgroupInfoResponse.faultInfo.FaultDescription;
        		}
        	}
        	catch(e){
        		saveMsg = uteReturnData.Body.Fault.detail.AdminServiceFault.FaultDescription;
        	}
    	}
    	
    	alertOption.displayMessage=saveMsg;
    	alertDialog(alertOption);
    	
        return false;
    	
    }); //closes the ajax call
}


UTEADMIN.workGroupAdmin.resetForm = function (formId) {
	
	$(formId +" input[type='text'], "+formId+" input[type='password'], "+formId+" input[type='hidden'], "+formId+" select, "+formId+" textarea" ).val("");
	
	$("#wgUsersGrid .vgrid-body .vgrid-row").remove();
	$("#skillsetGrid .vgrid-body .vgrid-row").remove();
	
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
    
    $("#detailsForm #WorkgroupName,#detailsForm #OrganizationUnitId").prop('disabled', true);
    
    $.each(wgDetails, function(elementId, elementValue){
        $("#detailsForm #"+ elementId).val(elementValue);
    });
    
    if($.type(wgDetails.workGroupUsers) === "object"){
    	$('#wgUsersGrid').vgrid('insertRowJustCancel', function($row){
    		
    		$row.find(".vgrid-column[data-name=LDAPUserInfoId]").html(wgDetails.workGroupUsers.lastName + ", " + wgDetails.workGroupUsers.firstName).data("extra", wgDetails.workGroupUsers.VZId.toUpperCase());
        	$row.find(".vgrid-column[data-name=userType] select").val(wgDetails.workGroupUsers.userType);
    		
    	}, null);
    }
    else{
    	$.each(wgDetails.workGroupUsers, function(index, userDtl){
        	$('#wgUsersGrid').vgrid('insertRowJustCancel', function($row){
        		
        		$row.find(".vgrid-column[data-name=LDAPUserInfoId]").html(userDtl.lastName + ", " + userDtl.firstName).data("extra", userDtl.VZId);
            	$row.find(".vgrid-column[data-name=userType] select").val(userDtl.userType);
        		
        	}, null);
	    });
        
    }
    
    
    
    if($.type(wgDetails.Skillsets) === "object"){
    	$('#skillsetGrid').vgrid('insertRowJustCancel', function($row){
    		
    		$row.find(".vgrid-column[data-name=SkillsetId] select").val(wgDetails.Skillsets.SkillsetId);
        	$row.find(".vgrid-column[data-name=ApplicationId] select").val(wgDetails.Skillsets.ApplicationId);
    		
    	}, null);
    	
    }
    else{
    	$.each(wgDetails.Skillsets, function(index, userDtl){
        	$('#skillsetGrid').vgrid('insertRowJustCancel', function($row){
        		
        		$row.find(".vgrid-column[data-name=SkillsetId] select").val(userDtl.SkillsetId);
            	$row.find(".vgrid-column[data-name=ApplicationId] select").val(userDtl.ApplicationId);
        		
        	}, null);
	    });
        
    }
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
          
          $("#content-spinny").hide();
      },
      fail:function(){
           $("#content-spinny").hide();
      }
  });

}

