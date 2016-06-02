var helpTopics = ["Design Circuit", "Modify Circuit Design", "Verify Activation Readiness", "How would I avail a new task?",
    "How can I customize 'My App'?", "How can I acquire a TFAs task?", "VZ Knowledge Documents", "vTube Videos", "Task Actions", "Complete Circuit Turn-up", "Confirm Cancellation", "Escalate Dispatch"
]

var helpTopicsMap = {
    "Design Circuit": "'Design_Circuit','TASK_HELP'",
    "Modify Circuit Design": "'Modify_Circuit_Design','TASK_HELP'",
    "Verify Activation Readiness": "'Verify_Activation_Readiness','TASK_HELP'",
    "How would I avail a new task?": "'UUI_Frequently_Asked_Questions','UUIAPP_HELP'",
    "How can I customize 'My App'?": "'Design_Circuit','TASK_HELP'",
    "How can I acquire a TFAs task?": "'Modify_Circuit_Design','TASK_HELP'",
    "Verify Activation Readiness": "'Verify_Activation_Readiness','TASK_HELP'",
    "Complete Circuit Turn-up": "'Complete_Circuit_Turn-up','TASK_HELP'",
    "Confirm Cancellation": "'Confirm_Cancellation','TASK_HELP'",
    "Escalate Dispatch": "'Escalate_Dispatch','TASK_HELP'"
}

$(document).ready(function() {
    $(".helpPopUpIframe").hide();
    $(".panels").accordion({
        collapsible: true,
        heightStyle: "content",
        autoHeight: false,
        clearStyle: true,
    });
    $(".left-panel-ul-first li").click(function() {
        $(".left-panel-ul-first li").removeClass("liselected");
        $(this).addClass("liselected");
    });
    $("#vzuui-order-search-input").click(function() {
        if ($(this).val() == "Search") {
            $(this).val("");
            $(this).css("color", "#333");
        }
    });

    $(window).resize(function() {
        helpheightresize();

    });

    helpheightresize();

    $(".slider").click(function() {
        if (!$(this).hasClass("sliderSelected")) {
            $(".leftpanel").show();
            $(this).addClass("sliderSelected");
        } else {
            $(".leftpanel").hide();
            $(this).removeClass("sliderSelected");
        }
    });


    $('.helpSectionContent .showHideIframe').click(function() {    
           $('.help-popup').show();		
          if (($(this).text()) == 'View More...') {
                $('.helpbreadcrumb').show();
                $('.nobreadcrumb').hide();
                $('.helpsecondbreadcrumb').hide();
                var firstlevel = $(this).data('name');
                $('.helpbreadcrumb .firstlevel').text(firstlevel);
            } else {
                $('.helpbreadcrumb').hide();
                $('.nobreadcrumb').hide();
                $('.helpsecondbreadcrumb').show();
                var firstlevel = $(this).data("name");
				$('.helpsecondbreadcrumb .firstlevel a').data("name",$(this).data("name"));				
				$('.helpsecondbreadcrumb .firstlevel a').attr("title",$(this).data("name"));
				$('.helpsecondbreadcrumb .firstlevel a').data("iframe",$(this).data("iframe"));				
				$('.helpsecondbreadcrumb .firstlevel a').data("tasktype",$(this).data("tasktype"));				
                $('.helpsecondbreadcrumb .firstlevel a').text($(this).data('name'));
                var secondlevel = $(this).text();
                $('.helpsecondbreadcrumb .secondlevel').text(secondlevel);
            }         
		
    });

    $('.left-panel-ul-first li').click(function() {
		 var firstlevel = $(this).data("name");
            $('.help-popup').show();
            $('.helpbreadcrumb').hide();
            $('.nobreadcrumb').hide();
            $('.helpsecondbreadcrumb').show();
            $('.helpsecondbreadcrumb .firstlevel a').text(firstlevel);
			
			$('.helpsecondbreadcrumb .firstlevel a').data("name",$(this).data("name"));				
			$('.helpsecondbreadcrumb .firstlevel a').attr("title",$(this).data("name"));
			$('.helpsecondbreadcrumb .firstlevel a').data("iframe",$(this).data("iframe"));				
			$('.helpsecondbreadcrumb .firstlevel a').data("tasktype",$(this).data("tasktype"));
					
            var secondlevel = $(this).text();
            $('.helpsecondbreadcrumb .secondlevel').text(secondlevel);
            isSliderDisplay = $(".slider").css("display");
            if (isSliderDisplay != "none") {
                $(".leftpanel").hide();
                $(".slider").removeClass("sliderSelected");
            }       
    });


    $('.apphelp').click(function() {
        $('.help-popup').show();
        $('.helpbreadcrumb').show();
        $('.nobreadcrumb').hide();
        $('.helpsecondbreadcrumb').hide();
        $('.helpbreadcrumb .firstlevel').text($(this).text());
    });

    $('.firstchild').click(function() {
        $('.help-popup').show();
        $('.helpbreadcrumb').show();
        $('.nobreadcrumb').hide();
        $('.helpsecondbreadcrumb').hide();
        $('.helpbreadcrumb .firstlevel').text($(this).text());
    });

    $('.taskhelpPage a').click(function() {
        parent.$('.helpbreadcrumb').hide();
        parent.$('.nobreadcrumb').hide();
        parent.$('.helpsecondbreadcrumb').show();
        var firstlevel = $(".help_header h1").text();
        parent.$('.helpsecondbreadcrumb .firstlevel a').text(firstlevel);
        var secondlevel = $(this).attr("title");
        parent.$('.helpsecondbreadcrumb .secondlevel').text(secondlevel);
        parent.$(".left-panel-ul-first li").removeClass("liselected");
    });


    $('.taskhelpbtn').click(function() {
        $('.nobreadcrumb').hide();
        $('.helpbreadcrumb').show();
        $('.helpsecondbreadcrumb').hide();
        var firstlevel = $(this).attr('title');
        $('.helpbreadcrumb .firstlevel').text(firstlevel);
		showHideTaskListIframe($(this).data("iframe"),$(this).data("tasktype"),this);
    });


    $('.left-panel-ul-first li').click(function() {
        var firstlevel = $('.ui-state-active').text();
        $('.helpbreadcrumb .firstlevel').text(firstlevel);
        var secondlevel = $(this).text();
        $('.helpbreadcrumb .secondlevel').text(secondlevel);
        var innerframe = $('.helpPopUpIframe').height();
    });

    $.ajax({
        url: CONTEXT_PATH + "/help/getsearchres",
        type:"GET",
        dataType: 'json',
        success: function(data) {
        	helpTopics= data.helpTopics;
        	helpTopicsMap = data.helpTopicsMap;
        	
        }
    });
    
    
    $("#help-search-input").keyup(function() {
        $(".helpSearchResultsList").html("");

        if ($("#help-search-input").val().length > 0) {
            $(".left-menu-bar .panels ").hide();
        } else {
            $(".left-menu-bar .panels ").show();
        }

    });
    $("#help-search-input").autocomplete({
        source: helpTopics,
        response: function(event, ui) {
            $(".helpSearchResultsList").append("<div class='primarynav'>Search Results<span onClick='clearHelpSearch()' class='searchResultClose'/></span>")
            for (var i = 0; i < ui.content.length; i++) {
                $(".helpSearchResultsList").append("<li onClick=showHideIframe(" + helpTopicsMap[ui.content[i].label] + ")>" + ui.content[i].label + "</li>");
                $(".ui-autocomplete").hide();
            }
        }

    })


});

