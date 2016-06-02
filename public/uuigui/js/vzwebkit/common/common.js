//Set domain, needed to work with other webapps in UPI    
if (document.domain.search(/mcilink.com$/) > -1)
    document.domain = 'mcilink.com';
else if (document.domain.search(/vzbi.com$/) > -1)
    document.domain = 'vzbi.com';
else if (document.domain.search(/verizon.com$/) > -1)
    document.domain = 'verizon.com';
else if (document.domain.search("localhost") > -1)
    document.domain = 'localhost';

if (window.jQuery) {
    !function($) {

        "use strict"; // jshint ;_;

        /* upiTab PLUGIN DEFINITION
         * ===================== */

        var old = $.fn.upiTab;

        $.fn.upiTab = function( ) {
            return this.each(function() {
                var $this = $(this);
                $this.click(function(event) {
                    $(this).parent().siblings().removeClass('active');
                    $(this).parent().addClass('active');
                    var tab = $($(this).attr('href'));
                    tab.siblings().removeClass('active');
                    tab.addClass('active');
                    event.preventDefault();
                });
            });
        };

        //$.fn.upiTab.Constructor = TabMgr


        /* TabMgr NO CONFLICT
         * =============== */

        $.fn.upiTab.noConflict = function() {
            $.fn.upiTab = old;
            return this;
        };
    }(window.jQuery);

    !function($) {

        "use strict"; // jshint ;_;

        /* upiToggle PLUGIN DEFINITION
         * ===================== */

        var old = $.fn.upiToggle;

        $.fn.upiToggle = function(callback) {
            return this.each(function() {
                var $this = $(this);
                $this.click(function(event) {
                    var text = $(this).text(),
                            toggle = $(this).data('toggle'),
                            div = $($(this).attr('href'));

                    div.toggle();
                    $(this).data('toggle', text);
                    $(this).text(toggle);

                    if (callback)
                        callback(div);

                    event.preventDefault();
                });
            });
        };

        //$.fn.upiToggle.Constructor = function(){}


        /* upiToggle NO CONFLICT
         * =============== */

        $.fn.upiToggle.noConflict = function() {
            $.fn.upiToggle = old;
            return this;
        };
    }(window.jQuery);

    !function($) {

        "use strict"; // jshint ;_;

        /* upiLinkToggle PLUGIN DEFINITION
         * ===================== */

        var old = $.fn.upiLinkToggle;

        $.fn.upiLinkToggle = function( ) {
            return this.each(function() {
                var $this = $(this);
                $this.click(function(event) {
                    $(this).hide();
                    $(this).siblings().show();
                    event.preventDefault();
                });
                $this.siblings('.link-toggle-select').change(function(event) {
                    $(this).siblings('.link-toggle-a').text($(this).val() + ':');
                    $(this).hide();
                    $(this).siblings().show();
                });
            });
        };

        //$.fn.upiLinkToggle.Constructor = function(){}


        /* upiLinkToggle NO CONFLICT
         * =============== */

        $.fn.upiLinkToggle.noConflict = function() {
            $.fn.upiLinkToggle = old;
            return this;
        };
    }(window.jQuery);

    (function($) {

        //not using $.fn --which is for jquery objects --this works off the jquery global object
        $.launchApp = function(event, url, target) {
            if (!target)
                target = "_blank";
            if ($.browser.msie && $.browser.version <= 9) {
                window.open(url, target);
                return;
            }
            var a = $("<a>").attr({href: "" + url, target: target}).css("display", "none").appendTo("body");
            if (document.createEvent) {
                if (event.target !== a[0]) {
                    var evt = document.createEvent("MouseEvents");
                    evt.initMouseEvent("click", true, true, window,
                            0, 0, 0, 0, 0, false, false, false, false, 0, null);
                    var allowDefault = a[0].dispatchEvent(evt);
                    // you can check allowDefault for false to see if
                    // any handler called evt.preventDefault().
                    // Firefox will *not* redirect to anchorObj.href
                    // for you. However every other browser will.
                }
            }
            setTimeout(function() {
                a.remove();
            }, 1000);
        };


        $.launchAppInSameWindow = function(event, url, target) {
            //if (!target) target = "_self";        	
            if (!target)
                target = "_self";
            if ($.browser.msie && $.browser.version <= 9) {
                window.open(url, target);
                return;
            }
            var a = $("<a>").attr({href: "" + url, target: target}).css("display", "none").appendTo("body");
            if (document.createEvent) {
                if (event.target !== a[0]) {
                    var evt = document.createEvent("MouseEvents");
                    evt.initMouseEvent("click", true, true, window,
                            0, 0, 0, 0, 0, false, false, false, false, 0, null);
                    var allowDefault = a[0].dispatchEvent(evt);
                    // you can check allowDefault for false to see if
                    // any handler called evt.preventDefault().
                    // Firefox will *not* redirect to anchorObj.href
                    // for you. However every other browser will.
                }
            }
        };




    })(window.jQuery);


// upiMultiSelect closure wrapper
// Uses dollar internally, but calls jQuery to prevent conflicts with other libraries
// Semicolon to prevent breakage with concatenation
// Pass in window as local variable for efficiency (could do same for document)
// Pass in undefined to prevent mutation in ES3
    ;
    (function($, document, window, undefined) {

        "use strict"; // jshint ;_;

        var defaults = {
            //height: 200
        };

        // upiMultiSelect CLASS DEFINITION

        var upiMultiSelect = function(element, options) {
            var ms = this;
            this.options = $.extend({}, defaults, options);
            this.select_element = $(element);
            this.outer_div = $("<div>", {
                "class": "upiMultiSelect"
            });
            //this.outer_div.css("width",this.select_element.css("width"));
            this.inner_input = $("<input>");
            this.inner_input.attr("name", this.select_element.attr("name"));
            this.inner_input.attr("autocomplete", "off");
            this.inner_input.click(function(ms) {
                return function(event) {
                    event.preventDefault();
                    ms.toggle();
                };
            }(this));
            this.inner_input.keydown(function(ms) {
                return function(event) {
                    event.preventDefault();
                    if (event.which == 13)
                    {
                        $(this).parents('form').submit();
                    }
                };
            }(this));
            this.inner_input.keypress(function(ms) {
                return function(event) {
                    event.preventDefault();
                };
            }(this));

            this.select_element.removeAttr("name");
            this.btn = $("<button>", {
                "class": "down", "type": "button"
            });
            $("<div>").appendTo(this.btn);
            var msic = $("<div>", {
                "class": "ms-input-container"
            });
            var msiw = $("<div>", {
                "class": "ms-input-wrapper"
            });
            msic.append(msiw);
            msiw.append(this.inner_input);
            msic.appendTo(this.outer_div);

            this.outer_div.append(this.btn);
            this.outer_div.insertAfter(this.select_element);
            this.select_element.hide();
            this.btn.click(function(ms) {
                return function(event) {
                    event.preventDefault();
                    ms.toggle();
                };
            }(this));

            var values = [];
            this.select_element.find('option').each(function() {
                if (this.selected) {
                    values.push($(this).text());
                }
            });
            this.inner_input.val(values.join(","));
        };

        upiMultiSelect.prototype = {
            constructor: upiMultiSelect,
            toggle: function(event) {
                if (!this.showing) {
                    this.show(event);
                } else {
                    this.hide(event);
                }
            },
            show: function(event) {
                var ms = this;
                var dd = this.dd = $("<div>", {
                    "class": 'dropdown'
                });
                var li, checkbox;
                dd.width(this.inner_input.width());
                if (this.options.height)
                    dd.height(this.options.height);
                dd.offset({
                    top: this.inner_input.outerHeight()
                });
                //strange jquery IE behavior, sets position to relative
                //so setting it back to absolute
                dd.css('position', 'absolute');
                if ($.browser.msie && parseInt($.browser.version, 10) === 7) {
                    //fix for IE7 :-(
                    $('div.upiMultiSelect').each(function() {
                        $(this).css('zIndex', -1);
                    });
                    this.outer_div.css('zIndex', 1000);
                }
                var ul = $("<ul>");
                this.select_element.find('option').each(function() {
                    li = $("<li>");
                    checkbox = $("<input>", {
                        type: "checkbox",
                        value: $(this).val()
                    });
                    if (this.selected) {
                        checkbox.attr('checked', true);
                    }
                    checkbox.change(function(option, ms) {
                        return function() {
                            //console.log($(this).is(':checked'));
                            //console.log(this.checked);
                            if (this.checked) {
                                $(option).attr('selected', true);
                            } else {
                                $(option).attr('selected', false);
                            }

                            var values = [];
                            ms.select_element.find('option').each(function() {
                                if (this.selected) {
                                    values.push($(this).text());
                                }
                            });
                            ms.inner_input.val(values.join(","));
                        };
                    }(this, ms));
                    checkbox.appendTo(li);
                    $("<div>").text($(this).text()).appendTo(li).click(function(event) {
                        $(this).siblings("input[type=checkbox]").trigger('click');
                    });
                    li.appendTo(ul);
                });
                ul.appendTo(dd);
                this.outer_div.append(dd);

                this.btn.removeClass("down").addClass("up");
                this.showing = true;
            },
            hide: function(event) {
                this.dd.find('input').unbind();
                this.dd.empty().remove();
                this.btn.removeClass("up").addClass("down");
                this.showing = false;
                if ($.browser.msie && parseInt($.browser.version, 10) === 7) {
                    //fix for IE7 :-(
                    $('div.upiMultiSelect').each(function() {
                        $(this).css('zIndex', 1);
                    });
                }
            }
        };

        // upiMultiSelect PLUGIN DEFINITION

        var old = $.fn.upiMultiSelect;

        $.fn.upiMultiSelect = function(options) {
            var args = arguments;

            return this.each(function() {
                var $this = $(this)
                        , data = $this.data('upiMultiSelect');
                if (!data) {
                    $this.data('upiMultiSelect', (data = new upiMultiSelect(this, options)));
                }
                if (typeof option == 'string') {
                    data[options].apply(this, Array.prototype.slice.call(args, 1));
                }
            });
        };

        $.fn.upiMultiSelect.Constructor = upiMultiSelect;

        // upiMultiSelect NO CONFLICT
        $.fn.upiMultiSelect.noConflict = function() {
            $.fn.upiMultiSelect = old;
            return this;
        };
    })(jQuery, document, window); // end closure wrapper

    $.fn.flexAddExcelBtn = function(excelPath) { // function to add button to bottom pager
        return this.each(function() {
            var that = this;
            var pDiv = $(this).parent().siblings('.pDiv'),
                    pGroup = $("<div class='pGroup'>"),
                    p = CONTEXT_PATH + "/ordermanager/excel";//old default--keep this so it does break existing windows
            //console.log(" excel path="+excelPath);
            if (excelPath) {
                p = excelPath;
            }

            a = $('<a>', {
                href: p,
                "class": 'excelExport'
            }).text("Export to Excel");

            pGroup.append("<div class='btnseparator'></div>");
            pGroup.append(a);
            //$('.pDiv2', pDiv).append("<div class='pGroup'><a href=\"excel\">Export to Excel</a></div> <div class='btnseparator'></div>");        
            $('.pDiv2', pDiv).append(pGroup);
            a.bind('click', {
                table: this,
                path: p
            }, function(event) {
                var table = event.data.table,
                        grid = table.grid,
                        col_list = "",
                        name_list = "";
                $('th:visible', grid.hDiv).each(function() {
                    col_list += $(this).find('div').text();
                    col_list += ";";
                    name_list += $(this).attr('abbr');
                    name_list += ";";
                });

                $(this).attr('href', event.data.path + '?cols=' + encodeURI(col_list) + '&names=' + encodeURI(name_list));
            });
        });
    };
    $.fn.flexShow = function() { // function to show grid
        return this.each(function() {
            var mDiv = $('mDiv', this);
            $(this.grid.gDiv).removeClass('hideBody');
            $('div.ptogtitle', this.grid.gDiv).removeClass('vsble');
        });
    };
    $.fn.flexHide = function() { // function to hide grid
        return this.each(function() {
            var mDiv = $('mDiv', this);
            $(this.grid.gDiv).addClass('hideBody');
            $('div.ptogtitle', this.grid.gDiv).addClass('vsble');
        });
    };
    $.fn.flexToggle = function() { // function to min/max grid
        return this.each(function() {
            var mDiv = $('mDiv', this);
            $(this.grid.gDiv).toggleClass('hideBody');
            $('div.ptogtitle', this.grid.gDiv).toggleClass('vsble');
        });
    };
    $.fn.flexReset = function() { // function to min/max grid
        return this.each(function() {
            $('tr', this).unbind();
            //$(this).empty();
            this.grid.addCellProp();
            this.grid.addRowProp();
            this.grid.rePosDrag();
            if (this.p.onSuccess) {
                this.p.onSuccess(this.grid);
            }
            if (this.p.hideOnSubmit) {
                $(this.grid.block).remove();
            }
            this.grid.hDiv.scrollLeft = this.grid.bDiv.scrollLeft;
            if ($.browser.opera) {
                $(this).css('visibility', 'visible');
            }
        });
    };

    $.fn.flexClear = function() {
        return this.each(function() {
            this.grid.changePage('first');
            $(this).flexAddData({
                rows: [],
                page: 0,
                total: 0
            });
        });
    };

    Mousetrap.bind('ctrl+shift+alt+k', function(e) {
        $("#koopa").css("display", "block");
        $("#koopa_results").css("display", "block");
        return false;
    });

    $("#koopa_submit").click(function() {
        var hist = $("#koopa_results").text();
        var results = "";
        try {
            results = eval($("#koopa_input").val());
        } catch (e) {
            results = e;
        }
        $("#koopa_results").text(hist + "\n" + results);
    });

    /*! jQuery.customSelect() - v0.2.4 - 2013-02-03 */

    (function($) {
        $.fn.extend({
            customSelect: function(options) {
                if (typeof document.body.style.maxHeight !== "undefined") { /* filter out <= IE6 */
                    var
                            defaults = {
                                customClass: null,
                                mapClass: true,
                                mapStyle: true
                            };
                    options = $.extend(defaults, options);

                    return this.each(function() {
                        var
                                $this = $(this),
                                customSelectInnerSpan = $('<span class="customSelectInner" />'),
                                customSelectSpan = $('<span class="customSelect" />').append(customSelectInnerSpan);
                        $this.after(customSelectSpan);

                        if (options.customClass) {
                            customSelectSpan.addClass(options.customClass);
                        }
                        if (options.mapClass) {
                            customSelectSpan.addClass($this.attr('class'));
                        }
                        if (options.mapStyle) {
                            customSelectSpan.attr('style', $this.attr('style'));
                        }

                        $this.on('update', function() {
                            changed(this);
                            var selectBoxWidth = parseInt($this.outerWidth(), 10) - (parseInt(customSelectSpan.outerWidth(), 10) - parseInt(customSelectSpan.width(), 10));
                            customSelectSpan.css({display: 'inline-block'});
                            customSelectInnerSpan.css({width: selectBoxWidth, display: 'inline-block'});
                            var selectBoxHeight = customSelectSpan.outerHeight();
                            $this.css({'-webkit-appearance': 'menulist-button', width: customSelectSpan.outerWidth(), position: 'absolute', opacity: 0, height: selectBoxHeight, fontSize: customSelectSpan.css('font-size')});
                        }).on("change", changed).on('keyup', function() {
                            $this.blur();
                            $this.focus();
                        }).on('mousedown', function() {
                            customSelectSpan.toggleClass('customSelectOpen');
                        }).focus(function() {
                            customSelectSpan.addClass('customSelectFocus');
                        }).blur(function() {
                            customSelectSpan.removeClass('customSelectFocus customSelectOpen');
                        }).hover(function() {
                            customSelectSpan.addClass('customSelectHover');
                        }, function() {
                            customSelectSpan.removeClass('customSelectHover');
                        }).trigger('update');
                    });

                }
            }
        });
        function changed(e) {
            var $this = $((e.currentTarget || e));
            var currentSelected = $this.find(':selected');
            var customSelectSpan = $this.next();
            var customSelectSpanInner = customSelectSpan.children(':first');
            var html = currentSelected.html() || '&nbsp;';
            customSelectSpanInner.html(html).parent().addClass('customSelectChanged');
            setTimeout(function() {
                customSelectSpan.removeClass('customSelectOpen');
            }, 60);
        }
    })(jQuery);

    (function($, sr) {
        // debouncing function from John Hann
        // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
        var debounce = function(func, threshold, execAsap) {
            var timeout;

            return function debounced() {
                var obj = this, args = arguments;
                function delayed() {
                    if (!execAsap)
                        func.apply(obj, args);
                    timeout = null;
                }
                ;

                if (timeout)
                    clearTimeout(timeout);
                else if (execAsap)
                    func.apply(obj, args);

                timeout = setTimeout(delayed, threshold || 100);
            };
        };
        // smartresize 
        jQuery.fn[sr] = function(fn) {
            return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
        };
    })(jQuery, 'smartresize');
}

