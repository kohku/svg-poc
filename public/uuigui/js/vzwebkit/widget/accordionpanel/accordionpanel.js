!function($) {

    "use strict"; // jshint ;_;

    var defaults = {
    };

    var accordionpanel = function(element, options) {
        this.options = $.extend({}, defaults, options);

        var accordion = this;
        accordion.panel = $(element);
        accordion.toggle = accordion.panel.find('.accordionheader');
        accordion.content = accordion.panel.find('.accordioncontent');
        accordion.toggle.click(function() {
            accordion.content.toggle();
            if (accordion.content.is(":visible")) {
                accordion.panel.addClass('accordionpanelselected');
            } else {
                accordion.panel.removeClass('accordionpanelselected');
            }
        });

        if (accordion.panel.hasClass("accordionpanelselected")) {
            accordion.content.toggle();            
        }
        //prevent the arrows from triggering text select events
        accordion.toggle.attr('unselectable', 'on')
                .css('user-select', 'none')
                .on('selectstart', false);
        accordion.toggle.attr('unselectable', 'on')
                .css('user-select', 'none')
                .on('selectstart', false);

    };

    accordionpanel.prototype = {
        constructor: accordionpanel,
        open: function() {
            var accordion = $(this).data('accordionpanel');
            accordion.content.show();
            accordion.panel.addClass('accordionpanelselected');
        },
        close: function() {
            var accordion = $(this).data('accordionpanel');
            accordion.content.hide();
            accordion.panel.removeClass('accordionpanelselected');
        },
        setName: function(name) {
            var accordion = $(this).data('accordionpanel');
            accordion.toggle.find('.accordionheadername').text(name);            
        }
    };
    /* accordionpanel PLUGIN DEFINITION
     * ===================== */
    var old = $.fn.accordionpanel;

    $.fn.accordionpanel = function(options) {
        var args = arguments;

        return this.each(function() {
            var $this = $(this), data = $this.data('accordionpanel');
            if (!data) {
                $this.data('accordionpanel', (data = new accordionpanel(this, options)));
            }
            if (typeof options === 'string') {
                data[options].apply(this, Array.prototype.slice.call(args, 1));
            }
        });
    };

    /* accordionpanel NO CONFLICT
     * =============== */

    $.fn.accordionpanel.noConflict = function() {
        $.fn.accordionpanel = old;
        return this;
    };
}(window.jQuery);
