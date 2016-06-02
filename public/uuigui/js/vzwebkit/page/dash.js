/*
 * 
 * NOTES:
 * 
 * vzuui-widget-app needs bottom padding to elimate scrollbar
 * 
 *  
 */
WO = function(jo, order) {
    var o = {};
    o.jo = jo;
    o.x = jo.position().left;
    o.y = jo.position().top;
    o.w = jo.width();
    o.h = jo.height();

    o.title = jo.prop("title");
    o.id = jo.data("app-id");
    o.order = order;
    jo.prop("order", order);

    o.copy = function() {
        return wo = WO(o.jo, o.order);
    };

    o.updatePosition = function(x, y) {
        o.x = x;
        o.y = y;
    };

    o.updateSize = function(w, h) {
        o.w = w;
        o.h = h;
    };

    o.updateOrder = function(order) {
        o.order = order;
        o.jo.prop("order", order);
        //Dash.log("updateOrder: setting id="+o.id +" to order:"+o.order);
    };

    o.updateParamsFromDom = function() {
        o.x = o.jo.position().left;
        o.y = o.jo.position().top;
        o.w = o.jo.width();
        o.h = o.jo.height();
    };

    o.console = function() {
        Dash.log(" id=" + o.id + " jox=" + o.jo.position().left + "joy=" + o.jo.position().top + " x=" + o.x + "y=" + o.y + " w=" + o.w + " h=" + o.h + " order=" + o.order + " title=" + o.title);
    };

    return o;
};

