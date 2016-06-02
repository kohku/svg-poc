Page = function() {
    var o = {};

    o.init = function() {
    	/*													*/
    	/* 													*/
    	/* Hiding header and Navigation for COA OSS changes */
    	/*													*/
    	/*													*/
    	if(sourceName=='COA'){
			$('.vzuui-logo').hide();
			$('.vzuui-user-info').hide();
			$('.vz-mini-wrap-list').find('.vz-mini-menu').find('li').eq(4).hide();
			$('#main-content-wrapper').css({
				'padding':'0px'
			});
		}
        /*                                        */
        /*        Initialize Notifications        */
        /*                                        */
        Notifications.init();

        /*                                        */
        /*        Initialize Mini-Search          */
        /*                                        */
        MiniSearch.init();

        /*                                        */
        /*        Initialize Mini-Search          */
        /*                                        */
        SideNav.init();

        /*                                        */
        /*        Initialize Home Links           */
        /*                                        */
        HomeLinks.init();

        /*                                        */
        /*        Initialize Session Timer        */
        /*                                        */
        SessionTimer.init();

        /*                                        */
        /*       Initialize  TfasNotification     */
        /*                                        */
        TfasNotification.init();
        /*                                        */
        /*       Intialize RWD Functions    */
        /*                                        */
        RWDFunctions.init();

        
        // beforeunload and logout button bindings 
        /*
        $(window).bind('beforeunload', function(e) {
            return "This action will close any open work on the page.\nPlease confirm if you want to continue."; 
        }); */
        $('#logout_btn').click(function(){     	$(window).unbind('beforeunload');     	return true;      });

        
        
        //register for service provider config

        vzuui.messenger.register("SERVICE_PROVIDER_CONFIG", function(e) {
            //console.log(" getting config event"+" pchome="+window.name);        
            var arr = e.prop_params;
            /* for(var i=0;i<arr.length;++i){           
             for(key in arr[i]){
             console.log("key="+key+" value="+arr[i][key]);
             }
             }*/

            //console.log(" sp_params.default_params..."+sp_params.default_params.length);
            for(var i=0;i<sp_params.default_params.length;++i){
                //console.log(" adding defualt param="+ sp_params.default_params[i].name+" value="+sp_params.default_params[i].value);
                e.prop_params.push(sp_params.default_params[i]);
            }
            // console.log(" sp_modify="+sp_modifying) ;             
            sp_params.prop_params = JSON.stringify(e.prop_params);
            if(sp_modifying==false){
                SideNav.executeAdd(sp_params, sp_src);
            }else{
                var dash_frame = $('.vzuui-app-iframe[src*="/dash"]');
//console.log(" sending update");
                if (dash_frame.size() === 1) {
                    var dash_frame = dash_frame.get(0);
                    //console.log(" sp_params="+sp_params.prop_params);
                        if(dash_frame.contentWindow && dash_frame.contentWindow.Landing ){
                        dash_frame.contentWindow.Landing.handleModifyExternal(sp_params);
                    }
                }
            }
            sp_modifying=false;
        });

        // console.log(" registering event");
        vzuui.messenger.register("SET_APP_CONFIG", function(e) {
            //  console.log(" getting config event"+" pchome="+window.name);        
            sp_modifying=true;
            sp_params.id=e.id;
            sp_params.widget_url=e.widget_url;
            sp_params.app_url=e.app_url;
            sp_params.name=e.name;
            sp_params.app_args=e.app_args;
            sp_params.default_params=[];

        });

        //console.log(" registering event 2---");       

        vzuui.messenger.register("SERVICE_PROVIDER_CONFIG_CLOSE", function(e) {
            //console.log(" close");
            $("#dialog-form").dialog("close");
        });

    };

    return o;
}();


///////////// cached vars for service provider config

var sp_params =
        {
            id: "",
            widget_name: "",
            widget_url: "",
            app_url: "",
            app_args: "",
            default_params:[]
        };

var sp_src = null;
var sp_modifying=false;
var sp_id="";
var sp_widget_url="";
var sp_app_url="";
var sp_name="";



