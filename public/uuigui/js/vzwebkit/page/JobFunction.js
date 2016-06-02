/**
 * 
 */


var alertOption = { title: "Info" };
$(document).ready(function(){
	
	$('.remodal .remodal-close').hide();
	$('.remodal h2 .remodal-close,.action_notification .remodal-close').show();

	$('#detailsForm').validationEngine();
	
	
	UTEADMIN.JobFunction.resetForm("#detailsForm");
	 

	$("#searchBtn").click(function(){

		$("#searchResultDiv").hide();
		$("#searchLoadingDiv").show();

		var searchParams = $('#searchForm').serializeArray();	
         

		UTEADMIN.JobFunction.renderSearchResult(searchParams);

	});
	
	
	
	$("#saveBtn").click(function(){
	 
		
		if($('#detailsForm').validationEngine('validate')){
			
			UTEADMIN.JobFunction.enableForm("#detailsForm");
			var wgDetails = $('#detailsForm').serializeArray();
			var userInfos = [];
			var isValid = true;
			

			 //console.log("wgDetails1"+wgDetails);
			
			UTEADMIN.JobFunction.saveWgDetails(wgDetails);
		}

	});
	
	$("#cancelBtn").click(function(){

		UTEADMIN.JobFunction.resetForm("#detailsForm");
    	
    	$( "#accordionPage" ).accordion({ active: 0 });
    	$("#FormHeader").html("Add JobFunction");
    	
    	UTEADMIN.JobFunction.enableForm("#detailsForm");

	});
	
	$('#searchResultDiv').on('click', '.editApp', function(evt) {
		
		var wgId = $(this).parents(".vzuui-om-dropdown").attr('data');
		//console.log("wgis"+wgId);
		$(".hidedropdown").hide();
		var wgDtls = UTEADMIN.JobFunction.searchWgDtlMap[wgId];
		
		UTEADMIN.JobFunction.loadEditForm(wgDtls, false);
		
	});
	
	
	$('#searchResultDiv').on('click', '.deleteApp', function(evt) {
		
		var wgId = $(this).parents(".vzuui-om-dropdown").attr('data');
		var deleteRowRef = $(this).closest('tr')[0];
		
		if (!confirm("Delete Operation is irreversible, Do you want to delete the selected job function")) {
	        return false;
	    }
		
		$.ajax({
	        type: "DELETE",
	        url: CONTEXT_PATH + "/ute/admin/jobfunction/delete?wgId=" + wgId,
	    }).done(function (uteReturnData) {
	    	
            var deleteMsg = "Failed to delete job function info info";
        	
        	if(uteReturnData){
        		
        	
        		try{
        			
            		if(uteReturnData.Body.processJobFunctionResponse.faultInfo.FaultCode == "UTE0000" || uteReturnData.Body.processJobFunctionResponse.faultInfo.FaultCode == "NO_ERROR"){
            			
            			deleteMsg = "Job Function deleted successfully";
            			
            			$('#searchResultDatagrid').dataTable().fnDeleteRow(deleteRowRef);
            			
            		}
            		else{
            			
            			deleteMsg = uteReturnData.Body.processJobFunction.faultInfo.FaultDescription;
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

});


window.UTEADMIN = window.UTEADMIN || {};
UTEADMIN.JobFunction = UTEADMIN.JobFunction || {};
UTEADMIN.util = UTEADMIN.util || {};
UTEADMIN.JobFunction.userListSeq = 0;
UTEADMIN.JobFunction.searchWgDtlMap = {};
UTEADMIN.JobFunction.dropdownMetaMap = {};

UTEADMIN.JobFunction.renderSearchResult = function (searchParams) {
	
    $.ajax({
        type: "POST",
        url: CONTEXT_PATH + "/ute/admin/jobfunction/search",
        data: searchParams,
    }).done(function (uteReturnData) {
    	
    	var wgResultHtmlData = [];
    	var erroMsg = "";
    	
    	if(uteReturnData){
    		try{
        		if(uteReturnData.Body.processJobFunctionResponse.faultInfo.FaultCode == "UTE0000" || uteReturnData.Body.processJobFunctionResponse.faultInfo.FaultCode == "NO_ERROR"){
        			
        			var jobFnDtls = uteReturnData.Body.processJobFunctionResponse.JobFunction;
        			
        			 
        			
        			if($.type(jobFnDtls) == "array"){
        				 
        				
        				for (var i = 0, c = jobFnDtls.length; i < c; i++) {
        					//console.log("alert"+jobFnDtls[i].organizationUnitId);
        					 
            	        	wgResultHtmlData.push([
            	        	    '<span class="vzuui-om-menu"></span><div id="popupBlock" class="vzuui-om-dropdown hidedropdown" data="' + jobFnDtls[i].JobFunctionGroupId + '"><ul id="vzuui-task-actions"><li class="editApp">Edit</li><li class="deleteApp">Delete</li></ul></div>',
            	        	    (jobFnDtls[i].JobFunctionName ? jobFnDtls[i].JobFunctionName : ""),
            	        	    (jobFnDtls[i].JobFunctionNameDesc ? jobFnDtls[i].JobFunctionNameDesc : ""), 
            	        	    (jobFnDtls[i].organizationUnitId ? jobFnDtls[i].organizationUnitId : ""), 
            	        	    (jobFnDtls[i].RuleSetName ? jobFnDtls[i].RuleSetName : ""), 
            	        	    '<label class="partialText" style="font-weight:normal;" title="'+jobFnDtls[i].FunctionTypeFullText+'">'+jobFnDtls[i].FunctionTypeDisplayText+'</label>',
            	            ]);
            	        	 
            	        	UTEADMIN.JobFunction.searchWgDtlMap[jobFnDtls[i].JobFunctionGroupId] = jobFnDtls[i];
            	        	 
            	        }
        				
        			}
        			else{
        				  
        				
        				//console.log("alert"+jobFnDtls[i].organizationUnitId);
        				wgResultHtmlData.push([
        		            	        	    '<span class="vzuui-om-menu"></span><div id="popupBlock" class="vzuui-om-dropdown hidedropdown" data="' + jobFnDtls.JobFunctionGroupId + '"><ul id="vzuui-task-actions"><li class="editApp">Edit</li><li class="deleteApp">Delete</li></ul></div>',
        		            	        	    (jobFnDtls.JobFunctionName ? jobFnDtls.JobFunctionName : ""),
        		            	        	    (jobFnDtls.JobFunctionNameDesc ? jobFnDtls.JobFunctionNameDesc : ""), 
        		            	        	    (jobFnDtls.organizationUnitId ? jobFnDtls.organizationUnitId : ""), 
        		            	        	    (jobFnDtls.RuleSetName ? jobFnDtls.RuleSetName : ""), 
        		            	        	    '<label class="partialText" style="font-weight:normal;" title="'+jobFnDtls.FunctionTypeFullText+'">'+jobFnDtls.FunctionTypeDisplayText+'</label>',           	        	   
        		            	        	  
        		            	        	  
        		            	            ]);
        		            	        	
        				UTEADMIN.JobFunction.searchWgDtlMap[jobFnDtls.JobFunctionGroupId] = jobFnDtls;
        				 
        			
        			}
        		}
        		else{
        			erroMsg = uteReturnData.Body.processJobFunctionResponse.faultInfo.FaultDescription;
        		}
        	}
        	catch(e){
        		//console.log(e);
        		erroMsg = uteReturnData.Body.Fault.detail.AdminServiceFault.FaultDescription;
        	}
    	}
    	
    	UTEADMIN.JobFunction.renderSearchDataTable(wgResultHtmlData, erroMsg);
    	
    	
        $("#searchResultDiv").show();
		$("#searchLoadingDiv").hide();
    	
    }); //closes the ajax call
}

UTEADMIN.JobFunction.renderSearchDataTable = function (rowData, erroMsg) {
	
		 
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
				            "sTitle": "Job Function Name",
				             "sWidth": "15%"
				        }, {
				            "sTitle": "Job Function Desc",
				            "sWidth": "30%"
				        } ,
				        
				        {
				            "sTitle": "Organization",
				            "sWidth": "30%"
				        } , 
				        {
				            "sTitle": "RuleSet Name",
				            "sWidth": "30%"
				        } ,
				        {
				            "sTitle": "Function Type",
				            "sWidth": "30%"
				        } ,
		        	],
	    "oLanguage": {
                        "sSearch": "Search",
                        "sZeroRecords": erroMsg,
                        "sProcessing": "Processing..."
            		},

    });
	
}


UTEADMIN.JobFunction.saveWgDetails = function (wgDetails) {
	
    $.ajax({
        type: "POST",
        url: CONTEXT_PATH + "/ute/admin/jobfunction/save",
        data: wgDetails,
    }).done(function (uteReturnData) {
    	
    	var saveMsg = "Failed to store jobfunction info";
    	
    	if(uteReturnData){
    		try{
        		if(uteReturnData.Body.processJobFunctionResponse.faultInfo.FaultCode == "UTE0000" || uteReturnData.Body.processJobFunctionResponse.faultInfo.FaultCode == "NO_ERROR"){
        			saveMsg = "Job Function details saved successfully";
        			
        			UTEADMIN.JobFunction.resetForm("#searchForm");
        			
        			$("#searchForm #JobFunctionName").val($("#detailsForm #JobFunctionName").val());
        			$("#searchForm #JobFunctionNameDesc").val($("#detailsForm #JobFunctionNameDesc").val());
        			$("#searchForm #FunctionTypeId").val($("#detailsForm #FunctionTypeId").val());
        			$("#searchBtn").trigger('click');
        			
        			UTEADMIN.JobFunction.resetForm("#detailsForm");
        	    	$( "#accordionPage" ).accordion({ active: 0 });
        	    	$("#FormHeader").html("Create JobFunction");
        			
        		}
        		else{
        			saveMsg = uteReturnData.Body.processJobFunctionResponse.faultInfo.FaultDescription;
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

 


UTEADMIN.JobFunction.resetForm = function (formId) {
	
	$(formId +" input[type='text'], "+formId+" input[type='password'], "+formId+" input[type='hidden'], "+formId+" select, "+formId+" textarea" ).val("");
	
	 
	
}

UTEADMIN.JobFunction.disableForm = function (formId) {
	
	$(formId +" input[type='text'], "+formId+" input[type='password'], "+formId+" select, "+formId+" textarea, "+formId+" input[type='radio'], "+formId+" input[type='checkbox']" ).prop('disabled', true);
	$("#saveBtn").hide();
}

UTEADMIN.JobFunction.enableForm = function (formId) {
	
	$(formId +" input[type='text'], "+formId+" input[type='password'], "+formId+" select, "+formId+" textarea, "+formId+" input[type='radio'], "+formId+" input[type='checkbox']" ).prop('disabled', false);
	$("#saveBtn").show();
}


UTEADMIN.JobFunction.loadEditForm = function (wgDetails, isDisable) {
	
	UTEADMIN.JobFunction.resetForm("#detailsForm");
	
	$("#FormHeader").html("Edit JobFunction");
	
    $( "#accordionPage" ).accordion({ active: 1 });
    
    $.each(wgDetails, function(elementId, elementValue){
        $("#detailsForm #"+ elementId).val(elementValue);
        //console.log("elementId "+elementId+"elementValue"+elementValue);
    });
    
}

 


 

