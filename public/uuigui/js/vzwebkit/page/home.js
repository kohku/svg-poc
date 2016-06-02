$(function() { 
    Dash.init(".vzuui-app-container", ".vzuui-app-icon", bw + margin, bh + margin);
    Landing.init();

    $("#getNextTaskButton").click(function() {
        $.ajax({
            url: CONTEXT_PATH + "/uui/apps/tasks/getnext",
            type: 'POST',
            success: function(data) {
                $('.vzuui-app-content iframe').each(function(index, obj) {
                    obj.src = obj.src;
                });
                $('.vzuui-widget-app-content iframe').each(function(index, obj) {
                    obj.src = obj.src;
                });
            }
        });
    });

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


    //Accordion Styles
    $('#vzuui-system-notification').accordion({collapsible: true});
    $('#badge-notification, #ideas-notification').accordion({collapsible: true, active: false});

    $('.vzuui-header-alert-section .vzuui-alertdropdown-arrow').click(function() {
        if ($('.vzuui-alerts-notification-overlay, .accordion').is(':hidden')) {
            $.ajax({
                url: CONTEXT_PATH + "/uui/user/notifications",
                dataType: 'json',
                type: 'POST',
                cache: false,
                success: function(data) {
                    var list = (data && data.notifications) || [];
                    Landing.notificationProcess(list);
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

    $('.vzuui-overlay-close').click(function() {
        $('.vzuui-alerts-notification-overlay').hide();
        $('.vzuui-alertdropdown-arrow').addClass('vzuui-alertdropdown-arrow-dwn').removeClass('vzuui-alertdropdown-arrow-up');
    });

    $('.vzuui-alerts-notification-overlay').hide();
    /*************** End ************/

    setTimeout(function() {
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

        var options = $('#searchBackend option');
        var checkbox = $('.ui-widget-content .ui-multiselect-checkboxes');
        for (var i = 0; i < options.length; i++) {
            checkbox.find('li').eq(i).find('input[type="radio"]').attr('value', options.eq(i).attr('value'));
            checkbox.find('li').eq(i).find('input[type="radio"]').attr('data-url', options.eq(i).attr('data-url'));
            checkbox.find('li').eq(i).find('input[type="radio"]').attr('data-typeahead', options.eq(i).attr('data-typeahead'));
            //option.text(spec[i].label);
            //combo.append(option);
        }

    }, 1200);
    $('.vzuui-page-header .vzuui-search-container').hide().delay(1200).fadeIn();
});