///////////////////////////////////////////////////////////////////////////////////
////////////////////////////// Side Navigation ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
SideNav = function() {
    var o = {};

    o.navOpen = false;
    o.navWidth = 200;
    o.navControlWidth = 20; //size of control to open and close nav section

    o.init = function() {
        $('#vzuui-accordion-wrapper').accordion();
        $('.vzuui-add-widget-enabled, .vzuui-add-widget-multi-instance').click(SideNav.addApp);
        $('.vzuui-add-widget-overlay').hide();

        $("#vzuui-nav-icon").click(function() {
            window.SessionTimer && SessionTimer.resetTimer();
            SideNav.handleNavigation($(this));
        });
        $("#vzuui-nav-icon-rwd").click(function() {
            window.SessionTimer && SessionTimer.resetTimer();
            SideNav.handleNavigation($(this),true);
        });
        //init dialog used for adding apps with args
        $("#dialog-form").dialog({
            autoOpen: false,
            height: 300,
            width: 400,
            modal: true,
            draggable: false,
            resizable: false,
            buttons: {
                "Submit": function() {
                    $('#dialog-form form').trigger("submit");
                    $(this).dialog("close");
                },
                Cancel: function() {
                    $(this).dialog("close");
                }
            },
            close: function() {
                var src = $(this).data("obj");

                src.css("opacity", "1.0");
                src.data("loading", "false");

                if (src.hasClass('vzuui-add-widget-enabled') && !(src.hasClass('vzuui-add-widget-multi-instance'))) {
                    src.addClass('vzuui-add-widget-disabled').removeClass('vzuui-add-widget-enabled');
                    src.parent().find('.vzuui-add-widget-overlay').show();
                }
            }
        });
    };

    o.addApp = function(event) {
        event.preventDefault();

        var $this = $(this);

        if ($this.data("loading") === "true") {
            return;
        }
        $this.css("opacity", ".5");
        $this.data("loading", "true");
        var obj = $this.parents('.vzuui-nav-app-icon');

        var id = obj.data("app-id");

        var widget_url = obj.data("widget-url");
        var app_url = obj.data("app-url");
        var app_args = obj.data("args");
        var external = obj.data("external");
        var name = obj.attr("title");

        //set these in the case this is externally configured
        sp_params.id = id;
        sp_params.widget_name = name;
        sp_params.widget_url = widget_url;
        sp_params.app_url = app_url;
        sp_params.app_args = app_args;
        sp_src = $this;

        //if app has arguments then present dialog
        if (app_args.length > 0) {
            uuiAjax({
                url: CONTEXT_PATH + "/dialog",
                type: "POST",
                data: {
                    id: id
                }
            }).done(function(result, textStatus) {
                if (textStatus === 'success') {

                    $("#dialog-form form").remove();
                    $("#dialog-form iframe").remove();
                    $("#dialog-form").html(result);
                    if (result.indexOf("external_config_url") === -1) {
                        $("#dialog-form select").multiselect({
                            multiple: false,
                            header: false,
                            selectedList: 1,
                            click: function(event, ui) {
                                //console.log(" multiselect click");
                            }
                        });
                        $('.date-picker').datepicker();
                        $("#dialog-form").parent().find('.ui-dialog-buttonpane').show();
                        $('#dialog-form form').submit(function(event) {
                            SideNav.handleDialogSubmit(event, $this);
                        });

                        //set width and height
                        $("#dialog-form").dialog("option", "height", 300);
                        $("#dialog-form").dialog("option", "width", 400);

                    } else { //this is the external_config_url case
                        var config_url=$("#dialog-form iframe").data("config-url");
                        sp_params.default_params=[];
                        sp_params.default_params.push({name:"external_config_url", value:config_url, type:"public/string", label: "config_url"});
                        // sp_params.default_params.push({name:"external", value:"true", type:"private/string", label: "external"});


                        //hide submit/cancel buttons
                        //console.log(" iframe src="+ $("#dialog-form iframe").data("config-url"));
                        $("#dialog-form").parent().find('.ui-dialog-buttonpane').hide();

                        //make width and height auto
                        $("#dialog-form").dialog("option", "height", "auto");
                        $("#dialog-form").dialog("option", "width", "auto");
                    }

                    $("#dialog-form").dialog("option", "title", "Adding App '" + name + "' to Home Page");
                    $("#dialog-form").dialog("open");
                    $("#dialog-form").data("obj", $this);
                }
            });
        } else {

            ////////////////////////   actually add the app //////////////////////
            var params =
                    {
                        id: id,
                        widget_name: name,
                        widget_url: widget_url,
                        app_url: app_url,
                        app_args: app_args
                    };

            SideNav.executeAdd(params, $this);

        }
        return false;
    };

    o.handleDialogSubmit = function(event, b) {
        var obj = b.parents('.vzuui-nav-app-icon');

        $("#dialog-form").dialog("close");
        event.preventDefault();
        var id = obj.data("app-id");

        var widget_url = obj.data("widget-url");
        var app_url = obj.data("app-url");
        var app_args = obj.data("args");
        var external = obj.data("external");
        var name = obj.attr("title");

        var params =
                {
                    id: id,
                    widget_name: name,
                    widget_url: widget_url,
                    app_url: app_url,
                    app_args: app_args
                };

        var prop_params = [];

        $('#dialog-form form').find('input, select').each(function(index, object) {
            var $obj = $(object);
            prop_params.push({name: $obj.attr("name"), value: $obj.val(), type: $obj.data('type'), label: $obj.data('label')});
        });

        params.prop_params = JSON.stringify(prop_params);
        SideNav.executeAdd(params, b);

        return false;
    };

    o.executeAdd = function(params, src) {
        var obj = src.parents('.vzuui-nav-app-icon');
        var id = obj.data("app-id");
        var widget_url = obj.data("widget-url");
        var app_url = obj.data("app-url");
        var app_args = obj.data("args");
        var external = obj.data("external");
        var name = obj.attr("title");
        var pnotify_text = "App '" + name + "' Added to Home Page";

        if (widget_url.length <= 0) {
            pnotify_text = "Link '" + name + "' Added to My Links";
        }

        $.pnotify({
            title: (widget_url.length <= 0) ? 'Adding Link' : 'Adding App',
            text: pnotify_text,
            type: 'success',
            hide: true,
            styling: 'jqueryui'
        });

        var dash_frame = $('.vzuui-app-iframe[src*="/dash"]');

        if (dash_frame.size() === 1) {
            var dash_frame = dash_frame.get(0);
            dash_frame.contentWindow && dash_frame.contentWindow.Landing && dash_frame.contentWindow.Landing.executeAdd && dash_frame.contentWindow.Landing.executeAdd(params, src, true);
        } else {
            var link = $("#vzuui-main-menu ul li a[href*='/dash']");
            if (link.size() === 1) {
                HomeLinks.getIframe(link, function(id, url, iframe) {
                    iframe = iframe.get(0);
                    setTimeout(function() {
                        iframe.contentWindow && iframe.contentWindow.Landing && iframe.contentWindow.Landing.executeAdd && iframe.contentWindow.Landing.executeAdd(params, src, true);
                    }, 1000);
                });
            }
        }
        
    };

    o.handleNavigation = function(jo,fromRwd) {
        var p = jo.parent().parent().parent();
        var w = p.width();

        if (!SideNav.navOpen) {
            if(jo.attr("id")=="vzuui-nav-icon"){
                SideNav.navOpen = true;
               p.css({width: SideNav.navWidth});
                $("#vzuui-nav-icon").removeClass("vzuui-nav-side-arrow-next").addClass("vzuui-nav-side-arrow-prev");
                $("#vzuui-nav-icon").parent().parent().animate({
                    "padding-left": "" + (SideNav.navWidth - SideNav.navControlWidth) + "px"
                }, 500, 'easeInOutQuart');
                //$("#vzuui-nav-icon").parent().parent().css("padding-left", "" + (SideNav.navWidth - SideNav.navControlWidth) + "px");
                $("#vzuui-nav-content").css("display", "inline-block");
                $("#vzuui-nav-content").animate({
                    "left": "0px"
                }, 500, 'easeInOutQuart', function() {
                    $('#main-content-wrapper').css({
                        'padding-left': "" + (SideNav.navWidth - SideNav.navControlWidth) + "px"
                    });
                });
            }else{
                    SideNav.navOpen = true;
                   // p.css({width: SideNav.navWidth});
                    $("#vzuui-nav-icon-rwd").addClass("vzuui-nav-side-arrow-next-rwd-selected");
                    $("#vzuui-nav-icon-rwd").parent().parent().animate({
                    "padding-left": "" + (SideNav.navWidth - SideNav.navControlWidth) + "px"
                }, 500, 'easeInOutQuart');
                     $("#vzuui-nav-content").css("display", "inline-block");
                $("#vzuui-nav-content").animate({
                    "left": "0px"
                }, 500, 'easeInOutQuart', function() {
                    
                });
                       
            }
        }
        else {
            if(jo.attr("id")=="vzuui-nav-icon"){
                SideNav.navOpen = false;
                p.css({width: SideNav.navControlWidth});
                $("#vzuui-nav-icon").removeClass("vzuui-nav-side-arrow-prev").addClass("vzuui-nav-side-arrow-next");
                $("#vzuui-nav-icon").parent().parent().animate({
                    "padding-left": "0px"
                }, 500, 'easeInOutQuart');
                //$("#vzuui-nav-icon").parent().parent().css("padding-left", "0px");
                $("#vzuui-nav-content").animate({
                    "left": "-180px"
                }, 500, 'easeInOutQuart', function() {
                    $("#vzuui-nav-content").hide();
                    $('#main-content-wrapper').css({
                        'padding-left': "20px"
                    });
                });
            }else{

                SideNav.navOpen = false;
                //p.css({width: SideNav.navControlWidth});
                $("#vzuui-nav-icon-rwd").removeClass("vzuui-nav-side-arrow-next-rwd-selected");
                $("#vzuui-nav-icon-rwd").parent().parent().animate({
                    "padding-left": "0px"
                }, 500, 'easeInOutQuart');
                //$("#vzuui-nav-icon").parent().parent().css("padding-left", "0px");
                $("#vzuui-nav-content").animate({
                    "left": "-180px"
                }, 500, 'easeInOutQuart', function() {
                    $("#vzuui-nav-content").hide();
                    
                });
           
                
            }
        }
    };
    o.delApp = function(title, widget_url) {
        $.pnotify({
            title: 'Success',
            text: "App '" + title + "' Removed From Home Page",
            type: 'success',
            hide: true,
            styling: 'jqueryui'
        });
        var nav = $('.vzuui-nav-app-icon[data-widget-url="' + widget_url + '"]');
        var content = nav.find('.vzuui-nav-app-content');

        if (nav.data('app-single-instance') === true) {
            if (content.find('.vzuui-add-widget').size() === 0) {
                content.append($("<div style='display: none;' class='vzuui-add-widget-overlay'></div>"));
                content.append($("<span class='vzuui-add-widget vzuui-add-widget-enabled'></span>"));
            } else {
                content.find('.vzuui-add-widget-overlay').hide();
                content.find('.vzuui-add-widget').removeClass('vzuui-add-widget-disabled');
                content.find('.vzuui-add-widget').addClass('vzuui-add-widget-enabled');
            }
        } else {
            if (content.find('.vzuui-add-widget').size() === 0) {
                content.append($("<span class='vzuui-add-widget vzuui-add-widget-multi-instance'></span>"));
            }
        }
        content.find('.vzuui-add-widget-enabled, .vzuui-add-widget-multi-instance').click(SideNav.addApp);
    };
    return o;
}();

