window.UTEADMIN = window.UTEADMIN || {};
UTEADMIN.priorityViewAdmin = UTEADMIN.priorityViewAdmin || {};
UTEADMIN.priorityViewAdmin.searchPriorityViewDtlMap = {};
UTEADMIN.priorityViewAdmin.userListSeq = 0;

$(document).ready(domOnReady);

var domOnReady = function(){
	$('.mainbox').show();
	//$("#FormHeader").hide();
	$('.remodal .remodal-close').hide();
	$('.remodal h2 .remodal-close,.action_notification .remodal-close').show();
	$('input[type="checkbox"]').vzuuiprettyCheckable();
	UTEADMIN.priorityViewAdmin.renderUserDataTable([],"");
	$("#priorityViewSearchBtn").click(function(){
		UTEADMIN.priorityViewAdmin.setLoadingGifPosition();
		$("#searchResultDiv").hide();
		$("#searchLoadingDiv").show();
		var searchParams = $('#priorityViewsearchForm').serializeArray();	
		UTEADMIN.priorityViewAdmin.renderSearchResult(searchParams);
	});
	
	$("#priorityViewClearBtn").click(function(){
		$("#priorityViewName_search").val('');
	});
	
	$("#createpriorityViewBtn").click(function(){
		
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

$('#priorityViewAccordionPage').accordion({
	heightStyle: "content",
	collapsible:false,
	active: 0,
});

$('#priorityViewSearchResultDatagrid').on('click', '.vzuui-om-menu', function(evt) {
	
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
}



UTEADMIN.priorityViewAdmin.renderSearchResult = function(searchParams){

	
    $.ajax({
        type: "POST",
        url: CONTEXT_PATH + "/ute/admin/priorityView/search",
        data: searchParams
    }).done(function (uteReturnData) {
    	
    	var priorityViewResultHtmlData = [];
    	var erroMsg = "";
    	
    	if(uteReturnData.Body){
    		try{
    			//console.log(uteReturnData);
    			if(uteReturnData.Body.priorityViewConfigResponse.StatusInfo.FaultCode == "UTE0000" || uteReturnData.Body.priorityViewConfigResponse.StatusInfo.FaultType == "NO_ERROR"){
        			
        			var PriorityViewDtls = uteReturnData.Body.priorityViewConfigResponse.PriorityViewConfig;
        				if($.type(PriorityViewDtls) == "array"){
        				for (var i = 0, c = PriorityViewDtls.length; i < c; i++) {
        					PriorityViewDtls[i].PriorityViewName ? PriorityViewDtls[i].PriorityViewName : "";
        					priorityViewResultHtmlData.push([
            	        	    '<span class="vzuui-om-menu"></span><div id="popupBlock" class="vzuui-om-dropdown hidedropdown" data="'+PriorityViewDtls[i].PriorityViewId+'"><ul id="vzuui-pv-actions"><li class="editApp">Edit</li><li class="deleteApp">Delete</li></ul><input type="hidden" name="priorityViewName" value="'+PriorityViewDtls[i].PriorityViewName+'"></div>',
            	        	    '<a href="#" class="viewPvDetails">'+PriorityViewDtls[i].PriorityViewName+'</a>',
            	        	    PriorityViewDtls[i].PriorityViewDesc ? PriorityViewDtls[i].PriorityViewDesc : ""
            	        	    		
            	            ]);
            	        	
            	        	UTEADMIN.priorityViewAdmin.searchPriorityViewDtlMap[PriorityViewDtls[i].PriorityViewId] = PriorityViewDtls[i];
            	        }
        				
        			}
        				else{
        					PriorityViewDtls.PriorityViewName ? PriorityViewDtls.PriorityViewName : "";
        					priorityViewResultHtmlData.push([
                	        	    '<span class="vzuui-om-menu"></span><div id="popupBlock" class="vzuui-om-dropdown hidedropdown" data="'+PriorityViewDtls.PriorityViewId+'"><ul id="vzuui-pv-actions"><li class="editApp">Edit</li><li class="deleteApp">Delete</li></ul><input type="hidden" name="priorityViewName" value="'+PriorityViewDtls.PriorityViewName+'"></div>',
                	        	    '<a href="#" class="viewPvDetails">'+PriorityViewDtls.PriorityViewName+'</a>',
                	        	    PriorityViewDtls.PriorityViewDesc ? PriorityViewDtls.PriorityViewDesc : ""
                	            ]);
                	        	
                	        UTEADMIN.priorityViewAdmin.searchPriorityViewDtlMap[PriorityViewDtls.PriorityViewId] = PriorityViewDtls;
        				}
    			}
    			else{
        			erroMsg = uteReturnData.Body.priorityViewConfigResponse.StatusInfo.FaultDescription;
        		}
    		}
        	catch(e){
        		//console.log(e);
        		erroMsg = uteReturnData.Body.Fault.detail.priorityRulesAdminFault.FaultDescription;
        	}
    	}
    	else{
    		erroMsg = uteReturnData.WSStatus;
    	}
    	
    	UTEADMIN.priorityViewAdmin.renderSearchDataTable(priorityViewResultHtmlData, erroMsg);
    	
    	
        $("#searchResultDiv").show();
		$("#searchLoadingDiv").hide();
    	
    }); //closes the ajax call

}

UTEADMIN.priorityViewAdmin.renderSearchDataTable = function (rowData, erroMsg) {
	
	$('#priorityViewSearchResultDatagrid').dataTable({
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
				            "sTitle": "Priority View Name",
				             "sWidth": "50%"
				        },
				        {
				            "sTitle": "Description",
				             "sWidth": "50%"
				        }
		        	],
	    "oLanguage": {
                        "sSearch": "Search",
                        "sZeroRecords": erroMsg,
                        "sProcessing": "Processing..."
            		}

    });
	
}

UTEADMIN.priorityViewAdmin.setLoadingGifPosition = function() {
	
	$("#searchLoadingDiv").css('top', ($(window).height()/2) - 10);
	$("#searchLoadingDiv").css('left',($(window).width()/2) - 10);
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
                		var t = $('#pvUsersDatagrid').dataTable().api();
                		t.row.add(UTEADMIN.priorityViewAdmin.getUserRowData(id, displayText, "")).draw();
                		$('#pvDetailsForm').validationEngine();
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

UTEADMIN.priorityViewAdmin.getUserRowData = function (ldapUserId, userNameDisplayText, userType) {
	
	return [
            '<input type="checkbox" class="row-id-box" id="' + (UTEADMIN.priorityViewAdmin.userListSeq++) + '">',
            '<input name="LDAPUserInfoId" type="hidden" value="' + ldapUserId + '" />' + userNameDisplayText,
            '<label>User</label>',
        ];
}

UTEADMIN.priorityViewAdmin.renderUserDataTable = function (rowData, erroMsg) {
	
	$('#pvUsersDatagrid').dataTable({
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
				                    	UTEADMIN.priorityViewAdmin.addUserDialog();
				                    }
				            },
				            {
				                    "sExtends": "text",
				                    "sButtonText": '<i class="trashIcon"></i>',
				                    "sToolTip": "Delete Users",
				                    "fnClick": function (nButton, oConfig, oFlash) {
				                    	UTEADMIN.priorityViewAdmin.deleteUser();
				                    }
				            },
				       ]
			
		},

    });
	
}

UTEADMIN.priorityViewAdmin.addUserDialog = function () {
	
	var dbox = $("#dialog-user-add");
    dbox.find("#vgrid_container .vgrid-body").empty();
    dbox.dialog('open');
    doReset();   
	
}

UTEADMIN.priorityViewAdmin.deleteUser = function () {
    var marked_delete = [];
    
    $("#pvUsersDatagrid tbody .row-id-box:checked").each(function () {
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
    	
    	$('#pvUsersDatagrid').dataTable().fnDeleteRow(obj);
 		
    });
    
}