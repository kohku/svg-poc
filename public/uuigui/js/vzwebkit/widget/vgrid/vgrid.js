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

/*
 * vgrid
 * jQuery widget for a data grid
 * Usage:
 $(<selector>).vgrid({
 excelUrl: CONTEXT_PATH + "/app/pcview/excel",
 excelData: {
 'View Name': view_name
 },
 sortUrl: CONTEXT_PATH + "/app/pcview/sort",
 sortData: {
 'View Name': view_name
 },
 drawerOpenCallback: function(drawer,open) {
 console.log(drawer);
 },
 columnWidths: {
 'LINE_OF_BUSINESS': 110,
 'ORDNBR_TYPE': 100,
 'TASK_NAME': 200,
 'FALLOUT_DATE': 80,
 'ORDER_STATUS': 75,
 'TASK_DUE_DATE': 80,
 'WORKPOOL': 220,
 'PROJECT_ID': 100
 },
 trackWindowHorizScroll: true,
 trackGridHorizScroll: false,
 settingsMenu: true,
 sortJs: true,
 sortColName: "order",
 sortColNameDir: "ASC",
 uiObjectName: "taskGrid"
 uiObjectConfigName: "taskGrid.Configs"
 });
 
 You can also set widths of columns via css, like so
 .vgrid-column:nth-child(2) {
 width:110px;
 }
 .vgrid-column:nth-child(3) {
 width:100px;
 }
 .vgrid-column:nth-child(4) {
 width:200px;
 }
 .vgrid-column:nth-child(5) {
 width:80px;
 }
 .vgrid-column:nth-child(6) {
 width:75px;
 }
 .vgrid-column:nth-child(7) {
 width:80px;
 }
 .vgrid-column:nth-child(8) {
 width:220px;
 }
 .vgrid-column:nth-child(9) {
 width:100px;
 }
 
 * @param {type} $
 * @returns {undefined}
 */