///////////////////////////////////////////////////////////////////////////////////
////////////////////////////// NOTIFICATIONS  /////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
Notifications = function() {
    var o = {};

    o.init = function() {
        setTimeout(Notifications.refreshNotificationCount, 5000); //slight delay to let DOM settle
        $('.vzuui-page-header .vzuui-search-container').hide().delay(1200).fadeIn();

        /******** Notification Overlay *************/
        $('.vzuui-header-alert-section').mouseenter(function() {
            if ($('.vzuui-alert-label').text() <= 0)
            {
                $(this).prop('title', 'You have no new tasks.');
            }
            else
            {
                $(this).prop('title', 'You have ' + $('.vzuui-alert-label').text() + ' new tasks.');
            }
        });
/*on click of notification icon*/
	isNotificationClickFirstTime=true;
	$(".vzuui-notification").click(function(){
		if($(".vzuui-alerts-notification-overlay-new, .accordion").is(":hidden")){
			       uuiAjax({
                    url: CONTEXT_PATH + "/uui/user/notifications",
                    dataType: 'json',
                    type: 'POST',
                    cache: false,
                    success: function(data) {
                        var list = (data && data.notifications) || [];
                        Notifications.notificationProcess(list);
                    }
                });
			$("#vzuui-tasks-menu").hide();
			$(".vzuui-alerts-notification-overlay-new, .accordion").show();
			w = window.innerWidth;
			if(w<640 && isNotificationClickFirstTime ){
				isNotificationClickFirstTime=false;

			}
			notificationposition=$(".vzuui-notification").position();
			$(".notificationborder").offset({left:notificationposition.left+8});
			$(".vzuui-favourites-overlay").hide();
			$('.vzuui-user-detail-info-new').hide();
			$(".vzuui-action-select-info").hide();
		}else{
			$(".vzuui-alerts-notification-overlay-new, .accordion").hide();
		}
		$(".vz-styled-select").removeClass("vz-active-mini");
		$(".vz-search").removeClass("vz-search-display");
		$(".vz-mini-menu").hide();
		$(".vzui-searchicon").removeClass("vzui-search-selected");

	});
	$(".vzuui-overlay-close").click(function(){
		   window.SessionTimer && SessionTimer.resetTimer();
		$(".vzuui-alerts-notification-overlay-new").hide();
	});
	$("#vzuui-system-notification").accordion({collapsible : true});		
	$(".vzuui-alerts-notification-overlay-new").hide();
	$('.vzuui-system-notification').accordion();
	$("#badge-notification, #ideas-notification").accordion({collapsible:true,active:false});
	
        $('.vzuui-header-alert-section .vzuui-alertdropdown-arrow ').click(function() {
            if ($('.vzuui-alerts-notification-overlay, .accordion').is(':hidden')) {
                uuiAjax({
                    url: CONTEXT_PATH + "/uui/user/notifications",
                    dataType: 'json',
                    type: 'POST',
                    cache: false,
                    success: function(data) {
                        var list = (data && data.notifications) || [];
                        Notifications.notificationProcess(list);
                    }
                });

                $('#vzuui-tasks-menu').hide();
                $('.vzuui-tasksdropdown-arrow').addClass('vzuui-tasksdropdown-arrow-dwn').removeClass('vzuui-tasksdropdown-arrow-up');
                $(this).addClass('vzuui-alertdropdown-arrow-up').removeClass('vzuui-alertdropdown-arrow-dwn');
                $('.vzuui-alerts-notification-overlay, .accordion').show();
            }
            else {
                $('.vzuui-alerts-notification-overlay, .accordion').hide();
                $(this).addClass('vzuui-alertdropdown-arrow-dwn').removeClass('vzuui-alertdropdown-arrow-up');
            }
        });

     /*   $('.vzuui-overlay-close').click(function() {
            window.SessionTimer && SessionTimer.resetTimer();
            $('.vzuui-alerts-notification-overlay').hide();
            $('.vzuui-alertdropdown-arrow').addClass('vzuui-alertdropdown-arrow-dwn').removeClass('vzuui-alertdropdown-arrow-up');
        });*/

        $('.vzuui-alerts-notification-overlay').hide();

        //Accordion Styles
        $('#vzuui-system-notification').accordion({collapsible: true});

    };

    o.refreshNotificationCount = function() {
        $('.vzuui-alert-label').text("?");
        uuiAjax({
            url: CONTEXT_PATH + "/uui/user/notifications",
            dataType: 'json',
            type: 'POST',
            cache: false,
            global: false,
            success: function(data) {
                var list = (data && data.notifications) || [];
                list = Notifications.unreadNotifications(list);
                $('.vzuui-alert-label').text(list.length);
                if (list.length >= 1) {
                    //$('.vzuui-header-alert-section').addClass('vzuui-alert-active').removeClass('vzuui-alert-default');
                    //$('.vzuui-alert-label').show().css('display', 'table');
                }
                else {
                    //$('.vzuui-header-alert-section').addClass('vzuui-alert-default').removeClass('vzuui-alert-active');
                    //$('.vzuui-alert-label').hide();
                }
            }
        });

        setTimeout(function() {
            Notifications.refreshNotificationCount();
        }, 300000); //five minutes
    };

    o.unreadNotifications = function(notifications) {
        var ignored_hash = {}, notification, i;
        var ignored_notifications = $.cookie('ignored-notifications') || "";
        ignored_notifications = ignored_notifications.split(',');

        //make a hash of ignored notifications
        for (i = 0; i < ignored_notifications.length; i++) {
            notification = ignored_notifications[i].trim();
            if (notification !== '') {
                ignored_hash[notification] = 1;
            }
        }

        //filter out notifications that the user has chosen
        //to ignore
        var new_list = [];
        for (i = notifications.length - 1; i >= 0; i--) {
            notification = notifications[i].NOTIFICATION_ID;
            if (!ignored_hash[notification]) {
                new_list.push(notifications[i]);
                ignored_hash[notification] = 3;
            } else {
                ignored_hash[notification] = 2;
            }
        }

        //trim notifications from cookie that have expired, this is to keep
        //the cookie from growing larger and larger
        ignored_notifications = "";
        for (var prop in ignored_hash) {
            if (ignored_hash.hasOwnProperty(prop)) {
                if (ignored_hash[prop] === 2) {
                    ignored_notifications += "," + prop;
                }
            }
        }
        $.cookie('ignored-notifications', ignored_notifications, {expires: 365});

        notifications = new_list;

        return notifications;
    };

    o.notificationProcess = function(notifications) {
        var ignored_hash = {}, notification, i;
        var ignored_notifications = $.cookie('ignored-notifications') || "";
        ignored_notifications = ignored_notifications.split(',');

        //make a hash of ignored notifications
        for (i = 0; i < ignored_notifications.length; i++) {
            notification = ignored_notifications[i].trim();
            if (notification !== '') {
                ignored_hash[notification] = 1;
            }
        }

        //filter out notifications that the user has chosen
        //to ignore
        var new_list = [];
        for (i = notifications.length - 1; i >= 0; i--) {
            notification = notifications[i].NOTIFICATION_ID;
            if (!ignored_hash[notification]) {
                new_list.push(notifications[i]);
                ignored_hash[notification] = 3;
            } else {
                ignored_hash[notification] = 2;
            }
        }

        //trim notifications from cookie that have expired, this is to keep
        //the cookie from growing larger and larger
        ignored_notifications = "";
        for (var prop in ignored_hash) {
            if (ignored_hash.hasOwnProperty(prop)) {
                if (ignored_hash[prop] === 2) {
                    ignored_notifications += "," + prop;
                }
            }
        }
        $.cookie('ignored-notifications', ignored_notifications, {expires: 365});

        notifications = new_list;

        //if length is 0 then bail
        if (notifications.length === 0)
            return;

        //now loop through notification list and create dialog
        var system_p = $('<p>'), user_p = $('<p>'), other_p = $('<p>'), div, span;
        for (i = 0; i < notifications.length; i++) {
            div = $('<div>');
            notification = notifications[i];
            div.attr("data-notification-id", notification.NOTIFICATION_ID);
            div.css({
                padding: "5px",
                'border-top': "1px solid black",
                position: 'relative'
            });
            if (notification.NOTIFICATION_LEVEL === 'APPLICATION') {
                div.append("<b>Notification from SYSTEM: </b>" + notification.MESSAGE);
            } else if (notification.NOTIFICATION_LEVEL === 'USER') {
                div.append("<b>Notification from " + notification.NOTIFICATION_BY_USER + ": </b>" + notification.MESSAGE);
            } else {
                div.append("<b>Notification </b>" + notification.MESSAGE);
            }

            span = $("<span class='ui-button-icon-primary ui-icon ui-icon-closethick' style='display:inline-block;position:absolute;top:3px;right:0px;cursor:pointer;'>");
            span.click(function() {
                var div = $(this).parent();
                var notification_id = div.data('notification-id');
                var ignored_notifications = $.cookie('ignored-notifications') || "";
                ignored_notifications += "," + notification_id;
                $.cookie('ignored-notifications', ignored_notifications, {expires: 365});
                div.remove();
                var current_count = $('.vzuui-alert-label').text();
                current_count = parseInt(current_count, 10);
                current_count = current_count - 1;
                $('.vzuui-alert-label').text(current_count);
                if (current_count < 1) {
                    //$('.vzuui-header-alert-section').addClass('vzuui-alert-default').removeClass('vzuui-alert-active');
                    //$('.vzuui-alert-label').hide();
                }
                Notifications.updateNotificationCounts();
                window.SessionTimer && SessionTimer.resetTimer();
            });
            div.append(span);
            if (notification.NOTIFICATION_LEVEL === 'APPLICATION') {
                system_p.append(div);
            } else if (notification.NOTIFICATION_LEVEL === 'USER') {
                user_p.append(div);
            } else {
                other_p.append(div);
            }

        }

        $('#vzuui-accordion-system-notificationBody').empty().append(system_p);
        $('#vzuui-accordion-user-notificationBody').empty().append(user_p);
        $('#vzuui-accordion-other-notificationBody').empty().append(other_p);
        Notifications.updateNotificationCounts();
    };

    o.updateNotificationCounts = function() {
        var system = $('#vzuui-accordion-system-notificationBody p').children().size();
        var user = $('#vzuui-accordion-user-notificationBody p').children().size();
        var other = $('#vzuui-accordion-other-notificationBody p').children().size();
        var notification = $('#vzuui-system-notification');

        notification.find('.system-notificaion-count').text(system);
        notification.find('.user-notificaion-count').text(user);
        notification.find('.other-notificaion-count').text(other);
    };

    return o;
}();