Dash = {
    logging: false,
    osm: [],
    bw: 220, //block width
    bh: 220, //block height
    //header_height:80,
    header_height: 75,
    container_selector: "container",
    widget_selector: "block",
    container: null,
    body: null,
    dragObj: null,
    xc: 0, //container offset
    yc: 0, //container offset
    ribbonMode: false,
    navOpen: false,
    navWidth: 200,
    left: 0, //left position of ribbon
    scrollbarWidth: 17, //approximate
    navControlWidth: 20, //size of control to open and close nav section
    ribbonMarginLeft: 50,
    ribbonMarginRight: 30,
    marginLeft: 30,
    marginRight: 20,
    ribbonInset: 20, // the amount the ribbon should be inset (left/right) relative to level 5
    level2_min_padding:328,
    level2_max_padding:70,
    mask: null,
    ///////////////////////////////////////////////////
    layout: function(event)
    {
        if (event == null)
        {
            Dash.getCurrentData();
            var bh = Dash.body;
            var c = Dash.container;
            var ol = Dash.marginLeft;
            var mr = Dash.marginRight;
            if (Dash.ribbonMode) {
                ol = Dash.ribbonMarginLeft;
                mr = Dash.ribbonMarginRight;
            }
            if (Dash.navOpen) {
                ol += Dash.navWidth - Dash.navControlWidth;
                mr = Dash.ribbonMarginLeft;
            }

            var has_scroll = c.parent().hasScrollbar();
            if (has_scroll && Dash.ribbonMode) {
                mr = Dash.ribbonMarginRight - Dash.scrollbarWidth;
            }

            var bw = Dash.body.width();
            Dash.log(" scrollbar=?" + has_scroll);

            c.height(bh - c.position().top);//initially --after widgets are draw a new height is set
            //need to set the heiht first --cause vertical scroll bar might be present --
            // and when u go to ribbon mode it will go away --this affects the width of the body and level5

            c.css({left: (ol + Dash.left)});



            Dash.log(" bw=" + bw + " left=" + c.position().left + " mr=" + mr);

            c.width(bw - c.position().left - mr);
            //c.width(bw-c.position().left); 
            var cleft = c.position().left;
            var cw = c.width();

            Dash.log("layout--------------- cw=" + cw + " left=" + c.position().left);

            var xc = Dash.xc;
            var yc = Dash.yc;

            var pb = Dash.pbox;//$(".vzuui-app-placement-box");
            pb.hide();
            Dash.log(" hiding placement box");
            var prev = false;
            var next = false;
            var showing = false;
            var partial = false;


            for (var i = 0; i < Dash.osm.length; ++i)
            {
                if ((cw > (Dash.osm[i].w + xc)) || xc == Dash.xc || (Dash.ribbonMode && (cw > xc)))
                {
                    var rw = (Dash.osm[i].w + xc + mr - 15);
                    if (Dash.ribbonMode && (cw < rw)) {
                        //show mask

                        //var m=Dash.osm[i].jo.find(".vzuui-level-one-mask");
                        // m.css("width",""+(255-(rw-cw))+"px");
                        // m.show();
                        partial = true;
                        //console.log("partial is true");
                    }
                    else {
                        //var m=Dash.osm[i].jo.find(".vzuui-level-one-mask");
                        // m.hide();
                    }
                    //layout
                    var dragging = Dash.osm[i]["jo"].prop("dragging");
                    if (dragging) {
                        Dash.dragObj = Dash.osm[i];
                    }
                    Dash.osm[i].console();
                    Dash.log(" i=" + i + " dragging=" + dragging + " xc=" + xc + "  yc=" + yc);
                    if (!Dash.collision(Dash.osm, i, xc, yc)) {

                        if (!dragging) {
                            Dash.log(" drawing jo=..." + Dash.osm[i].jo);
                            Dash.osm[i].jo.css("left", xc + "px");
                            Dash.osm[i].jo.css("top", yc + "px");

                            var offset = 0;
                            if (Dash.navOpen) {
                                offset = Dash.navWidth;/*offset=200;*/
                            }

                            if ((cleft + xc - offset) < 0 || (Dash.ribbonMode && (yc >= Dash.bh || partial))) {
                                if ((cleft + xc - offset) < 0) {
                                    Dash.osm[i].jo.hide();
                                }
                                if (!showing) {
                                    if (i < (Dash.osm.length)) {
                                        prev = true;
                                    }
                                }
                                else {
                                    if ((i < Dash.osm.length) || partial) {
                                        next = true;
                                    }
                                }
                            }
                            else {
                                Dash.osm[i].jo.show();
                                showing = true;
                            }
                        }
                        else {
                            Dash.log("i=" + i + " drawing placement box....x=" + xc + " yc=" + yc + " w=" + Dash.osm[i].jo.width() + " h=" + Dash.osm[i].jo.height());
                            pb.css("left", xc + "px");
                            pb.css("top", yc + "px");
                            pb.css("width", Dash.osm[i].jo.width() + "px");
                            pb.css("height", Dash.osm[i].jo.height() + "px");
                            pb.show();
                        }
                        Dash.osm[i].order = i;
                        Dash.osm[i].x = xc;
                        Dash.osm[i].y = yc;

                        xc += Math.ceil(Dash.osm[i].w / Dash.bw) * Dash.bw;
                    }
                    else {
                        {
                            Dash.log("collision???");
                        }
                        xc += Dash.bw;
                        --i;
                    }
                }
                else {
                    Dash.log("failed width--- xc=" + xc + " cw=" + cw + " opw=" + Dash.osm[i].w + " id=" + Dash.osm[i].title);
                    xc = Dash.xc;
                    yc += Dash.bh;
                    --i;
                }
            }

            //adjust container size so we can reach all the widgets

            if (!Dash.ribbonMode) {
                c.height(yc + Dash.bh);
            }
            else {
                c.height(Dash.bh);
            }

            if (prev) {
                $("#vzuui-ribbon-left-icon").addClass("vzuui-nav-arrow-prev");
                $("#vzuui-ribbon-left-icon").removeClass("vzuui-nav-arrow-prev-disable");
            }
            else {
                $("#vzuui-ribbon-left-icon").addClass("vzuui-nav-arrow-prev-disable");
                $("#vzuui-ribbon-left-icon").removeClass("vzuui-nav-arrow-prev");
            }

            if (next) {
                $("#vzuui-ribbon-right-icon").addClass("vzuui-nav-arrow-next");
                $("#vzuui-ribbon-right-icon").removeClass("vzuui-nav-arrow-next-disable");
            }
            else {
                $("#vzuui-ribbon-right-icon").addClass("vzuui-nav-arrow-next-disable");
                $("#vzuui-ribbon-right-icon").removeClass("vzuui-nav-arrow-next");
            }
        }

    },
    selectLevelOne: function(jo) {
        var appIcon = jo;
        appIcon.addClass('vzuui-effect-widget-selected');
        appIcon.addClass('vzuui-app-icon-shift');
        var toolbar = appIcon.find(".vzuui-app-icon-title-bar");
        toolbar.addClass('vzuui-title-bar-shift');
    },
    unselectLevelOnes: function() {
        $(".vzuui-app-icon").each(function() {
            var appicon = $(this);
            appicon.removeClass('vzuui-effect-widget-selected');
            appicon.removeClass('vzuui-app-icon-shift');
            var toolbar = appicon.find(".vzuui-app-icon-title-bar");
            toolbar.removeClass('vzuui-title-bar-shift');
        });
    },
    animateAndLayout: function() {
        //console.log("animate and layout");
        var ol = Dash.marginLeft;

        if (Dash.ribbonMode) {
            ol = Dash.ribbonMarginLeft;
        }
        if (Dash.navOpen) {
            ol += Dash.navWidth - Dash.navControlWidth;
        }

        Dash.container.animate({"left": "" + (ol + Dash.left) + "px"}, 500, function() {
            //console.log(" laying out...");
            Dash.layout();
    });
    },
    findPositions: function(osm) {
        //var cw=$(".vzuui-app-container").width()+10;
        var cw = Dash.container.width() + 10;

        Dash.log(" find positions------<" + Dash.cnt + ">--------- cw=" + cw);
        var xc = Dash.xc;
        var yc = Dash.yc;

        for (var i = 0; i < osm.length; ++i)
        {
            if ((cw > (osm[i].w + xc)) || xc == Dash.xc)
            {
                if (!Dash.collision(osm, i, xc, yc)) {
                    osm[i].order = i;
                    osm[i].x = xc;
                    osm[i].y = yc;
                    {
                        Dash.log("-id=" + osm[i].title + " xc=" + xc + " yc=" + yc);
                    }
                    xc += Math.ceil(osm[i].w / Dash.bw) * Dash.bw;
                }
                else {
                    {
                        Dash.log("collision???");
                    }
                    xc += Dash.bw;
                    --i;
                }
            }
            else {
                Dash.log("failed width--- xc=" + xc + " cw=" + cw + " opw=" + osm[i].w + " id=" + osm[i].title);
                xc = Dash.xc;
                yc += Dash.bh;
                --i;
            }
     }
    },
    updateAll: function()
    {
        //var op={x:x,y:y,w:w,h:h,jo:$(this),title:$(this).prop("title")};
        //console.log(" update all");
        var ids = [];
        var xs = [];
        var ys = [];
        var ws = [];
        var hs = [];
        
        //legacy for pc dashboard
        var icon_width = 60,icon_height = 47,icon_margin = 10;

        for (var i = 0; i < Dash.osm.length; ++i) {
            var op = Dash.osm[i];
            ids[i] = op.id;
            /*xs[i] = Math.floor(op.x / Dash.bw);
            ys[i] = Math.floor(op.y / Dash.bh);
            ws[i] = Math.floor(op.w / Dash.bw) + 1;
            hs[i] = Math.floor(op.h / Dash.bh) + 1;
            */
            //pcgui uses these params for x,y,w,h --uui doesnt use these values so...
           
            xs[i]=Math.floor(op.x/icon_width);
            ys[i]=Math.floor(op.y/icon_height);
           // ws[i]=Math.floor(op.w/icon_width);//+1;
            //hs[i]=Math.floor(op.h/icon_height);//+1;  
            
            ws[i]=op.jo.data("app-db-width");
            //console.log(" width="+op.jo.data("app-db-width"));
            hs[i]=op.jo.data("app-db-height");
            
            //we dont have this data when we add from side nav --so create using old way initially
            if(ws[i]==null || ws[i]==""){             
                ws[i] = Math.floor(op.w / Dash.bw) + 1;
                hs[i] = Math.floor(op.h / Dash.bh) + 1;
                op.jo.data("app-db-width",ws[i]);
                op.jo.data("app-db-height",hs[i]);
            }
            

            if (xs[i] < 0) {
                xs[i] = 0;
            }
            if (ys[i] < 0) {
                ys[i] = 0;
            }
        }

        Landing.updateAllAppSettings(ids, xs, ys, ws, hs);

    },
    handleRibbonLeft: function(jo) {
        //20 is for right margin of the block--which is not important on the right edge 
        if ($("#vzuui-ribbon-left-icon").hasClass("vzuui-nav-arrow-prev-disable")) {
            return false;
        }
        var ps = parseInt(($(".vzuui-widget-app").width() - (2 * Dash.ribbonInset) + Dash.marginRight) / Dash.bw) * Dash.bw;
        Dash.left += ps;
        if (Dash.left > 0) {
            Dash.left = 0;
        }
        Dash.log(" left dl=" + Dash.left + " ps=" + ps + " l5w-40=" + ($(".vzuui-widget-app").width() - 40));
        Dash.layout();
        Dash.container.delay(100);
        Dash.layout(); //race condition prevention
        //Dash.animateAndLayout();
    },
    handleRibbonRight: function(jo) {
        if ($("#vzuui-ribbon-right-icon").hasClass("vzuui-nav-arrow-next-disable")) {
            return false;
        }

        var ps = parseInt(($(".vzuui-widget-app").width() - (2 * Dash.ribbonInset) + Dash.marginRight/*+20*/) / Dash.bw) * Dash.bw;
        Dash.left -= ps;
        Dash.log(" right dl=" + Dash.left + " ps=" + ps + " l5w-40=" + ($(".vzuui-widget-app").width() - 40));
        Dash.layout();
        Dash.container.delay(100);
        Dash.layout(); //race condition prevention
        //Dash.animateAndLayout();

    },
    handleNavigation: function(jo) {
        var p = jo.parent().parent().parent();
        var w = p.width();
        //if(w==Dash.navControlWidth){
        if (!Dash.navOpen) {
            Dash.navOpen = true;
            //p.css("width","200px");    
            p.css({width: Dash.navWidth});
            $("#vzuui-nav-icon").removeClass("vzuui-nav-side-arrow-next").addClass("vzuui-nav-side-arrow-prev");
            $("#vzuui-nav-icon").parent().parent().css("padding-left", "" + (Dash.navWidth - Dash.navControlWidth) + "px");
            $(".vzuui-drag-section").css("padding-left", "" + (Dash.navWidth + 10 + 5) + "px");
            $(".vzuui-widget-app").css("padding-left", "" + (Dash.navWidth + 10) + "px");
            $("#vzuui-nav-content").css("display", "inline-block");
            $("#vzuui-ribbon-left-icon").css("left", "" + (Dash.navWidth + 5) + "px");
        }
        else {
            Dash.navOpen = false;
            //p.css("width","20px"); 
            p.css({width: Dash.navControlWidth});
            $("#vzuui-nav-icon").removeClass("vzuui-nav-side-arrow-prev").addClass("vzuui-nav-side-arrow-next");
            $("#vzuui-nav-icon").parent().parent().css("padding-left", "0px");
            $(".vzuui-drag-section").css("padding-left", "" + Dash.marginLeft + "px");
            $(".vzuui-widget-app").css("padding-left", "" + Dash.marginLeft + "px");
            $("#vzuui-nav-content").hide();
            $("#vzuui-ribbon-left-icon").css("left", "" + (Dash.marginLeft - 2) + "px");
        }
        Dash.layout();
    },
    isLevelFiveActivated: function() {
        var level5 = $(".vzuui-widget-app");
        return !(level5.css("display") == "none");
    },
    activateLevelFive: function(jo) {
        //Dash.log(" jo="+jo);
        // console.log("-activating level five color="+jo.css("background-color")+"  name="+$(jo).text());
        if (jo) {
            Dash.selectLevelOne(jo);
        }

        Dash.ribbonMode = true;
        var c = $(".vzuui-app-container");

        var mask = $(".vzuui-drag-mask");
        mask.show();
        //mask.css("z-index",10);

        //c.parent().css({height:Dash.bh});   

        var nw = Dash.body.width() - Dash.ribbonMarginRight - 10;

        var drag_section = c.parent();
        drag_section.css({height: (Dash.bh + Dash.header_height), overflow: "hidden", width: nw});

        Dash.layout();

        var level5 = $(".vzuui-widget-app");
        level5.show();
        $("#vzuui-ribbon-left-icon").show();
        $("#vzuui-ribbon-right-icon").show();
    },
    deactivateLevelFive: function() {
        Dash.unselectLevelOnes();
        //Dash.log(" jo="+jo);
        Dash.log("deactivating level five color=");
        Dash.ribbonMode = false;
        var c = $(".vzuui-app-container");
        //c.parent().css("height","100%");

        var mask = $(".vzuui-drag-mask");
        mask.hide();
        // mask.css("z-index",0);

        var drag_section = c.parent();
        drag_section.css({height: "100%", overflow: "auto", width: "100%"});

        Dash.left = 0;
        Dash.layout();
        var level5 = $(".vzuui-widget-app");
        level5.hide();
        $("#vzuui-ribbon-left-icon").hide();
        $("#vzuui-ribbon-right-icon").hide();
        $(".vzuui-drag-section").show();
    },
    maximizeLevelFive: function() {
        $(".vzuui-drag-section").hide();
        $("#vzuui-ribbon-left-icon").hide();
        $("#vzuui-ribbon-right-icon").hide();
        //$(".vzuui-widget-app").animate({"padding-top": "70px"}, 500);/*.css("padding-top","70px")*/
        $(".vzuui-widget-app").animate({"padding-top":Dash.level2_max_padding+"px"},500);
        $(".vzuui-widget-app").data("max", "true");
        $(".vzuui-widget-app div.nav-arrow-level-5 a.nav-arrow-level-5-link").addClass("down");

    },
    minimizeLevelFive: function() {

        //$(".vzuui-widget-app").animate({"padding-top": "328px"}, 500,function(){
        $(".vzuui-drag-section").show();
        $("#vzuui-ribbon-left-icon").show();
        $("#vzuui-ribbon-right-icon").show();
        // $(".vzuui-widget-app").css("padding-top","328px");
        // });//.css("padding-top","320px");

        //$(".vzuui-widget-app").css("padding-top", "328px");
        $(".vzuui-widget-app").css("padding-top", Dash.level2_min_padding+"px");
        $(".vzuui-widget-app").data("max", "false");
        $(".vzuui-widget-app div.nav-arrow-level-5 a.nav-arrow-level-5-link").removeClass("down");
        Dash.layout();
        Dash.container.delay(100);
        Dash.layout();
    },
    ///////////////////////////////////////////////////////////////////////////      


    handleStop: function(event, ui)
    {
        ui.helper.css("z-index", "0");
        ui.helper.prop("dragging", false);
        if (Dash.dragObj != null) {
            var pb = $(".vzuui-app-placement-box");
            if (pb.css("display") != "none") {
                Dash.dragObj.jo.css("top", pb.css("top"));
                Dash.dragObj.jo.css("left", pb.css("left"));
            }
            Dash.osm = (Dash.findOrder(Dash.dragObj, Dash.osm)).osm;
        }
        Dash.layout();
        var obj = ui.helper;
        var app_display = ui.helper.prop("app-display");

        if (app_display != "none") {
            obj.find(".vzuui-app-content").show();
        }
        else {
            obj.find(".vzuui-flip-content").show();
        }


        Dash.mask.css("z-index", "0");
        Dash.updateAll();
    },
    handleStart: function(event, ui) {
        ui.helper.css("z-index", "10000");
        var obj = ui.helper;
        obj.prop("dragging", true);
        obj.prop("app-display", $(".vzuui-app-content").css("display"));

        obj.find(".vzuui-flip-content").hide();
        //obj.find(".vzuui-app-content").hide();
        obj.find(".vzuui-app-content").hide();
        Dash.mask.css("z-index", "100");

        for (var i = 0; i < Dash.osm.length; ++i)
        {
            var dragging = Dash.osm[i]["jo"].prop("dragging");
            if (dragging) {
                Dash.dragObj = Dash.osm[i];
            }
        }
    },
    handleDrag: function(event, ui) {

        var refresh = false;
//console.log(" dragObj="+Dash.dragObj);
        if (Dash.dragObj != null) {
            var ci = Dash.determineCandidate(Dash.dragObj);
            //console.log("--cnt="+Dash.cnt+"---------------------------- ci="+ci);
            if (ci > -1) {

                var osmt = Dash.spliceOsm(Dash.osm, Dash.dragObj, ci);
                Dash.findPositions(osmt);
                //ok so now we have a predicted layout
                // lets see if drag obj is over its potential position
                if (Dash.findUnionPerc(Dash.dragObj, osmt[ci]) > .6) {
                    //Dash.log("-<"+Dash.cnt+">-- over candidate location!!!");
                    //for(var i=0;i<Dash.osm.length;++i){
                    //   Dash.log("ci="+ci+" id="+Dash.osm[i].id+" title="+Dash.osm[i].title);
                    //}
                    Dash.osm = osmt;
                    refresh = true;
                }
            }
            else if (ci == -2) {
                //console.log(" no intersection");
                //ok there was no intersection
                var res = Dash.findOrder(Dash.dragObj, Dash.osm);
                var osmt = res.osm;
                Dash.findPositions(osmt);
                //ok so now we have a predicted layout
                // lets see if drag obj is over its potential position
                var ni = res.index;
                var osmt = Dash.spliceOsm(Dash.osm, Dash.dragObj, ni);
                Dash.osm = osmt;
                refresh = true;
            }
        }

        //console.log(" refresh="+refresh);      
        if (refresh) {
            Dash.layout();
        }

    },
    findInitialOrder: function()
    {
        var i = 0;
        Dash.log(" widget selector=" + Dash.widget_selector);
        Dash.osm = [];
        $(Dash.widget_selector).each(function() {
            var op = WO($(this), i);
            Dash.osm.push(op);
            op.console();
            ++i;
            Dash.osm = (Dash.findOrder(op, Dash.osm)).osm;
        });
    },
    findOrder: function(wo, osm)
    {
        var nop = [];
        var placed = false;
        var tx = wo.jo.position().left;
        var ty = wo.jo.position().top;
        var th = wo.h;
        var index = -1;

        for (var i = 0; i < osm.length; ++i)
        {
            if (wo.id !== osm[i].id) {

                // if x is less than nx and y range intersects with ny range --then its moves ahead
                Dash.log("- wo(" + tx + "," + ty + " th=" + th + ") nop[" + i + "](" + osm[i].x + "," + osm[i].y + ")  wo.id=" + wo.id + "  i=" + i);

                //if( !placed && ( tx<=osm[i].x && ( (ty>=osm[i].y && ty<=osm[i].y) || ((ty+th)>=osm[i].y && (ty+th)<=osm[i].y)  ) )){        
                if (!placed && (ty < osm[i].y || (ty === osm[i].y && tx <= osm[i].x))) {
                    //Dash.log("- wo("+tx+","+ty+") nop["+i+"]("+osm[i].x+","+osm[i].y+")  placing wo.id="+wo.id+" at position i="+i);
                    nop.push(wo.copy());
                    nop[nop.length - 1].updateOrder(nop.length - 1);
                    placed = true;
                    index = nop.length - 1;
                }

                nop.push(osm[i].copy());
                nop[nop.length - 1].updateOrder(nop.length - 1);
            }
        }

        if (!placed) {
            nop.push(wo.copy());
            nop[nop.length - 1].updateOrder(nop.length - 1);
            index = nop.length - 1;
        }

        return {osm: nop, index: index};
    },
    getCurrentData: function()
    {
        for (var i = 0; i < Dash.osm.length; ++i)
        {
            Dash.osm[i].updateParamsFromDom();
      }
    },
    intersectRect: function(r1, r2) {
        return !(r2.left > r1.right ||
                r2.right < r1.left ||
                r2.top > r1.bottom ||
                r2.bottom < r1.top);
    },
    intersectWO: function(dobj, wo2) {
        //Dash.log("intersect comparing----------");
        dobj.console();
        wo2.console();
        return !((wo2.x > (dobj.jo.position().left + dobj.w)) ||
                ((wo2.x + wo2.w) < dobj.jo.position().left) ||
                (wo2.y > (dobj.jo.position().top + dobj.h)) ||
                ((wo2.y + wo2.h) < dobj.jo.position().top));
    },
    collision: function(op, index, x, y)
    {
        var b = false;

        var r1 = {
            left: x,
            top: y,
            right: (x + op[index].w - 1),
            bottom: (y + op[index].h - 1)
        }

        for (var i = 0; i < index; ++i) {

            var r2 = {
                left: op[i].x,
                top: op[i].y,
                right: (op[i].x + op[i].w - 1),
                bottom: (op[i].y + op[i].h - 1)
            }

            if (Dash.intersectRect(r1, r2)) {
                b = true;
                //Dash.log(op[index]["id"]+"("+x+","+y+") has collision detected with "+op[i]["id"]+"("+r2["right"]+","+r2["bottom"]+")" );
                break;
            }
        }
        //Dash.log(" returning b="+b);
        return b;
    },
    ///////////////////////////////////////



    copyOsm: function(osm) {
        var nop = [];
        for (var i = 0; i < osm.length; ++i)
        {
            nop.push(osm[i].copy());
        }
        return nop;
    },
    spliceOsm: function(osm, wo, index) {
        var nop = [];
        var placed = false;
        for (var i = 0; i < osm.length; ++i)
        {
            if (wo.id != osm[i].id) {
                if (index == (nop.length)) {
                    nop.push(wo.copy());
                    nop[nop.length - 1].updateOrder(nop.length - 1);
                    placed = true;
                }
                nop.push(osm[i].copy());
                nop[nop.length - 1].updateOrder(nop.length - 1);
            }
        }
        if (!placed) {
            nop.push(wo.copy());
            nop[nop.length - 1].updateOrder(nop.length - 1);
        }
        return nop;
    },
    remove: function(jo) {
        for (var i = 0; i < Dash.osm.length; ++i) {
            if (Dash.osm[i].jo.prop("order") == jo.prop("order"))
            {
                Dash.osm.splice(i, 1);
                break;
            }
        }
    },
    add: function(jo) {

        Dash.findInitialOrder();
        //jo.dblclick( function(){Dash.activateLevelFive($(this));} );
        jo.find(" a.level2").click(Landing.handleDoubleClick)
        jo.draggable({containment: Dash.container_selector, grid: [20, 20], opacity: .7, stop: Dash.handleStop, start: Dash.handleStart, drag: Dash.handleDrag});


    },
    //////////////////////////////////////////////////


    findUnionPerc: function(dragObj, candidate) {

        if (!Dash.intersectWO(dragObj, candidate)) {
            return 0;
        }

        var x1b = dragObj.jo.position().left + dragObj.w;
        var x2b = candidate.x + candidate.w;
        var y1b = dragObj.jo.position().top + dragObj.h;
        var y2b = candidate.y + candidate.h;

        //Dash.log(" target("+dragObj.x+","+dragObj.y+","+dragObj.w+","+dragObj.h);
        //Dash.log(" candidate("+candidate.x+","+candidate.y+","+candidate.w+","+candidate.h);
        /*
         SI = Max(0, Max(XA2, XB2) - Min(XA1, XB1)) * Max(0, Max(YA2, YB2) - Min(YA1, YB1))
         From there you compute the area of the union:
         
         SU = SA + SB - SI
         And you can consider the ratio
         
         SI / SU
         */

        var x = Math.max(dragObj.jo.position().left, candidate.x);
        var y = Math.max(dragObj.jo.position().top, candidate.y);

        var x2 = Math.min(x1b, x2b);
        var y2 = Math.min(y1b, y2b);
        //Dash.log(" x="+x+" x2="+x2+" y1="+y+"  y2="+y2);

        var a = ((x2 - x) * (y2 - y));
        var ap = dragObj.w * dragObj.h;

        if (a <= 0) {
            r = 0;
        }
        else {
            r = a / ap;
        }

        {
            Dash.log("1:<" + Dash.cnt + ">(" + dragObj.id + ")(" + dragObj.jo.position().left + "," + dragObj.jo.position().top + ") union with: " + candidate.id + "(" + candidate.x + "," + candidate.y + ") a=" + a + "  ap=" + ap + "  perc=" + r);
}
        return r;
    },
    findUnionPerc2: function(dragObj, candidate) {

        if (!Dash.intersectWO(dragObj, candidate)) {
            return 0;
        }

        var x1b = dragObj.jo.position().left + dragObj.w;
        var x2b = candidate.x + candidate.w;
        var y1b = dragObj.jo.position().top + dragObj.h;
        var y2b = candidate.y + candidate.h;

        //Dash.log(" target("+target.x+","+target.y+","+target.w+","+target.h);
        //Dash.log(" candidate("+candidate.x+","+candidate.y+","+candidate.w+","+candidate.h);

        var x = Math.max(dragObj.jo.position().left, candidate.x);
        var y = Math.max(dragObj.jo.position().top, candidate.y);

        var x2 = Math.min(x1b, x2b);
        var y2 = Math.min(y1b, y2b);
        //Dash.log(" x="+x+" x2="+x2+" y1="+y+"  y2="+y2);

        var a = ((x2 - x) * (y2 - y));
        var ap = dragObj.w * dragObj.h;
        var ap2 = candidate.w * candidate.h;
        //Dash.log("target("+dragObj.id+") union with: "+candidate.id+" a="+a+"  ap="+ap+"  perc="+a/ap);
        //Dash.log("2:<"+Dash.cnt+">("+dragObj.id+")("+dragObj.jo.position().left+","+dragObj.jo.position().top+") union with: "+candidate.id+"("+candidate.x+","+candidate.y+") a="+a+"  ap="+ap+"  perc="+a/ap);

        var p1 = a / ap;
        var p2 = a / ap2;
        if (a <= 0) {
            p1 = 0;
            p2 = 0;
        }

        return ap < ap2 ? p1 : p2;

    },
    determineCandidate: function(target) {
        var index = -1;
        var intersected = false;
        //console.log("  determine candidate--<"+Dash.cnt+">-----target id="+target.id+"-");
        for (var i = 0; i < Dash.osm.length; ++i)
        {
            //console.log(" osm id="+Dash.osm[i].id+" x="+Dash.osm[i].x+" y="+Dash.osm[i].y);
            /* if(target.id!=Dash.osm[i].id)*/{
                if (Dash.intersectWO(target, Dash.osm[i]))
                {
                    intersected = true;
                    //console.log(" found intersect with "+Dash.osm[i].id);
                    if (Dash.findUnionPerc2(target, Dash.osm[i]) > .6)
                    {
                        index = i;
                        //console.log("i="+i+" target("+target.id+") found overlapping candidate ("+Dash.osm[i].id+")");
                        break;
                    }
                }
                else {
                    //ok now its not intersecting with anything
                    // Dash.log("i="+i+" candidate did not match("+Dash.osm[i].id+")");                
                }
            }
        }
        //Dash.log(" end determine candidate...");

        return intersected ? index : -2;
    },
    init: function(container_selector, widget_selector, block_width, block_height) {
        Dash.container_selector = container_selector;
        Dash.widget_selector = widget_selector;

        Dash.container = $(Dash.container_selector);
        Dash.body = $("body");
        Dash.pbox = $(".vzuui-app-placement-box");

        Dash.mask = $(".vzuui-drag-mask");

        Dash.bw = block_width;
        Dash.bh = block_height;
        Dash.log(" --------------- DASH INIT ------------");
        $(Dash.widget_selector).each(function() {
            Dash.log(" making draggable");
            //$(this).dblclick( function(){Dash.activateLevelFive($(this));} );
            $(this).draggable({containment: Dash.container_selector, grid: [20, 20], opacity: .7, stop: Dash.handleStop, start: Dash.handleStart, drag: Dash.handleDrag});
            //$(this).flippy({duration: "500",verso: $("#woohoo").html()});
        });
        //$(".vzuui-widget-app").dblclick(function(){Dash.deactivateLevelFive($(this));});
        $("#vzuui-nav-icon").click(function() {
            Dash.handleNavigation($(this));
        });
        $("#vzuui-ribbon-left-icon").click(function() {
            Dash.handleRibbonLeft($(this));
        });
        $("#vzuui-ribbon-right-icon").click(function() {
            Dash.handleRibbonRight($(this));
        });

        Dash.findInitialOrder();
        Dash.layout();

        $(window).resize(function() {
            //Dash.layout();
            //Dash.handleresize();          
            if (this.resizeTO)
                clearTimeout(this.resizeTO);
            this.resizeTO = setTimeout(function() {
                $(this).trigger('resizeEnd');
            }, 200);
        });

        $(window).bind('resizeEnd', function() {
            Dash.layout();

            if (Dash.ribbonMode) {
                var c = $(".vzuui-app-container");
                var nw = Dash.body.width() - Dash.ribbonMarginRight - 5;
                var drag_section = c.parent();
                drag_section.css({height: (Dash.bh + Dash.header_height), overflow: "hidden", width: nw});
            }
        });

        $(".vzuui-widget-app div.nav-arrow-level-5 a.nav-arrow-level-5-link").click(function() {
            var cont = $(".vzuui-widget-app");

            if (!cont.data("max") || cont.data("max") == "false") {
                Dash.maximizeLevelFive();
            }
            else {
                Dash.minimizeLevelFive();
            }

        });

        Dash.log(" --------------- DASH INIT EXIT 2------------");
    },
    log: function(str) {
        if (Dash.logging) {
            console.log(str);
        }
    }

};