if (window.Mousetrap) {
    Mousetrap.bind('ctrl+alt+c+u', function(e) {
        changeUserDialog();
        return false;
    });
}

function changeUserDialog() {
    $("#dialog-change-user").remove();
    var dialog = $("<div>");
    dialog.attr("id", "dialog-change-user");
    dialog.attr("title", "Change User");
    dialog.css("display", "none");
    var p = $('<p>');
    var span = $('<span>');
    span.addClass("ui-icon ui-icon-alert");
    span.css({
        "float": 'left',
        "margin": '0 7px 20px 0'
    });
    p.append(span);
    span = $('<span>');
    span.append("Enter New User Id:");
    span.append($('<input id="input-change-user-uid" type="text" style="width:150px;" />'));
    p.append(span);
    dialog.append(p);
    $(document.body).append(dialog);
    dialog.dialog({
        resizable: false,
        height: 170,
        width: 400,
        modal: true,
        buttons: {
            Ok: function() {
                $(this).dialog("close");
                //console.log(" uid="+$("#input-change-user-uid").val());
                $.ajax({
                    url: CONTEXT_PATH + "/cid",
                    type: "POST",
                    data: {cid: $("#input-change-user-uid").val()},
                    success: function() {
                        window.location.reload();
                        //console.log(" changed id "+$("#input-change-user-uid").val() );
                    }
                });
            }
        }
    });
}