///////////////////////////////////////////////////////////////////////////////////
////////////////////////////// Mini Search ////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
MiniSearch = function() {
    var o = {};

    o.responseDtlMap = null;

    o.init = function()
    {
        uuiAjax({
            url: CONTEXT_PATH + "/uui/user/settings/SYSTEM/VZUUI.MINISEARCH",
            dataType: 'json',
            global: false,
            success: function(data) {
                var spec = data.spec;
                var combo = $('.vzuui-searchSelect');
                for (var i = 0; i < spec.length; i++) {
                    var option = $("<option>");
                    option.attr("value", spec[i].datasource);
                    option.attr("data-url", spec[i].targeturl);
                    option.attr("data-typeahead", spec[i].typeahead);
                    option.text(spec[i].label);
                    combo.append(option);
                }
		MiniSearch.setValtoSpan();
            }
        });

        $.widget("custom.vzuiiAutocomplete", $.ui.autocomplete, {
            _renderMenu: function(ul, items) {
                $(ul).css('z-index', "1050");
                var that = this;
                $.each(items, function(index, item) {
                    that._renderItemData(ul, item);
                });
                $(ul).find("li:odd").css("background", "#FAFAFF");
            },
            _renderItem: function(ul, item) {
                return $("<li>")
                        .attr("data-value", item.value)
                        .append($("<a>").text(item.label))
                        .appendTo(ul);
            }
        });

        $("#vzuui-searchbutton").click(function(){
            MiniSearch.doLaunchURL("");

        });
        $(".vzuui-advanced-search,.vzuui-advanced-search-rwd").click(function(){
            MiniSearch.doLaunchURL("");

        });

        $("#vzuui-order-search-input-rwd").vzuiiAutocomplete({
            source: MiniSearch.handleMiniOrderSearchAuto,
            select: MiniSearch.launchOrderManager,
            change: function(event, ui) {
                event.preventDefault();
                return false;
            },
            focus: function(event, ui) {
                var value = ui.item.label;
                $("#vzuui-order-search-input-rwd").val(value);
                event.preventDefault();
                return false;
            },
            response: function(event, ui) {
                //console.log(ui);
                if (o.returnKey) {
                    //console.log("return key pressed");
                    o.returnKey = false;
                    o.handleReturnKey();
                }
            },
            minLength: 3
        }).keydown(function(e) {
            //13 = Enter Key
            if (e.keyCode === 13) {
                o.returnKey = true;
                var typeahead = $(".vzuui-searchSelect :selected").data('typeahead');

                //if the current search backend doesn't support typeahead then launchURL
                if (!typeahead) {
                    MiniSearch.no_typeahead = true;
                    $("#vzuui-order-search-input-rwd").vzuiiAutocomplete("search");
                }
                else{
                    o.handleReturnKey();
                }
            } else {
                o.returnKey = false;
            }
        });
        $("#vzuui-order-search-input-new").vzuiiAutocomplete({
            source: MiniSearch.handleMiniOrderSearchAuto,
            select: MiniSearch.launchOrderManager,
            change: function(event, ui) {
                event.preventDefault();
                return false;
            },
            focus: function(event, ui) {
                var value = ui.item.label;
                $("#vzuui-order-search-input-new").val(value);
                event.preventDefault();
                return false;
            },
            response: function(event, ui) {
                //console.log(ui);
                if (o.returnKey) {
                    //console.log("return key pressed");
                    o.returnKey = false;
                    o.handleReturnKey();
                }
            },
            minLength: 3
        }).keydown(function(e) {
            //13 = Enter Key
            if (e.keyCode === 13) {
                o.returnKey = true;
                var typeahead = $(".vzuui-searchSelect :selected").data('typeahead');

                //if the current search backend doesn't support typeahead then launchURL
                if (!typeahead) {
                    MiniSearch.no_typeahead = true;
                    $("#vzuui-order-search-input-new").vzuiiAutocomplete("search");
                }
                else{
                    o.handleReturnKey();
                }
            } else {
                o.returnKey = false;
            }
        });

        //Had to put this in setTimeout to make sure it would initialize correctly
      /*  setTimeout(function() {
            $('#searchBackend').multiselect({
                multiple: false,
                selectedList: 1,
                minWidth: 136,
                height: 101
            }).multiselectfilter({label: '', placeholder: ''});
            if ($('ul.ui-multiselect-checkboxes').find('li').size() <= 5) {
                $('.ui-multiselect-hasfilter').hide();
            }
            else {
                $('div.ui-multiselect-filter').show();
            }

            if ($.browser.msie && $.browser.version === '9.0') {
                $('.ui-multiselect-filter input').css({'width': '99%', 'height': '27px'});
            }

            var options = $('.vzuui-searchSelect option');
            var checkbox = $('.ui-widget-content .ui-multiselect-checkboxes');
            for (var i = 0; i < options.length; i++) {
                checkbox.find('li').eq(i).find('input[type="radio"]').attr('value', options.eq(i).attr('value'));
                checkbox.find('li').eq(i).find('input[type="radio"]').attr('data-url', options.eq(i).attr('data-url'));
                checkbox.find('li').eq(i).find('input[type="radio"]').attr('data-typeahead', options.eq(i).attr('data-typeahead'));
                //option.text(spec[i].label);
                //combo.append(option);
            }

        }, 1200);*/
		MiniSearch.setSearchOnChange();
		MiniSearch.handleSearchClick();
	
    };
    
    o.handleMiniOrderSearchAuto = function(req, respfnc)
    {   //Hack to fix two separate dropdown
    	if($("#vzuui-search_bar").is(':visible')){
    		var backend = $("#vzuui-searchDropdownBox").val();  
        	var typeahead = $("#vzuui-searchDropdownBox :selected").data('typeahead');
    	}else{
    		var backend = $("#vzuui-searchDropdownBox-rwd").val();
    		var typeahead = $("#vzuui-searchDropdownBox-rwd :selected").data('typeahead');
    	}
       
        o.responseDtlMap = null;

        //if the current search backend doesn't support typeahead then bail
        if (!MiniSearch.no_typeahead && !typeahead) {
            return;
        }
        if (MiniSearch.no_typeahead)
            MiniSearch.no_typeahead = false;

        $("#vzuui-order-search-input-search").removeClass("icon-search");
        $("#vzuui-order-search-input-search").addClass("icon-load");
        MiniSearch.orderIdMap = null;
        uuiAjax({url: CONTEXT_PATH + "/mini/auto",
            type: "POST",
            data: {
                search_value: (req["term"]),
                backend: backend
            }
        }
        ).success(
                function(data) {
                    $("#vzuui-order-search-input-search").removeClass("icon-load");
                    $("#vzuui-order-search-input-search").addClass("icon-search");
                    var resultList = jQuery.parseJSON(data);
                    if (resultList === null)
                        return;

                    var keys = [];
                    for (var i = 0; i < resultList.length; i++) {
                        keys.push({
                            label: resultList[i].VALUE,
                            value: resultList[i].PARAM
                        });
                    }

                    o.responseDtlMap = keys;

                    if (resultList) {
                        respfnc(keys);
                    }
                    else {
                        respfnc({});
                    }
                }
        );
    };

    o.launchOrderManager = function(event, ui)
    {
        var value = ui.item.value;
        MiniSearch.doLaunchURL(value);
        event.preventDefault();
        return false;
    };

    o.doLaunchURL = function(params) {
        var target = "ordermanager";
        var url = $(".vzuui-searchSelect :selected").data('url');

        //determin if it's an internal or external link
        if (url.substring(0, 4) !== 'http' && url[0] !== '/') {
            url = CONTEXT_PATH + "/" + url;
        }

        url = url + params;

        var link = $("#vzuui-main-menu ul li a[href*='/pcgui/ordermanager']");

        $('#vzuui-main-menu ul li a').removeClass('active');
        $('a.vzuui-notification-display-new').removeClass('tfas-page-active');
        link.addClass('active');
        link.attr("href",url);

        /* $('.vzuui-app-iframe').css({
            display: 'none'
        });

            
        

        if (params.length === 0){
            HomeLinks.getIframe(link, function(id, url, iframe) {
                iframe.css({
                    display: "block"
                });

            });
        } else {

            HomeLinks.getIframe(link, function(id, url, iframe) {
                iframe.css({
                    display: "block"
                });
             iframe.attr("src",url);

            });
        }
*/



        $.launchApp({target: ""}, url, target);

    };
    o.setValtoSpan=function(){
    		if($("#vzuui-search_bar").css("display")!="none")
  				var textVal=$("#vzuui-searchDropdownBox :selected").text();
		  else
			  	var textVal=$("#vzuui-searchDropdownBox :selected").text();

    	if(textVal.length>11){
					textVal=textVal.slice(0,10)+"..."
					}
		$("#vzuui-nav-search-in-content-rwd").html(textVal);
		$("#vzuui-nav-search-in-content").html(textVal);
    };
	 o.setSearchOnChange=function(){
	    		$("#vzuui-searchDropdownBox").change(function(){
	    			var search_str=$("#vzuui-searchDropdownBox :selected").text();
					if(search_str.length>11){
						search_str=search_str.slice(0,10)+"..."
					}
					$("#vzuui-nav-search-in-content").text(search_str);
					$("#vzuui-searchDropdownBox").attr("title",search_str)
				});
				$("#vzuui-searchDropdownBox-rwd").change(function(){
	    			  var search_str=$("#vzuui-searchDropdownBox-rwd :selected").text();
			  		if(search_str.length>11){
						search_str=search_str.slice(0,10)+"..."
			  		}
			  		$("#vzuui-nav-search-in-content-rwd").text(search_str);
			  		$("#vzuui-searchDropdownBox-rwd").attr("title",search_str)
				});
			};
	o.handleSearchClick=function(){	
		 // On click of Search Icon
		$(".vzui-searchicon").click(function(){
			if($(this).hasClass("vzui-search-selected")){
				$(this).removeClass("vzui-search-selected");
			}else{
				$(this).addClass("vzui-search-selected");
			}
			$(".vz-mini-menu").hide();
			$(".vz-styled-select").removeClass("vz-active-mini");
			$(".vzuui-alerts-notification-overlay-new, .accordion").hide();
			$(".vz-search").toggleClass("vz-search-display");
		});
		 };

			
    o.handleReturnKey = function() {

        if ($.type(o.responseDtlMap) == "array" && o.responseDtlMap.length == 1) {

            o.doLaunchURL(o.responseDtlMap[0].value);

        }
    };

    return o;
}();

