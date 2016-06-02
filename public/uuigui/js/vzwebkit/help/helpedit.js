function sendHelpMail() {
    $("#helpmail").attr("href", "mailto: ?subject=Emailing Help for: Design Circuit &body=" + window.location + "");
}
var searchText = "";
var sPageURL = window.location.search.substring(1);
var sURLVariables = sPageURL.split('&');
for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == "fromPage") {
        searchText = sParameterName[1];

    }

}

function printDocument() {
    var printContents = document.getElementById("helppagecontent").innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
}

editor = null;

$(function() {
	
	 if (hashelpEditPriv == "true") {
	    	$(".editseperator, .editter, .editter_app_help").show(); 
	    } else {
	    	$(".editseperator, .editter, .editter_app_help").hide();
	    }
    
    $(window).resize(function(){
		 heightresize();	
		 
	 });

});

function populateData(d) {
    if (($("#texteditWidgTextarea") != null) && $("#texteditWidgTextarea").css('visibility') == 'visible') {
        textareastr = $("#texteditWidgTextarea").val();

    } else {
        if (d != "fromPubish") {

            $("#saveTaskDialog").dialog({
                    dialogClass: 'vzuui-custom-dialog',
                    resizable: false,
                    height: 180,
                    modal: true,
                    buttons: [{
                            text: "OK",
                            "class": 'vzuui-btn-red',
                            click: function() {
                                $("#saveTaskDialog").dialog("close");
                            }

                        },

                    ]

                }

            );

        }
        textareastr = editor.getData();
    }
    if (d != "fromPubish") {
        $("#previewScreen").html('').html(textareastr);
        $(".txtactions").siblings('div').show().html('').append(textareastr);
        $(".txtactions").remove();
        editor.destroy();
    } else {
        $(".txtactions").siblings('div').show();
        $(".txtactions").remove();
    }
    editor = null;
};


function retainText(d) {

    $("#disTaskDialog").dialog({
            dialogClass: 'vzuui-custom-dialog',
            resizable: false,
            height: 180,
            modal: true,
            buttons: [{
                    text: "OK",
                    "class": 'vzuui-btn-red',
                    click: function() {
                        $("#disTaskDialog").dialog("close");
                        $(".txtactions").siblings('div').show();
                        $(".txtactions").remove();
                    }

                },

                {
                    text: "Cancel",
                    "class": 'vzuui-btn-gray',
                    click: function() {
                        $("#disTaskDialog").dialog("close");

                    }
                },

            ]

        }

    );

}



$('.editter').click(function() {
    heightresize();
    /*$("#mailmode,#printmode,#editmode").hide();*/
    $("#publishmode,#cancelpage").show();
    if ($('#editmode').css("display") == "inline-block") {
        return;
    }
    if ($('.txtactions').is(':visible')) {

        $("#activeTaskDialog").dialog({
                dialogClass: 'vzuui-custom-dialog',
                resizable: false,
                height: 180,
                modal: true,
                buttons: [{
                    text: "OK",
                    "class": 'vzuui-btn-red',
                    click: function() {
                        $("#activeTaskDialog").dialog("close");
                    }

                }, ]

            }

        );
        //var r = confirm("Changes will be lost. Click Cancel to Edit the Previous Change");           
        // if (r == false) {
        // return;
        // } 
        return;
    }
    var targetfield = $(this).parent().siblings('div').html();
    var textarearstart = '<div class="txtactions"><div style="width:100%;" id="textedit" ></div><br><button type="submit" onclick="populateData(this)" class="saveedit vzuui-btn-red" style="margin-right:10px;">Save and Preview</button><button onclick="retainText(this)" type="cancel" class="closeedit vzuui-btn-gray"> Discard Changes</button></form>' + '</div>';
    $(".txtactions").remove();
    $(".helpDesc .edited").show();
    $(this).parent().parent().append(textarearstart);
    editor = createEditor(targetfield);
    editor.config.removePlugins = 'elementspath',
        editor.config.toolbar = [{
                name: 'document',
                items: ['Source', '-', 'Save', 'NewPage', 'DocProps', 'Preview', 'Print', '-', 'Templates']
            }, {
                name: 'clipboard',
                items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']
            }, {
                name: 'editing',
                items: ['Find', 'Replace', '-', 'SelectAll', '-', 'SpellChecker', 'Scayt']
            },

            '/', {
                name: 'basicstyles',
                items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat']
            }, {
                name: 'paragraph',
                items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote',
                    '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl'
                ]
            }, {
                name: 'links',
                items: ['Link', 'Unlink']
            }, {
                name: 'insert',
                items: ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe']
            },
            '/', {
                name: 'styles',
                items: ['Styles', 'Format', 'Font', 'FontSize']
            }, {
                name: 'colors',
                items: ['TextColor', 'BGColor']
            }, {
                name: 'tools',
                items: ['Maximize']
            }
        ];

    editor.config.removeButtons = 'Save,Flash,Preview,Image';
    editor.focus();
    $(this).parent().siblings('div:first').addClass('edited');
    $(this).parent().siblings('div:first').hide();
    setTargetBlank();
});




