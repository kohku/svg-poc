!function($) {

    "use strict"; // jshint ;_;

    function calc_verical_center(container, item) {
        var cont_height = container.outerHeight();
        var item_height = item.outerHeight();

        return (cont_height - item_height) / 2;
    }

    function isNumber(o) {
        return !isNaN(o - 0) && o !== null && o.replace(/^\s\s*/, '') !== "" && o !== false;
    }

    var defaults = {
        layout_left_margin: 84,
        layout_item_width: 156,
        layout_item_left_margin: 30,
        layout_item_selected_width: 281,
        layout_item_selected_left_margin: 15,
        item_css_class: 'item',
        item_selected_css_class: 'item-selected',
        item_close_x_css_class: 'item-close-x',
        item_order_number_css_class: 'item-order-number',
        left_arrow_css_class: 'leftarrow',
        right_arrow_css_class: 'rightarrow'
    };

    var cardcarousel = function(element, options) {
        this.options = $.extend({}, defaults, options);

        var carousel = this;
        carousel.ul_element = $(element);
        carousel.left_arrow = $(element).find('.' + carousel.options.left_arrow_css_class);
        carousel.right_arrow = $(element).find('.' + carousel.options.right_arrow_css_class);
        carousel.items = $(element).find('.' + carousel.options.item_css_class);

        if (carousel.left_arrow.size() == 0) {
            carousel.ul_element.prepend($('<li class="' + carousel.options.left_arrow_css_class + '">'));
            carousel.left_arrow = $(element).find('.' + carousel.options.left_arrow_css_class);
        }

        if (carousel.right_arrow.size() == 0) {
            carousel.ul_element.append($('<li class="' + carousel.options.right_arrow_css_class + '">'));
            carousel.right_arrow = $(element).find('.' + carousel.options.right_arrow_css_class);
        }

        //prevent the arrows from triggering text select events
        carousel.left_arrow.attr('unselectable', 'on')
                .css('user-select', 'none')
                .on('selectstart', false);
        carousel.right_arrow.attr('unselectable', 'on')
                .css('user-select', 'none')
                .on('selectstart', false);

        //if no item selected, then select first one
        if (carousel.ul_element.find('.' + carousel.options.item_selected_css_class).size() < 1) {
            carousel.items.first().addClass(carousel.options.item_selected_css_class);
        }

        carousel.layout_arrows();
        carousel.layout_items();
        carousel.attach_arrow_listeners();
        carousel.attach_card_listeners();
        carousel.attach_x_listeners();

        //console.table(carousel);
    };

    cardcarousel.prototype = {
        constructor: cardcarousel,
        layout_arrows: function() {
            var carousel = this;
            carousel.left_arrow.css({
                position: 'absolute',
                left: '8px',
                top: calc_verical_center(carousel.ul_element, carousel.left_arrow) + 'px'
            });
            carousel.right_arrow.css({
                position: 'absolute',
                right: '8px',
                top: calc_verical_center(carousel.ul_element, carousel.right_arrow) + 'px'
            });
        },
        layout_items: function() {
            var carousel = this;
            var start = carousel.options.layout_left_margin;
            carousel.items.each(function(index, obj) {
                var $obj = $(obj);
                if ($obj.hasClass(carousel.options.item_selected_css_class)) {
                    start -= Math.abs(carousel.options.layout_item_selected_left_margin - carousel.options.layout_item_left_margin);
                }
                $obj.css({
                    position: 'absolute',
                    left: start + 'px',
                    top: calc_verical_center(carousel.ul_element, $obj) + 'px'
                });
                if ($obj.hasClass(carousel.options.item_selected_css_class)) {
                    start += carousel.options.layout_item_selected_width + carousel.options.layout_item_selected_left_margin;
                } else {
                    start += carousel.options.layout_item_left_margin + carousel.options.layout_item_width;
                }
            });
        },
        adjust_items: function(items, adjustment) {
            var promises = [];
            items.each(function(index, obj) {
                var $obj = $(obj);
                promises.push($obj.animate({
                    left: adjustment
                }, {
                    duration: 400,
                    easing: "easeInOutBack"
                }));
            });

            return promises;
        },
        attach_arrow_listeners: function() {
            var carousel = this;
            carousel.left_arrow.on('click', function() {
                carousel.select_prev();
            });
            carousel.right_arrow.on('click', function() {
                carousel.select_next();
            });
        },
        attach_card_listeners: function() {
            var carousel = this;
            carousel.ul_element.on('click', 'li.' + carousel.options.item_css_class, function(evt) {
                //bail if they clicked on X, have seperate handler for that
                if ($(evt.target).hasClass(carousel.options.item_close_x_css_class)) {
                    return;
                }
                carousel.items.removeClass(carousel.options.item_selected_css_class);
                $(this).addClass(carousel.options.item_selected_css_class);
                carousel.layout_items();
            });
        },
        attach_x_listeners: function() {
            var carousel = this;
            carousel.ul_element.on('click', '.' + carousel.options.item_close_x_css_class, function() {
                if (carousel.busy) {
                    return;
                }
                carousel.busy = true;
                var li_element = $(this).closest("li");
                carousel.removeCardInternal(li_element);
            });
        },
        removeCardInternal: function(li_element) {
            var carousel = this;
            var next_siblings = li_element.find(" ~ li." + carousel.options.item_css_class);
            var width = li_element.outerWidth();
            var was_selected = false;
            if (li_element.hasClass(carousel.options.item_selected_css_class)) {
                was_selected = true;
                //width += carousel.options.layout_item_selected_left_margin - carousel.options.layout_item_left_margin;
            } else {
                width += carousel.options.layout_item_left_margin;
            }
            li_element.remove();
            carousel.items = carousel.ul_element.find('.' + carousel.options.item_css_class);
            var promises = carousel.adjust_items(next_siblings, "-=" + (width));
            $.when.apply($, promises).then(function() {
                carousel.busy = false;
                if (was_selected) {
                    if (next_siblings.size() > 0) {
                        next_siblings.first().addClass(carousel.options.item_selected_css_class);
                    } else {
                        carousel.items.last().addClass(carousel.options.item_selected_css_class);
                    }
                    carousel.layout_items();
                }
            });
        },
        select_next: function() {
            if (this.busy)
                return;
            this.busy = true;
            var carousel = this;
            var current_selected = carousel.ul_element.find('.' + carousel.options.item_selected_css_class);
            var next_selected = current_selected.next();

            //if no currently selected item then bail
            if (current_selected.size() == 0) {
                this.busy = false;
                return;

            }

            //if we hit the arrow, stop
            if (next_selected.hasClass(carousel.options.right_arrow_css_class)) {
                this.busy = false;
                return;
            }

            current_selected.removeClass(carousel.options.item_selected_css_class);
            next_selected.addClass(carousel.options.item_selected_css_class);
            carousel.layout_items();

            var container_width = carousel.ul_element.outerWidth();
            var item_width = next_selected.outerWidth();
            var item_x = next_selected.position().left;
            if ((item_x + item_width) > container_width) {
                carousel.options.layout_left_margin += container_width - (item_x + item_width);
                carousel.options.layout_left_margin -= 69;
                var promises = carousel.adjust_items(carousel.items, "-=" + (Math.abs(container_width - (item_x + item_width)) + 69));
                $.when.apply($, promises).then(function() {
                    carousel.busy = false;
                });
            } else {
                this.busy = false;
            }
        },
        select_prev: function() {
            if (this.busy)
                return;
            this.busy = true;
            var carousel = this;
            var current_selected = carousel.ul_element.find('.' + carousel.options.item_selected_css_class);
            var prev_selected = current_selected.prev();

            //if no currently selected item then bail
            if (current_selected.size() == 0) {
                this.busy = false;
                return;

            }

            //if we hit the arrow, stop
            if (prev_selected.hasClass(carousel.options.left_arrow_css_class)) {
                this.busy = false;
                return;
            }

            current_selected.removeClass(carousel.options.item_selected_css_class);
            prev_selected.addClass(carousel.options.item_selected_css_class);
            carousel.layout_items();

            var item_x = prev_selected.position().left;
            if ((item_x) < 0) {
                carousel.options.layout_left_margin -= item_x;
                carousel.options.layout_left_margin += 69;
                var promises = carousel.adjust_items(carousel.items, "+=" + (Math.abs(item_x) + 69));
                $.when.apply($, promises).then(function() {
                    carousel.busy = false;
                });
            } else {
                this.busy = false;
            }
        },
        createCard: function(orderNumber, workOrderType, orderAction) {
            var carousel = this;
            var li_element = $('<li class="' + carousel.options.item_css_class + '">');
            var order_div = $('<div class="' + carousel.options.item_order_number_css_class + '">');
            var icon = $('<div>');

            icon.addClass("item-icon-" + orderAction + "-" + workOrderType);
            order_div.text(orderNumber);
            li_element.append(order_div);
            li_element.append($('<div class="' + carousel.options.item_close_x_css_class + '">'));
            li_element.append(icon);

            return li_element;
        },
        addCard: function(options) {
            var carousel = $(this).data('cardcarousel');
            var order_num = options.order_number;
            var order_ver = options.order_version;
            var order_act = options.order_action || 'i';
            var work_type = options.work_type || 'access';

            if (order_ver) {
                order_num += " (" + order_ver + ")";
            }
            var card = carousel.createCard(order_num, work_type, order_act);
            if (carousel.items.size() > 0) {
                card.insertAfter(carousel.items.last());
            } else {
                card.addClass(carousel.options.item_selected_css_class);
                card.insertAfter(carousel.ul_element.find('.' + carousel.options.left_arrow_css_class));
            }
            carousel.items = carousel.ul_element.find('.' + carousel.options.item_css_class);
            carousel.layout_items();
        },
        removeCard: function(index) {
            var carousel = $(this).data('cardcarousel');
            if (carousel.busy) {
                return;
            }
            carousel.busy = true;

            if (!isNumber(index)) {
                index = 0;
            }
            carousel.removeCardInternal(carousel.items.eq(index));
        },
        removeAllCards: function() {
            var carousel = $(this).data('cardcarousel');
            carousel.items.remove();
            carousel.items = carousel.ul_element.find('.' + carousel.options.item_css_class);
            carousel.layout_items();
        },
        selectCard: function(index) {
            var carousel = $(this).data('cardcarousel');
            if (!isNumber(index)) {
                index = 0;
            }
            var card = carousel.items.eq(index);
            carousel.items.removeClass(carousel.options.item_selected_css_class);
            $(card).addClass(carousel.options.item_selected_css_class);
            carousel.layout_items();
        }
    };
    /* cardcarousel PLUGIN DEFINITION
     * ===================== */
    var old = $.fn.cardcarousel;

    $.fn.cardcarousel = function(options) {
        var args = arguments;

        return this.each(function() {
            var $this = $(this), data = $this.data('cardcarousel');
            if (!data) {
                $this.data('cardcarousel', (data = new cardcarousel(this, options)));
            }
            if (typeof options === 'string') {
                data[options].apply(this, Array.prototype.slice.call(args, 1));
            }
        });
    };

    /* cardcarousel NO CONFLICT
     * =============== */

    $.fn.cardcarousel.noConflict = function() {
        $.fn.cardcarousel = old;
        return this;
    };
}(window.jQuery);