///////////////////////////////////////////////////////////////////////////////////
////////////////////////////// HOME LINKS /////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
HomeLinks = function() {
    var o = {};

    o.init = function() {
        //if vzuui-main-menu is not there then add it
        if ($('#vzuui-main-menu').size() === 0) {
            var container = $('<div>');
            container.attr('id', 'vzuui-main-menu');
            container.addClass('vzuui-main-menu-new');
            container.append($('<ul>'));
            $('.vzuui-logo').after(container);
        }

        var url = CONTEXT_PATH + "/uui/user/settings/POST/SYSTEM/VZUUI.Home.Links"
        if (window.isManager) {
            url += '.Supervisor';
        }
        if (window.isVzwUser) {
            url += '.VZW';
        }

        uuiAjax({
            url: url,
            dataType: 'json',
            type: 'POST',
            global: false,
            success: HomeLinks.homeLinksProcess
        });
    };

    o.homeLinksProcess = function(data) {
        var links = data.links;
        var ul = $('#vzuui-main-menu ul');
        ul.empty();
        for (var i = 0; i < links.length; i++) {
            var li = $("<li>");
            var a = $('<a>');
            if(links[i].external){
                a.attr("href", links[i].app_url);
            } else {
                a.attr("href", CONTEXT_PATH + links[i].app_url);
            }

            a.data('iframe_id', "page_" + i);
            if (links[i].lvl0_url) {
                a.html(links[i].label + "<span class='levelzerodata'></span>");
                a.data('lvl0_url', links[i].lvl0_url);
            } else {
                a.html(links[i].label);
            }

            if (links[i]["default"]) {
                a.addClass('active');
            }
            a.click(HomeLinks.handleClick);
            li.append(a);
            ul.append(li);
        }
        HomeLinks.updateLevelZeros();
        setTimeout(function() {
            $('#vzuui-main-menu ul li a.active').click();
        }, 100);
             
       // Setting RWD Links
        var ul2 = $('.vz-mini-menu ul');
        ul2.empty();       
        for (var i = 0; i < links.length; i++) {
            var li = $("<li>");
            var a = $('<a>');
            if(links[i].external){
                a.attr("href", links[i].app_url);
            } else {
                a.attr("href", CONTEXT_PATH + links[i].app_url);
            }

            a.data('iframe_id', "page_" + i);
            if (links[i].lvl0_url) {
                a.html(links[i].label + "<span class='levelzerodata'></span>");
                a.data('lvl0_url', links[i].lvl0_url);
            } else {
                a.html(links[i].label);
            }

            if (links[i]["default"]) {
                a.addClass('active');
            }
            a.click(HomeLinks.handleClick);
            li.append(a);
            ul2.append(li);
        }
        labelRwd="Welcome"+$(".vzzui-username").text();
        liLogout="<li>"+
        			"<a style='padding-bottom: 37px;padding-top: 8px;'>"+
        				"<div style='display:block'>"+
        					"<div class='vzuui-userImag'>"+
        						"<div class='vzuui-userInfo' style=''>"+
        							"<span class='vzzui-welcome'>"+labelRwd+"</span>"+
        						"</div>"+
        					"</div>"+        					
        					"<div id='logout_btn2' class='vzuui-mini-logout' onclick='$(window).unbind(\"beforeunload\"); window.location.href=\"/uigui/uui/logout\";'>"+		
        					"</div>"+
        				"</div>"+
        			"</a>"+
        		"</li>"	
        ul2.append(liLogout);
         //console.log("Done the menu adding");
        HomeLinks.updateLevelZeros();
        setTimeout(function() {
        	RWDFunctions.setClickForRwd();
            $('#vz-mini-menu ul li a.active').click();
        }, 100);
    
    };

    o.handleClick = function(evt) {
        window.SessionTimer && SessionTimer.resetTimer();
        $('#vzuui-main-menu ul li a').removeClass('active');
        $('a.vzuui-notification-display-new').removeClass('tfas-page-active');
        $(this).addClass('active');

        $('.vzuui-app-iframe').css({
            display: 'none'
        });
        HomeLinks.getIframe(this, function(id, url, iframe) {
            iframe.css({
                display: "block"
            });
        });

        return false;
    };

    o.getIframe = function(link, callback) {
        var url = $(link).attr("href");
        var id = $(link).data("iframe_id");
        var iframe = $("#" + id);
        if (iframe.size() === 0) {
            iframe = HomeLinks.addIframe(id, url, callback);
        } else {
            callback && callback(id, url, iframe);
        }
        return iframe;
    };

    o.addIframe = function(id, url, callback) {
        var container = $('#main-content');
        var html = "<div class='spinny'><span class='vzuui-progress-image'></span></div>";
        container.append(html);

        var iframe = $("<iframe>");
        iframe.addClass("vzuui-app-iframe");
        iframe.attr("src", url);
        iframe.attr("id", id);
//        iframe.css({
//            display: 'none'
//        });
        container.append(iframe);

        $(iframe).one('load', function() {
        	$('.vzuui-app-iframe').css({
                display: 'none'
            });
        	container.find(".spinny").remove();
            $('#vzuui-main-menu ul li a').removeClass('active');
        	var url=iframe.attr("src");
        	var alink= $("#vzuui-main-menu ul li a[href*='"+url+"']");
        	alink.addClass('active');
            iframe.show();
            callback && callback(id, url, iframe);
        });

        return iframe;
    };

    o.refreshLevelZeros = function() {
        $('.levelzerodata').each(function(index, obj) {
            var $obj = $(obj);
            var a = $obj.closest('a');
            uuiAjax({
                url: CONTEXT_PATH + a.data('lvl0_url'),
                global: false,
                success: function(data) {
                    $obj.empty();
                    $obj.html(data);
                }
            });
        });
    };

    o.updateLevelZeros = function() {
        HomeLinks.refreshLevelZeros();
        setTimeout(HomeLinks.updateLevelZeros, 300000);
    };

    return o;
}();

