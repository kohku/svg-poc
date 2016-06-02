(function ($) {
    if (!$.vzwebkit) {
        $.vzwebkit = {};
    }

    $.vzwebkit.treegrid = function (el, cols, rows, menuFunction, options) {
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        base.time = (new Date()).getTime();
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        base.elId = el.id;
        
        // Add a reverse reference to the DOM object
        base.$el.data("vzwebkit.treegrid", base);

        base.init = function () {
            if (cols == null) alert('cols not defined');//cols = 20;
            if (rows == null) rows = []; // no row data

            base.cols = cols;
            base.rows = rows;
            base.menuFunction = menuFunction;


            base.options = $.extend({}, $.vzwebkit.treegrid.defaultOptions, options);
            base.options.autoWidthDivCharCount = base.options.nodeTab.length;

            base.twM = 1;
            // Put your initialization code here
            base.renderTree(base.cols, base.rows, base.options);

            base.time = (new Date()).getTime() - base.time;
            //alert(base.time);
        };

        // Sample Function, Uncomment to use
        base.renderTree = function (cols, rows, o) {
            var treeId = base.el.id;
            o.tgcolCls = o.colCls + ' ' + treeId + 'cz';
            //alert(treeId);
            var h = "<div class='" + o.containerCls + "'><div class='" + o.headCls + "'><div class='" + o.tgcolCls + "' id='h" + treeId + "cz'>&nbsp; </div>";
            $.each(cols, function (i, col) {
                col.tgcolCls = o.colCls + ' ' + treeId + 'c' + i;
                h = h + "<div id='h" + treeId + 'c' + i + "' class='" + col.tgcolCls + "'>" + col.title + "</div>";
            });
            h = h + "</div><div id='nc" + treeId + "root' class='" + o.inrCls + "'></div></div>";
            base.$el.html(h);

            $.each(rows, function (i, r) {
                base.renderRow(cols, r, o);
            });

            var btn = base.$el.find("div[id^='nbtn']");
            //btn.css("color", "red");
            btn.click(function (evnt) {
                //alert(this.id);
            	
            	var node_id = this.id.substring(4+base.elId.length);
				base.openNode(node_id);
				/*
                var id = this.id.substring(4);
                var chld = $('#nc' + id);
                if (chld.is(':visible')) {
                    chld.slideUp(200);
                    $(this).html(o.openBut);
                } else {
                    var btn = $(this);
                    var lvl = 1+ btn.parent().parent().data('lvl');
                    var w = (2 * o.autoIconWidthPixel) + o.autoWidthPadding + (lvl * o.autoIconWidthPixel);
                    //alert(treeId+", "+lvl + ", " + btn.parent().width() + " - " + w);
                    if (btn.parent().width() < w) {
                        var v = '.' + treeId + 'cz';
                        $(v).css('width', w);
                    }
                    chld.slideDown(200);
                    btn.html(o.closeBut);
                }
                */
            });

            var micon = base.$el.find('.' + o.menuIconCls);
            micon.click(function (evnt) {
                var rowme = this.id;
                var rowdiv = $(this).parents('.' + o.rowCls);
                var rowid = rowdiv[0].id;
                var nodeId = rowid.substring(2 + treeId.length); // 'nd' 2 char
                base.menuFunction(this, nodeId, evnt);
            });

            $.each(cols, function (i, col) {
                var cid = '.' + treeId + 'c' + i;
                var w = col.width + 'px';
                $(cid).css('width', w);
            });

           
            var fw = (2 * o.autoIconWidthPixel) + o.autoWidthPadding;
            var cid = "." + treeId + "cz";
            $(cid).css('width', fw);

            // head col resizable
            var hcolCls = '.' + o.headCls + ' > .' + o.colCls;
            $(hcolCls).resizable({
                handles: 'e',
                stop: function (event, ui) {
                    var ccls = '.' + this.id.substring(1);
                    $(ccls).css('width', ui.size.width);
                }
            });
        };

        base.renderRow = function (cols, r, o) {
            var treeId = base.el.id;
            var id = treeId + r[o.nidName];
            var pid = r[o.pidName];

            if (pid == null) pid = treeId + "root";
            else pid = treeId + pid;

            var targetPTab = $("#ntab" + pid);
            var targetP = $("#np" + pid);
            var targetC = $("#nc" + pid);

            var nodelevelCls = '';
            var levelNum = 0;
            if (targetPTab[0]) {
                levelNum = targetPTab.children().length + 1;
            }
            if (o.levelCls && targetPTab[0]) {
                nodelevelCls = ' tlvl' + levelNum;
            }

            var b = "";
            var bs = "<div id='nd" + id + "' class='" + o.rowCls + "' data-lvl='" + levelNum + "' ><div class='" + o.tgcolCls + nodelevelCls + "'>";
            var be = "";
            $.each(cols, function (i, col) {
                var cid = treeId + "c" + i;
                var ctxt = r[col.key];
                if (ctxt === undefined ) ctxt="&nbsp;";
                b = b + "<div class='" + col.tgcolCls + nodelevelCls + "'>" + ctxt + " </div>";
            });
            b = b + "</div>";
            bs = bs + "<div id='ntab" + id + "' class='" + o.inrCls + "' >"; 
            if (targetPTab[0]) {
                var phtml = targetPTab.html();
                bs = bs + phtml + o.nodeTab;
            }
            bs = bs + "</div>";

            if ("yes" == r[o.pflagName]) {
                bs = bs + "<div id='nbtn" + id + "' class='" + o.inrCls + "'>" + o.openBut + "</div>";
                be = "<div id='nc" + id + "' class='" + o.inrCls + " " + o.hdnCls + "' ></div>";
            } else {
                bs = bs + "<div class='" + o.inrCls + "'>" + o.nodeTab + "</div>";
            }
            bs = bs + o.menuIcon + "</div>";
            b = bs + b + be;

            targetC.append(b);

        };
        
        base.openNode = function(nodeId){
			//alert("base.openNode "+base.elId);
			var id = base.elId+''+nodeId //this.id.substring(4);
			var btnId = '#nbtn'+id;
			var btn = $(btnId);
			var chld = $('#nc' + id);
			var o = base.options;
            if (chld.is(':visible')) {
                chld.slideUp(200);
                btn.html(o.openBut);
            } else {
				var lvl = 1+ btn.parent().parent().data('lvl');
				var w = (2 * o.autoIconWidthPixel) + o.autoWidthPadding + (lvl * o.autoIconWidthPixel);
				//alert(treeId+", "+lvl + ", " + btn.parent().width() + " - " + w);
				if (btn.parent().width() < w) {
					var v = '.' + base.elId + 'cz';
					$(v).css('width', w);
				}
				chld.slideDown(200);
				btn.html(o.closeBut);
			}
        };
        
        base.openNodeWP = function(nodeId){
			base.openNode(nodeId);
			var id = base.elId+''+nodeId;
			var nodeRow = $('#nd' + id);
			var prnt = nodeRow.parent()[0];
			//alert(prnt+' '+prnt.id +' '+prnt.id.indexOf('nc'));
			if(prnt !== undefined && prnt.id !== undefined && prnt.id.indexOf('nc')==0 ){
			    var txt = 'nc'+base.elId;
				var pid = prnt.id.substring( txt.length );
				if(pid!='root')	base.openNodeWP(pid);
			}
		};

        // Run initializer
        base.init();
    };

    $.vzwebkit.treegrid.defaultOptions = {
        nodeTab: "<span class='tg_IconEmpty'> </span>",
        openBut: "<span class='tg_IconOpen' title='Open'> </span>",
        closeBut: "<span class='tg_IconClose' title='Close'> </span>",
        menuIcon: "<span class='tg_IconCtx' > </span>",
        menuIconCls: "tg_IconCtx",
        nidName: "TASK_ID",
        pidName: "PARENT_TASK_ID",
        pflagName: "parent",
        containerCls: "tg_container",
        headCls: "tg_header",
        rowCls: "tg_row",
        colCls: "tg_col",
        inrCls: "tg_inr",
        hdnCls: "tg_hdn",
        levelCls: false,
        autoIconWidthPixel: 14,
        autoWidthPadding: 18 // 14+2+2
    };

    $.fn.vzwebkit_treegrid = function (cols, rows, menuFunction, options) {
        return this.each(function () {
            (new $.vzwebkit.treegrid(this, cols, rows, menuFunction, options));
        });
    };

    // This function breaks the chain, but returns
    // the vzwebkit.treegrid if it has been attached to the object.
    $.fn.getvzwebkit_treegrid = function () {
       return this.data("vzwebkit.treegrid");
    };
    

})(jQuery);