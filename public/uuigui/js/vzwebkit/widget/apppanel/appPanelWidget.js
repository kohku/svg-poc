
// widget version of app panel --allows you to have multiple app panels in single jsp
              
vzuui.appPanel=function(selector){
    var o={};
    o.id=selector;
    o.dragged=false;
    o.ordered=false;
console.log("selector");    
    o.init=function(){              
                          
    //try{            
            o.createChildren();
            
            $(o.id+' #appNav a').click(o.handleNavClick); 
            $(o.id+' .header').click(o.handlePanelClick);    
           
            $(o.id+" appNav").sortable(
            {      
                items: "> li",
                handle: "",
                axis: "y",
                revert:true,
                start: function(event,ui){
                        //console.log(" start ui="+ui.helper.item+"  evt="+event.srcElement);
                        o.dragged=true;
                },
                stop: function( event, ui ) {                   
                    o.saveMenuSortOrder();
                   // if(!ordered){dragged=true;}
                    //ordered=false;
                   // dragged=true;
                   //console.log(" stop ui="+event.srcElement);
                },
                update:function(event, ui){     
                    //console.log(" update");
                    //sortRightPanels(); 
                    var k="#"+event.srcElement.id.substring(4);
                    //console.log(" update  evt="+event.srcElement.id+" k="+k);                                                   
                    //updatePanelsAfterNavSort(k);
                    o.sortRightPanels(k);
                    
                }           
            });
            
            
            var p={};
            
            $(o.id+' #appNav .navchild').each(function(){ 
               p[$(this).data("parentid")]=true;
            });
            
            for(var key in p){
                //console.log(" key="+key);         
                
                //$("#"+key).parent().sortable(
                $(o.id+" #"+key).next().sortable(
                {                  
                    items: "> li",
                    handle: "",
                    axis: "y",
                    revert:true,
                    start: function(event,ui){
                        //console.log(" start ui="+ui.helper.item+"  evt="+event.srcElement);
                        o.dragged=true;
                    },
                    stop: function( event, ui ) { 
                         //console.log(" stop"+ui.helper);
                        o.saveMenuSortOrder();
                       // if(!ordered){dragged=true;}
                      //  ordered=false;
                        //dragged=true;
                    },
                    update:function(event, ui){  
                          var k="#"+event.srcElement.id.substring(4);
                          //console.log(" update  evt="+event.srcElement.id+" k="+k);
                          //sortRightPanels();                          
//hmmmm
                        o.updatePanelsAfterNavSort(k);             
                    }              
                });
            }
                      
            // Hover function to change background color on mouseenter/leave.
            $(o.id+' .appNavToggle').hover(function() {
                $(this).css({                  
                    'cursor': 'pointer'
                });
            }, function() {
                $(this).css({                  
                    'cursor': 'pointer'
                });
            });
           
          
            $(o.id+' .appNavToggle').height($(o.id+' #container').height()); // Setting side navigation bar height equal to Detail Container.
            
            var appNavWidthOut = $(o.id+' #appNav').width();
            $(o.id+" .appNavToggle").animate({'margin-left':  (appNavWidthOut + 2) + 'px'});
            $(o.id+' #container').animate({'margin-left': (appNavWidthOut + 10) + 'px'});
            

            // Toggle Function to show/hide side navigation bar.
            $(o.id+'.appNavToggle').toggle(function() {
                $(o.id+' #appNav').hide('slide');
                $(this).animate({'margin-left': '2px'});
                $(this).css({
                    'background': 'url("' + CONTEXT_PATH + '/css/vzwebkit/images/Sprite-pcgui/unified-new/Uni_widget_arrow_nxt_enbl.png") scroll no-repeat',
                    'background-position-y': '24.1%'
                });
                $(o.id+' #container').animate({'margin-left': '10px'});
            }, function() {
            	
            	var appNavWidth = $(o.id+' #appNav').show('slide').width();
                $(this).animate({'margin-left':  (appNavWidth + 2) + 'px'});
                $(this).css({
                    'background': 'url("' + CONTEXT_PATH + '/css/vzwebkit/images/Sprite-pcgui/unified-new/Uni_widget_arrow_prv_enbl.png") scroll  no-repeat',
                    'background-position-y': '24.1%'
                });
                $(o.id+' #container').animate({'margin-left': (appNavWidth + 10) + 'px'});
            });
                     
            var tid=openOnLoad[0];
            $.each(openOnLoad, function(index,object){   
                if (object) {                                   
                     o.openPanelNoScroll('#'+object);                     
                }
            });
            //console.log(" scrollto="+scrollto.running+" tid="+tid);
           
            o.scrollto("#"+tid);
            
   // }catch(e){
        //console.log(e);
   // }
    
}

/////////////////////////////////////////////////////////////////////////////////

        
o.openAllPanels=function(){
    var panels=appPanelSet.panelOrder.split(",");
    var tid=panels[0];
    $.each(panels, function(index,object){   
        if (object) {                                  
            o.openPanelNoScroll('#'+object);              
        }
    });
            
    o.scrollto("#"+tid);
    //UiSettingsSave(appPanelSet.key, appPanelSet);
}        
    
o.closeAllPanels=function(){  
    var panels=appPanelSet.panelOrder.split(",");
    
    $.each(panels, function(index,object){             
        if (object) {                         
               o.closePanel('#'+object);        
        }
    });
}    
        
o.createChildren=function(){  
    $(o.id+' #appNav .navchild').each(function(){ 
        //console.log("-- id="+$(this).attr("id") +" parent="+$(this).data('parentid'));
        var id=$(this).attr("id");
        var pid=$(this).data('parentid');
        $(o.id+" #"+id ).parent().remove().appendTo($(o.id+" #"+pid).siblings("div")/*.parent()*/);

        //now move panels under parents
        var panel_id=id.substr(4);
        var panel_pid=pid.substr(4);
        $(o.id+" #"+panel_id ).remove().appendTo( $(o.id+" #"+panel_pid+"Body") );
        //console.log(" panel_pid="+panel_pid+" data="+$("#"+panel_pid).data("url"));
        $(o.id+" #"+panel_pid).data("url","");
    });   
}        

o.updatePanelsAfterNavSort=function(id){  
    
    $(o.id+'#appNav .navchild').each(function(){ 
        //console.log("-- id="+$(this).attr("id") +" parent="+$(this).data('parentid'));
        var id=$(this).attr("id");
        var pid=$(this).data('parentid');
        //now move panels under parents
        var panel_id=id.substr(4);
        var panel_pid=pid.substr(4);
        $(o.id+"#"+panel_id ).remove().appendTo( $(o.id+" #"+panel_pid+"Body") );
        //console.log(" panel_pid="+panel_pid+" data="+$("#"+panel_pid).data("url"));
        $(o.id+"#"+panel_pid).data("url","");
    });   
    $(o.id+" #panelPadding").remove().appendTo(o.id+" #container");
    $(o.id+' .header').unbind('click');
    $(o.id+' .header').click(o.handlePanelClick);
    
    o.scrollto(id);
}        

                
o.handleNavClick=function(){
    //console.log(" nav click --dragged="+dragged);
    if(o.dragged){  
        //console.log(" calling scroll to from nav click");
        //scrollto(this.hash);
        o.dragged=false;
        return;
    }
    o.openPanel(this.hash);
    return false;        
}

o.handlePanelClick=function() {
    //console.log(" panel click dragged="+dragged);
    if(o.dragged){
        o.dragged=false;
        return;
    }
    o.togglePanel(this);
    $(this).find('.closePanel').parent().addClass('vzuui-active-panel');
    $(this).find('.openPanel').parent().removeClass('vzuui-active-panel');
}           

        
o.sortLeftNav=function(){
    $(o.id+' #container .appPanel').each(function(){ 
        //console.log(" id="+$(this).attr("id"));
        $(o.id+' #nav_' + $(this).attr('id') ).parent().remove().appendTo($(o.id+' #appNav'));
    });
    
    //reattaching events--is there a better way--also sortable still seems to work???
    $(o.id+' #appNav a').click(o.handleNavClick);
}
        
o.sortRightPanels=function(id){
    
    var not_nested={};
   
    $(o.id+' #appNav li a').each(function(){ 
        var p=$(o.id+' #' + $(this).attr('id').substr(4) );
        var id=p.attr("id");
        //console.log(" parent id="+p.data("parentid"));
        if(p.data("parentid")==""){
            //console.log(" not_nested adding id="+id);
            not_nested[id]=id;
        }
    });
    
   $(o.id+' #container iframe').each(function(){
        var id=$(this).parent().parent().attr("id");
        var pid=$(this).parent().parent().data("parentid");
        var obj=$(this).parent().parent();
        if(pid!=""){
            o.closePanel("#"+id);
            $(this).remove();
            o.ordered=true;
        }
   });
   
   $.each(not_nested,function(){
       //console.log(" removing "+this);
       var oo=$(o.id+" #"+this).remove();
       oo.appendTo($(o.id+' #container'));
   });
   
    $(o.id+" #panelPadding").remove().appendTo(o.id+" #container");
   
    //reattaching events--is there a better way--also sortable still seems to work???
    $(o.id+' .header').unbind('click');//make sure no stale handlers 
    $(o.id+' .header').click(o.handlePanelClick);
  
    o.scrollto(id);
}
  
o.closeMsg=function(id) {
    if (id.indexOf("Msg") < 0) id = id + "Msg";
    $(o.id+" "+id).hide();
    return false;
}
o.showMsg=function(id, msg) {
    if (id.indexOf("Msg") < 0) id = id + "Msg";
    $(o.id+" "+id).html(msg).show();
    return false;
}

o.togglePanel=function(id) {
    var id = $(o.id+" "+id).parent().attr('id');
    var pid = "#"+id + "Body";
    var p = $(o.id+" "+pid);
    //console.log("toggle before vis="+p.is(':visible'));
    
    if (p.is(':visible')) {
        o.closePanel("#"+id);
    } else {
        o.openPanel("#" + id);
    }
     //console.log("toggle after vis="+p.is(':visible'));
}
        
o.scrollto=function(id,callback) {
    if (o.scrollto.running) return;
    o.scrollto.running = true;

//console.log(" scrolling to id="+id);
    var offset = {
        top:-40
    };
    if (!window.hideHeader) {
        offset = {
        /* top:0*/
         top:-45
        };
    }
   
    if ($.scrollTo) {
        setTimeout(function(){
            //console.log(" --scrolling id="+id);
        $.scrollTo(id,500,
        {
            axis: 'y',
            easing: 'swing',
            offset: offset,
            onAfter: function() {
                o.scrollto.running = false;                       
                if (callback) {
                    callback(id);
                }
            }
        });
        },500);
    }
}
o.scrollto.running = false;


o.openPanelNoScroll=function(id) {
    console.log("o.id="+o.id+" open panel no scroll id="+id);
    var pid = id + "Body";
    var p = $(o.id+" "+pid);
    if( p.is(":visible") ){
        o.scrollto(id);
        return;
    }
  console.log(" p="+p.html()); 
    if ($.trim(p.text()) == '') {
        if( p.html() && p.html().indexOf('<iframe')==-1){
            console.log(" refreshing");
            o.refreshPanel(id);           
        }
    } 
    p.show();
    o.setOpenPanels();          
    return false;
}



o.openPanel=function(id) {
    //console.log("open panel id="+id);
    var pid = id + "Body";
    var p = $(o.id+" "+pid);
    if( p.is(":visible") ){
        //console.log("visible cya");
        o.scrollto(id);
        return;
    }
   // console.log("id="+id+" p text="+p.text()+"p.html="+p.html());
    if ($.trim(p.text()) == '') {
        if(p.html().indexOf('<iframe')>-1){
           // console.log(" scrollto");
            o.scrollto(id);
        }else{
           // console.log(" refresh");
            o.scrollto(id,o.refreshPanel);
        }

    } else {
        //console.log(" else scrollto")
        o.scrollto(id);
    }
    p.show();

    var header = $(o.id+" "+id+"Head");
    var closePanel = $(header).find('.closePanel');
    var openPanel = $(header).find('.openPanel');

    closePanel.removeClass('closePanel').addClass('openPanel');

    openPanel.removeClass('openPanel').addClass('closePanel');
    
    o.setOpenPanels();          
    //UiSettingsSave(appPanelSet.key, appPanelSet);
    //console.log("finished open id="+id);
    return false;
}

o.closePanel=function(id) {
    var pid = id + "Body";
    o.closeMsg(id);
    $(o.id+" "+pid).hide();
    var header = $(o.id+" "+id+"Head");
    var closePanel = $(header).find('.closePanel');
    var openPanel = $(header).find('.openPanel');

    closePanel.removeClass('closePanel').addClass('openPanel');         
    openPanel.removeClass('openPanel').addClass('closePanel');

    o.setOpenPanels();          
    //UiSettingsSave(appPanelSet.key, appPanelSet);

    return false;
}


o.loadContent=function(id) {
    
 console.log("load content id="+id);
    var idurl="";
    var external=($(o.id+" "+id).data("external")==true);

    idurl=$(o.id+" "+id).data("url");//+"?foo=3&callback=?";
     console.log(" load content: id="+id+" url="+idurl);
    if(idurl==""){return;}

   
  
    
   
    
    var bid=$(o.id+" "+id+"Body"); 
    //var query_params = "&" + $.param(data_obj);
    //var query_params = "&" + $.param(postData);
 console.log(" external = "+external);
    if(external){
        var src = idurl;// + query_params;
        var html = "<div class='spinny' style='text-align:left;height:35px;background:white;' ><span class='vzuui-progress-image'></span></div>";
        var c=$(bid);
        c.html(html);
        html = '<iframe id="iframe_content_'+id.substr(1)+'"  style="background:#888888;width:100%;height:100%;" frameBorder="0" '+' class="vzuui-app-iframe" scrolling="no" src="' + src + '"></iframe>';

        var iframe = $(html);
        iframe.hide();
        c.append(iframe); 
        
        $(iframe).one('load', function() {
            c.find(".spinny").remove();
            iframe.show();
        });
    }
    else{
        
        var html = "<div class='spinny' style='text-align:left;height:35px;background:white;' ><span class='vzuui-progress-image'></span></div>";
        var c=$(bid);
        c.html(html);
        html = '<iframe name="iframe_content_'+id.substr(1)+'" id="iframe_content_'+id.substr(1)+'"  style="background:#888888;width:100%;height:100%;" frameBorder="0" '+' class="vzuui-app-iframe" scrolling="no" src="about:blank"></iframe>';
        var iframe = $(html);
        iframe.hide();
        c.append(iframe); 
  
        var ed=JSON.stringify(data_obj);//encodeURIComponent(JSON.stringify(data_obj));
          console.log(" setting up form data="+ed+" CONTEXT_PATH="+CONTEXT_PATH);
        $("#panelposterdata").val(ed);
        $("#panel-poster").attr("target","iframe_content_"+id.substr(1));
        setTimeout(function() {
                $("#panel-poster").attr("action",CONTEXT_PATH+$(id).data("url")).submit();
            }, 1000);
        //$("#panel-poster").attr("action",CONTEXT_PATH+$(id).data("url")).submit();
        
        $(iframe).one('load', function() {
            c.find(".spinny").remove();
            iframe.show();
        });
    }

    setTimeout(function() {
        $(iframe).autoiframeresize();
    }, 1000);

   
}

        
o.refreshPanel=function(id,callback) {     
    //console.log("refresh..id="+id);
    o.loadContent(id);
    return;
    
    //moved to iframes
    
    var idurl="";

    if($(o.id+" "+id).data("external")==true){
        idurl=$(o.id+" "+id).data("url")+"?foo=3&callback=?";
    }
    else{
        idurl=CONTEXT_PATH+$(o.id+" "+id).data("url");
    }
    if(idurl==""){return;}

    o.showMsg(id, "<span class='iconLoading'> </span> &nbsp; Loading Data");
    var request = $.ajax({
        url: idurl,
        type: "GET",
        data: postData,
        dataType: "html",
        cache: false
    });
    request.done(function (msg) {
        msg = getContent(msg);
        $(id + 'Body').show().html(msg);
        $(id + 'Head').addClass('loaded');
        o.closeMsg(id);
        if (callback) {
            callback();
        }
        return false;
    });

    request.fail(function (jqXHR, textStatus, errorThrown) {
        o.showMsg(id, "Failed to load data for " + id + ".  ts:" + textStatus + ", et:" + errorThrown);
        return false;
    });

    return false;
}

o.getContent=function(str) {
    var s = str.indexOf("<body>");
    var e = str.lastIndexOf("</body>");
    if (s > -1 && e > s) {
        str = str.substr(s + 6, e - s - 6);
    }
    return str;
}
        
o.saveMenuSortOrder=function(){
        var pids="";
        $(o.id+ " #appNav a" ).each(function() {
                var idstr = $(this).attr('id');
                pids=pids+idstr.substring(4)+","
        });
       // console.log("nav pids="+pids);
        appPanelSet.panelOrder=pids;
        UiSettingsSave(appPanelSet.key, appPanelSet);
}


o.savePanelSortOrder=function(){
        var pids="";
        $( o.id+" #container  .appPanel" ).each(function() {           
            var idstr = $(this).attr('id');
            pids=pids+idstr.substring(0)+","

        });
        o.setOpenPanels();
        appPanelSet.panelOrder=pids;
        //console.log("--panel pids="+pids);
        UiSettingsSave(appPanelSet.key, appPanelSet);
}
    
o.setOpenPanels=function(){
    var op="";
    $(o.id+ " #container  .appPanel" ).each(function() {           
        var idstr = $(this).attr('id');                         
        var pid = idstr + "Body";

        var p = $(o.id+" #"+pid);
        if (p.is(':visible')) {

            op=op+idstr.substring(0)+","
        }
    });
    //console.log("open panels="+op);

    appPanelSet.openOnLoad=op;      
}

  return o;
};