///////////////////////////////////////////////////////////////////////////////////
////////////////////////////// SESSION TIMER //////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
SessionTimer = function() {
    var o = {};

    o.duration = 60 * 60 * 1000; //60 minutes
    o.warning_time = 5 * 60 * 1000; //5 minutes
    o.minute = 60 * 1000;
    o.second = 1000;
    o.shownWarning = false;
    o.tickCallback = function() {
    };

    o.init = function(callback, duration) {
        if (duration) {
            o.duration = duration;
        }

        if (callback) {
            o.tickCallback = callback;
        }

        SessionTimer.setEndTime();
        setTimeout(SessionTimer.tick, 1000);

        //set all ajax request to call resetTimer, except those with global:false
        $(document).ajaxSend(function() {
            SessionTimer.resetTimer();
        });
    };

    o.setEndTime = function() {
        SessionTimer.end_time = (new Date()).getTime() + SessionTimer.duration;
    };

    o.resetTimer = function() {
        SessionTimer.setEndTime();
        SessionTimer.shownWarning = false;
    };

    o.tick = function() {
        SessionTimer.time_left = SessionTimer.end_time - (new Date()).getTime();
        if (!SessionTimer.shownWarning && SessionTimer.time_left < SessionTimer.warning_time) {
            SessionTimer.shownWarning = true;
            //SessionTimer.showWarningWindow();
        }

        if (SessionTimer.time_left > 0) {
            setTimeout(SessionTimer.tick, 1000);
        } else {
        	$(window).unbind('beforeunload');
            window.location.href = CONTEXT_PATH + "/uui/logout/loggedout";
        }
    };

    o.timeLeftString = function() {
        var minutes = Math.floor(SessionTimer.time_left / SessionTimer.minute);
        var seconds = Math.floor((SessionTimer.time_left % SessionTimer.minute) / 1000);
        if (minutes < 0)
            minutes = 0;
        if (seconds < 0)
            seconds = 0;

        if (minutes < 10) {
            minutes = "0" + minutes;
        }

        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        var ans = minutes + ":" + seconds;

        return ans;
    };

    o.topWindowBoundary = function()
    {
        // In Internet Explorer window.screenTop is the window's top boundry
        if (window.screenTop)
        {
            return window.screenTop;
        }

        // In Firefox window.screenY is the window's top boundry
        if (window.screenY)
            return window.screenY;

        return 0;
    };

    o.topScreenBoundry = function()
    {
        // Check if the window is off the primary monitor in a positive axis
        // X,Y                 S = Screen, W = Window
        // 0,0     ----------  
        //        |          | 
        //        |          | 
        //        |        S | 
        //         ----------  
        // X,Y             
        // 0,1280  ----------
        //        |  ---     |
        //        | | W |    |
        //        |  ---   S |
        //         ----------
        if (SessionTimer.topWindowBoundary() > window.screen.height)
        {
            return SessionTimer.topWindowBoundary() - (window.SessionTimer() - window.screen.height);
        }

        // Check if the window is off the primary monitor in a negative axis
        // X,Y                   S = Screen, W = Window
        // 0,-1024   ----------  
        //          |  ---     | 
        //          | | W |    | 
        //          |  ---   S | 
        //           ----------  
        // X,Y             
        // 0,0       ----------
        //          |          |
        //          |          |
        //          |        S |
        //           ----------
        // This only works in Firefox at the moment due to a bug in Internet Explorer opening new windows into a negative axis
        // However, you can move opened windows into a negative axis as a workaround
        if (SessionTimer.topWindowBoundary() < 0 && SessionTimer.topWindowBoundary() > (window.screen.height * -1))
        {
            return (window.screen.height * -1);
        }

        // If neither of the above, the monitor is on the primary monitor whose's screen Y should be 0
        return 0;
    };

    o.leftWindowBoundry = function()
    {
        // In Internet Explorer window.screenLeft is the window's left boundry
        if (window.screenLeft)
        {
            return window.screenLeft;
        }

        // In Firefox window.screenX is the window's left boundry
        if (window.screenX)
            return window.screenX;

        return 0;
    };

    o.leftScreenBoundry = function()
    {
        // Check if the window is off the primary monitor in a positive axis
        // X,Y                  X,Y                    S = Screen, W = Window
        // 0,0  ----------   1280,0  ----------
        //     |          |         |  ---     |
        //     |          |         | | W |    |
        //     |        S |         |  ---   S |
        //      ----------           ----------
        if (SessionTimer.leftWindowBoundry() > window.screen.width)
        {
            return SessionTimer.leftWindowBoundry() - (SessionTimer.leftWindowBoundry() - window.screen.width);
        }

        // Check if the window is off the primary monitor in a negative axis
        // X,Y                  X,Y                    S = Screen, W = Window
        // 0,0  ----------  -1280,0  ----------
        //     |          |         |  ---     |
        //     |          |         | | W |    |
        //     |        S |         |  ---   S |
        //      ----------           ----------
        // This only works in Firefox at the moment due to a bug in Internet Explorer opening new windows into a negative axis
        // However, you can move opened windows into a negative axis as a workaround
        if (SessionTimer.leftWindowBoundry() < 0 && SessionTimer.leftWindowBoundry() > (window.screen.width * -1))
        {
            return (window.screen.width * -1);
        }

        // If neither of the above, the monitor is on the primary monitor whose's screen X should be 0
        return 0;
    };

    o.showWarningWindow = function() {
        var width = 300;
        var height = 200;
        var left = SessionTimer.leftScreenBoundry() + (screen.width / 2) - (width / 2);
        var top = SessionTimer.topScreenBoundry() + (screen.height / 2) - (height / 2);
        window.open(CONTEXT_PATH + "/uui/logout/warning", "_blank", "location=no,menubar=no,toolbar=no,status=no,resizeable=no,height=" + height + ",width=" + width + ",top=" + top + ",left=" + left);
    };

    return o;
}();