function findHomePage(win, cnt) {
    //if(cnt){console.log("-- find home page win="+win+"  cnt="+cnt);}

    if (cnt != null && cnt < 0) {
        return null;
    }
    --cnt;

    if (!win)
        return null;

    if (win.name === "pchome") {
        return win;
    }

    //is win a iframe
    if (win.frameElement) {
        return findHomePage(win.parent, cnt);
    }

    //try the opener of this win
    return findHomePage(win.opener, cnt);
}

function makeVzButton(text, cls) {
    var btn = $('<a>');
    btn.attr('title', text);
    btn.attr('href', '#');
    btn.addClass(cls + " vzuui-btn-gray small");
    btn.append($('<span>' + text + '</span>'));

    return btn;
}

function widgetSetMyTitleHelper(newtitle) {
    try {
        var window_href = window.location.href;
        $(window.parent.document).find('.vzuui-app-content,.app-content').each(function(index, ele) {
            var iframe_ele = $(ele).find('.vzuui-app-iframe,.app-iframe');
            if (iframe_ele.size() > 0) {
                var iframe_href = iframe_ele.attr('src');
                if (iframe_href.indexOf("http") != 0) {
                    iframe_href = window.location.protocol + "//" + window.location.host + iframe_href;
                }
                if (iframe_href == window_href) {
                    var titlebar = $(ele).siblings(".vzuui-app-icon-title-bar,.app-icon-title-bar");
                    if (newtitle != '') {
                    	$(ele).parent(".vzuui-app-icon,.app-icon").attr('title', newtitle);
                    	if (titlebar.size() == 1) {
                        	titlebar.find('.name').html(newtitle);
                        }
                    }
                }
            }
        });
    } catch (e) {
    }
}
function widgetSetMyTitle() {
    if ($.browser.msie && $.browser.version < 9) {
        window.setTimeout(function() {
            widgetSetMyTitleHelper(window.document.title);
        }, 1000);
    } else {
        widgetSetMyTitleHelper(window.document.title);
    }
}

