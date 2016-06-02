/**
 * 
 */


var alertOption = { title: "Info" };
$(document).ready(function(){
	
	$('.remodal .remodal-close').hide();
	$('.remodal h2 .remodal-close,.action_notification .remodal-close').show();

	$('#detailsForm, #searchForm').validationEngine();
	
	UTEADMIN.ruleAdmin.resetForm("#detailsForm");
	
	UTEADMIN.ruleAdmin.createHeader($("#conditionStartNode"));

	$("#searchBtn").click(function(){

		if($('#searchForm').validationEngine('validate')){
			
			$("#searchResultDiv").hide();
			$("#searchLoadingDiv").show();

			var searchParams = $('#searchForm').serializeArray();	

			UTEADMIN.ruleAdmin.renderSearchResult(searchParams);
			
		}
		
	});
	
	$("#saveBtn").click(function(){
		
		if($('#detailsForm').validationEngine('validate')){
			UTEADMIN.ruleAdmin.enableForm("#detailsForm");
			var wgDetails = $('#detailsForm').serializeArray();
			
			wgDetails.push({name : 'ruleCondition', value : JSON.stringify(UTEADMIN.ruleAdmin.getConditions($("#conditionStartNode")))});
			
			UTEADMIN.ruleAdmin.saveWgDetails(wgDetails);
		}

	});
	
	$("#cancelBtn").click(function(){

		UTEADMIN.ruleAdmin.resetForm("#detailsForm");
    	$( "#accordionPage" ).accordion({ active: 0 });
    	$("#FormHeader").html("Add Rule");
    	UTEADMIN.ruleAdmin.enableForm("#detailsForm");

	});
	
	$('#resultGrid').vgrid({
        sortJs: true
    });

	
	$('.action-CREATE').click(function(evt) {
        evt.preventDefault();
        $('#wgUsersGrid').vgrid('insertRowJustCancel', null, null);
        return false;
    });
	
	$('.actionSkillset-CREATE').click(function(evt) {
        evt.preventDefault();
        $('#skillsetGrid').vgrid('insertRowJustCancel', null, null);
        return false;
    });
	
	
	$('#searchResultDiv').on('click', '.action-EDIT', function(evt) {
		
		var row = $(this).closest('.vgrid-row');
		var ruleDtlsObj = $(row).find('[data-name=ruleName]').data('extra');
		
		UTEADMIN.ruleAdmin.loadEditForm(ruleDtlsObj, false);
		
	});
	
	
	$('#searchResultDiv').on('click', '.action-DELETE', function(evt) {
		
		var row = $(this).closest('.vgrid-row');
		var ruleDtlsObj = $(row).find('[data-name=ruleName]').data('extra');
		
		if (!confirm("Delete Operation is irreversible, Do you want to delete the selected Rule")) {
	        return false;
	    }
		
		$.ajax({
	        type: "POST",
	        url: CONTEXT_PATH + "/ute/admin/ruleadmin/delete",
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
                			
        					row.slideUp({
        		                complete: function() {
        		                    row.remove();
        		                }
        		            });
                			
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
	
	$("#conditionStartNode").on('click', '.addChildCondition', function(){
		
		var $li = $(this).closest('li');
		
		var $ul = $li.children('ul');
		
		if($ul.size() > 0){
		
		}
		else{
			$ul = $("<ul>");
			$ul.data('level', $li.data('level') + 1);
			$li.find('span.toggleHolder').empty().append('<i class="minusIcon"></i></span>');
			$ul.appendTo($li);
		}
		
		UTEADMIN.ruleAdmin.addNewCondition($ul);
		
	});
	
	
	$("#conditionStartNode").on('click', '.addTopCondition', function(){
	
		var $ul = $(this).closest('ul');
		UTEADMIN.ruleAdmin.addNewCondition($ul);
		
	});
	
	$("#conditionStartNode").on('click', '.removeChildCondition', function(){
	
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
	
	

//	$('input[type="checkbox"],input[type="radio"]').vzuuiprettyCheckable();

});


window.UTEADMIN = window.UTEADMIN || {};
UTEADMIN.ruleAdmin = UTEADMIN.ruleAdmin || {};
UTEADMIN.util = UTEADMIN.util || {};
UTEADMIN.ruleAdmin.parameterSeq = 0;
UTEADMIN.ruleAdmin.searchAppDtlMap = {};


UTEADMIN.ruleAdmin.renderSearchResult = function (searchParams) {
	
    $.ajax({
        type: "POST",
        url: CONTEXT_PATH + "/ute/admin/ruleadmin/search",
        data: searchParams,
        dataType: "html",
    }).done(function (searchResults) {
    	
    	$("#searchResultDiv").html(searchResults).promise().done(function(){
    		
    		$("#resultGrid").vgrid({
    	        sortJs: true
    	    });
    		
    	});
        $("#searchResultDiv").show();
		$("#searchLoadingDiv").hide();
		
		
    	
    }); //closes the ajax call
}


UTEADMIN.ruleAdmin.saveWgDetails = function (wgDetails) {
	
    $.ajax({
        type: "POST",
        url: CONTEXT_PATH + "/ute/admin/ruleadmin/save",
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
            			
            			$("#FormHeader").html("Add Rule");
            			
            			UTEADMIN.ruleAdmin.resetForm("#detailsForm");
            	    	UTEADMIN.ruleAdmin.enableForm("#detailsForm");
            	    	$( "#accordionPage" ).accordion({ active: 0 });
            			
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
    	
    	alertOption.displayMessage=saveMsg;
    	alertDialog(alertOption);
    	
        return false;
    	
    }); //closes the ajax call
}


UTEADMIN.ruleAdmin.resetForm = function (formId) {
	
	$(formId +" input[type='text'], "+formId+" input[type='password'], "+formId+" input[type='hidden'], "+formId+" select, "+formId+" textarea" ).val("");
	
	$("#conditionStartNode > li.body").remove();
	
}

UTEADMIN.ruleAdmin.disableForm = function (formId) {
	
	$(formId +" input[type='text'], "+formId+" input[type='password'], "+formId+" select, "+formId+" textarea, "+formId+" input[type='radio'], "+formId+" input[type='checkbox']" ).prop('disabled', true);
	$("#saveBtn").hide();
}

UTEADMIN.ruleAdmin.enableForm = function (formId) {
	
	$(formId +" input[type='text'], "+formId+" input[type='password'], "+formId+" select, "+formId+" textarea, "+formId+" input[type='radio'], "+formId+" input[type='checkbox']" ).prop('disabled', false);
	$("#saveBtn").show();
}


UTEADMIN.ruleAdmin.loadEditForm = function (ruleDetails, isDisable) {
	
	UTEADMIN.ruleAdmin.resetForm("#detailsForm");
	
	$("#FormHeader").html("Edit Rule");
	
	$( "#accordionPage" ).accordion({ active: 1 });
    
    $.each(ruleDetails, function(elementId, elementValue){
        $("#detailsForm #"+ elementId).val(elementValue);
    });
    
    UTEADMIN.ruleAdmin.createConditionInDom(ruleDetails.Condition);
    
    $("#detailsForm #ApplicationName,#detailsForm #Name,#detailsForm #JobfunctionName").prop('disabled', true);
    
    $("#detailsForm #IsUpdate").val("Y");
    
    $("#detailsForm #workgroup").val(ruleDetails.RuleOutcomeList.ruleOutcome.workgroup);
    $("#detailsForm #skillset").val(ruleDetails.RuleOutcomeList.ruleOutcome.skillset);
}


UTEADMIN.ruleAdmin.getSingleCondition = function (liNode){
	
	var innerCondition = {};
	
	$.each($(liNode).children('div').children('div').children('input,select'), function(i, input){
		innerCondition[$(input).data('name')] = $(input).val();
	});
	
	if($(liNode).children('ul').size() > 0){
		innerCondition.Condition = UTEADMIN.ruleAdmin.getConditions($(liNode).children('ul:first'))
	}
	
	return innerCondition;
}

UTEADMIN.ruleAdmin.getConditions = function ($ul){
	
	var innerConditions = [];
	
	$.each($ul.children('li.body'), function(i, li){
		innerConditions.push(UTEADMIN.ruleAdmin.getSingleCondition(li));
	});
	
	return innerConditions;
}

UTEADMIN.ruleAdmin.addNewCondition = function ($ul, condition){
	
	var level = $ul.data('level');
	var $li = $('<li class="body"></li>');
	var $div = $("<div>");

	$li.data('level', level);
	$li.addClass('level' + level);
	
	if(! condition){
		condition = {};
	}
	
	$li.append($div);
	
	var $leftOperandInput = UTEADMIN.ruleAdmin.getInputBlock('text', 'leftOperand', condition.leftOperand, 'Left Operand : ');
	
	$leftOperandInput.prepend('<span class="toggleHolder"><i class="arrowIcon"></i></span>');
	
	for(var iter = 1; iter < level; iter++){
		$leftOperandInput.prepend('<span><i class="lineIcon"></i></span>');
	}
	
	$div.append($leftOperandInput);
	$div.append(UTEADMIN.ruleAdmin.getSelectBlock('Operator', condition.Operator, 'Operator : ', {'EQ': 'Equal (==)','NE': 'Not Equal (!=)','GT': 'Greater Than (>)', 'LT': 'Lesser Than (<)','GE': 'Greater Than or Equal (>=)', 'LE': 'Lesser Than or Equal (<=)','IN': 'In','ENDSWITH': 'Ends With','STARTSWITH': 'Starts With', 'EQIGNORECASE':'Equals Ignore Case', 'LIKE':'Like', 'NESTED':'(...)'}));
	$div.append(UTEADMIN.ruleAdmin.getInputBlock('text', 'RightOperand', condition.RightOperand, 'Right Operand : '));
	$div.append(UTEADMIN.ruleAdmin.getSelectBlock('Connective', condition.Connective, 'Connective : ', ['AND','OR']));
	
	$div.append('<div class="ActionDiv adhocInlineBlock"><span class="addChildCondition" title="Add Child Condition"><i class="addIcon"></i></span> <span class="removeChildCondition" title="Delete Condition"><i class="trashIcon"></i></span></div>');
	
	$ul.append($li);
	
	return $li;
}

UTEADMIN.ruleAdmin.createHeader = function ($ul){
	
	var $li = $('<li class="header"></li>');
	var $div = $("<div>");
	
	$div.append('<div class="leftOperandDiv adhocInlineBlock">Left Operand</div>');
	$div.append('<div class="OperatorDiv adhocInlineBlock">Operator</div>');
	$div.append('<div class="RightOperandDiv adhocInlineBlock">Right Operand</div>');
	$div.append('<div class="ConnectiveDiv adhocInlineBlock">Connective</div>');
	$div.append('<div class="ActionDiv adhocInlineBlock">Action</div>');

	$li.append($div);
	$ul.append($li);
	
	return $li;
}

UTEADMIN.ruleAdmin.getInputBlock = function (type, name, value, label){
	
	var $div = $('<div class="adhocInlineBlock"></div>');
	var $input = $("<input>");
	
	$div.addClass(name + "Div");
	$input.addClass(name);
	
	$input.data('name', name);
	$input.attr('type', type);
	$input.val(value);
	
	$div.append($input);
	
	return $div;
}

UTEADMIN.ruleAdmin.getSelectBlock = function (name, value, label, optionsDtls){
	
	var $div = $('<div class="adhocInlineBlock"></div>');
	var $select = $("<select>");
	
	$div.addClass(name + "Div");
	$select.addClass(name);
	
	$select.data('name', name);
	
	var optionStr = "";
	
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
	
	$select.html(optionStr);
	
	$div.append($select);
	
	return $div;
}

UTEADMIN.ruleAdmin.createConditionInDom = function (conditions){
	
	$("#conditionStartNode").children('li.body').remove();
	UTEADMIN.ruleAdmin.putAllConditionsInDom(conditions, $("#conditionStartNode"));
}

UTEADMIN.ruleAdmin.putAllConditionsInDom = function (conditions, $ul){
	
    if($.type(conditions) != "array"){
    	conditions = [conditions]
    }
	
	$.each(conditions, function(index, singleCondition){
		UTEADMIN.ruleAdmin.putSingleConditionInDom(singleCondition, $ul);
	});
}

UTEADMIN.ruleAdmin.putSingleConditionInDom = function (singleCondition, $ulToAddCondition){
	
	var $li = UTEADMIN.ruleAdmin.addNewCondition($ulToAddCondition, singleCondition);
	
	if(singleCondition.Condition){
	
		var $ul = $("<ul>");
		$ul.data('level', $li.data('level') + 1);
		$li.find('span.toggleHolder').empty().append('<i class="minusIcon"></i></span>');
		$ul.appendTo($li);
		
		UTEADMIN.ruleAdmin.putAllConditionsInDom(singleCondition.Condition, $ul);
	}
	
}