///////////////////////////////////////////////////////////////////////////////////
//////////////////////////////TFAS Notification /////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
TfasNotification = function() {
    var o = {};

    o.init = function() {
        var url = CONTEXT_PATH + "/tasks/getTfasNotification"

        uuiAjax({
            url: url,
            dataType: 'json',
            global: false,
            success: TfasNotification.tfasNotificationProcess
        });
    };

    o.tfasNotificationProcess = function(data) {

        if (data && data.app_url && (data.skillsetExist == 'true' || data.skillsetExist == true)) {

            if ($("div.vzuui-search-container div.vzuui-task-info-new").size() === 0) {
                var container = $('<div>');
                container.attr('id', 'vzuui-task-info-new');
                container.addClass('vzuui-task-info-new');
                container.css('float', 'left');
                container.css('margin-top', '-11px');
                container.append($('<ul>'));
                $("div.vzuui-search-container").prepend(container);
            }

            var li = $("<li>");
            var a = $('<a class="vzuui-borderLess vzuui-notification-display-new" style="position: relative;padding-bottom: 18px;top: 1px;"></a>');
            a.attr("href", CONTEXT_PATH + data.app_url);
            a.data('iframe_id', "page_999");
            a.data('widget_url', data.widget_url);

            a.html('<span class="vzuui-tfas-image-new" style="margin-left:-9px"></span><div class="vzuui-tfas-text"><div class="tfasLevel0"></div></div>');

            a.click(TfasNotification.doLaunchURL);
            li.prepend(a);

            //$("div.vzuui-search-container div.vzuui-task-info-new ul").append(li);
			$("div.vzuui-task-info-new ul").prepend(li);

            o.restarttimer = data.restarttimer;
            o.appurl = data.app_url;
            TfasNotification.updateLevelZeros();
        }

    };

    o.handleClick = function(evt) {
        window.SessionTimer && SessionTimer.resetTimer();

        $('#vzuui-main-menu ul li a').removeClass('active');

        $('a.vzuui-notification-display-new').addClass('tfas-page-active');

        $('.vzuui-app-iframe').css({
            display: 'none'
        });

        TfasNotification.getIframe(this, function(id, url, iframe) {
            iframe.css({
                display: "block"
            });
        });

        return false;
    };
    
    o.doLaunchURL = function() {
    	
    	$('a.vzuui-notification-display-new').addClass('tfas-task-present');
    	
    	$.launchApp({target: null}, CONTEXT_PATH + TfasNotification.appurl);
    	return false;

    };

    o.getIframe = function(link, callback) {
        var url = $(link).attr("href");
        var id = $(link).data("iframe_id");
        var iframe = TfasNotification.addIframe(id, url, callback);

        return iframe;
    };

    o.addIframe = function(id, url, callback) {
        var container = $('#main-content');
        var html = "<div class='spinny'><span class='vzuui-progress-image'></span></div>";
        container.append(html);

        var iframe = $("<iframe>");
        iframe.addClass("vzuui-app-iframe");
        iframe.attr("src", url);
        iframe.attr("id", id);
        container.append(iframe);

        $(iframe).one('load', function() {
            container.find(".spinny").remove();
            iframe.show();
            callback && callback(id, url, iframe);
        });

        return iframe;
    };

    o.refreshLevelZeros = function() {

        var $tfasLevel0 = $(".tfasLevel0");

        var a = $tfasLevel0.closest('a');

        //if we have a url then try and call it
        if (a.data('widget_url')) {
            uuiAjax({
                url: CONTEXT_PATH + a.data('widget_url'),
                global: false,
                success: function(data) {
                    $tfasLevel0.empty();
                    $tfasLevel0.html(data);

                    if (!a.hasClass('tfas-page-active')) {

                        if (data == "0") {
                            a.removeClass('tfas-task-present');
                            a.unbind('click');
                            a.click(function(){return false;});
                        }
                        else {
                            a.addClass('tfas-task-present');
                            a.unbind('click');
                            a.click(TfasNotification.doLaunchURL);
                        }
                    }
                }
            });
        }
    };

    o.updateLevelZeros = function() {
        TfasNotification.refreshLevelZeros();
        setTimeout(TfasNotification.updateLevelZeros, TfasNotification.restarttimer);
    };

    return o;
}();