!function($) {

    "use strict"; // jshint ;_;

    var defaults = {
    };

    var autoiframeresize = function(iframeDomElement, options) {
        var that = this;
        this.options = $.extend({}, defaults, options);
        var iframe = this;
        iframe.iframe_element = $(iframeDomElement);

        window.setInterval(function() {
            try {
                if (that.options.target) {
                    var h = $(that.options.target).height();
                    iframe.iframe_element.height(h + that.options.offset);
                } else if (that.options.autobody) {
                    if ($(iframeDomElement.contentDocument.body).css("overflow") !== 'hidden') {
                        $(iframeDomElement.contentDocument.body).css("overflow", "hidden");
                    }
                    $(iframeDomElement.contentDocument.body).css("height", "auto");
                    iframe.checkSizeAndAdjust(iframeDomElement);
                }
                else {
                    if ($(iframeDomElement.contentDocument.body).css("overflow") !== 'hidden') {
                        $(iframeDomElement.contentDocument.body).css("overflow", "hidden");
                    }
                    iframe.checkSizeAndAdjust(iframeDomElement);
                }
            }
            catch (e) {
                //console.log(e);
            }
        }, 1000);
    };

    autoiframeresize.prototype = {
        constructor: autoiframeresize,
        checkSizeAndAdjust: function(iframeDomElement) {
            var iframeDocumentHeight = iframeDomElement.contentDocument.documentElement.offsetHeight;
            var iframeBodyHeight = iframeDomElement.contentDocument.body.offsetHeight;
            var windowHeight = iframeDomElement.contentWindow.innerHeight;

            //choose the larger of the two heights
            if (iframeBodyHeight > iframeDocumentHeight) {
                iframeDocumentHeight = iframeBodyHeight;
            }

            //if difference is height is greater than 10, then adjust
            if (Math.abs(iframeDocumentHeight - windowHeight) >= 10) {
                iframeDomElement.style.height = iframeDocumentHeight + "px";
            }
        }
    };

    /* autoiframeresize PLUGIN DEFINITION
     * ===================== */
    var old = $.fn.autoiframeresize;

    $.fn.autoiframeresize = function(options) {
        var args = arguments;

        return this.each(function() {
            var $this = $(this), data = $this.data('autoiframeresize');
            if (!data) {
                $this.data('autoiframeresize', (data = new autoiframeresize(this, options)));
            }
            if (typeof options === 'string') {
                data[options].apply(this, Array.prototype.slice.call(args, 1));
            }
        });
    };

    /* autoiframeresize NO CONFLICT
     * =============== */
    $.fn.autoiframeresize.noConflict = function() {
        $.fn.autoiframeresize = old;
        return this;
    };
}(window.jQuery);

