/**
 * 
 */
var alertOption={title:"Info"};
$(document).ready(function(){
	/*var inst = $.remodal.lookup[$('[data-remodal-id=modal]').data('remodal')];
	inst.open();*/
	$('.remodal .remodal-close').hide();
	$('.remodal h2 .remodal-close,.action_notification .remodal-close').show();

	PCGUI.appAdmin.renderDataTable([]);
	PCGUI.appAdmin.renderParameterDataTable([], true);
	
	PCGUI.appAdmin.resetForm("#appDetailsForm");
	
	$('#appDetailsForm').validationEngine();

	$("#searchBtn").click(function(){

		$("#searchResultDiv").hide();
		$("#searchLoadingDiv").show();

		var searchParams = $('#appSearchForm').serializeArray();	

		PCGUI.appAdmin.renderSearchResult(searchParams);

	});
	
	$("#addAppBtn").click(function(){

		$('#addAppDiv').show();	

	});
	
	$("#parameterInputTable").on("change", "#select_all", function() {
        $(".row-id-box").prop("checked", $(this).prop("checked"));
    });

	
	
	$("#saveAppBtn").click(function(){
		
		if($('#appDetailsForm').validationEngine('validate')){
			var appDetails = $('#appDetailsForm').serializeArray();
			PCGUI.appAdmin.saveAppDetails(appDetails);
		}

	});
	
	$("#cancelAppBtn").click(function(){

		PCGUI.appAdmin.resetForm("#appDetailsForm");
    	
    	$( "#accordionAppPage" ).accordion({ active: 0 });
    	
    	PCGUI.appAdmin.enableForm("#appDetailsForm");

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
	
	$("input[name='TYPE']").change(function(){

		PCGUI.appAdmin.updateForm($("input[name='TYPE']:checked").val(), {}, false);
		
	});
	
	
//	$(':not(.vzuui-om-menu)').on('click', function(evt) {
//		
//		$(".hidedropdown").hide();
//		
//	});
//	
	
	$('#searchResultDatagrid').on('click', '.editApp', function(evt) {
		
		PCGUI.appAdmin.enableForm("#appDetailsForm");
		
		var appId = $(this).parents(".vzuui-om-dropdown").attr('data');
		
		$(".hidedropdown").hide();
		
		PCGUI.appAdmin.loadEditForm(appId, false);
		
	});
	
	$('#searchResultDatagrid').on('click', '.viewApp', function(evt) {
		
		var appId = $(this).parents(".vzuui-om-dropdown").attr('data');
		
		$(".hidedropdown").hide();
		
		PCGUI.appAdmin.loadEditForm(appId, true);
		
	});
	
	$('#searchResultDatagrid').on('click', '.deleteApp', function(evt) {
		
		var appId = $(this).parents(".vzuui-om-dropdown").attr('data');
		var deleteRowRef = $(this).closest('tr')[0];
		
		$(".hidedropdown").hide();
		
		if (!confirm("Delete Operation is irreversible, Do you want to delete the selected App/Panel")) {
	        return false;
	    }
		
		$.ajax({
	        type: "DELETE",
	        url: CONTEXT_PATH + "/uui/apps/admin/application/delete?appId=" + appId,
	    }).done(function (deleteMsg) {
	    	
	    	alertOption.displayMessage=deleteMsg;
	    	//alert(deleteMsg);
	    	alertDialog(alertOption);
	    	$('#searchResultDatagrid').dataTable().fnDeleteRow(deleteRowRef);
	    	
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
	
	$('#accordionAppPage').accordion({
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


window.PCGUI = window.PCGUI || {};
PCGUI.appAdmin = PCGUI.appAdmin || {};
PCGUI.util = PCGUI.util || {};
PCGUI.appAdmin.parameterSeq = 0;
PCGUI.appAdmin.searchAppDtlMap = {};


PCGUI.appAdmin.renderSearchResult = function (searchParams) {
	
    $.ajax({
        type: "POST",
        url: CONTEXT_PATH + "/uui/apps/admin/application/search",
        data: searchParams,
        dataType: "json",
    }).done(function (searchResults) {
    	
    	var appResults = searchResults.results;
        var appResultHtmlData = [];
        for (var i = 0, c = appResults.length; i < c; i++) {
        	appResultHtmlData.push([
        	    '<span class="vzuui-om-menu"></span><div id="popupBlock" class="vzuui-om-dropdown hidedropdown" data="' + appResults[i].ID + '"><ul id="vzuui-task-actions"><li class="editApp">Edit</li><li class="viewApp">View</li><li class="deleteApp">Delete</li></ul></div>',
                appResults[i].NAME,
                '',
                '',
                '',
                appResults[i].GROUP_NAME,
                '',
                (appResults[i].DESCRIBE ? appResults[i].DESCRIBE : "")
            ]);
        	
        	PCGUI.appAdmin.searchAppDtlMap[appResults[i].ID] = appResults[i];
        }
        
        PCGUI.appAdmin.renderDataTable(appResultHtmlData);
        
        $("#searchResultDiv").show();
		$("#searchLoadingDiv").hide();
    	
    }); //closes the ajax call
}


PCGUI.appAdmin.saveAppDetails = function (appDetails) {
	
    $.ajax({
        type: "POST",
        url: CONTEXT_PATH + "/uui/apps/admin/application/save",
        data: appDetails,
    }).done(function (saveMsg) {
    	
    	$("#searchBtn").trigger('click');
    	
    	//alert(saveMsg);
    	alertOption.displayMessage=saveMsg;
    	alertDialog(alertOption);
    	
    	PCGUI.appAdmin.resetForm("#appDetailsForm");
    	
    	$( "#accordionAppPage" ).accordion({ active: 0 });
    	
    }); //closes the ajax call
}


PCGUI.appAdmin.renderDataTable = function (rowData) {
	
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
						     "sWidth": "4%"
						},
				         {
				            "sTitle": "Name",
				             "sWidth": "13%"
				        }, {
				            "sTitle": "Release Date",
				            "sWidth": "10%"
				        }, {
				            "sTitle": "Version",
				            "sWidth": "10%"
				        }, {
				            "sTitle": "Product",
				            "sWidth": "10%"
				        }, {
				            "sTitle": "Group",
				            "sWidth": "12%"
				        }, {
				            "sTitle": "Type",
				            "sWidth": "10%"
				        }, {
				            "sTitle": "Description",
				            "sWidth": "30%"
				        }, 
		        	],
	    "oLanguage": {
                        "sSearch": "Search",
                        "sZeroRecords": "No Matching Apps/Panel found for search criteria",
                        "sProcessing": "Processing..."
            		},

    });
	
}


PCGUI.appAdmin.renderParameterDataTable = function (rowData, isNewRowCreate) {
	
	var t = $('#parameterInputTable').dataTable({
		"sDom": '<"top"T>rt<"bottom"i><"clear">',
		"aaData": rowData,
		"bPaginate": false, 
		"sPaginationType": "full_numbers", 
		"bLengthChange": false, 
		"bFilter": false, 
		"bSort":false, 
		"bInfo": false, 
		"bAutoWidth": false, 
		"bDestroy": true,
        "aoColumns": [
		{
		    "sTitle": '<input type="checkbox" class="uniform" id="select_all">',
		     "sWidth": "6%"
		},
		{
		    "sTitle": "Name",
		     "sWidth": "14%"
		},
         {
            "sTitle": "Type",
             "sWidth": "14%"
        }, {
            "sTitle": "Label",
            "sWidth": "14%"
        }, {
            "sTitle": "Value",
            "sWidth": "16%"
        }, {
            "sTitle": "Description",
            "sWidth": "20%"
        }, {
            "sTitle": "Validation",
            "sWidth": "16%"
        },],
        "oTableTools": {
            "aButtons": [
            {
                    "sExtends": "text",
                    "sButtonText": '<i class="addIcon"></i>',
                    "sToolTip": "Add Param",
                    "fnClick": function (nButton, oConfig, oFlash) {
                       PCGUI.appAdmin.addNewParameterRow();
                    }
            },
            {
                    "sExtends": "text",
                    "sButtonText": '<i class="trashIcon"></i>',
                    "sToolTip": "Delete Param",
                    "fnClick": function (nButton, oConfig, oFlash) {
                       PCGUI.appAdmin.deleteParamater();
                    }
            },]
			
		},

    });
	
	if(isNewRowCreate){
		PCGUI.appAdmin.addNewParameterRow();
	}
	
}


PCGUI.appAdmin.addNewParameterRow = function () {
	
	var t = $('#parameterInputTable').dataTable().api();
	
	t.row.add( [
	            '<input type="checkbox" class="row-id-box" id="' + (PCGUI.appAdmin.parameterSeq++) + '">',
	            '<input name="name" class="name validate[required,maxSize[64]]" type="text" >',
	            '<select name="type" class="type validate[required,maxSize[64]]" ><option value="">Select Type</option>' + PCGUI.appAdmin.getPropertyTypeOptionHTML("") + '</select>',
	            '<input name="label" class="paramLabel" type="text">',
	            '<input name="value" class="value validate[required,maxSize[4000]]" type="text">',
	            '<textarea cols="20" rows="2" name="describe"> </textarea>',
	            '<textarea cols="20" rows="2" name="validation"> </textarea>',
	        ] ).draw();
	
//	$('input[type="checkbox"]').vzuuiprettyCheckable();
	
	$('#appDetailsForm').validationEngine();
	
}


PCGUI.appAdmin.deleteParamater = function () {
    var marked_delete = [];
    
    $("#parameterInputTable tbody .row-id-box:checked").each(function () {
        marked_delete.push($(this).closest('tr')[0]);
    });
    
    var sel = marked_delete.length;
    var p = sel > 1 ? "s" : "";
    if (!sel) {
        //alert("Please select at least one paramater to perform delete operation!");
        alertOption.displayMessage="Please select at least one paramater to perform delete operation!";
        alertDialog(alertOption);
        return false;
    }
    if (!confirm("Delete Operation is irreversible, Do you want to delete the selected " + sel + " parameter" + p)) {
        return false;
    }
    
    $.each(marked_delete, function(index, obj){
    	
    	$('#parameterInputTable').dataTable().fnDeleteRow(obj);
 		
    });
    
}


PCGUI.appAdmin.resetForm = function (formId) {
	
	$(formId +" input[type='text'], "+formId+" input[type='password'], "+formId+" input[type='hidden'], "+formId+" select, "+formId+" textarea" ).val("");
	
	PCGUI.appAdmin.renderParameterDataTable([], true);
}

PCGUI.appAdmin.disableForm = function (formId) {
	
	$(formId +" input[type='text'], "+formId+" input[type='password'], "+formId+" select, "+formId+" textarea, "+formId+" input[type='radio'], "+formId+" input[type='checkbox']" ).prop('disabled', true);
	$("#saveAppBtn").hide();
}

PCGUI.appAdmin.enableForm = function (formId) {
	
	$(formId +" input[type='text'], "+formId+" input[type='password'], "+formId+" select, "+formId+" textarea, "+formId+" input[type='radio'], "+formId+" input[type='checkbox']" ).prop('disabled', false);
	$("#saveAppBtn").show();
}


PCGUI.appAdmin.loadEditForm = function (appId, isDisable) {
	
	PCGUI.appAdmin.resetForm("#appDetailsForm");
	
	PCGUI.appAdmin.updateForm(PCGUI.appAdmin.searchAppDtlMap[appId]['TYPE'], PCGUI.appAdmin.searchAppDtlMap[appId], isDisable);
	
	$("input[name='TYPE'][value='" + PCGUI.appAdmin.searchAppDtlMap[appId]['TYPE'] + "']").attr("checked", true);
	
	
	$.ajax({
        type: "GET",
        url: CONTEXT_PATH + "/uui/apps/admin/application/appProperty?appId=" + appId,
        dataType: "json",
    }).done(function (searchResults) {
    	var appResults = searchResults.results;
        var appResultHtmlData = [];
        for (var i = 0, c = appResults.length; i < c; i++) {
        	appResultHtmlData.push([
        	        	            '<input type="checkbox" class="row-id-box" id="' + (PCGUI.appAdmin.parameterSeq++) + '">',
        	        	            '<input name="name" class="name validate[required,maxSize[64]]" type="text" value="' + appResults[i].NAME + '">',
        	        	            '<select name="type" class="type validate[required]"><option value="">Select Type</option>' + PCGUI.appAdmin.getPropertyTypeOptionHTML(appResults[i].TYPE) + '</select>',
        	        	            '<input name="label" class="paramLabel" type="text" value="' + (appResults[i].LABEL ? appResults[i].LABEL : "") + '">',
        	        	            '<input name="value" class="value validate[required,maxSize[4000]]" type="text" value="' + appResults[i].VALUE + '">',
        	        	            '<textarea cols="20" rows="2" name="describe"> ' + (appResults[i].DESCRIBE ? appResults[i].DESCRIBE : "") + ' </textarea>',
        	        	            '<textarea cols="20" rows="2" name="validation"> ' + (appResults[i].VALIDATION ? appResults[i].VALIDATION : "") + ' </textarea>',
        	        	        ] );
        }
        
        PCGUI.appAdmin.renderParameterDataTable(appResultHtmlData, false);
        
        $('#appDetailsForm').validationEngine();
        
        $( "#accordionAppPage" ).accordion({ active: 1 });
    	
    }); //closes the ajax call
	
}


PCGUI.appAdmin.getPropertyTypeOptionHTML = function (selectValue) {
	
	var propertyTypeOption = "";
	
	$.each(propertyTypeList, function(index, option){
		
		propertyTypeOption = propertyTypeOption + '<option value="' + option + '"' + ((option == selectValue) ? " selected ":" ") + '>' + option + '</option>';	
 		
    });
	
	return propertyTypeOption;
	
}

PCGUI.appAdmin.updateForm = function (appType, appDetails, isDisable) {
	
	$.ajax({
        type: "GET",
        url: CONTEXT_PATH + "/uui/apps/admin/application/appForm?appType=" + appType,
        dataType: "html",
    }).done(function (formData) {
    	
    	$( "#appDetailsAccordion" ).html(formData).promise().done(function(){
    		
    		$('#accordion2,#accordion3').accordion({
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
    		
    		$.each(appDetails, function(elementId, elementValue){
    	        $("#"+ elementId).val(elementValue);
    	    });
    		
    		if(isDisable){
    			PCGUI.appAdmin.disableForm("#appDetailsForm");
    		}
    		
    		$('#appDetailsForm').validationEngine();
    		
    	});
    	
    	
    }); //closes the ajax call
	
}



