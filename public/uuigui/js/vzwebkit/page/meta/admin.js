var Page = (function($, window, undefined) {
    var o = {};

    //Private vars and functions

    function attachValidationHandlers(row) {
        var cols = row.find('input,select');
        cols.blur(function() {
            var name = $(this).parent('.vgrid-column').data("name");
            if (validation_functions[name]) {
                var rtn = validation_functions[name]($(this).val());
                //console.log(rtn);
                if (rtn === true) {
                    $(this).removeClass("error");
                    $(this).attr('title', "");
                } else {
                    $(this).addClass("error");
                    $(this).attr('title', rtn);
                }
            }
            ;
        });
    }

    function doCreate(params, row) {
        $.ajax({
            url: window.location.pathname + "/create/" + $("#orderNumber").val(),
            type: "POST",
            data: params,
            dataType: 'json',
            success: function(text, status) {
                if (text.status !== 'SUCCESS') {
                    $("#dialog-error").find('.dialog-error-message').empty().text(text.message);
                    $("#dialog-error").dialog({
                        resizable: false,
                        height: 300,
                        width: 300,
                        modal: true,
                        buttons: {
                            Close: function()
                            {
                                $(this).dialog("close");
                            }
                        }
                    });
                } else {
                    $.pnotify({
                        title: 'Success',
                        text: selected_object + " created.",
                        type: 'success',
                        hide: true,
                        styling: 'jqueryui'
                    });
                    $('.vgrid').vgrid('cancelRowForInsert', row);
                    if (text.key && text.key > 0) {
                        //console.log(text.key);
                    }
                }
            }
        });
    }

    function doModify(params, row) {
        $.ajax({
            url: window.location.pathname + "/edit",
            type: "POST",
            data: params,
            success: function(text, status) {
                if (text.status !== 'SUCCESS') {
                    $("#dialog-error").find('.dialog-error-message').empty().text(text.message);
                    $("#dialog-error").dialog({
                        resizable: false,
                        height: 300,
                        width: 300,
                        modal: true,
                        buttons: {
                            Close: function()
                            {
                                $(this).dialog("close");
                            }
                        }
                    });
                } else {
                    $.pnotify({
                        title: 'Success',
                        text: selected_object + " modified.",
                        type: 'success',
                        hide: true,
                        styling: 'jqueryui'
                    });
                    $('.vgrid').vgrid('cancelRowForEdit', row);
                }
            }
        });
    }

    function doAction(params, row, btn, deleterow) {
        var action = btn.data('action').toLowerCase();
        var action_name = action.charAt(0).toUpperCase() + action.slice(1);

        $('#dialog-confirm-action').attr('title', action_name + " " + selected_object);
        $('.dialog-action_name').html(action_name);
        $("#dialog-confirm-action").dialog({
            resizable: false,
            height: 300,
            width: 300,
            modal: true,
            buttons: {
                OK: function() {
                    $.ajax({
                        url: window.location.pathname + "/" + action,
                        type: "POST",
                        data: params,
                        success: function(text, status) {
                            $("#dialog-confirm-action").dialog("close");
                            if (text.status !== 'SUCCESS') {
                                $("#dialog-error").find('.dialog-error-message').empty().text(text.message);
                                $("#dialog-error").dialog({
                                    resizable: false,
                                    height: 350,
                                    width: 350,
                                    modal: true,
                                    buttons: {
                                        Close: function()
                                        {
                                            $(this).dialog("close");
                                        }
                                    }
                                });
                            } else {
                                $.pnotify({
                                    title: 'Success',
                                    text: selected_object + " " + action + ".",
                                    type: 'success',
                                    hide: true,
                                    styling: 'jqueryui'
                                });
                                if (deleterow) {
                                    row.slideUp({
                                        complete: function() {
                                            row.remove();
                                        }
                                    });
                                }
                            }
                        }
                    });
                },
                Close: function()
                {
                    $(this).dialog("close");
                }
            }
        });
    }

    //Public (exported) functions
    o.init = function() {
        $(".object_dropdown").multiselect({
            multiple: false,
            header: false,
            //header: "Select an Option",
            //noneSelectedText: "Select an Option",
            selectedList: 1});
        //$(".object_dropdown").msDropdown({
        //    scrollbar:true
        //});
        $('.object_dropdown').bind('change', function() {
        	
            window.location = CONTEXT_PATH + "/uui/apps/admin/meta/" + $(this).val();
        	
        });
    $('.task_dropdown').bind('change', function() {
    	
    	var objNam = $('.object_dropdown').val();
    	
    	var url =   CONTEXT_PATH + "/uui/apps/admin/meta/" +objNam ;
    	 var taskName = $('.task_dropdown').val();
    	 url += "?taskName="+taskName;
    	 
    	 window.location = url;
        	
    		
        });
        $('.vgrid').vgrid({
            sortJs: true
        });

        $('.action-CREATE').click(function(evt) {
            evt.preventDefault();
            $('.vgrid').vgrid('insertRowForCreate', attachValidationHandlers, doCreate);
            return false;
        });

        $('.action-OTHER').each(function(index, obj) {
            var $obj = $(obj);
            if ($obj.hasClass("action-EDIT")) {
                $obj.click(function(evt) {
                    evt.preventDefault();
                    var btn = this;

                    $('.vgrid').vgrid('modifyRowForEdit', $(btn).parents('.vgrid-row'), attachValidationHandlers, doModify);

                    return false;
                });
            }
            else if ($obj.hasClass("action-DELETE")) {
                $obj.click(function(evt) {
                    evt.preventDefault();
                    var $btn = $(this);
                    var row = $btn.parents('.vgrid-row');
                    $('.vgrid').vgrid('getRowData', row, function(params) {
                        doAction(params, row, $btn, true);
                    });
                    return false;
                });
            }
            else {
                $obj.click(function(evt) {
                    evt.preventDefault();
                    var $btn = $(this);
                    var row = $btn.parents('.vgrid-row');
                    $('.vgrid').vgrid('getRowData', row, function(params) {
                        doAction(params, row, $btn, false);
                    });
                    return false;
                });
            }
        });
    };

    return o;
}(jQuery, window));

$(function() {
    Page.init();
});

