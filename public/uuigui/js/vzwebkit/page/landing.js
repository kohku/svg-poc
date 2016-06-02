var	taskByNameGlobal = null;	
Landing = { 
    init: function() {
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


        //for side nav
        $('#vzuui-accordion-wrapper').accordion();
        $('.vzuui-add-widget-enabled, .vzuui-add-widget-multi-instance').click(Landing.addApp);
        $('.vzuui-add-widget-overlay').hide();

        $(".vzuui-app-icon").each(function(index, obj) {
            var external = $(obj).data('external');
            var widget_url = $(obj).data('widget-url');
            if (!external) {
                widget_url = CONTEXT_PATH + widget_url;
            }
            Landing.createWidget(obj, widget_url);
            Landing.initWidget(obj);
        });

        vzuui.messenger.register("LEVEL_ONE_FILTER_EVENT", function(e) {
            var appIcon = $("#" + e.frame_id);
            taskByNameGlobal = e.task_by;
            if (Dash.isLevelFiveActivated()) {
                Dash.unselectLevelOnes();
                Dash.activateLevelFive(appIcon);
                
                var external = appIcon.data('external');
                var app_url = appIcon.data('app-url');
                if (!external) {
                	app_url = CONTEXT_PATH + app_url;
                }
                
                Landing.tryMakeWidgetL5(app_url, appIcon);
            }
        });

        $.ajax({
            url: CONTEXT_PATH + "/uui/user/settings/SYSTEM/VZUUI.MINISEARCH",
            dataType: 'json',
            success: function(data) {
                var spec = data.spec;
                var combo = $('#searchBackend');
                for (var i = 0; i < spec.length; i++) {
                    var option = $("<option>");
                    option.attr("value", spec[i].datasource);
                    option.attr("data-url", spec[i].targeturl);
                    option.attr("data-typeahead", spec[i].typeahead);
                    option.text(spec[i].label);
                    combo.append(option);
                }
            }
        });
        Landing.initMiniOrderSearch();
        setTimeout(Landing.refreshNotificationCount, 5000);
                
        if (window.parent && window.parent.name === 'pchome') {
            Landing.IFramed = true;
        }
    },
    ///////////////////////////////////////////////////////////////////
    refreshNotificationCount: function() {
        $('.vzuui-alert-label').text("?");
        $.ajax({
            url: CONTEXT_PATH + "/uui/user/notifications",
            dataType: 'json',
            type: 'POST',
            cache: false,
            success: function(data) {
                var list = (data && data.notifications) || [];
                list = Landing.unreadNotifications(list);
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
            Landing.refreshNotificationCount();
        }, 300000); //five minutes
    },
    unreadNotifications: function(notifications) {
        var ignored_hash = {}, notification, i;
        var ignored_notifications = $.cookie('ignored-notifications') || "";
        ignored_notifications = ignored_notifications.split(',');

        //make a hash of ignored notifications
        for (i = 0; i < ignored_notifications.length; i++) {
            notification = ignored_notifications[i].trim();
            if (notification != '') {
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
                if (ignored_hash[prop] == 2) {
                    ignored_notifications += "," + prop;
                }
            }
        }
        $.cookie('ignored-notifications', ignored_notifications, {expires: 365});

        notifications = new_list;

        return notifications;
    },
    notificationProcess: function(notifications) {
        var ignored_hash = {}, notification, i;
        var ignored_notifications = $.cookie('ignored-notifications') || "";
        ignored_notifications = ignored_notifications.split(',');

        //make a hash of ignored notifications
        for (i = 0; i < ignored_notifications.length; i++) {
            notification = ignored_notifications[i].trim();
            if (notification != '') {
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
                if (ignored_hash[prop] == 2) {
                    ignored_notifications += "," + prop;
                }
            }
        }
        $.cookie('ignored-notifications', ignored_notifications, {expires: 365});

        notifications = new_list;

        //if length is 0 then bail
        if (notifications.length == 0)
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
            if (notification.NOTIFICATION_LEVEL == 'APPLICATION') {
                div.append("<b>Notification from SYSTEM: </b>" + notification.MESSAGE);
            } else if (notification.NOTIFICATION_LEVEL == 'USER') {
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
                Landing.updateNotificationCounts();
            });
            div.append(span);
            if (notification.NOTIFICATION_LEVEL == 'APPLICATION') {
                system_p.append(div);
            } else if (notification.NOTIFICATION_LEVEL == 'USER') {
                user_p.append(div);
            } else {
                other_p.append(div);
            }

        }

        $('#vzuui-accordion-system-notificationBody').empty().append(system_p);
        $('#vzuui-accordion-user-notificationBody').empty().append(user_p);
        $('#vzuui-accordion-other-notificationBody').empty().append(other_p);
        Landing.updateNotificationCounts();
    },
    updateNotificationCounts: function() {
        var system = $('#vzuui-accordion-system-notificationBody p').children().size();
        var user = $('#vzuui-accordion-user-notificationBody p').children().size();
        var other = $('#vzuui-accordion-other-notificationBody p').children().size();
        var notification = $('#vzuui-system-notification');

        notification.find('.system-notificaion-count').text(system);
        notification.find('.user-notificaion-count').text(user);
        notification.find('.other-notificaion-count').text(other);
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////

    updateAllAppSettings: function(ids, xs, ys, ws, hs) {
        //console.log(" -update all app settings..id="+ids+" x="+xs+" y="+ys+" w="+ws+" h="+hs);


        var params = [];
        for (var i = 0; i < ids.length; ++i) {
            params.push({name: "id", value: ids[i]});
            params.push({name: "x", value: xs[i]});
            params.push({name: "y", value: ys[i]});
            params.push({name: "w", value: ws[i]});
            params.push({name: "h", value: hs[i]});
        }

        $.ajax({
            url: CONTEXT_PATH + "/update/all",
            type: "POST",
            data: params,
            success: function(result, textStatus) {
                //console.log(result);
            }
        });
    },
    tryMakeWidgetL5: function(app_url, obj) {
        var other_args = "frame_id=" + $(obj).attr("id") + "&";
        if (debug === "true") {
            other_args += "debug=true&";
        }

        var cont = $(obj);
        var f = cont.getFrame("#level_one_" + cont.attr("id"));
        var fk = false;
        try {
            fk = f.level_one_key;
        } catch (e) {
            fk = false;
        }

        if (fk && fk != "none") {
            other_args += "filter=" + fk + "&";
        }
        
        if(taskByNameGlobal != null && taskByNameGlobal != ""){
        	other_args += "taskByName=" + taskByNameGlobal + "&";
        }
        if (app_url == null || app_url == CONTEXT_PATH || app_url == "") {
            return;
        }
        var query_params = other_args + Landing.parseAppArgs({level: "2"}, obj);
        if (app_url.indexOf('?') != -1) {
            query_params = "&" + query_params;
        } else {
            query_params = "?" + query_params;
        }

        var c = $(".vzuui-widget-app-content");
        var html = "<div class='spinny' style='text-align:center;padding-top:100px;' ><span class='vzuui-progress-image'></span></div>";
        c.html(html);
        var title = obj.attr('title');
        html = '<div class="vzuui-app-icon-title-bar-l5">' + title;
        html += '<a class="refresh" href="#" title="Refresh"><span title=""></span></a>';
        html += '<a class="delete" href="#" title="Delete Widget"><span title=""></span></a>';
        html += '</div>';
        html += '<iframe frameBorder="0" class="vzuui-app-level5-iframe"  src="' + app_url + query_params + '"></iframe>';

        var iframe = $(html);
        iframe.hide();
        c.append(iframe);

        $(iframe).one('load', function() {
            c.find(".spinny").remove();
            iframe.show();
        });

        iframe.find(".refresh").click(function(event) {
            var obj = $(this);
            var html2 = "<div style='text-align:center;padding-top:50px;' ><span class='vzuui-progress-image'></span></div>";
            var iframe = obj.parent().parent().find(".vzuui-app-level5-iframe")[0];
            var body = $(".vzuui-app-level5-iframe").contents().find("body");
            var isTeamFrame = false;
            var isFliptable = false;
            if(body.find(".fliptaskdata").length > 0) isTeamFrame = true; 
            if(body.find(".fliptaskdata").hasClass("fliptable")) isFliptable=true;
            body.html(html2);
            if (iframe) {
            	
            	if  (isTeamFrame){

            		   if  (isFliptable){
            			     iframe.src = iframe.src.indexOf("&isTlist=true") != -1 ? iframe.src : iframe.src+"&isTlist=true";            		          
            		     } else  {            		   
            			     iframe.src = iframe.src.indexOf("&isTlist=true") != -1 ?(iframe.src.replace("&isTlist=true","")) : iframe.src;        		       	  
                           }
            		}
            	
            	else
            	
                iframe.src = iframe.src;
            }
        });

        iframe.find(".delete").click(Dash.deactivateLevelFive);
    },
    tryMakeWidget: function(widget_url, obj) {
        var other_args = "frame_id=" + $(obj).attr("id") + "&";
        if (debug === "true") {
            other_args += "debug=true&";
        }

        if (widget_url == null || widget_url == CONTEXT_PATH || widget_url == "") {
            return;
        }
        var query_params = other_args + Landing.parseAppArgs({level: "1"}, obj);
        if (widget_url.indexOf('?') != -1) {
            query_params = "&" + query_params;
        } else {
            query_params = "?" + query_params;
        }

        var html = "<div class='spinny' style='text-align:center;padding-top:80px;' ><span class='vzuui-progress-image'></span></div>";
        var c = obj.find(".vzuui-app-content");
        c.html(html);

        var data = " data-app-icon-id='" + $(obj).attr("id") + "'";
        html = '<iframe id="level_one_' + $(obj).attr("id") + '" frameBorder="0" ' + data + ' class="vzuui-app-iframe" scrolling="no" src="' + widget_url + query_params + '"></iframe>';
        var iframe = $(html);
        iframe.hide();
        c.append(iframe);

        $(iframe).one('load', function() {
            c.find(".spinny").remove();
            iframe.show();
        });
    },
    parseAppArgs: function(params, obj) {
        var args = obj.data('app-args');

        if (args === '')
            return $.param(params);

        args = args.split(",");
        //starts at 1 because args starts with a comma --so no first pair
        for (var i = 0; i < args.length; i++) {
            var pairs = args[i].split(':');
            params[pairs[0]] = pairs[1];
        }


        return $.param(params);
    },
    /////////////////////////////////////////////////////////////////////////        

    createWidget: function(jo, url) {
        var $obj = $(jo);
        Landing.tryMakeWidget(url, $obj);
    },
    initWidget: function(obj) {
        var jo = $(obj);        
        jo.find(" a.delete").click(function(evt) {
            evt.preventDefault();
            var appIcon = $(this).parents('.vzuui-app-icon'), id = appIcon.data('app-id');
            Landing.temp_app_title = appIcon.attr('title');
            //console.log(" deleting id="+id+"  title="+Landing.temp_app_title);
            $("#dialog-confirm").dialog({
                title: "Remove '" + Landing.temp_app_title + "' From Home Page?",
                resizable: false,
                height: 180,
                modal: true,
                buttons: {
                    "Remove App": function() {
                        $.ajax({
                            url: CONTEXT_PATH + "/uui/applications/delete",
                            type: "POST",
                            data: {
                                id: id
                            },
                            success: function(result, textStatus) {
                                $("#dialog-confirm").dialog("close");
                                Dash.remove(appIcon);
                                Dash.layout();
                                appIcon.remove();
                                if (Landing.IFramed) {
                                    window.parent && window.parent.SideNav && window.parent.SideNav.delApp && window.parent.SideNav.delApp(Landing.temp_app_title,jo.data('widget-url'));
                                } else {
                                    $.pnotify({
                                        title: 'Success',
                                        text: "App '" + Landing.temp_app_title + "' Removed From Home Page",
                                        type: 'success',
                                        hide: true,
                                        styling: 'jqueryui'
                                    });
                                }


                                var mi = $('.vzuui-nav-app-content div a:contains(' + Landing.temp_app_title + ')')
                                        .parent().parent().find('.vzuui-add-widget');

                                if (mi.hasClass('vzuui-add-widget-multi-instance')) {
                                    mi.removeClass('vzuui-add-widget-disabled');
                                }
                                else {
                                    mi.removeClass('vzuui-add-widget-disabled').addClass('vzuui-add-widget-enabled');
                                }

                                $('.vzuui-nav-app-content div a:contains(' + Landing.temp_app_title + ')')
                                        .parent().parent().find('.vzuui-add-widget-overlay').hide();

                            }
                        });
                    },
                    Cancel: function() {
                        $(this).dialog("close");
                    }
                }
            });

            return false;
        });

        jo.find(" a.widget-editable").click(Landing.handleEdit);
        jo.find(" a.level2").click(Landing.handleDoubleClick);
        jo.find(" a.flip").click(Landing.handleFlip);
        jo.find(" a.maximize").click(Landing.handleMaximize);
    },
    
    handleEdit: function(event) {
        event.preventDefault();

        var $this = $(this);

        if ($this.data("loading") == "true") {
            return;
        }
        $this.css("opacity", ".5");
        $this.data("loading", "true");
        var obj = $this.parents('.vzuui-app-icon');

        var id = obj.data("app-id");

        var widget_url = obj.data("widget-url");
        var app_url = obj.data("app-url");
        var app_args = obj.data("app-args");
        var external = obj.data("external");
        var name = obj.attr("title");
//console.log(" handle edit-"+app_args);
        
        vzuui.messenger.unregister("SERVICE_PROVIDER_CONFIG_CLOSE");
        vzuui.messenger.register("SERVICE_PROVIDER_CONFIG_CLOSE", function(e) {
            $("#dialog-form").dialog("close");
        });
        
        vzuui.messenger.post("SET_APP_CONFIG",{id:id,widget_url:widget_url,app_url:app_url,name:name,app_args:app_args});
//console.log(" after edit");
        ///////////////// determine app params ////////////////////////
        if (app_args.length > 0) {


            $.ajax({
                url: CONTEXT_PATH + "/dialog",
                type: "POST",
                data: {
                    id: id,
                    args:app_args
                }
            }).done(function(result, textStatus) {
                //console.log(" result  text status="+textStatus);
                if (textStatus == 'success') {
                    $("#dialog-form form").remove();
                    $("#dialog-form iframe").remove();
                    $("#dialog-form").html(result);
                    //console.log("set the html");
                    if (result.indexOf("external_config_url") === -1) {
                        $("#dialog-form select").multiselect({
                            multiple: false,
                            header: false,
                            selectedList: 1,
                            click: function(event, ui) {
                                //console.log(" multiselect click");
                            }
                        });
                        $("#dialog-form").dialog("option", "title", "Modify App '" + name + "'");
                        $("#dialog-form").dialog("open");
                        $('.date-picker').datepicker();
                        $("#dialog-form").data("obj", $this);

                        $('#dialog-form form').submit(function(event) {
                            Landing.handleModifySubmit(event, obj);
                        });
                    }
                    else{
                        //this is the external_config_url case
                        //hide submit/cancel buttons
                        $("#dialog-form").parent().find('.ui-dialog-buttonpane').hide();
                        
                        //make width and height auto
                        $("#dialog-form").dialog("option", "height", "auto");
                        $("#dialog-form").dialog("option", "width", "auto");
                    }
                }
                
                $("#dialog-form").dialog("option", "title", "Modifying App '" + name + "' to Home Page");
                $("#dialog-form").dialog("open");
                $("#dialog-form").data("obj", $this);
            });
            return false;
        }
    },
    handleFlipComplete: function() {
        $(this).css("transform", "");
        $(this).css("-ms-filter", "progid:DXImageTransform.Microsoft.dropshadow(OffX=2,OffY=3,Color=#1a000000,Positive=true)");
        $(this).css("filter", "progid:DXImageTransform.Microsoft.dropshadow(OffX=2,OffY=3,Color=#1a000000,Positive=true)");
    },
    handleFlip: function(event) {
        event.preventDefault();
        var $this = $(this);

        var cont = $this.parent().parent();
        var f = $this.getFrame("#level_one_" + cont.attr("id"));
        var fk = f.level_one_key;
        var flipped = cont.data("flipped");

        cont.css("-ms-filter", "");
        cont.css("filter", "");

        if (flipped == "false" || !flipped) {
            cont.data("flipped", "true");
            /* if(!$.browser.msie)*/{
                cont.rotate3Di(180, 300, {complete: Landing.handleFlipComplete});
            }
        }
        else {
            cont.data("flipped", "false");
            /*if(!$.browser.msie)*/{
                cont.rotate3Di(0, 300, {complete: Landing.handleFlipComplete});
            }
        }

        var c = cont.find(".vzuui-app-content");
        var f = cont.find(".vzuui-flip-content");
        if (c.css("display") != "none") {
            //do flip
            f.show();
            c.hide();
        }
        else {
            //flip back to original content
            c.show();
            f.hide();
        }
        // }});
        var oargs = "";
        if (fk && fk != "none") {
            oargs = "filter=" + fk;
        }
        Landing.getFlipContent(cont, oargs);
    },
    getFlipContent2: function(obj, params) {
        obj = $(obj);
        var url = obj.data("flip-url");
        var p = "";
        if (params) {
            p = "&" + params + "&";
        }
        var query_params = "?" + p + Landing.parseAppArgs({level: "1.5"}, obj);
        var c = obj.find(".vzuui-flip-content");
        var html = '<iframe frameBorder="0" class="vzuui-app-iframe" scrolling="no" src="' + CONTEXT_PATH + url + query_params + '"></iframe>';
        try {
            c.html(html);
        } catch (e) {
        }
        ;
    },
    getFlipContent: function(obj, params) {


        obj = $(obj);
        var url = obj.data("flip-url");
        var p = "";
        if (params) {
            p = "&" + params + "&";
        }
        var query_params = "?" + p + Landing.parseAppArgs({level: "1.5"}, obj);

        var spinny = obj.find("#vzuui-flip-content-spinny");
        var fr = obj.find("#vzuui-flip-content-frame");
        spinny.show();
        fr.hide();
        fr.attr("src", CONTEXT_PATH + url + query_params);

        $(fr).one('load', function() {
            // console.log(" done loading");
            spinny.hide();
            fr.show();
        });
    },
    //////////////////////////////////////////////////////////////////////////////////////


    handleDialogSubmit: function(event, b) {
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
        Landing.executeAdd(params, b);

        return false;
    },
    executeAdd: function(params, src, silent) {
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

        if (!silent) {
            $.pnotify({
                title: 'Adding App',
                text: pnotify_text,
                type: 'success',
                hide: true,
                styling: 'jqueryui'
            });
        }

        $.ajax({
            url: CONTEXT_PATH + "/add",
            type: "POST",
            data: params,
            success: function(data) {
                var widget = $(data);

                //if we are adding a link, which is a widget with no widget_url
                //then skip adding it to home page
                if (!widget.data('widget-url') || widget.data('widget-url').length <= 0) {
                    var mylinkiframe = $(".vzuui-app-iframe[src*=mylinkwidget]").get(0);
                    if (mylinkiframe) {
                        mylinkiframe.contentWindow.location.reload();
                    } else {
                        setTimeout(function() {
                            $('.vzuui-nav-app-icon[data-widget-url="/uui/mylinkwidget"]').find('.vzuui-add-widget-enabled').click();
                        }, 100);
                    }
                    src.data("loading", "false");
                    return;
                }

                $('.vzuui-app-container').append(widget);
                Dash.add(widget);
                Dash.layout();

                var $obj = widget;
                //var widget_url = CONTEXT_PATH + $obj.data('widget-url'); 
                var external = $obj.data('external');
                var widget_url = $obj.data('widget-url');
                if (!external) {
                    widget_url = CONTEXT_PATH + widget_url;
                }

                Landing.createWidget($obj, widget_url);
                Landing.initWidget($obj);
                src.css("opacity", "1.0");
                src.data("loading", "false");

                Dash.updateAll();
            },
            fail: function(data) {
                src.css("opacity", "1.0");
                src.data("loading", "false");
            }

        });
        if (src.hasClass('vzuui-add-widget-enabled') && !(src.hasClass('vzuui-add-widget-multi-instance'))) {
            src.addClass('vzuui-add-widget-disabled').removeClass('vzuui-add-widget-enabled');
            src.parent().find('.vzuui-add-widget-overlay').show();
        }
    },
    
    handleModifyExternal:function(params){
 
         $("#dialog-form").dialog("close");
        //event.preventDefault();
        
        var name = params.name;

        $.pnotify({
            title: 'Modifying App',
            text: "App '" + name + "' Modified.",
            type: 'success',
            hide: true,
            styling: 'jqueryui'
        });

        $.ajax({
            url: CONTEXT_PATH + "/modify",
            type: "POST",
            data: params,
            success: function(data) {
                window.location.reload();
            },
            fail: function(data) {

            }

        });


        return false;
        
    },
    
    
    
    handleModifySubmit: function(event, obj) {
        $("#dialog-form").dialog("close");
        event.preventDefault();
        var id = obj.data("app-id");

/*
"id") int id,
            @FormParam("widget_name") String name,
            @FormParam("widget_url") String widget_url,
            @FormParam("app_url") String app_url,
*/
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

        var name = obj.attr("title");

        $.pnotify({
            title: 'Modifying App',
            text: "App '" + name + "' Modified.",
            type: 'success',
            hide: true,
            styling: 'jqueryui'
        });

        $.ajax({
            url: CONTEXT_PATH + "/modify",
            type: "POST",
            data: params,
            success: function(data) {
                window.location.reload();
            },
            fail: function(data) {

            }

        });


        return false;
    },
    addApp: function(event) {
        event.preventDefault();

        var $this = $(this);

        if ($this.data("loading") == "true") {
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

        ///////////////// determine app params ////////////////////////
        if (app_args.length > 0) {


            $.ajax({
                url: CONTEXT_PATH + "/dialog",
                type: "POST",
                data: {
                    id: id
                }
            }).done(function(result, textStatus) {
                if (textStatus == 'success') {

                    $("#dialog-form form").remove();
                    $("#dialog-form").html(result);
                    $("#dialog-form select").multiselect({
                        multiple: false,
                        header: false,
                        selectedList: 1,
                        click: function(event, ui) {
                            //console.log(" multiselect click");
                        }
                    });
                    $("#dialog-form").dialog("option", "title", "Adding App '" + name + "' to Home Page");
                    $("#dialog-form").dialog("open");
                    $('.date-picker').datepicker();
                    $("#dialog-form").data("obj", $this);

                    $('#dialog-form form').submit(function(event) {
                        Landing.handleDialogSubmit(event, $this);
                    });
                }
            });
            return false;
        }


        ////////////////////////   actually add the app //////////////////////

        var params =
                {
                    id: id,
                    widget_name: name,
                    widget_url: widget_url,
                    app_url: app_url,
                    app_args: app_args
                };

        Landing.executeAdd(params, $this);


        return false;
    },
    deleteApp: function(event) {
        event.preventDefault();
        var $this = $(this);
        var id = $this.data("app-id");
        //console.log(" deleting app id="+id);
        var params = [];
        params.push({
            name: "id",
            value: id
        });

        $.ajax({
            url: CONTEXT_PATH + "/delete",
            type: "POST",
            data: params,
            success: function() {
                //console.log(" app delete success");
                //change button to an +
                //TODO show delete dialog???
                //refresh to layout

            }
        });

        return false;
    },
    //////////////////////////////////////////////////////////////////////////        

    handleMaximize: function(event) {
        event.preventDefault();
        var $this = $(this),
                appIcon = $this.parents('.vzuui-app-icon');

        var $obj = appIcon;
        var app_url = $obj.find('.maximize').attr('href');


        var other_args = "";
        if (debug === "true") {
            other_args = "debug=true&";
        }

        var cont = appIcon;
        var f = cont.getFrame("#level_one_" + cont.attr("id"));
        var fk;
        try {
            fk = f.level_one_key;
        } catch (e) {
            fk = false;
        }

        if (fk && fk != "none") {
            other_args += "filter=" + fk + "&";
        }

        if (app_url == null || app_url == CONTEXT_PATH || app_url == "") {
            return;
        }
        var query_params = other_args + Landing.parseAppArgs({level: "3"}, appIcon);
        if (app_url.indexOf('?') != -1) {
            query_params = "&" + query_params;
        } else {
            query_params = "?" + query_params;
        }
        app_url = app_url + query_params;

        //need to fix up app-url, add params
        //app_url = app_url + "?" + Landing.parseAppArgs({}, $obj);

        //$obj.find('.maximize').attr('href', app_url);  
        $.launchApp({target: ""}, app_url, appIcon.data("app-name").replace(/ /g, ""));
    },
    handleDoubleClick: function(evt) {

        var $this = $(this),
                appIcon = $this.parents('.vzuui-app-icon');

        Dash.unselectLevelOnes();
        Dash.activateLevelFive(appIcon);
        var external = appIcon.data('external');
        if (external != null && (external == "true" || external == true)) {
            Landing.tryMakeWidgetL5(appIcon.data('app-url'), appIcon);
        }
        else {
            Landing.tryMakeWidgetL5(CONTEXT_PATH + appIcon.data('app-url'), appIcon);
        }
        if ($(".vzuui-widget-app div.nav-arrow-level-5 a.nav-arrow-level-5-link").hasClass("down"))
            Dash.minimizeLevelFive();

    },
    ///////////////////////////////////////////////////////////////////////////        
    ///////////////////////////////////////////////////////////////////////////        

    initMiniOrderSearch: function()
    {
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

        $("#vzuui-order-search-input").vzuiiAutocomplete({
            source: Landing.handleMiniOrderSearchAuto,
            select: Landing.launchOrderManager,
            change: function(event, ui) {
                event.preventDefault();
                return false;
            },
            focus: function(event, ui) {
                var value = ui.item.label;
                $("#vzuui-order-search-input").val(value);
                event.preventDefault();
                return false;
            },
            minLength: 3
        }).keydown(function(e) {
            //13 = Enter Key
            if (e.keyCode === 13) {
                var typeahead = $("#searchBackend :selected").data('typeahead');

                //if the current search backend doesn't support typeahead then launchURL
                if (!typeahead) {
                    Landing.no_typeahead = true;
                    $("#vzuui-order-search-input").vzuiiAutocomplete("search");
                }
            } else {
            }
        });
    },
    handleMiniOrderSearchAuto: function(req, respfnc)
    {
        var backend = $("#searchBackend").val();
        var typeahead = $("#searchBackend :selected").data('typeahead');

        //if the current search backend doesn't support typeahead then bail
        if (!Landing.no_typeahead && !typeahead) {
            return;
        }
        if (Landing.no_typeahead)
            Landing.no_typeahead = false;

        $("#vzuui-order-search-input-search").removeClass("icon-search");
        $("#vzuui-order-search-input-search").addClass("icon-load");
        Landing.orderIdMap = null;
        $.ajax({url: CONTEXT_PATH + "/mini/auto",
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
                    if (resultList == null)
                        return;

                    var keys = [];
                    for (var i = 0; i < resultList.length; i++) {
                        keys.push({
                            label: resultList[i].VALUE,
                            value: resultList[i].PARAM
                        });
                    }

                    if (resultList) {
                        respfnc(keys);
                    }
                    else {
                        respfnc({});
                    }
                }
        );
    },
    launchOrderManager: function(event, ui)
    {
        var value = ui.item.value;
        Landing.doLaunchURL(value);
        event.preventDefault();
        return false;
    },
    doLaunchURL: function(params) {
        var target = "ordermanager";
        var url = $("#searchBackend :selected").data('url');

        //determin if it's an internal or external link
        if (url.substring(0, 4) !== 'http' && url[0] !== '/') {
            url = CONTEXT_PATH + "/" + url;
        }

        url = url + params;

        $.launchApp({target: ""}, url, target);
    }
};