!function($) {

    "use strict"; // jshint ;_;

    var defaults = {
    };

    var infiniteScroll = function(element, options) {
        this.options = $.extend({}, defaults, options);

        try {
            var that = this;
            var $window = $(element);
            var $document = $(document);
            var goal = 0;
            if ($.browser.chrome && $.browser.version > "32") {
                goal = 2;
            }

            $window.scroll(function() {
                var diff = Math.abs($window.scrollTop() - ($document.height() - $window.height()));
                if (diff <= goal) {
                    that.options.callback();
                }
            });

        } catch (e) {

        }
    };

    infiniteScroll.prototype = {
        constructor: infiniteScroll
    };

    /* autoiframeresize PLUGIN DEFINITION
     * ===================== */
    var old = $.fn.infiniteScroll;

    $.fn.infiniteScroll = function(options) {
        var args = arguments;

        return this.each(function() {
            var $this = $(this), data = $this.data('infiniteScroll');
            if (!data) {
                $this.data('infiniteScroll', (data = new infiniteScroll(this, options)));
            }
            if (typeof options === 'string') {
                data[options].apply(this, Array.prototype.slice.call(args, 1));
            }
        });
    };

    /* infiniteScroll NO CONFLICT
     * =============== */
    $.fn.infiniteScroll.noConflict = function() {
        $.fn.infiniteScroll = old;
        return this;
    };
}(window.jQuery);

//json2.min.js - dML  need to figure out js dependencies 
var JSON;
if (!JSON) {
    JSON = {};
}
(function() {
    function f(n) {
        return n < 10 ? "0" + n : n;
    }
    if (typeof Date.prototype.toJSON !== "function") {
        Date.prototype.toJSON = function(key) {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null;
        };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(key) {
            return this.valueOf();
        };
    }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {"\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\"}, rep;
    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
            var c = meta[a];
            return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }
    function str(key, holder) {
        var i, k, v, length, mind = gap, partial, value = holder[key];
        if (value && typeof value === "object" && typeof value.toJSON === "function") {
            value = value.toJSON(key);
        }
        if (typeof rep === "function") {
            value = rep.call(holder, key, value);
        }
        switch (typeof value) {
            case"string":
                return quote(value);
            case"number":
                return isFinite(value) ? String(value) : "null";
            case"boolean":
            case"null":
                return String(value);
            case"object":
                if (!value) {
                    return"null";
                }
                gap += indent;
                partial = [];
                if (Object.prototype.toString.apply(value) === "[object Array]") {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || "null";
                    }
                    v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
                    gap = mind;
                    return v;
                }
                if (rep && typeof rep === "object") {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === "string") {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ": " : ":") + v);
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ": " : ":") + v);
                            }
                        }
                    }
                }
                v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
                gap = mind;
                return v;
        }
    }
    if (typeof JSON.stringify !== "function") {
        JSON.stringify = function(value, replacer, space) {
            var i;
            gap = "";
            indent = "";
            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " ";
                }
            } else {
                if (typeof space === "string") {
                    indent = space;
                }
            }
            rep = replacer;
            if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
                throw new Error("JSON.stringify");
            }
            return str("", {"": value});
        };
    }
    if (typeof JSON.parse !== "function") {
        JSON.parse = function(text, reviver) {
            var j;
            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function(a) {
                    return"\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }
            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                j = eval("(" + text + ")");
                return typeof reviver === "function" ? walk({"": j}, "") : j;
            }
            throw new SyntaxError("JSON.parse");
        };
    }
}());

