/**
 * 
 */

var alertOption = {	title:"Info" }

$(document).ready(function(){
	/*var inst = $.remodal.lookup[$('[data-remodal-id=modal]').data('remodal')];
	inst.open();*/
	$('.remodal .remodal-close').hide();
	$('.remodal h2 .remodal-close,.action_notification .remodal-close').show();

	$('#detailsForm').validationEngine();
	
	UTEADMIN.adminGeneric.resetForm("#detailsForm");

	$("#searchBtn").click(function(){

		$("#searchResultDiv").hide();
		$("#searchLoadingDiv").show();

		var searchParams = $('#searchForm').serializeArray();	

		UTEADMIN.adminGeneric.renderSearchResult(searchParams);

	});
	
	
	$("#saveBtn").click(function(){
		
		if($('#detailsForm').validationEngine('validate')){
			var wgDetails = $('#detailsForm').serializeArray();
			
			UTEADMIN.adminGeneric.saveWgDetails(wgDetails);
		}

	});
	
	$("#cancelBtn").click(function(){

		UTEADMIN.adminGeneric.resetForm("#detailsForm");
    	
    	$( "#accordionPage" ).accordion({ active: 0 });
    	
    	UTEADMIN.adminGeneric.enableForm("#detailsForm");

	});
	
	$('#wgResultGrid').vgrid({
        sortJs: true
    });

	
	
	$('#searchResultDiv').on('click', '.actionwg-EDIT', function(evt) {
		
		var itemDtls = $(this).data('extra');
		UTEADMIN.adminGeneric.loadEditForm(itemDtls, false);
		
	});
	
	
	$('#searchResultDiv').on('click', '.actionwg-DELETE', function(evt) {
		var row = $(this).closest('.vgrid-row');
		var id = $(this).data('id');
		
		if (!confirm("Delete Operation is irreversible, Do you want to delete the selected item")) {
	        return false;
	    }
		
		$.ajax({
	        type: "DELETE",
	        url: CONTEXT_PATH + "/ute/admin/" + object_name + "/delete?id=" + id,
	    }).done(function (deleteMsg) {
	    		    		    	  	    	
	    	alertOption.displayMessage = deleteMsg;
	    	alertDialog(alertOption);
	    	row.slideUp({
                complete: function() {
                    row.remove();
                }
            });
            return false;
	    	
	    }); //closes the ajax call
		
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
UTEADMIN.adminGeneric = UTEADMIN.adminGeneric || {};
UTEADMIN.util = UTEADMIN.util || {};
UTEADMIN.adminGeneric.parameterSeq = 0;
UTEADMIN.adminGeneric.searchAppDtlMap = {};


UTEADMIN.adminGeneric.renderSearchResult = function (searchParams) {
	
    $.ajax({
        type: "POST",
        url: CONTEXT_PATH + "/ute/admin/" + object_name + "/search",
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


UTEADMIN.adminGeneric.saveWgDetails = function (wgDetails) {
	
    $.ajax({
        type: "POST",
        url: CONTEXT_PATH + "/ute/admin/" + object_name + "/save",
        data: wgDetails,
    }).done(function (saveMsg) {    	
    	//alert(saveMsg);
    	alertOption.displayMessage=saveMsg;
    	alertDialog(alertOption);
    	UTEADMIN.adminGeneric.resetForm("#detailsForm");
    	
    	$( "#accordionPage" ).accordion({ active: 0 });
    	
    }); //closes the ajax call
}


UTEADMIN.adminGeneric.resetForm = function (formId) {
	
	$(formId +" input[type='text'], "+formId+" input[type='password'], "+formId+" input[type='hidden'], "+formId+" select, "+formId+" textarea" ).val("");
	
}

UTEADMIN.adminGeneric.disableForm = function (formId) {
	
	$(formId +" input[type='text'], "+formId+" input[type='password'], "+formId+" select, "+formId+" textarea, "+formId+" input[type='radio'], "+formId+" input[type='checkbox']" ).prop('disabled', true);
	$("#saveBtn").hide();
}

UTEADMIN.adminGeneric.enableForm = function (formId) {
	
	$(formId +" input[type='text'], "+formId+" input[type='password'], "+formId+" select, "+formId+" textarea, "+formId+" input[type='radio'], "+formId+" input[type='checkbox']" ).prop('disabled', false);
	$("#saveBtn").show();
}


UTEADMIN.adminGeneric.loadEditForm = function (wgDetails, isDisable) {
	
	UTEADMIN.adminGeneric.resetForm("#detailsForm");
	
	$( "#accordionPage" ).accordion({ active: 1 });
    
    $.each(wgDetails, function(elementId, elementValue){
        $("#detailsForm #"+ elementId).val(elementValue);
    });
	
//	$.ajax({
//        type: "GET",
//        url: CONTEXT_PATH + "/ute/admin/" + object_name + "/details?id=" + id,
//        dataType: "json",
//    }).done(function (wgDetails) {
//        
//    	
//    }); //closes the ajax call
	
}