$('.editter_app_help').click(function() {
    heightresize();
    /*$("#mailmode,#printmode,#editmode").hide();*/
    $("#publishmode,#cancelpage").show();
    if ($('#editmode').css("display") == "inline-block") {
        return;
    }
    if ($('.txtactions').is(':visible')) {
        $("#activeTaskDialog").dialog("open");
        var r = confirm("Changes will be lost. Click Cancel to Edit the Previous Change");
        if (r == false) {
            return;
        }
    }
    var targetfield = $(".helpDesc").html();
    var textarearstart = '<div class="txtactions"><div style="width:100%;" id="textedit" ></div><br><button type="submit" onclick="populateData(this)" class="saveedit vzuui-btn-red" style="margin-right:10px;">Save and Preview</button><button onclick="retainText(this)" type="cancel" class="closeedit vzuui-btn-gray"> Discard Changes</button></form>' + '</div>';
    $(".txtactions").remove();
    $(".helpDesc .edited").show();
    $("#taskdesc").append(textarearstart);
    editor = createEditor(targetfield);
    editor.config.removePlugins = 'elementspath',
        editor.config.DefaultLinkTarget = '_self',
        editor.config.height = $(".help_content").height() - 255,
        editor.config.toolbar = [{
                name: 'document',
                items: ['Source', '-', 'Save', 'NewPage', 'DocProps', 'Preview', 'Print', '-', 'Templates']
            }, {
                name: 'clipboard',
                items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']
            }, {
                name: 'editing',
                items: ['Find', 'Replace', '-', 'SelectAll', '-', 'SpellChecker', 'Scayt']
            },

            '/', {
                name: 'basicstyles',
                items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat']
            }, {
                name: 'paragraph',
                items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote',
                    '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl'
                ]
            }, {
                name: 'links',
                items: ['Link', 'Unlink']
            }, {
                name: 'insert',
                items: ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe']
            },
            '/', {
                name: 'styles',
                items: ['Styles', 'Format', 'Font', 'FontSize']
            }, {
                name: 'colors',
                items: ['TextColor', 'BGColor']
            }, {
                name: 'tools',
                items: ['Maximize']
            }
        ];

    editor.config.removeButtons = 'Save,Flash,Preview';
    editor.focus();
    $(this).parent().siblings('div:first').addClass('edited');
    $(".helpDesc").hide();
    setTargetBlank();
});



function setTargetBlank() {

    CKEDITOR.on('dialogDefinition', function(ev) {

        try {
            var dialogName = ev.data.name;
            var dialogDefinition = ev.data.definition;
            if (dialogName == 'link') {
                var informationTab = dialogDefinition.getContents('target');
                var targetField = informationTab.get('linkTargetType');

                targetField['default'] = '_blank';

            }

        } catch (exception) {

            alert('Error ' + ev.message);

        }

    });

}


function createEditor(html) {
    var config = {};
    editor = CKEDITOR.appendTo('textedit', config, html);
    return editor;
}