!function($) {

    "use strict"; // jshint ;_;

    var defaults = {
        excelUrl: null,
        sortUrl: null,
        settingsMenu: true,
        enhancedSettingsMenu: false,
        trackWindowHorizScroll: false,
        trackGridHorizScroll: false,
        rowHeight: '24px',
        multiSelect: false,
        multiSelectCallback: false,
        dblclickDrawerOpen: true
    };

    var vgrid = function(element, options) {
        var grid = this;
        this.options = $.extend({}, defaults, options);
        this.vgrid_element = $(element);
        this.vgrid_head = this.vgrid_element.find('.vgrid-head');
        this.vgrid_body = this.vgrid_element.find('.vgrid-body');
        //this.nrows      = this.vgrid_body.children().length;

        //add sorting links to header columns if we have a sortUrl
        if (this.options.sortUrl) {
            this.vgrid_head.children('.vgrid-column').each(function(index, obj) {
                var html = $(obj).html();
                $(obj).html("<a class='vgrid-column-sort-link' href='#'>" + html + "</a>");
                $(obj).children('.vgrid-column-sort-link').click(function(evt) {
                    evt.preventDefault();

                    var nrows = $('.vgrid-body').children().length;
                    //console.log(" nrows="+nrows);
                    //alert(" nrows="+nrows);
                    grid.doSort($(obj).data('name'), nrows);
                    return false;
                });
            });
        } else if (this.options.sortJs) {
            this.vgrid_head.children('.vgrid-column').each(function(index, obj) {
                var html = $(obj).html();
                $(obj).html("<a class='vgrid-column-sort-link' href='#'>" + html + "</a>");
                $(obj).children('.vgrid-column-sort-link').click(function(evt) {
                    evt.preventDefault();
                    grid.doSortJs($(obj).data('name'));
                    return false;
                });
            });

            if (this.options.sortColName) {
                var dir = this.options.sortColNameDir || "ASC";
                if (dir == "ASC") {
                    dir = false;
                } else {
                    dir = true;
                }
                grid.doSortJs(this.options.sortColName, dir);
            }
        }

        //if user passed in columnSizes then adjust sizes
        if (this.options.columnWidths) {
            var spinner = new Spinner({top: 75, radius: 20, length: 50, lines: 15});

            spinner.spin(grid.vgrid_element.get(0));
            grid.vgrid_body.hide();

            setTimeout(function() {
                grid.vgrid_head.children('.vgrid-column').each(function(index, obj) {
                    var name = $(obj).data('name');
                    var newWidth = grid.options.columnWidths[name];
                    if (newWidth) {
                        $(obj).width(newWidth);
                        grid.resizeColumn(name, newWidth);
                    }
                });
                grid.vgrid_body.show();
                spinner.stop();
            }, 50);
        }

        if (grid.options.multiSelect) {
            $('.vgrid-selector-checkbox').each(function(index, obj) {
                if ($(obj).is(':checked')) {
                    $(this).closest('.vgrid-row').addClass("vgrid-selected-row");
                }
            });
            this.vgrid_body.on('click', '.vgrid-selector-checkbox', function(evt) {
                //$('.vgrid-selected-row').removeClass("vgrid-selected-row");
                evt.stopPropagation();
                $('.hidedropdown').hide();
                $('.vgrid-head .vgrid-column').each(function() {
                    $(this).removeAttr('data-filter-value');
                });
                var checkbox = $(this);
                if (checkbox.is(':checked')) {
                    $(this).closest('.vgrid-row').addClass("vgrid-selected-row");
                    if (grid.options.multiSelectCallback) {
                        grid.options.multiSelectCallback(checkbox, true);
                    }
                } else {
                    $(this).closest('.vgrid-row').removeClass("vgrid-selected-row");
                    if (grid.options.multiSelectCallback) {
                        grid.options.multiSelectCallback(checkbox, false);
                    }
                }
            });
        } else {
            //handle selecting of a single row
            this.vgrid_body.on('click', '.vgrid-row', function(evt) {
                $('.vgrid-selected-row').removeClass("vgrid-selected-row");
                $(this).addClass("vgrid-selected-row");
            });
        }

        //handling opening and closing of row drawer 
        if (grid.options.dblclickDrawerOpen) {
            this.vgrid_body.on('dblclick', '.vgrid-row', function(evt) {
                grid.toggleDrawerInternal($(this));
            });
        }

        //setting up the export excel link
        //vgrid-menu-link-li
        if (grid.options.excelUrl) {
            grid.vgrid_element.find(".vgrid-menu-link-li").html('<a class="vgrid-menu-link" href="' + grid.options.excelUrl + '">Export to Excel</a>');
            grid.vgrid_element.find('.vgrid-menu-link').click(function(evt) {
                var col_list = "", name_list = "", url = grid.options.excelUrl + "?";

                grid.vgrid_head.children('.vgrid-column').each(function(index, obj) {
                    if ($(obj).is(':visible')) {
                        col_list += $(obj).text();
                        col_list += ";";
                        name_list += $(obj).data('name');
                        name_list += ";";
                    }
                });
                if (grid.options.excelData) {
                    url += $.param(grid.options.excelData);
                    url += "&";
                }
                url += 'cols=' + encodeURI(col_list) + '&names=' + encodeURI(name_list);
                $(this).attr('href', url);
            });
        } else {
            grid.vgrid_element.find(".vgrid-menu-link-li").html('<a class="vgrid-menu-link" href="#">Export to Excel</a>');
            grid.vgrid_element.find('.vgrid-menu-link').click(function(evt) {
                evt.preventDefault();

                var col_list = "", name_list = "";

                grid.vgrid_head.children('.vgrid-column').each(function(index, obj) {
                    if ($(obj).is(':visible')) {
                        col_list += $(obj).text();
                        col_list += ";";
                        name_list += $(obj).data('name');
                        name_list += ";";
                    }
                });

                var form = $('<form>');
                form.attr("method", "post");
                form.attr("action", CONTEXT_PATH + "/excel/export");
                form.attr("enctype", "application/x-www-form-urlencoded");
                form.attr("target", "_blank");
                form.css("display", "none");

                var input = $("<input>").attr("name", "sheet").attr("value", "excel_export");
                form.append(input);
                input = $("<input>").attr("name", "cols").attr("value", col_list);
                form.append(input);
                input = $("<input>").attr("name", "names").attr("value", name_list);
                form.append(input);

                var row = [];
                grid.vgrid_body.children('.vgrid-row').each(function(index, obj) {
                    row = "";
                    var ftf = true;
                    $(obj).children('.vgrid-column').each(function(index, obj) {
                        if ($(obj).is(':visible')) {
                            if (!ftf)
                                row += ", ";
                            row += $(obj).text();
                        }
                        ftf = false;
                    });
                    input = $("<input>").attr("name", "rows").attr("value", row + " ,");
                    form.append(input);
                });

                $('body').append(form);

                form.submit();

                setTimeout(function() {
                    form.remove();
                }, 5000);

                return false;
            });
        }

        //the X close button on popup menu
        grid.vgrid_element.children('.vgrid-menu').children('i').click(function() {
            grid.vgrid_element.children('.vgrid-menu').slideUp(200);
        });

        if (this.options.settingsMenu) {
            if (this.vgrid_head.children('.vgrid-left-gutter').size() > 0) {
                this.configSettingsMenu(this.vgrid_head.children('.vgrid-left-gutter'));
            } else {
                var sel = this.vgrid_head.children('.vgrid-selector');
                if (sel.size() === 1) {
                    var img = $('<img>');
                    img.css({
                        'margin-top': '5px', 'width': '15px', 'height': '15px'
                    });
                    img.attr("src", CONTEXT_PATH + "/css/vzwebkit/widget/vgrid/gear.png");
                    sel.append(img);
                    this.configSettingsMenu(img);
                }
            }
        } else {
            this.vgrid_head.children('.vgrid-left-gutter').css("background-image", "none");
        }

        //making header columns resizable
        this.vgrid_head.children('.vgrid-column').each(function(index, obj) {
            $(obj).resizable({
                handles: "e",
                maxHeight: 14,
                minHeight: 14,
                stop: grid.handleResizeStop
            });
        });

        //making header columns sortable
        this.vgrid_head.sortable({
            cursor: "move",
            items: '.vgrid-column',
            revert: false,            
            tolerance: "pointer",
            containment: this.vgrid_head,
            start: grid.handleMoveStart,
            stop: grid.handleMoveStop
        });

        this.vgrid_head.find('div.filter-div').each(function(index, obj) {
            var col = $(obj).parents(".vgrid-column");

            $(obj).click(function(evt) {
                evt.preventDefault();
                grid.handleFilterMenu(col);
                return false;
            });
        });

        //if trackWindowHorizScroll is set then bind event handler
        if (this.options.trackWindowHorizScroll) {
            $(window).scroll(function(evt) {
                //this.hDiv.scrollLeft = this.bDiv.scrollLeft;
                //console.log(grid.vgrid_head.scrollLeft());
                //console.log($(window).scrollLeft());
                grid.vgrid_head.css('left', -($(window).scrollLeft()));
            });
        }
        //if trackGridHorizScroll is set then bind event handler
        if (this.options.trackGridHorizScroll) {
            grid.vgrid_body.scroll(function(evt) {
                grid.vgrid_head.css('left', -(grid.vgrid_body.scrollLeft()));
            });
        }

        //add handler for refresh button on paganation bar, if present
        $('#refreshBtn').click(function() {
            window.location.reload(true);
        });
    };

    vgrid.prototype = {
        constructor: vgrid,
        createGridSettingsJSON: function(default_config) {
            var grid = this;
            var columns = [];
            this.vgrid_head.children('.vgrid-column').each(function(index, obj) {
                var $obj = $(obj);
                columns.push({
                    name: $obj.data("name"),
                    isFilter: $obj.data("filter"),
                    type: $obj.data("type"),
                    width: $obj.outerWidth(),
                    hidden: $obj.css('display') == 'none',
                    visible: $obj.css('display') != 'none',
                    position: index,
                    label: $obj.find('a').text(),
                    filterValue: $obj.data("filter-value"),
                    sortPos: $obj.data("sort-pos"),
                    sortDir: $obj.data("sort-dir")
                });
            });
            var settings = {
                columns: columns
            };

            if (default_config) {
                settings.default_config = default_config;
            }

            if (isDefined(window.page_size)) {
                settings.page_size = window.page_size;
            }

            return settings;
        },
        createConfigsJSON: function(name, ui_object_name) {
            var grid = this;
            var settings = {
            };
            var configs = [];

            //clone window.configs
            if (window.configs) {
                for (var i = 0; i < window.configs.length; i++) {
                    configs.push({
                        "name": window.configs[i].name,
                        "ui_object_name": window.configs[i].ui_object_name
                    });
                }
            }

            settings.configs = configs;

            if (name) {
                settings.configs.push(
                        {
                            "name": name,
                            "ui_object_name": ui_object_name
                        }
                );
                if (window.configs) {
                    for (var i = 0; i < window.configs.length; i++) {
                        window.configs[i]["default"] = "false";
                    }

                    window.configs.push({
                        "name": name,
                        "ui_object_name": ui_object_name,
                        "default": "true"
                    });
                }
            }

            return settings;
        },
        saveConfigsSettings: function(name, ui_object_name) {
            if (this.options.uiObjectConfigName) {
                var configs = this.createConfigsJSON(name, ui_object_name);
                return UiSettingsSave(this.options.uiObjectConfigName, configs);
            }
        },
        saveUserDefaultGridSettings: function(default_config, clear_default) {
            if (this.options.uiObjectName) {
                var settings = this.createGridSettingsJSON(default_config);
                var promise = UiSettingsSave(this.options.uiObjectName, settings);
                if (clear_default) {
                    delete settings.default_config;
                }

                return promise;
            }
        },
        saveGridSettings: function() {
            var defaultConfig = this.getDefaultConfigJS();
            if (defaultConfig === "") {
                defaultConfig = this.options.uiObjectName;
            } else {
                defaultConfig = this.options.uiObjectConfigName + "." + defaultConfig;
            }
            var settings = this.createGridSettingsJSON();
            var promise = UiSettingsSave(defaultConfig, settings);
            return promise;
        },
        saveUserNamedDefaultGridSettings: function(new_default_config, callback) {
            var grid = this;
            if (this.options.uiObjectName) {
                UiSettingsRetrieve(this.options.uiObjectName, function(data) {
                    if (!data) {
                        data = grid.createGridSettingsJSON();
                    }
                    if (new_default_config) {
                        data.default_config = new_default_config;
                    } else {
                        delete data.default_config;
                    }
                    UiSettingsSave(grid.options.uiObjectName, data, callback);
                });
            }
        },
        saveNamedGridSettings: function(config_name) {
            if (config_name) {
                var settings = this.createGridSettingsJSON();
                return UiSettingsSave(config_name, settings);
            }
        },
        getDefaultConfig: function() {
            var configs = $('.vgrid-menu-filter-footer-container-configs .config-card');
            var defaultConfig = null;
            configs.each(function(index, obj) {
                var $obj = $(obj);
                if ($obj.data("default") === true || $obj.data("default") === "true") {
                    if ($obj.data("name") !== "_default_") {
                        defaultConfig = $obj.data('ui_object_name');
                    }
                }
            });

            return defaultConfig;
        },
        getDefaultConfigJS: function() {
            if (window.configs) {
                for (var i = window.configs.length - 1; i >= 0; i--) {
                    if (window.configs[i]["default"] === "true") {
                        return window.configs[i]["name"];
                    }
                }
            }

            return "";
        },
        haveConfig: function(name) {
            if (window.configs) {
                var configs = window.configs;
                for (var i = configs.length - 1; i >= 0; i--) {
                    if (configs[i]["name"] === name) {
                        return true;
                    }
                }
            }

            return false;
        },
        haveDefault: function() {
            if (window.configs) {
                var configs = window.configs;
                for (var i = configs.length - 1; i >= 0; i--) {
                    if (configs[i]["default"] === "true") {
                        return true;
                    }
                }
            }

            return false;
        },
        toggleCustomizeMenu: function(btn) {
            var grid = $(this).data('vgrid');
            var btn_offset = $(btn).offset();
            var menu = $('.vgrid-popup-menu');
            if (menu.size() > 0) {
                menu.hide();
                menu.remove();
            } else {
                menu = $('<div>');
                menu.addClass("vgrid-menu vgrid-popup-menu hidedropdown");
                var container = $('<div>');
                container.addClass("vgrid-menu-column-list");
                var columns = grid.vgrid_head.children('.vgrid-column');
                var temp = '';
                columns.each(function(index, obj) {
                    temp = '<div><input class="vgrid-column-checkbox" type="checkbox" name="' + $(obj).data('name') + '" value="' + $(obj).data('name') + '"';
                    if ($(obj).is(":visible")) {
                        temp += 'checked';
                    }
                    temp += '>' + $(obj).text() + '</div>';
                    container.append(temp);
                });
                menu.offset({
                    left: btn_offset.left - 16
                });
                menu.css({
                    'top': 'auto',
                    'bottom': $(window).height() - btn_offset.top - 8,
                    display: 'block',
                    'height': '200px',
                    'width': '210px',
                    'overflow-y': 'auto'
                });

                container.find('input').change(function(evt) {
                    var target = evt.target;
                    var name = $(target).val();
                    if ($(this).is(':checked')) {
                        grid.vgrid_head.find('[data-name="' + name + '"]').show();
                        grid.vgrid_body.find('[data-name="' + name + '"]').show();
                    } else {
                        grid.vgrid_head.find('[data-name="' + name + '"]').hide();
                        grid.vgrid_body.find('[data-name="' + name + '"]').hide();
                    }
                    grid.saveGridSettings();
                });

                menu.append(container);
                $('body').append(menu);
                menu.css({
                    'position': 'absolute'
                });
                //menu.show();
            }
        },
        excelExport: function() {
            var grid = $(this).data('vgrid');
            if (grid.options.excelUrl) {
                var col_list = "", name_list = "";

                grid.vgrid_head.children('.vgrid-column').each(function(index, obj) {
                    if ($(obj).is(':visible')) {
                        col_list += $(obj).text();
                        col_list += ";";
                        name_list += $(obj).data('name');
                        name_list += ";";
                    }
                });

                var form = $('<form>');
                form.attr("method", "get");
                form.attr("action", grid.options.excelUrl);
                form.attr("enctype", "application/x-www-form-urlencoded");
                form.attr("target", "_blank");
                form.css("display", "none");

                var input = $("<input>").attr("name", "sheet").attr("value", "excel_export");
                form.append(input);
                input = $("<input>").attr("name", "cols").attr("value", col_list);
                form.append(input);
                input = $("<input>").attr("name", "names").attr("value", name_list);
                form.append(input);
                for (var prop in grid.options.excelData) {
                    // important check that this is objects own property 
                    // not from prototype prop inherited
                    if (grid.options.excelData.hasOwnProperty(prop)) {
                        input = $("<input>").attr("name", prop).attr("value", grid.options.excelData[prop]);
                        form.append(input);
                    }
                }

                $('body').append(form);

                form.submit();

                setTimeout(function() {
                    form.remove();
                }, 5000);
            } else {
                var col_list = "", name_list = "";

                grid.vgrid_head.children('.vgrid-column').each(function(index, obj) {
                    if ($(obj).is(':visible')) {
                        col_list += $(obj).text();
                        col_list += ";";
                        name_list += $(obj).data('name');
                        name_list += ";";
                    }
                });

                var form = $('<form>');
                form.attr("method", "post");
                form.attr("action", CONTEXT_PATH + "/excel/export");
                form.attr("enctype", "application/x-www-form-urlencoded");
                form.attr("target", "_blank");
                form.css("display", "none");

                var input = $("<input>").attr("name", "sheet").attr("value", "excel_export");
                form.append(input);
                input = $("<input>").attr("name", "cols").attr("value", col_list);
                form.append(input);
                input = $("<input>").attr("name", "names").attr("value", name_list);
                form.append(input);

                var row = [];
                grid.vgrid_body.children('.vgrid-row').each(function(index, obj) {
                    row = "";
                    var ftf = true;
                    $(obj).children('.vgrid-column').each(function(index, obj) {
                        if ($(obj).is(':visible')) {
                            if (!ftf)
                                row += ", ";
                            row += $(obj).text();
                        }
                        ftf = false;
                    });
                    input = $("<input>").attr("name", "rows").attr("value", row + " ,");
                    form.append(input);
                });

                $('body').append(form);

                form.submit();

                setTimeout(function() {
                    form.remove();
                }, 5000);
            }
        },
        show: function() {
        },
        handleResizeStop: function(event, ui) {
            var newWidth = ui.size.width;
            var grid = $(this).parents('.vgrid').data('vgrid');
            grid.resizeColumn($(this).data('name'), newWidth);
            grid.saveGridSettings();
        },
        handleMoveStart: function(event, ui) {
            var grid = $(this).parents('.vgrid').data('vgrid');
            var index = ui.item.index();
            grid.startIndex = index;
        },
        handleMoveStop: function(event, ui) {
            var grid = $(this).parents('.vgrid').data('vgrid');
            var index = ui.item.index();
            grid.moveColumn(grid.startIndex, index);
            grid.saveGridSettings();
        },
        resizeColumn: function(name, width) {
            this.vgrid_body.find('[data-name="' + name + '"]').outerWidth(width);
        },
        moveColumn: function(fromIndex, toIndex) {
            this.vgrid_body.children().each(function(index, obj) {
                var col = $(this).children().get(fromIndex);
                var target = $(this).children().get(toIndex);
                if (toIndex === fromIndex) {
                    return;
                } else {
                    $(col).remove();
                    if (toIndex > fromIndex) {
                        $(col).insertAfter(target);
                    } else {
                        $(col).insertBefore(target);
                    }
                }
            });
        },
        configSettingsMenu: function(img) {
            var grid = this;
            if (this.options.enhancedSettingsMenu) {
                grid.vgrid_head.find('div.filter-div').hide();
                grid.vgrid_element.find('.vgrid-menu').remove();
                grid.vgrid_element.append($("<div class='vgrid-menu-filter'></div>"));
                img.click(function(evt) {
                    grid.populateFilterMenu(grid.vgrid_element.find('.vgrid-menu-filter'));
                    $('body').append($('<div id="vgrid-filter-overlay" class="ui-widget-overlay ui-front"></div>'));
                    grid.vgrid_element.children('.vgrid-menu-filter').slideDown(500);
                });
            } else {
                img.click(function(evt) {
                    var $menuColumn = grid.vgrid_element.find('.vgrid-menu-column-list');
                    grid.populateMenuColumns($menuColumn);

                    window.setTimeout(function() {
                        var heightPresent = $(window).height() - 130;
                        var scrollHeight = $menuColumn.prop('scrollHeight');

                        if ($menuColumn.height() > heightPresent) {
                            $menuColumn.height(heightPresent).css('overflow-y', 'auto')
                        }
                        else if (scrollHeight > $menuColumn.height()) {
                            if (scrollHeight < heightPresent) {
                                $menuColumn.height(scrollHeight);
                            }
                            else {
                                $menuColumn.height(heightPresent);
                            }
                        }
                    }, 200);

                    grid.vgrid_element.children('.vgrid-menu').slideDown(200);
                });

                $('body').on('click', function(evt) {
                    var target = evt.target;
                    if ($(target).closest('.vgrid-menu').size() === 0 && target.tagName !== 'IMG') {
                        $('.vgrid-menu').slideUp(200, function() {
                        });
                    }
                });
            }
        },
        /*
         * New Filter/Sort/Hiding menu
         * @param {type} container
         * @returns nil
         */
        populateFilterMenu: function(container) {
            var grid = this;
            grid.filterPopupActivity = false;
            container.empty();
            var columns = this.vgrid_head.children('.vgrid-column');

            container.append($("<h2 style='margin-bottom:8px;margin-top:1px;'>Filtering and Sorting <a class='remodal-close' href='#' style='text-align: right; float: right; display: block;'></a></h2>"));
            container.append($('<div class="or-spacer"><div class="mask"></div></div>'));

            //middle part of dialog
            var table_container = $('<div class="vgrid-menu-filter-table-container">');
            var table = $('<table class="vgrid-menu-filter-table vzuui-dataGrid">');

            //create header
            var table_header = $('<thead>');
            var header = $('<tr>');
            header.addClass("vgrid-menu-filter-header");
            header.append($("<th class='vgrid-menu-filter-header-show-columns'>Show Columns</th>"));
            header.append($("<th class='vgrid-menu-filter-header-columns'>Columns</th>"));
            header.append($("<th class='vgrid-menu-filter-header-positioning-sorting'>Sorting Order</th>"));
            header.append($("<th class='vgrid-menu-filter-header-conditions'>Conditions</th>"));
            table_header.append(header);
            table.append(table_header);

            //create table body
            var table_body = $('<tbody>');
            var table_row;
            columns.each(function(index, obj) {
                var temp;
                var $obj = $(obj);
                table_row = $('<tr>');

                var td;

                td = $("<td>");
                td.attr('data-name', $obj.data('name'));
                temp = "<input class='vgrid-menu-filter-show-checkbox' type='checkbox' name='" + $obj.data('name') + "'";
                if ($obj.is(":visible")) {
                    temp += ' checked';
                }
                temp += ">";
                td.html(temp);
                table_row.append(td);

                td = $("<td>");
                td.attr('data-name', $obj.data('name'));
                td.html($obj.text());
                table_row.append(td);

                td = $("<td>");
                td.attr('data-name', $obj.data('name'));
                //create select for positioning and sorting
                var sortPos = $obj.data('sort-pos');
                var posAndSortSelect = "<select class='vgrid-menu-filter-sort-select'>";
                posAndSortSelect += "<option value=''>None</option>";
                columns.each(function(index, obj) {
                    posAndSortSelect += "<option value='" + (index + 1) + "'";
                    if (sortPos !== null && sortPos === (index + 1)) {
                        posAndSortSelect += " selected";
                    }
                    posAndSortSelect += ">" + (index + 1) + "</option>";
                });
                posAndSortSelect += "</select>";

                td.append($(posAndSortSelect));
                var sortDir = $obj.data('sort-dir');
                var posAndSortSelectDir = "<select class='vgrid-menu-filter-sort-select-dir'>";
                posAndSortSelectDir += "<option value='ASC' " + (sortDir === 'ASC' ? 'selected' : '') + ">A-Z</option>";
                posAndSortSelectDir += "<option value='DESC' " + (sortDir === 'DESC' ? 'selected' : '') + ">Z-A</option>";
                posAndSortSelectDir += "</select>";
                td.append($(posAndSortSelectDir));
                table_row.append(td);

                td = $("<td>");
                td.attr('data-name', $obj.data('name'));
                td.attr('data-type', $obj.data('type'));
                var filterVal = $obj.data('filter-value');
                if (filterVal === undefined)
                    filterVal = "";

                temp = "<input class='vgrid-menu-filter-filter-text' type='text' name='" + $obj.data('name') + "' value='" + filterVal + "'>";
                td.html(temp);
                table_row.append(td);

                table_body.append(table_row);
            });
            table.append(table_body);
            table_container.append(table);
            container.append(table_container);

            //footer part of dialog
            var footer_container = $('<div class="vgrid-menu-filter-footer-container">');
            var table = $('<table>');
            //table.append("<tr><td colspan='3' style='text-align:center;'><button class='vzuui-btn-gray vgrid-menu-filter-footer-apply-btn' type='button'>Apply</button></td></tr>");
            table.append("<tr><td>Configuration Name:</td><td><input value='" + grid.getDefaultConfigJS() + "' type='text'></td><td><button class='vzuui-btn-red vgrid-menu-filter-footer-save-btn' type='button'>Apply</button><button style='margin-left: 15px;' class='vzuui-btn-gray vgrid-menu-filter-footer-reset-btn' type='button'>Reset</button></td></tr>");
            footer_container.append(table);
            var div = $("<div>");
            div.css("margin-top", "10px");
            div.append("Just click to apply defined/saved filters.");
            footer_container.append(div);
            div = $("<div class='vgrid-menu-filter-footer-container-configs'>");
            if (window.configs) {
                grid.renderConfigs(div);
            }
            footer_container.append(div);

            container.append(footer_container);

            //
            //
            //Event handlers
            //
            //
            container.find('.remodal-close').click(function() {
                container.slideUp(500, function() {
                    $('#vgrid-filter-overlay').remove();
                    grid.filterPopupActivity && window.location.reload();
                });
                return false;
            });
            container.find('.vgrid-menu-filter-footer-save-btn').click(function() {
                var name = $('.vgrid-menu-filter-footer-container input').val();
                var promises = [];
                name = name.trim();
                if (name !== '') {
                    var new_config_name = grid.options.uiObjectConfigName + "." + name;
                    grid.setColumnSettings(container);

                    //are we creating a new config, if so save it in config entry
                    if (!grid.haveConfig(name)) {
                        var deferred = $.Deferred();
                        promises.push(grid.saveConfigsSettings(name, new_config_name));
                        promises.push(deferred);
                        grid.saveUserNamedDefaultGridSettings(new_config_name, function() {
                            deferred.resolve();
                        });
                    }

                    promises.push(grid.saveNamedGridSettings(new_config_name));
                    grid.filterPopupActivity = true;
                    $('.vgrid-menu-filter-footer-container-configs').empty();
                    grid.renderConfigs($('.vgrid-menu-filter-footer-container-configs'));
                    $('.vgrid-menu-filter-footer-container input').val('');
                } else {
                    var default_config = grid.getDefaultConfig();
                    grid.setColumnSettings(container);
                    promises.push(grid.saveUserDefaultGridSettings(default_config));
                    grid.filterPopupActivity = true;
                }

                $.when.apply($, promises).done(function() {
                    container.slideUp(500, function() {
                        window.setTimeout(function() {
                            //$('#vgrid-filter-overlay').remove();
                            window.location.reload();
                        }, 500);
                    });
                });

            });
            container.find('.vgrid-menu-filter-footer-reset-btn').click(function() {
                grid.resetColumnSettings(container);
                grid.setColumnSettings(container, true);
                if (grid.options.uiObjectName) {
                    UiSettingsDelete(grid.options.uiObjectName);
                }
            });

            //init date pickers
            container.find("td[data-type='DATE'] input").each(function(index, obj) {
                //Delay the creation of the daterangepicker widget until the
                //textbox is clicked the first time.
                //this avoids strange rendering bugs
            	$(obj).prop('readonly','readonly'); //make readonly to prevent user from entering bad data
                $(obj).one('click', function() {
                    $(obj).daterangepicker({
                        dateFormat: 'yy-mm-dd'
                    });
                    //delay the triggering of the click event by 100ms
                    //this avoids other strange rendering bugs
                    setTimeout(function() {
                        $(obj).trigger('click');
                    }, 100);

                });
            });
        },
        renderConfigs: function(container) {
            var grid = this;
            container.append("<div data-ui_object_name='_default_' data-default='" + (grid.haveDefault() ? "false" : "true") + "' data-name='_default_' class='config-card'>Default</div>");
            for (var i = 0; i < window.configs.length; i++) {
                var config = window.configs[i];
                container.append("<div data-ui_object_name='" + config.ui_object_name + "' data-default='" + (config["default"]) + "' data-name='" + config.name + "' class='config-card'>" + config.name + "<div class='config'></div></div>");
            }

            //
            //
            //Event Handlers
            //
            //
            container.find('.config-card').click(function() {
                var $this = $(this);
                var name = $this.attr("data-name");
                var defaultValue = $this.attr("data-default");
                var container = $this.parent();
                var container_children = container.children();
                var newValue;

                if (defaultValue === "true") {
                    return;
                }

                if (defaultValue === "true") {
                    newValue = "false";
                } else {
                    newValue = "true";
                }

                container_children.attr("data-default", "false").data("default", "false");
                $this.attr("data-default", newValue).data("default", newValue);
                var default_ui_config_name = "";
                var default_name = "";
                if (window.configs) {
                    for (var i = 0; i < window.configs.length; i++) {
                        var config = window.configs[i];
                        config["default"] = "false";
                        if (config.name === name) {
                            config["default"] = newValue;
                            default_ui_config_name = config.ui_object_name;
                            default_name = config.name;
                        }
                    }
                }
                if (default_ui_config_name !== "") {
                    if (newValue === "true") {
                        $('.vgrid-menu-filter-footer-container input').val(default_name);
                        grid.saveUserNamedDefaultGridSettings(default_ui_config_name, function() {
                            grid.handleConfigSwitch(default_ui_config_name);
                        });

                    } else {
                        $('.vgrid-menu-filter-footer-container input').val("");
                        grid.saveUserNamedDefaultGridSettings(null, function() {
                            grid.handleConfigSwitch(grid.options.uiObjectName);
                        }); //clear default

                    }
                }

                if (name === "_default_") {
                    $('.vgrid-menu-filter-footer-container input').val("");
                    grid.saveUserNamedDefaultGridSettings(null, function() {
                        grid.handleConfigSwitch(grid.options.uiObjectName);
                    }); //clear default

                }

                //grid.saveConfigsSettings();
                grid.filterPopupActivity = true;
            });

            //Delete
            container.find('.config').click(function() {
                grid.handleConfigDelete(this);
            });
        },
        handleConfigSwitch: function(ui_config_name) {
            var grid = this;
            var table_body = $('.vgrid-menu-filter-table tbody');

            table_body.empty();
            grid.vgrid_head.empty();
            grid.vgrid_body.empty();

            UiSettingsRetrieve(ui_config_name, function(data) {
                if (!data)
                    return;

                $.each(data.columns, function(index, obj) {
                    var table_row = $('<tr>'), temp;

                    //Columns
                    var td;
                    //Show Columns checkbox
                    td = $("<td>");
                    td.attr('data-name', obj.name);
                    temp = "<input class='vgrid-menu-filter-show-checkbox' type='checkbox' name='" + obj.name + "'";
                    if (obj.visible) {
                        temp += ' checked';
                    }
                    temp += ">";
                    td.html(temp);
                    table_row.append(td);

                    td = $("<td>");
                    td.attr('data-name', obj.name);
                    td.html(obj.label);
                    table_row.append(td);

                    //Sorting Order
                    td = $("<td>");
                    td.attr('data-name', obj.name);
                    //create select for positioning and sorting
                    var sortPos = parseInt(obj.sortPos, 10);
                    var posAndSortSelect = "<select class='vgrid-menu-filter-sort-select'>";
                    posAndSortSelect += "<option value=''>None</option>";
                    $.each(data.columns, function(index, obj) {
                        posAndSortSelect += "<option value='" + (index + 1) + "'";
                        if (sortPos !== undefined && sortPos === (index + 1)) {
                            posAndSortSelect += " selected";
                        }
                        posAndSortSelect += ">" + (index + 1) + "</option>";
                    });
                    posAndSortSelect += "</select>";

                    td.append($(posAndSortSelect));
                    var sortDir = obj.sortDir;
                    var posAndSortSelectDir = "<select class='vgrid-menu-filter-sort-select-dir'>";
                    posAndSortSelectDir += "<option value='ASC' " + (sortDir === 'ASC' ? 'selected' : '') + ">A-Z</option>";
                    posAndSortSelectDir += "<option value='DESC' " + (sortDir === 'DESC' ? 'selected' : '') + ">Z-A</option>";
                    posAndSortSelectDir += "</select>";
                    td.append($(posAndSortSelectDir));
                    table_row.append(td);

                    //Conditions
                    td = $("<td>");
                    td.attr('data-name', obj.name);
                    td.attr('data-type', obj.type);
                    var filterVal = obj.filterValue;
                    if (filterVal === undefined)
                        filterVal = "";

                    temp = "<input class='vgrid-menu-filter-filter-text' type='text' name='" + obj.name + "' value='" + filterVal + "'>";
                    td.html(temp);
                    table_row.append(td);

                    table_body.append(table_row);

                    //<div class="vgrid-column  ui-resizable" data-name="humantaskInfoID" data-sort-pos="3" data-sort-dir="ASC" data-filter="Y" data-type="NUMBER" style="width:160px;"><a class="vgrid-column-sort-link" href="#">Human Task Info ID<div style="display: none;" class="filter-div"><div class="filter-down-arrow"></div></div></a><div style="z-index: 90;" class="ui-resizable-handle ui-resizable-e"></div></div>
                    //<div class="vgrid-column  ui-resizable" data-name="taskSource" data-sort-dir="ASC" data-filter="Y" data-type="STRING" style="width:160px;"><a class="vgrid-column-sort-link" href="#">Task Source<div style="display: none;" class="filter-div"><div class="filter-down-arrow"></div></div></a><div style="z-index: 90;" class="ui-resizable-handle ui-resizable-e"></div></div>
                    var col = $('<div class="vgrid-column  ui-resizable" data-name="' + obj.name + '" data-sort-dir="' + obj.sortDir + '" data-filter="' + obj.isFilter + '" data-type="' + obj.type + '" style="width:' + obj.width + 'px;"><a class="vgrid-column-sort-link" href="#">' + obj.label + '<div style="display: none;" class="filter-div"><div class="filter-down-arrow"></div></div></a><div style="z-index: 90;" class="ui-resizable-handle ui-resizable-e"></div></div>');
                    grid.vgrid_head.append(col);

                });
                //init date pickers
                table_body.find("td[data-type='DATE'] input").each(function(index, obj) {
                    //Delay the creation of the daterangepicker widget until the
                    //textbox is clicked the first time.
                    //this avoids strange rendering bugs
                	$(obj).prop('readonly','readonly'); //make readonly to prevent user from entering bad data
                    $(obj).one('click', function() {
                        $(obj).daterangepicker({
                            dateFormat: 'yy-mm-dd'
                        });
                        //delay the triggering of the click event by 100ms
                        //this avoids other strange rendering bugs
                        setTimeout(function() {
                            $(obj).trigger('click');
                        }, 100);

                    });
                });
            });
        },
        handleConfigSwitch2: function(ui_config_name) {
            var grid = this;
            UiSettingsRetrieve(ui_config_name, function(data) {
                $.each(data.columns, function(index, obj) {
                    var tds = $('.vgrid-menu-filter-table [data-name="' + obj.name + '"]');
                    if (tds.size() > 0) {
                        grid.handleConfigSwitchVisible(obj.visible, tds.eq(1));
                        grid.handleConfigSwitchSortOrder(obj.sortPos, obj.sortDir, tds.eq(2));
                        grid.handleConfigSwitchFilter(obj.filterValue, tds.eq(3));

                    }
                });
            });
        },
        handleConfigSwitchVisible: function(visible, td) {
            var checkbox = td.find('input');
            checkbox.prop('checked', visible);
        },
        handleConfigSwitchSortOrder: function(sortPos, sortDir, td) {
            var pos = td.find('.vgrid-menu-filter-sort-select');
            var dir = td.find('.vgrid-menu-filter-sort-select-dir');
            pos.val(sortPos);
            dir.val(sortDir);
        },
        handleConfigSwitchFilter: function(value, td) {
            var textbox = td.find('input');
            textbox.val(value);
        },
        handleConfigDelete: function(element) {
            var grid = this;
            var $element = $(element);
            var name = $element.parent().data("name");
            var ui_object_name = $element.parent().data("ui_object_name");
            var deleting_default = false;

            if (window.configs) {
                for (var i = window.configs.length - 1; i >= 0; i--) {
                    if (window.configs[i].name === name) {
                        if (window.configs[i]["default"] === "true") {
                            deleting_default = true;
                        }
                        window.configs.splice(i, 1);
                    }
                }
            }
            $('.vgrid-menu-filter-footer-container-configs').empty();
            grid.renderConfigs($('.vgrid-menu-filter-footer-container-configs'));
            if (deleting_default || window.configs.length === 0) {
                grid.saveUserNamedDefaultGridSettings(null, function() {
                    grid.handleConfigSwitch(grid.options.uiObjectName);
                });
            }

            grid.saveConfigsSettings();

            grid.filterPopupActivity = true;
            UiSettingsDelete(ui_object_name);
        },
        resetColumnSettings: function(container) {
            var grid = this;
            var trs = container.find('.vgrid-menu-filter-table tr');
            trs.each(function(index, obj) {
                var $obj = $(obj);
                $obj.find('input,select').each(function(index2, obj2) {
                    var $obj2 = $(obj2);
                    if ($obj2.hasClass('vgrid-menu-filter-show-checkbox')) {
                        $obj2.prop('checked', true);
                    } else if ($obj2.hasClass('vgrid-menu-filter-filter-text')) {
                        $obj2.val("");
                    } else if ($obj2.hasClass('vgrid-menu-filter-sort-select')) {
                        //$('option:selected', $obj2).removeAttr('selected');
                    	$obj2.val("");
                    } else if ($obj2.hasClass('vgrid-menu-filter-sort-select-dir')) {
                       //$('option:selected', $obj2).removeAttr('selected');
                    	$obj2.val("ASC");
                    }
                });
            });
        },
        setColumnSettings: function(container, clearFilter) {
            clearFilter = !!clearFilter;
            var grid = this;
            var trs = container.find('.vgrid-menu-filter-table td');
            trs.each(function(index, tr_obj) {
                var $tr_obj = $(tr_obj);
                var domColumn = grid.vgrid_head.children('.vgrid-column[data-name=' + $tr_obj.data('name') + ']');
                $tr_obj.find('input,select').each(function(index2, td_obj) {
                    var $td_obj = $(td_obj);
                    if ($td_obj.hasClass('vgrid-menu-filter-show-checkbox')) {
                        domColumn.css('display', $td_obj.prop('checked') ? 'inline-block' : 'none');
                    } else if ($td_obj.hasClass('vgrid-menu-filter-filter-text')) {
                        if ($td_obj.val() !== "" || clearFilter) {
                            domColumn.attr('data-filter-value', $td_obj.val());
                            domColumn.data('filter-value', $td_obj.val());
                        } else if ($td_obj.val() === "" && domColumn.data('filter-value') !== "") {
                            domColumn.attr('data-filter-value', $td_obj.val());
                            domColumn.data('filter-value', $td_obj.val());
                        }
                    } else if ($td_obj.hasClass('vgrid-menu-filter-sort-select')) {
                        domColumn.attr('data-sort-pos', $td_obj.val());
                        domColumn.data('sort-pos', $td_obj.val());
                    } else if ($td_obj.hasClass('vgrid-menu-filter-sort-select-dir')) {
                        domColumn.attr('data-sort-dir', $td_obj.val());
                        domColumn.data('sort-dir', $td_obj.val());
                    }
                });
            });
        },
        populateMenuColumns: function(container) {
            var grid = this;
            container.empty();
            var columns = this.vgrid_head.children('.vgrid-column');
            var temp = '';
            columns.each(function(index, obj) {
                temp = '<div><input class="vgrid-column-checkbox" type="checkbox" name="' + $(obj).data('name') + '" value="' + $(obj).data('name') + '"';
                if ($(obj).is(":visible")) {
                    temp += 'checked';
                }
                temp += '>' + $(obj).text() + '</div>';
                container.append(temp);
            });

            container.find('input').change(function(evt) {
                var target = evt.target;
                var name = $(target).val();
                if ($(this).is(':checked')) {
                    grid.vgrid_head.find('[data-name="' + name + '"]').show();
                    grid.vgrid_body.find('[data-name="' + name + '"]').show();
                } else {
                    grid.vgrid_head.find('[data-name="' + name + '"]').hide();
                    grid.vgrid_body.find('[data-name="' + name + '"]').hide();
                }
                grid.saveGridSettings();
            });
        },
        doSortJs: function(name, dir) {
            var grid = this;
            var header = grid.vgrid_head.find('[data-name="' + name + '"]');
            var cols = grid.vgrid_body.find('[data-name="' + name + '"]');
            var inverse = !!dir;

            var sort_dir = header.data('sort_dir');
            if (!sort_dir) {
                header.data('sort_dir', "ASC");
                sort_dir = header.data('sort_dir');
            }

            if (sort_dir == 'DESC') {
                inverse = !inverse;
                header.data('sort_dir', "ASC");
            } else {
                header.data('sort_dir', "DESC");
            }


            cols.sortElements(function(a, b) {
                a = $(a).text();
                b = $(b).text();
                return (
                        isNaN(a) || isNaN(b) ?
                        a > b : +a > +b
                        ) ?
                        inverse ? -1 : 1 :
                        inverse ? 1 : -1;

            }, function() {
                return this.parentNode;
            });
        },
        doSort: function(name, nrows) {
            var grid = this;

            if (grid.doSortInProgress) {
                return;
            }

            grid.doSortInProgress = true;

//console.log(" do sort ------");
            var spinner = new Spinner({top: 75, radius: 20, length: 50, lines: 15});

            spinner.spin(grid.vgrid_element.get(0));


            var params = $.extend({},
                    this.options.sortData ? this.options.sortData : {},
                    {
                        sortname: name,
                        'rand': Math.random()
                    }
            );
            var params = [];
            if (this.options.sortData) {
                for (var i in this.options.sortData) {
                    params.push({
                        name: i,
                        value: this.options.sortData[i]
                    });
                }
            }
            params.push({
                name: 'sortname',
                value: name
            });
            params.push({
                name: 'rand',
                value: Math.random()
            });
            params.push({
                name: 'nrows',
                value: nrows
            });

            var columns = this.vgrid_head.children('.vgrid-column');
            columns.each(function(index, obj) {
                var $obj = $(obj);
                params.push({
                    name: 'column_name',
                    value: $obj.data('name')
                });
                params.push({
                    name: 'column_width',
                    value: Math.floor($obj.outerWidth())
                });
                params.push({
                    name: 'column_visible',
                    value: $obj.is(':visible')
                });
            });

            $.ajax({
                url: this.options.sortUrl,
                type: "POST",
                data: params,
                success: function(data) {
                    //console.log(" vgrid sort success options ="+grid.options.sortCallback);
                    grid.vgrid_body.html(data);
                    spinner.stop();
                    if (grid.options.sortCallback) {
                        grid.options.sortCallback();
                    }
                    grid.doSortInProgress = false;
                }
            });
        },
        startWait: function() {
            var grid = $(this).data('vgrid');

            try {
                grid.spinner.stop();
            } catch (e) {
            }

            grid.spinner = new Spinner({top: 75, radius: 20, length: 50, lines: 15});

            grid.spinner.spin(grid.vgrid_element.get(0));
        },
        endWait: function() {
            var grid = $(this).data('vgrid');
            grid.spinner.stop();
        },
        getParams: function(row) {
            var cols = row.find('[data-editable=Y],[data-editable=N],[data-editable=C],[data-editable=M]');
            var params = [];
            for (var i = 0; i < cols.length; i++) {
                var col = $(cols[i]);

                var name = col.data('name');
                var value;
                var child = col.find('input, select');
                if (child.length > 0) {
                    value = child.val();
                } else {
                    value = col.text();
                }
                params.push({
                    name: 'name',
                    value: name
                });
                params.push({
                    name: 'value',
                    value: value
                });
            }

            return params;
        },
        getRowData: function(row, callback) {
            var grid = $(this).data('vgrid');
            if (callback) {
                callback(grid.getParams(row));
            }

        },
        handleType: function(col, type, current_value, default_value) {
            current_value = current_value || "";
            default_value = default_value || "";

            if (type === 'STRING') {
                var input = $("<input>");
                input.css("width", "100%");
                input.val(current_value);
                col.append(input);
            }
            else if (type === 'NUMBER') {
                var input = $("<input>");
                input.css("width", "100%");
                input.val(current_value);
                col.append(input);
            }
            else if (type === 'STRINGLIST') {
                var select = $("<select>");
                var values = default_value.split('|');
                select.css("width", "100%");
                for (var i = 0; i < values.length; i++) {
                    var optionParam = values[i].split('~');
                    var option = $('<option>');
                    if (optionParam.length > 1) {
                        option.attr('value', optionParam[0]).text(optionParam[1]);
                    }
                    else {
                        option.attr('value', optionParam[0]).text(optionParam[0]);
                    }

                    if (current_value == optionParam[0]) {
                        option.attr("selected", "true");
                    }
                    option.appendTo(select);
                }
                //input.val(current_value);
                col.append(select);
            }
            else if (type === 'BIGSTRING') {
                var dialog = $('<div>');
                dialog.css({'display': 'none', overflow: 'hidden'});
                dialog.attr('title', 'Editing ' + col.data('name'));
                $(document.body).append(dialog);

                var textarea = $("<textarea>");
                textarea.css({"width": "100%", "height": "100%"});
                textarea.val(current_value);
                dialog.append(textarea);

                var input_container = $('<div>');
                input_container.css({'width': '100%', 'float': 'left'});
                var input_wrapper = $('<div>');
                input_wrapper.css({'margin-right': '40px'});

                var input = $("<input>");
                input.css("width", "100%");
                input.val(current_value);
                input_wrapper.append(input);
                input_container.append(input_wrapper);
                col.append(input_container);

                var edit_btn = $('<a>');
                var edit_btn = makeVzButton('Edit', 'action-EDITFIELD');
                edit_btn.css({"margin-top": "-6px", 'margin-left': '-38px'});
                col.append(edit_btn);

                $(edit_btn).click(function(evt) {
                    evt.preventDefault();
                    //input.css({display: "block"});
                    dialog.dialog({
                        resizable: true,
                        height: 400,
                        width: 400,
                        modal: true,
                        buttons: {
                            Save: function() {
                                input.val($(this).children('textarea').val());
                                $(this).dialog("close");
                                $(this).remove();
                            },
                            Cancel: function() {
                                $(this).dialog('close');
                                $(this).remove();
                            }
                        }
                    });
                    return false;
                });
            } else if (type === 'DATE') {
                var input = $("<input>");
                input.css("width", "100%");
                input.val(current_value);
                col.append(input);
                input.datepicker({dateFormat: "yy-mm-dd"});
            }

        },
        createColumn: function(classList, attrHash, childrenList, editable, type, defaultValue) {
            classList = classList || [];
            attrHash = attrHash || {};
            childrenList = childrenList || [];

            var col = $('<div>');

            for (var i = 0; i < classList.length; i++) {
                col.addClass(classList[i]);
            }

            for (var name in attrHash) {
                col.attr(name, attrHash[name]);
            }

            for (var i = 0; i < childrenList.length; i++) {
                col.append(childrenList[i]);
            }

            if (editable) {
                this.handleType(col, type, defaultValue, defaultValue);
            }

            return col;
        },
        insertRowForCreate: function(completeCallback, createCallback) {
            var grid = $(this).data('vgrid');
            var columns = grid.vgrid_head.children('.vgrid-column');
            var row = $('<div>');
            row.addClass('vgrid-row');
            row.addClass('vgrid-row-edit');

            grid.createColumn(['vgrid-left-gutter'], {"data-name": "_LEFT_GUTTER_"}).appendTo(row);

            var submit_btn = makeVzButton('CREATE', 'action-CREATESUBMIT');

            var cancel_btn = makeVzButton('CANCEL', 'action-CANCELSUBMIT');

            $(cancel_btn).click(function(evt) {
                evt.preventDefault();
                row.slideUp({
                    complete: function() {
                        row.remove();
                    }
                });

                return false;
            });

            var action_column = grid.vgrid_head.children('.vgrid-column[data-name=ROW_ACTIONS]');
            var col = grid.createColumn(['vgrid-column'], {"data-name": "ROW_ACTIONS"}, [submit_btn, cancel_btn]);
            col.css('width', "" + ($(action_column).outerWidth()) + "px");
            col.appendTo(row);

            columns.each(function(index, obj) {
                var col;
                var type;
                var editable = false;
                var defaultValue = "";
                var attrHash = {};
                var childrenList = [];

                if ($(obj).data('name') !== 'ROW_ACTIONS') {
                    for (var i = 0; i < obj.attributes.length; i++) {
                        if (obj.attributes[i].name.substring(0, 4) == "data") {
                            attrHash[obj.attributes[i].name] = obj.attributes[i].value;
                        }
                        if (obj.attributes[i].name == "data-type") {
                            type = obj.attributes[i].value;
                        }
                        else if (obj.attributes[i].name == "data-editable" && (obj.attributes[i].value == 'Y' || obj.attributes[i].value == 'C')) {
                            editable = true;
                        }
                        else if (obj.attributes[i].name == "data-defaultvalue") {
                            defaultValue = obj.attributes[i].value;
                        }
                    }


                    col = grid.createColumn(['vgrid-column'], attrHash, childrenList, editable, type, defaultValue);
                    col.css('width', "" + ($(obj).outerWidth()) + "px"); //don't understand why this has to be done
                    //still a little off with IE :-(
                    col.appendTo(row);
                }
            });

            row.hide();
            row.prependTo(grid.vgrid_body);
            row.slideDown({
                complete: function() {
                    row.height(32);
                }
            });
            row.children('.vgrid-column[data-editable=Y],.vgrid-column[data-editable=C]').find('input, select').get(0).focus();

            if (completeCallback) {
                completeCallback(row);
            }
            $(submit_btn).click(function(evt) {
                evt.preventDefault();
                var params = grid.getParams(row);
                if (createCallback) {
                    createCallback(params, row);
                }
                return false;
            });
        },
        insertRowJustCancel: function(completeCallback, createCallback) {
            var grid = $(this).data('vgrid');
            var columns = grid.vgrid_head.children('.vgrid-column');
            var row = $('<div>');
            row.addClass('vgrid-row');

            var cancel_btn = makeVzButton('DELETE', 'action-CANCELSUBMIT');

            $(cancel_btn).click(function(evt) {
                evt.preventDefault();
                row.slideUp({
                    complete: function() {
                        row.remove();
                    }
                });

                return false;
            });

            var action_column = grid.vgrid_head.children('.vgrid-column[data-name=ROW_ACTIONS]');
            var col = grid.createColumn(['vgrid-column'], {"data-name": "ROW_ACTIONS"}, [cancel_btn]);
            col.css('width', "" + ($(action_column).outerWidth()) + "px");
            col.appendTo(row);

            columns.each(function(index, obj) {
                var col;
                var type;
                var editable = false;
                var defaultValue = "";
                var attrHash = {};
                var childrenList = [];

                if ($(obj).data('name') !== 'ROW_ACTIONS') {
                    for (var i = 0; i < obj.attributes.length; i++) {
                        if (obj.attributes[i].name.substring(0, 4) == "data") {
                            attrHash[obj.attributes[i].name] = obj.attributes[i].value;
                        }
                        if (obj.attributes[i].name == "data-type") {
                            type = obj.attributes[i].value;
                        }
                        else if (obj.attributes[i].name == "data-editable" && (obj.attributes[i].value == 'Y' || obj.attributes[i].value == 'C')) {
                            editable = true;
                        }
                        else if (obj.attributes[i].name == "data-defaultvalue") {
                            defaultValue = obj.attributes[i].value;
                        }
                    }


                    col = grid.createColumn(['vgrid-column'], attrHash, childrenList, editable, type, defaultValue);
                    col.css('width', "" + ($(obj).outerWidth()) + "px"); //don't understand why this has to be done
                    //still a little off with IE :-(
                    col.appendTo(row);
                }
            });

            row.hide();
            row.prependTo(grid.vgrid_body);
            row.slideDown({
                complete: function() {
                    row.height(32);
                }
            });
            
            if(row.children('.vgrid-column[data-editable=Y],.vgrid-column[data-editable=C]').find('input, select').size() > 0){
            	row.children('.vgrid-column[data-editable=Y],.vgrid-column[data-editable=C]').find('input, select').get(0).focus();
            }

            if (completeCallback) {
                completeCallback(row);
            }
        },
        cancelRowForInsert: function(row) {
            var grid = $(this).data('vgrid');
            var columns = row.children('.vgrid-column[data-editable=Y],.vgrid-column[data-editable=M],.vgrid-column[data-editable=C]');
            row.removeClass('vgrid-row-edit');
            row.addClass('vgrid-row-edited');

            columns.each(function(index, obj) {
                var col = $(obj);
                var value;
                var child = col.find('input, select');
                if (child.length > 0) {
                    value = child.val();
                } else {
                    value = col.text();
                }
                col.empty();
                col.text(value);
            });

            var action_col = row.children('.vgrid-column[data-name=ROW_ACTIONS]');
            action_col.children('.action-CANCELSUBMIT, .action-CREATESUBMIT').remove();
            action_col.children().show();
        },
        modifyRowForEdit: function(row, completeCallback, modifyCallback) {
            var grid = $(this).data('vgrid');
            var columns = row.children('.vgrid-column[data-editable=Y],.vgrid-column[data-editable=M]');
            row.addClass('vgrid-row-edit');

            columns.each(function(index, obj) {
                var col = $(obj);
                var text = col.text();
                var head_column = grid.vgrid_head.children('.vgrid-column[data-name=' + col.data('name') + ']');
                col.empty();
                grid.handleType(col, col.data('type'), text, head_column.data('defaultvalue'));
            });

            var action_col = row.children('.vgrid-column[data-name=ROW_ACTIONS]');
            action_col.children().hide();

            var submit_btn = makeVzButton('MODIFY', 'action-EDITSUBMIT');
            action_col.append(submit_btn);

            var cancel_btn = makeVzButton('CANCEL', 'action-CANCELSUBMIT');
            action_col.append(cancel_btn);

            $(cancel_btn).click(function(evt) {
                evt.preventDefault();
                grid.cancelRowForEdit(row, true);
                return false;
            });

            $(submit_btn).click(function(evt) {
                evt.preventDefault();
                var params = grid.getParams(row);
                if (modifyCallback) {
                    modifyCallback(params, row);
                }
                return false;
            });

            row.children('.vgrid-column[data-editable=Y],.vgrid-column[data-editable=M]').find('input, select').get(0).focus();

            if (completeCallback) {
                completeCallback(row);
            }
        },
        cancelRowForEdit: function(row, noedit) {
            var grid = $(this).data('vgrid');
            var columns = row.children('.vgrid-column[data-editable=Y],.vgrid-column[data-editable=M]');
            row.removeClass('vgrid-row-edit');
            if (!noedit) {
                row.addClass('vgrid-row-edited');
            }

            columns.each(function(index, obj) {
                var col = $(obj);
                var value;
                var child = col.find('input, select');
                if (child.length > 0) {
                    value = child.val();
                } else {
                    value = col.text();
                }
                col.empty();
                col.text(value);
            });

            var action_col = row.children('.vgrid-column[data-name=ROW_ACTIONS]');
            action_col.children('.action-CANCELSUBMIT, .action-EDITSUBMIT').remove();
            action_col.children().show();
        },
        handleFilterMenu: function(col) {
            var grid = this;
            var type = col.data('type');
            var popupdiv = $(this.vgrid_head).children('.filter-menu[data-name=' + col.data("name") + ']');
            if (popupdiv.length > 0) {
                popupdiv.slideUp({
                    complete: function() {
                        popupdiv.remove();
                        $('.ui-daterangepickercontain').remove();
                    }
                });
                /* if ($.trim(col.siblings('.filter-menu').find('.input-container').find('.filterClear').val()).length >= 1) {
                 col.attr('data-filter-value', '');
                 }
                 else{
                 $('.vgrid-head .vgrid-column').each(function(){$(this).removeAttr('data-filter-value');});
                 col.siblings('.filter-menu').find('.input-container').find('.filterClear').val('');
                 }*/

            } else {
                var popupdivs = $(this.vgrid_head).children('.filter-menu');
                popupdivs.each(function(index, obj) {
                    $(obj).slideUp({
                        complete: function() {
                            $(obj).remove();
                        }
                    });
                    /*if ($.trim(col.siblings('.filter-menu').find('.input-container').find('.filterClear').val()).length >= 1) {
                     col.attr('data-filter-value', '');
                     }
                     else{
                     $('.vgrid-head .vgrid-column').each(function(){$(this).removeAttr('data-filter-value');});
                     col.siblings('.filter-menu').find('.input-container').find('.filterClear').val()
                     }*/
                });

                popupdiv = $("<div>");
                popupdiv.addClass("filter-menu hidedropdown");
                popupdiv.data('name', col.data("name"));
                popupdiv.attr('data-name', col.data("name"));
                var position = col.position();
                popupdiv.css({
                    width: col.outerWidth(),
                    height: type === 'STRINGLIST' ? '200px' : '80px',
                    display: 'none',
                    top: position.top + col.outerHeight(),
                    left: position.left
                });
                $(this.vgrid_head).append(popupdiv);
                popupdiv.slideDown(400, function() {
                    grid.handleFilterMenuType(col, popupdiv);
                    var attr = col.attr('data-filter-value');
                    if (typeof attr == typeof undefined && attr == false) {
                        $(this).find('.input-container').find('.filterClear').val(null);
                    }
                    //col.attr('data-filter-value', null);
                    /*if ($.trim(col.siblings('.filter-menu').find('.input-container').find('.filterClear').val()).length >= 1) {
                     col.attr('data-filter-value', '');
                     }
                     else
                     {
                     col.removeAttr('data-filter-value', '');
                     }*/

                });
            }
        },
        handleFilterMenuType: function(col, menu) {
            var grid = this;
            var type = col.data('type');
            var current_value = col.data('filter-value');
            if (type === 'STRING' || type === 'BIGSTRING') {
                var input_container = $('<div class="input-container"></div>');
                var textfield = $('<input>');
                textfield.val(current_value);
                textfield.attr('placeholder', 'Filter By');
                textfield.appendTo(input_container);
                input_container.appendTo(menu);
                var filter_btn = makeVzButton('Filter', 'action-FILTERSUBMIT');
                filter_btn.appendTo(menu);
                filter_btn.mousedown(function() {
                    $(this).css('background', '#999999').find('span').css('color', '#fff');
                }).mouseup(function() {
                    $(this).css('background', '').find('span').css('color', '');
                });
                filter_btn.click(function() {
                    var value = textfield.val();
                    //$('.input-container').find('.filterClear').val('');
                    //$('.vgrid-head .vgrid-column').each(function(){$(this).removeAttr('data-filter-value');});
                    col.data('filter-value', value);
                    col.attr('data-filter-value', value);
                    grid.doFilterRefresh();
                });
                var reset_btn = makeVzButton('Reset', 'action-FILTERRESET');
                reset_btn.appendTo(menu);
                reset_btn.mousedown(function() {
                    $(this).css('background', '#999999').find('span').css('color', '#fff');
                }).mouseup(function() {
                    $(this).css('background', '').find('span').css('color', '');
                });
                reset_btn.click(function() {
                    var filterColumn = $(this).parents('div[data-name]').attr('data-name');
                    $(this).parent().find('.input-container').find('.filterClear').val('');
                    //col.removeAttr('data-filter-value');
                    //$(this).parent().siblings('.vgrid-column').removeAttr('data-filter-value');
                    grid.vgrid_head.children(".vgrid-column[data-name='" + filterColumn + "']").removeAttr('data-filter-value');
                });
                textfield.keyup(function(e) {
                    if (e.keyCode == 13)
                    {
                        filter_btn.trigger('click');
                    }
                });

                textfield.addClass('filterClear');
            }
            else if (type === 'NUMBER') {
                var input_container = $('<div class="input-container"></div>');
                var textfield = $('<input>');
                textfield.val(current_value);
                textfield.attr('placeholder', 'Filter By');
                textfield.appendTo(input_container);
                input_container.appendTo(menu);
                var filter_btn = makeVzButton('Filter', 'action-FILTERSUBMIT');
                filter_btn.appendTo(menu);
                filter_btn.mousedown(function() {
                    $(this).css('background', '#999999').find('span').css('color', '#fff');
                }).mouseup(function() {
                    $(this).css('background', '').find('span').css('color', '');
                });
                filter_btn.click(function() {
                    var value = $.trim(textfield.val()).toUpperCase();
                    var regexp = new RegExp("[\=<>!]+.*");
                    var match = regexp.exec(value);
                    if (match == null && value.length > 0) {
                        if (value.indexOf("BETWEEN") !== -1) {
                            value = ' ' + value;
                        } else {
                            value = '=' + value;
                        }
                    }
                    value = value.replace(">", "GT");
                    value = value.replace("<", "LT");
                    //$('.input-container').find('.filterClear').val('');
                    //$('.vgrid-head .vgrid-column').each(function(){$(this).removeAttr('data-filter-value');});
                    col.data('filter-value', value);
                    col.attr('data-filter-value', value);
                    grid.doFilterRefresh();
                });
                var reset_btn = makeVzButton('Reset', 'action-FILTERRESET');
                reset_btn.appendTo(menu);
                reset_btn.mousedown(function() {
                    $(this).css('background', '#999999').find('span').css('color', '#fff');
                }).mouseup(function() {
                    $(this).css('background', '').find('span').css('color', '');
                });
                reset_btn.click(function() {
                    var filterColumn = $(this).parents('div[data-name]').attr('data-name');
                    $(this).parent().find('.input-container').find('.filterClear').val('');
                    //col.removeAttr('data-filter-value');
                    //$(this).parent().siblings('.vgrid-column').removeAttr('data-filter-value');
                    grid.vgrid_head.children(".vgrid-column[data-name='" + filterColumn + "']").removeAttr('data-filter-value');
                });
                textfield.keyup(function(e) {
                    if (e.keyCode == 13)
                    {
                        filter_btn.trigger('click');
                    }
                });
                textfield.addClass('filterClear');
            }
            else if (type === 'STRINGLIST') {
                var values = col.data('defaultvalue').split('|');
                var curr_values = [];
                if (col.data('filter-value')) {
                    curr_values = col.data('filter-value').split(':');
                }

                var ul = $('<ul>');
                ul.addClass("stringlist");
                var checkbox;
                var li;
                for (var i = 0; i < values.length; i++) {
                    li = $("<li>");
                    checkbox = $('<input type="checkbox">');
                    for (var j = 0; j < curr_values.length; j++) {
                        if (curr_values[j] == values[i]) {
                            checkbox.prop('checked', true);
                            break;
                        }
                    }
                    checkbox.val(values[i]);
                    checkbox.appendTo(li);
                    $("<div>").append(values[i]).appendTo(li);
                    li.appendTo(ul);
                }
                ul.appendTo(menu);
                var filter_btn = makeVzButton('Filter', 'action-FILTERSUBMIT');
                filter_btn.appendTo(menu);
                filter_btn.mousedown(function() {
                    $(this).css('background', '#999999').find('span').css('color', '#fff');
                }).mouseup(function() {
                    $(this).css('background', '').find('span').css('color', '');
                });
                filter_btn.click(function() {
                    var value = "";
                    var checkboxs = ul.find('input');
                    var ftf = true;
                    checkboxs.each(function(index, obj) {
                        if ($(obj).is(':checked')) {
                            if (!ftf)
                                value += ":";
                            value += $(obj).val();
                            ftf = false;
                        }
                    });
                    // $('.input-container').find('.filterClear').val('');
                    // $('.vgrid-head .vgrid-column').each(function(){$(this).removeAttr('data-filter-value');});
                    col.data('filter-value', value);
                    col.attr('data-filter-value', value);
                    grid.doFilterRefresh();
                });
            } else if (type === 'DATE') {
                var input_container = $('<div class="input-container"></div>');
                var textfield = $('<input>');
                textfield.val(current_value);
                textfield.attr('placeholder', 'Filter By');
                textfield.keydown(function() {
                    $(this).val("");
                    return false;
                });
                textfield.appendTo(input_container);
                input_container.appendTo(menu);
                var filter_btn = makeVzButton('Filter', 'action-FILTERSUBMIT');
                filter_btn.appendTo(menu);
                filter_btn.mousedown(function() {
                    $(this).css('background', '#999999').find('span').css('color', '#fff');
                }).mouseup(function() {
                    $(this).css('background', '').find('span').css('color', '');
                });
                filter_btn.click(function() {
                    var value = textfield.val();
                    // $('.input-container').find('.filterClear').val('');
                    // $('.vgrid-head .vgrid-column').each(function(){$(this).removeAttr('data-filter-value');});
                    col.data('filter-value', value);
                    col.attr('data-filter-value', value);
                    grid.doFilterRefresh();
                });
                var reset_btn = makeVzButton('Reset', 'action-FILTERRESET');
                reset_btn.appendTo(menu);
                reset_btn.mousedown(function() {
                    $(this).css('background', '#999999').find('span').css('color', '#fff');
                }).mouseup(function() {
                    $(this).css('background', '').find('span').css('color', '');
                });
                reset_btn.click(function() {
                    var filterColumn = $(this).parents('div[data-name]').attr('data-name');
                    $(this).parent().find('.input-container').find('.filterClear').val('');
                    //col.removeAttr('data-filter-value');
                    // $(this).parent().siblings('.vgrid-column').removeAttr('data-filter-value');
                    grid.vgrid_head.children(".vgrid-column[data-name='" + filterColumn + "']").removeAttr('data-filter-value');
                });
                textfield.keyup(function(e) {
                    if (e.keyCode == 13)
                    {
                        filter_btn.trigger('click');
                    }
                });
                $(textfield).daterangepicker({
                    dateFormat: 'yy-mm-dd'
                });
                textfield.addClass('filterClear');
            }
        },
        stripFilterParam: function(qryString) {
            var result = "?";
            if (qryString.length === 0)
                return result;

            qryString = qryString.substring(1);

            var params = qryString.split("#")[0].split("&");
            for (var i = 0; i < params.length; i++) {
                var nv = params[i].split("=");
                if (nv[0].toLowerCase() !== "filter") {
                    if (i !== 0)
                        result += "&";
                    result += nv[0] + "=" + nv[1];
                }
            }

            return result;
        },
        doFilterRefresh: function() {
            var cols = this.vgrid_head.children('.vgrid-column[data-filter-value]');
            var search = this.stripFilterParam(window.location.search);
            var qry = "";
            cols.each(function(index, obj) {
                if ($(obj).data('filter-value').length !== 0) {
                    qry += '&filter=' + $(obj).data('name') + ':' + $(obj).data('filter-value');
                }
            });
            qry = encodeURI(qry);

            window.location.assign(window.location.pathname + search + qry);
        },
        removeFilterSetting: function() {
            var search = this.stripFilterParam(window.location.search);
            var grid = $(this).data('vgrid');
            grid.vgrid_head.children('.vgrid-column').data('filter-value', '');
            grid.vgrid_head.children('.vgrid-column').attr('data-filter-value', '');
            var cols = grid.vgrid_head.children('.vgrid-column[data-filter-value]');
            var qry = "";
            cols.each(function(index, obj) {
                qry += '&filter=' + $(obj).data('name') + ':' + $(obj).data('filter-value');
            });
            qry = encodeURI(qry);

            window.location.assign(window.location.pathname + search + qry);
        },
        unselectRows: function() {
            var grid = $(this).data('vgrid');
            var body = grid.vgrid_body;
            $('input.vgrid-selector-checkbox:checked', body).prop('checked', false).closest('.vgrid-row').removeClass("vgrid-selected-row");
            ;
            if (grid.options.multiSelectCallback) {
                grid.options.multiSelectCallback(null, false);
            }
        },
        getSelectedRowsCount: function(callback) {
            var grid = $(this).data('vgrid');
            var body = grid.vgrid_body;
            var count = $('input.vgrid-selector-checkbox:checked', body).length;
            if (callback) {
                callback(count);
            }
        },
        getRowDataNonEdit: function(row) {
            var cols = $(row).find('.vgrid-column');
            var params = [];
            for (var i = 0; i < cols.length; i++) {
                var col = $(cols[i]);

                var name = col.data('name');
                var value;
                var child = col.find('a');
                if (child.length > 0) {
                    value = child.text();
                } else {
                    value = col.text();
                }
                params.push({
                    name: 'name',
                    value: name
                });
                params.push({
                    name: 'value',
                    value: value
                });
            }

            return params;
        },
        getSelectedRowsData: function(callback) {
            var grid = $(this).data('vgrid');
            var body = grid.vgrid_body;
            var rows = [];
            $('input.vgrid-selector-checkbox:checked', body).each(function(index, obj) {
                rows.push(grid.getRowDataNonEdit($(obj).closest('.vgrid-row').get(0)));
            });
            if (callback) {
                callback(rows);
            }
        },
        getRowDataNonEditHashmap: function(row) {
            var cols = $(row).find('.vgrid-column');
            var params = {};
            for (var i = 0; i < cols.length; i++) {
                var col = $(cols[i]);

                var name = col.data('name');
                var value;
                var child = col.find('a');
                if (child.length > 0) {
                    value = child.text();
                } else {
                    value = col.text();
                }
                params[name] = value;
            }
            return {
                'name': 'value',
                'value': JSON.stringify(params)
            };
        },
        getSelectedRowsDataHashmap: function(callback) {
            var grid = $(this).data('vgrid');
            var body = grid.vgrid_body;
            var rows = [];
            var rowArr = [];
            $('input.vgrid-selector-checkbox:checked', body).each(function(index, obj) {
                rows.push(grid.getRowDataNonEditHashmap($(obj).closest('.vgrid-row').get(0)));
                rowArr.push($(obj).closest('.vgrid-row'));
            });
            if (callback) {
                callback(rows, rowArr);
            }
        },
        toggleDrawerInternal: function(row) {
            var grid = this, opening = true,
                    drawer = row.children('.vgrid-row-body');

            if (drawer.length) {
                if (row.css('height') == grid.options.rowHeight) {
                    row.css('height', 'auto');
                    drawer.slideDown(400);
                } else {
                    drawer.slideUp(400, function() {
                        row.css('height', grid.options.rowHeight);
                    });
                    opening = false;
                }
            }
            if (grid.options.drawerOpenCallback) {
                grid.options.drawerOpenCallback(drawer.get(0), opening);
            }
        },
        toggleDrawer: function(row) {
            var grid = $(this).data('vgrid');
            grid.toggleDrawerInternal(row);
        }
    };

    /* vgrid PLUGIN DEFINITION
     * ===================== */
    $('#filter-div,#app-box').on('click', function(e) {
        if ($(e.target).closest('.hidedropdown').length === 0) {
            var menu = $('.vgrid-popup-menu');
            if (menu.size() > 0) {
                menu.hide();
                menu.remove();
            }
        }
    });

    /* $('.vgrid-column').click(function(){
     $('.hidedropdown').hide();
     $('.vgrid-head .vgrid-column').each(function(){
     if ($.trim($(this).siblings('.hidedropdown').find('.input-container').find('.filterClear').val()).length <= 1) {
     $(this).removeAttr('data-filter-value');
     }
     });
     });*/

    /***** Following Code is to assign the width to buttons as per the window width on the fly *****/
    //this should not be here!!!
    //its screen specific code!!
    $(function() {
        setTimeout(function() {
            function linkBarLinksWidth() {
                $('.vgrid-row').each(function() {
                    var linkBarLinks = $(this).find('.link-bar').find('a');
                    var linkBarLinksWidth = ((($(window).width() / $(linkBarLinks).length).toFixed(2) - 3.5) / $(window).width()) * 100 + '%';
                    //var linkBarLinksWidth = (100 / $(linkBarLinks).size()) - 1 + '.64%';
                    $(linkBarLinks).css({'width': linkBarLinksWidth});
                });
            }
            ;
            linkBarLinksWidth();

            $(window).bind('resize scroll', function() {
                linkBarLinksWidth();
            });
        }, 1000);
    });

    var old = $.fn.vgrid;

    $.fn.vgrid = function(options) {
        var args = arguments;

        return this.each(function() {
            var $this = $(this), data = $this.data('vgrid');
            if (!data) {
                $this.data('vgrid', (data = new vgrid(this, options)));
            }
            if (typeof options === 'string') {
                data[options].apply(this, Array.prototype.slice.call(args, 1));
            }
        });
    };

    //$.fn.vgrid.Constructor = function(){}


    /* vgrid NO CONFLICT
     * =============== */

    $.fn.vgrid.noConflict = function() {
        $.fn.vgrid = old;
        return this;
    };
}(window.jQuery);