function UiSettingsSave(ui_object_name, obj, callback) {
    if (VZID) {
        return $.ajax({
            url: CONTEXT_PATH + "/uui/user/settings/" + VZID + "/" + ui_object_name,
            type: "POST",
            data: {
                setting: JSON.stringify(obj)
            },
            success: function(data, textStatus) {
                if (callback) {
                    callback(data);
                }                
            }
        });
    }
}
function UiSettingsRetrieve(ui_object_name, callback) {
    if (VZID) {
        return $.ajax({
            url: CONTEXT_PATH + "/uui/user/settings/" + VZID + "/" + ui_object_name,
            type: "GET",
            dataType: 'json',
            success: function(data, textStatus) {
                if (callback) {
                    callback(data);
                }
            }
        });
    }
}
function UiSettingsDelete(ui_object_name, obj) {
    if (VZID) {
        return $.ajax({
            url: CONTEXT_PATH + "/uui/user/settings/" + VZID + "/" + ui_object_name,
            type: "POST"
        });
    }
}

function isNumber(o) {
    return !isNaN(o - 0) && o !== null && o !== "" && o !== false;
}

function isDefined(o) {
    return !(typeof o === 'undefined');
}

function notificationDialog(notifications) {
    $("#dialog-notification").remove();
    var dialog = $("<div>");
    dialog.attr("id", "dialog-notification");
    dialog.attr("title", "Notifications");
    dialog.css("display", "none");

    var ignored_hash = {}, notification;
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
    var p = $('<p>'), div, span;
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
        }
        span = $("<span class='ui-button-icon-primary ui-icon ui-icon-closethick' style='position:absolute;top:3px;right:0px;cursor:pointer;'>");
        span.click(function() {
            var div = $(this).parent();
            var notification_id = div.data('notification-id');
            var ignored_notifications = $.cookie('ignored-notifications') || "";
            ignored_notifications += "," + notification_id;
            $.cookie('ignored-notifications', ignored_notifications, {expires: 365});
            if (div.parent().children().length == 1) {
                dialog.dialog('close');
            }
            div.remove();
        });
        div.append(span);
        p.append(div);
    }
    dialog.append(p);
    $(document.body).append(dialog);
    dialog.dialog({
        resizable: false,
        height: 250,
        width: 400,
        modal: true
    });
    $('.ui-dialog .ui-dialog-content').css({
        padding: "0px"
    });
}
function escapeXml(s) {
    var XML_CHAR_MAP = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&apos;'
    };
    return s.replace(/[<>&"']/g, function(ch) {
        return XML_CHAR_MAP[ch];
    });
}

if (window.jQuery) {
    (function($) {
        $.fn.hasScrollbar = function() {
            var divnode = this.get(0);
            if (divnode.scrollHeight > divnode.clientHeight) {
                return true;
            }
            else {
                return false;
            }
        };
    })(window.jQuery);
}

/**
 * jQuery.fn.sortElements
 * --------------
 * @author James Padolsey (http://james.padolsey.com)
 * @version 0.11
 * @updated 18-MAR-2010
 * --------------
 * @param Function comparator:
 *   Exactly the same behaviour as [1,2,3].sort(comparator)
 *   
 * @param Function getSortable
 *   A function that should return the element that is
 *   to be sorted. The comparator will run on the
 *   current collection, but you may want the actual
 *   resulting sort to occur on a parent or another
 *   associated element.
 *   
 *   E.g. $('td').sortElements(comparator, function(){
 *      return this.parentNode; 
 *   })
 *   
 *   The <td>'s parent (<tr>) will be sorted instead
 *   of the <td> itself.
 */
jQuery.fn.sortElements = (function() {

    var sort = [].sort;

    return function(comparator, getSortable) {

        getSortable = getSortable || function() {
            return this;
        };

        var placements = this.map(function() {

            var sortElement = getSortable.call(this),
                    parentNode = sortElement.parentNode,
                    // Since the element itself will change position, we have
                    // to have some way of storing it's original position in
                    // the DOM. The easiest way is to have a 'flag' node:
                    nextSibling = parentNode.insertBefore(
                            document.createTextNode(''),
                            sortElement.nextSibling
                            );

            return function() {

                if (parentNode === this) {
                    throw new Error(
                            "You can't sort elements if any one is a descendant of another."
                            );
                }

                // Insert before flag:
                parentNode.insertBefore(this, nextSibling);
                // Remove flag:
                parentNode.removeChild(nextSibling);

            };

        });

        return sort.call(this, comparator).each(function(i) {
            placements[i].call(getSortable.call(this));
        });

    };
})();

if (window.jQuery) {
    (function($) {
        $.fn.getHome = function() {
            return findHomePage(window, 10);
        };
    })(window.jQuery);
}

if (window.jQuery) {
    (function($) {
        $.fn.getFrame = function(selector) {
            if ($(selector) && $(selector).get(0)) {
                return $(selector).get(0).contentWindow;
            }
            else {
                return null;
            }
        };
    })(window.jQuery);
}