clickedCancel = function() {
    if ($('.txtactions').is(':visible')) {
        $("#discardTaskDialog").dialog({
                dialogClass: 'vzuui-custom-dialog',
                resizable: false,
                height: 180,
                modal: true,
                buttons: [{
                        text: "Discard",
                        "class": 'vzuui-btn-red',
                        click: function() {
                            $("#discardTaskDialog").dialog("close");
                            window.location.reload(true);
                        }

                    },

                    {
                        text: "Cancel",
                        "class": 'vzuui-btn-gray',
                        click: function() {
                            $("#discardTaskDialog").dialog("close");
                        }

                    },

                ]

            }

        );
    } else {
        $("#discardTaskDialog").dialog({
            dialogClass: 'vzuui-custom-dialog',
            resizable: false,
            height: 180,
            modal: true,
            buttons: [{
                    text: "Discard",
                    "class": 'vzuui-btn-red',
                    click: function() {
                        $("#discardTaskDialog").dialog("close");
                        window.location.reload(true);
                    }

                },

                {
                    text: "Cancel",
                    "class": 'vzuui-btn-gray',
                    click: function() {
                        $("#discardTaskDialog").dialog("close");
                    }

                },

            ]

        });

    }


}



$(".cancelmode").click(clickedCancel);


$('#publishmode').click(function() {

    if ($('.txtactions').is(':visible')) {

        $("#publishTaskDialog").dialog({
                dialogClass: 'vzuui-custom-dialog',
                resizable: false,
                height: 180,
                modal: true,
                buttons: [{
                    text: "OK",
                    "class": 'vzuui-btn-red',
                    click: function() {
                        $("#publishTaskDialog").dialog("close");

                    }

                }, ]

            }

        );
    } else {

        $("#finalpublishTaskDialog").dialog({
                dialogClass: 'vzuui-custom-dialog',
                resizable: false,
                height: 180,
                modal: true,
                buttons: [{
                        text: "Publish",
                        "class": 'vzuui-btn-red',
                        click: function() {
                            $("#finalpublishTaskDialog").dialog("close");
                            $("#publishmode,#cancelpage").hide();
                            $('.helpDesc div').removeClass('editsection').show();
                            $("#publishmode,#cancelpage").hide();
                           /* var bodyheight = $('body').height();
                            totalright = bodyheight - 45;
                            $('.help_content').css('height', totalright - 10);
                            $('.help_content').height();
                            $('.help_content').css('overflow-y', 'auto');*/
                            var URL = window.location.pathname.replace("select", "update");
                            var CONTENT = '<div class="help_content">' + $(".help_content").html() + '</div>';
                            $.ajax({
                                url: URL,
                                type: "POST",
                                data: {
                                    content: CONTENT
                                },
                                success: function(data) {
                                    $('.notificationmsg').slideUp("slow");
                                    $('.notificationmsgsucess').html(data);
                                    $('.notificationmsgsucess').slideDown("slow").delay(3000).slideUp("slow");
                                },
                                fail: function() {
                                    $('.notificationmsgsucess').html("Internal Server Error");
                                    $('.notificationmsgfailure').slideDown("slow").delay(3000).slideUp("slow");

                                }
                            });


                        }

                    },

                    {
                        text: "Cancel",
                        "class": 'vzuui-btn-gray',
                        click: function() {
                            $("#finalpublishTaskDialog").dialog("close");
                            $("#publishmode,#cancelpage").show();
                        }

                    },

                ]

            }

        );

    }


});




function heightresize() {
    var bodyheight = $('body').height();
    totalright = bodyheight - 90;
    $('.help_content').css('height', totalright + 35);
    $('.help_content').height();
    //$('.help_content').css('overflow-y', 'auto');

}


function clearHelpSearch() {
    $("#help-search-input").val("");
    $("#help-search-input").trigger("keyup")
}

$(".slider").click(function() {
    if (!$(this).hasClass("sliderSelected")) {
        $(".leftpanel").show();
        $(this).addClass("sliderSelected");
    } else {
        $(".leftpanel").hide();
        $(this).removeClass("sliderSelected");
    }
});