editor = null;

function showHideIframe(iframeName, oType) {
    $('.help-popup').show();
    var bodyheight = $('body').height();
    totalleftmenu = bodyheight - 125;
    $(".helpPopUpIframe").hide();
    $("#helpSectionRightContent").hide();
    var iframe = $("#" + iframeName);
    var url = CONTEXT_PATH + '/help/select/LAYER1/' + iframeName + '/' + oType;

    $('.helpPopUpIframe').css({
        display: 'none'
    });

    getIframe(url, iframeName, function(id, url, iframe) {
        iframe.css({
            display: "block"
        });
    })
}

function showHideTaskListIframe(iframeName, oType,ele) {
    $('.help-popup').show();
    var bodyheight = $('body').height();
    totalleftmenu = bodyheight - 125;
    $(".helpPopUpIframe").hide();
    $("#helpSectionRightContent").hide();
    var iframe = $("#" + iframeName);
    var hTitle=$(ele).data("name").replace("/","%2F");
	    hTitle=hTitle.replace(/ /g,"_");
    var url = CONTEXT_PATH + '/help/tasklist/'+oType+'/'+hTitle;

    $('.helpPopUpIframe').css({
        display: 'none'
    });

    getIframe(url, iframeName, function(id, url, iframe) {
        iframe.css({
            display: "block"
        });
    })
}
function getIframe(url, id, callback) {
    var iframe = $("#" + id);
    if (iframe.size() === 0) {
        iframe = addIframe(id, url, callback);
    } else {
        callback && callback(id, url, iframe);
    }
    return iframe;
};

function addIframe(id, url, callback) {
    var container = $('.inner_help_container_new');
    var html = "<div class='spinny-help'><span class='vzuui-help-progress-image'></span></div>";
    container.append(html);

    var iframe = $("<iframe>");
    iframe.addClass("helpPopUpIframe");
    iframe.attr("src", url);
    iframe.attr("id", id);
    container.append(iframe);

    $(iframe).one('load', function() {
    	
      $('.helpPopUpIframe').css({
           display: 'none'
       });       
      $('.left-panel-ul-first li').removeClass('liselected');  
      container.find(".spinny-help").remove();
      var id=iframe.attr("id");
      var li_link=$(".left-panel-ul-first li[data-iframe='"+ id.trim() +"']");
          li_link.addClass('liselected');
          iframe.show();
          callback && callback(id, url, iframe);
    });

    return iframe;
};

function clearHelpSearch() {
    $("#help-search-input").val("");
    $("#help-search-input").trigger("keyup")
}

function helpheightresize() {

    var bodyheight = $('body').height();
    totalhelp = bodyheight - 10;
    totalleftmenu = bodyheight - 60;
    totalright = bodyheight - 60;

    $('.help-body').css('height', totalhelp);
    $('.left-menu-bar').css('height', totalleftmenu);
    $('.right-container').css('height', totalright);
    $('.right-container').css('overflow-y', 'auto');
}