var vzuui = {
    messenger: {
        unregister: function(event_name) {
            $(document).off(event_name);
        },
        register: function(event_name, fnc) {
            var _obj = {
                filter: function(criteria) {
                    this._criteria = criteria;
                },
                _criteria: null
            };

            $(document).on(event_name, function(e) {
                var send = true;

                if (_obj._criteria) {
                    for (var key in _obj._criteria) {
                        if (!e[key]) {
                            send = false;
                        }
                        else if (e[key] != _obj._criteria[key]) {
                            send = false;
                        }
                        if (!send) {
                            break;
                        }
                    }
                }
                if (send) {
                    fnc(e);
                }
            });
            return _obj;
        },
        post: function(event_name, data) {
            var h = $(window).getHome();
            var e = {type: event_name, message: "foo"};
            for (var key in data) {
                e[key] = data[key];
            }
            if (h && h.vzuui && h.vzuui.messenger) {
                h.vzuui.messenger._distributeEvent(e);
            }
        },
        _distributeEvent: function(jq_event) {
            //console.log("dist event start--")
            $.event.trigger(jq_event);
            $('iframe').each(function() {
                //console.log(" dist event iframe start id="+ $(this)[0].contentWindow.FRAME_ID);
                try {
                    if ($(this)[0].contentWindow.vzuui) {
                        $(this)[0].contentWindow.vzuui.messenger._distributeEvent(jq_event);
                    }
                }
                catch (e) {
                    //window probably didnt include common.js --so access denied 
                    //because other window that include common.js set the domain
                }
                //console.log(" dist event iframe end");
            });
            //console.log(" dist event end");
        }
    }

};

function stringifyHash(hash) {
    var str = "";
    for (var key in hash) {
        str += " " + key + ":" + hash[key] + ",";
    }
    return str;
}


function isString(o) {
    return typeof o == "string" || (typeof o == "object" && o.constructor === String);
}

function makeWaitDialog() {
    $("#dialog-please-wait").remove();
    var dialog = $("<div>");
    dialog.attr("id", "dialog-please-wait");
    dialog.attr("title", "Please Wait");
    dialog.css("display", "none");
    var p = $('<p>');
    var span = $('<span>');
    span.addClass("ui-icon ui-icon-info");
    span.css({
        "float": 'left',
        "margin": '0 7px 20px 0'
    });
    p.append(span);
    span = $('<span>');
    span.append("Working, Please Wait.");
    span.append("<span class='vzuui-progress-image' style='top: 35px;'></span>");
    p.append(span);
    dialog.append(p);
    $(document.body).append(dialog);
    dialog.dialog({
        resizable: false,
        height: 110,
        width: 200,
        modal: true,
        open: function(event, ui) {
            $("#dialog-please-wait").siblings('.ui-dialog-titlebar').find('.ui-dialog-titlebar-close').hide();
        }
    });

    return dialog;
}

//set option cache to false for all ajax requests
if (window.jQuery) {
    $.ajaxSetup({
        cache: false
    });

    //sso redirects don't work like local redirects, this might be the only
    //way to detect an sso logout
    $(document).ajaxError(function(event, xhr, ajaxOptions) {
        // OK, for firefox we get this set of statuses for an SSO timeout
        // not the best, was hoping for a status of 302
        if (xhr.readyState === 0 && xhr.responseText === "" && xhr.status === 0 && xhr.statusText === "error")
        {
            window.location.href = window.CONTEXT_PATH + "/";
        }
        // OK, for IE we get nothing in the status codes that tells us that anything went wrong :-)
        // soooo, all we can do is search response text and see if the title of page is the SSO page
        // so lame
        else if (xhr.responseText.indexOf("<title>Enterprise Single Sign On</title>") !== -1) {
            window.location.href = window.CONTEXT_PATH + "/";
        }
        // Chrome?????
    });
}

//returns map of parameters/values from a url
//assumes parameters appear only once in a url
function parseURLparameters(url) {
    var ans = {};
    var params = url.split("#")[0].split("?")[1].split("&");
    for (var i = 0; i < params.length; i++) {
        var nv = params[i].split("=");
        ans[nv[0]] = nv[1];
    }

    return ans;
}

//wrapper around jquery ajax, used to detect SSO timeouts 
//wraps error and success callback functions
//does not wrap promises
function uuiAjax(url, options) {
    // If url is an object, then assume url is undefined
    if (typeof url === "object") {
        options = url;
        url = undefined;
    }

    // Force options to be an object
    options = options || {};

    if (options.error) {
        var oldError = options.error;
        options.error = function(jqXHR, textStatus, errorThrown) {
            if (jqXHR.responseText && jqXHR.responseText.indexOf && jqXHR.responseText.indexOf("<title>Enterprise Single Sign On</title>") !== -1) {
                window.location.href = window.CONTEXT_PATH + "/";
            } else {
                return oldError(jqXHR, textStatus, errorThrown);
            }
        }
    }

    if (options.success) {
        var oldSuccess = options.success;
        options.success = function(data, textStatus, jqXHR) {
            if (data && data.indexOf && data.indexOf("<title>Enterprise Single Sign On</title>") !== -1) {
                window.location.href = window.CONTEXT_PATH + "/";
            } else {
                return oldSuccess(data, textStatus, jqXHR);
            }
        }
    }

    var promise = $.ajax(url, options);

    promise.done(function(result, textStatus) {
        if (result && result.indexOf && result.indexOf("<title>Enterprise Single Sign On</title>") !== -1) {
            window.location.href = window.CONTEXT_PATH + "/";
        }
    });

    return promise;
}