// RWD Function Changes

RWDFunctions=function(){	
    var o = {};
    o.init=function(){  	
    	RWDFunctions.setIframeHeightAndWidth();
    	window.onresize = function(event) {
    		RWDFunctions.setIframeHeightAndWidth();
    	}
    	RWDFunctions.handleHamburgerClick();
    } 
   // On click of Hamburger Icon  for RWD
    o.handleHamburgerClick=function(){
	    $(".vz-styled-select").click(function(){
			$(".vzuui-alerts-notification-overlay-new, .accordion").hide();
			$(".vz-search").removeClass("vz-search-display");
			$(".vzui-searchicon").removeClass("vzui-search-selected");
			if($(this).hasClass("vz-active-mini")){
				$(this).removeClass("vz-active-mini");
				$(".vz-mini-menu").hide();
			}else{
			 	$(this).removeClass("vz-active-mini");    
			 	$(this).addClass("vz-active-mini");
			 	$(".vz-mini-menu").show();
			}
		});
    };

    o.setClickForRwd=function(){
    	$(".vz-mini-menu ul li a").click(function(){
  		  $(".vz-mini-menu").hide();
  		  $(".vz-styled-select").removeClass("vz-active-mini");
  		  
  		});
  	}
	o.setIframeHeightAndWidth=function(){
	  	height=$(window).height();
        width=$(window).width();
        heightOffset=80;
        widthOffset=20;
	  	$("#main-content").css("padding-bottom",(height-heightOffset));
       // $("#main-content iframe").css("width",(width-widthOffset));
	 }
  return o;
}();

///////////////////////////////////////////////////////////////////////////////////
//////////////////////////// Initialize the Page //////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
$(Page.init);