function iframeDialog(options) {
    options = options || {};
    var default_options = {
        autoOpen: true,
        closeOnEscape: true,
        draggable: true,
        height: 400,
        minHeight: 100,
        maxHeight: 1000,
        width: 400,
        minWidth: 100,
        maxWidth: 1000,
        modal: false,
        resizable: true,
        title: ""
    };

    $(".iframe-content-dialog-external").remove(); //added to remove iframe content from IE weird cache

    var map = parseURLparameters(options.url);
    if (map['_width']) {
        options.width = map['_width'];
    }
    if (map['_height']) {
        options.height = map['_height'];
    }

    $.extend(default_options, options);

    default_options.resizeStop = function(event, ui) {
        var dialogContent = $('#dialog-iframe-generic');
        var width = ui.size.width - 19;
        var height = ui.size.height - 40;
        setTimeout(function() {
            dialogContent.width(width);
            dialogContent.height(height);
        }, 1000);
    };

    /*
     function checkAndResize(iframeDomElement,parent) {
     var style = iframeDomElement.contentDocument.body.style;
     if (style.overflow !== 'hidden') {
     style.overflow = 'hidden';
     }
     if (style.height !== 'auto') {
     style.height = 'auto';
     }
     if (style.width !== 'auto') {
     style.width = 'auto';
     }
     
     //first lets figure out height iframe wants to be
     var iframeDocumentHeight = iframeDomElement.contentDocument.documentElement.offsetHeight;
     var iframeBodyHeight = iframeDomElement.contentDocument.body.offsetHeight;
     var windowHeight = iframeDomElement.contentWindow.innerHeight;
     //choose the larger of the two heights
     if (iframeBodyHeight > iframeDocumentHeight) {
     iframeDocumentHeight = iframeBodyHeight;
     }
     
     //if difference is height is greater than 10, then adjust
     if (Math.abs(iframeDocumentHeight - windowHeight) >= 10) {
     iframeDomElement.style.height = iframeDocumentHeight + "px";
     parent.height(iframeDocumentHeight);
     }
     
     //second lets figure out width iframe wants to be
     var iframeDocumentWidth = iframeDomElement.contentDocument.documentElement.offsetWidth;
     var iframeBodyWidth = iframeDomElement.contentDocument.body.offsetWidth;
     var windowWidth = iframeDomElement.contentWindow.innerWidth;
     //choose the larger of the two heights
     if (iframeBodyWidth > iframeDocumentWidth) {
     iframeDocumentWidth = iframeBodyWidth;
     }
     console.log(iframeDocumentWidth,windowWidth);
     //if difference is height is greater than 10, then adjust
     if (Math.abs(iframeDocumentWidth - windowWidth) >= 10) {
     iframeDomElement.style.width = iframeDocumentWidth + "px";
     parent.width(iframeDocumentWidth);
     }
     }    
     default_options.open = function(event,ui) {
     var dialog = $('#dialog-iframe-generic');
     var iframe = dialog.find('iframe');
     iframe.ready(function() {
     setInterval(function() {
     try {
     checkAndResize(iframe.get(0),dialog);
     } catch (e) {
     console.log(e);
     }
     },1000);            
     });
     };
     default_options.close = function(event,ui) {
     
     };
     */

    $("#dialog-iframe-generic").remove();
    var dialog = $("<div>");
    dialog.attr("id", "dialog-iframe-generic");
    dialog.attr("title", options.title);
    dialog.css({
        "display": "none",
        height: "100%",
        width: "100%",
        padding: "0.5em 0.5em"
    });
    var iframe = $('<iframe>');
    iframe.css({
        height: "100%",
        width: "100%",
        border: "0px",
        padding: "0px",
        margin: "0px"
    });

    dialog.append(iframe);
    $(document.body).append(dialog);
    iframe.addClass("iframe-content-dialog-external");
    var returnDialog = dialog.dialog(default_options);

    returnDialog.promise().done(function() {
        iframe.attr("src", options.url || "about:blank");
    });

    return returnDialog;
}


function alertDialog(options) {
    options = options || {};
    var default_options = {
        autoOpen: true,
        closeOnEscape: true,
        draggable: true,
        height: 150,
        width: 300,
        modal: true,
        resizable: false,
        title: "Action Status",
        buttons: {
            Ok: function() {
                $(this).dialog("close");
            }
        }
    };

    $.extend(default_options, options);

    $("#dialog-alert-generic").remove();
    var dialog = $("<div>");
    dialog.attr("id", "dialog-alert-generic");
    dialog.attr("title", default_options.title);
    dialog.css({
        "display": "none",
        height: "100%",
        width: "100%",
        padding: "0.5em 0.5em"
    });
    dialog.html(options.displayMessage);
    $(document.body).append(dialog);
    return dialog.dialog(default_options);
}


 //addressing jQuery bug where this flag is set to false
 //if screen is iframed, it should always be true for UUI
 if (window.jQuery) {
    window.jQuery.support.boxSizing=true;
 }