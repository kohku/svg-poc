
var dragged=false;
var ordered=false;

$(document).ready(function () {
              
    try{
            $(".body").hide();
            $(".appMsg").hide();
            createChildren();
            
            $('#appNav a').click(handleNavClick); 
            $('.header').click(handlePanelClick);    
            /*
            $("#container").sortable({
                    items: "> .appPanel",
                    handle: ".header",
                    axis: "y",                   
                    stop: function( event, ui ) {                  
                        savePanelSortOrder();                        
                        dragged=true;
                    },
                    update: function(event,ui){                       
                        sortLeftNav();                   
                    }               
            });
            */
            $("#appNav").sortable(
            {
               /* items: "> li",*/
                items: "> li",
                handle: "",
                axis: "y",
                revert:true,
                start: function(event,ui){
                        //console.log(" start ui="+ui.helper.item+"  evt="+event.srcElement);
                        dragged=true;
                },
                stop: function( event, ui ) {                   
                    saveMenuSortOrder();
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
                    sortRightPanels(k);
                    
                }           
            });
            
            /*
            $("#nav_express_resolution").parent().sortable(
            {
               // items: "> li",
                items: " li",
                handle: "",
                axis: "y",
                revert:true,
                stop: function( event, ui ) {   
                    console.log(" stop"+ui.helper);
                    saveMenuSortOrder();
                    if(!ordered){dragged=true;}
                    ordered=false;
                   // dragged=true;
                },
                update:function(event, ui){ 
                    console.log(" update");
                    sortRightPanels();  
                    updatePanelsAfterNavSort();
                }           
            });
            */
            var p={};
            
            $('#appNav .navchild').each(function(){ 
               p[$(this).data("parentid")]=true;
            });
            
            for(var key in p){
                //console.log(" key="+key);         
                
                //$("#"+key).parent().sortable(
                $("#"+key).next().sortable(
                {
                   /* items: "> li",*/
                    items: "> li",
                    handle: "",
                    axis: "y",
                    revert:true,
                    start: function(event,ui){
                        //console.log(" start ui="+ui.helper.item+"  evt="+event.srcElement);
                        dragged=true;
                    },
                    stop: function( event, ui ) { 
                         //console.log(" stop"+ui.helper);
                        saveMenuSortOrder();
                       // if(!ordered){dragged=true;}
                      //  ordered=false;
                        //dragged=true;
                    },
                     update:function(event, ui){  
                          var k="#"+event.srcElement.id.substring(4);
                          //console.log(" update  evt="+event.srcElement.id+" k="+k);
                          //sortRightPanels();                          
                          updatePanelsAfterNavSort(k);
                        
                    }
                    /*
                    update:function(k) { 
                        return function(event, ui){  
                          console.log(" update..=.="+k+"  evt="+event.srcElement.id);
                          //sortRightPanels();                          
                          updatePanelsAfterNavSort(k);
                        };
                    }(key)*/
                });
            }
                      
            // Hover function to change background color on mouseenter/leave.
            $('.appNavToggle').hover(function() {
                $(this).css({                  
                    'cursor': 'pointer'
                });
            }, function() {
                $(this).css({                  
                    'cursor': 'pointer'
                });
            });
           
          
            $('.appNavToggle').height($('#container').height()); // Setting side navigation bar height equal to Detail Container.
            
            var appNavWidthOut = $('#appNav').width();
            $(".appNavToggle").animate({'margin-left':  (appNavWidthOut + 2) + 'px'});
            $('#container').animate({'margin-left': (appNavWidthOut + 10) + 'px'});
            

            // Toggle Function to show/hide side navigation bar.
            $('.appNavToggle').toggle(function() {
                $('#appNav').hide('slide');
                $(this).animate({'margin-left': '2px'});
                $(this).css({
                    'background': 'url("' + CONTEXT_PATH + '/css/vzwebkit/images/Sprite-pcgui/unified-new/Uni_widget_arrow_nxt_enbl.png") scroll no-repeat',
                    'background-position-y': '24.1%'
                });
                $('#container').animate({'margin-left': '10px'});
            }, function() {
            	
            	var appNavWidth = $('#appNav').show('slide').width();
                $(this).animate({'margin-left':  (appNavWidth + 2) + 'px'});
                $(this).css({
                    'background': 'url("' + CONTEXT_PATH + '/css/vzwebkit/images/Sprite-pcgui/unified-new/Uni_widget_arrow_prv_enbl.png") scroll  no-repeat',
                    'background-position-y': '24.1%'
                });
                $('#container').animate({'margin-left': (appNavWidth + 10) + 'px'});
            });
                     
            var tid=openOnLoad[0];
            $.each(openOnLoad, function(index,object){   
                if (object) {                                   
                     openPanelNoScroll('#'+object);                     
                }
            });
            //console.log(" scrollto="+scrollto.running+" tid="+tid);
           
            scrollto("#"+tid);
            
    }catch(e){
        //console.log(e);
    }
    
    
    //$("#iframe_content_site_survey").autoiframeresize({"autobody":"true"});
    
    //$(".vzuui-app-iframe").autoiframeresize({"autobody":"true"});
   // $(".vzuui-app-iframe").autoiframeresize();
    //alert(" hello jq="+$(".vzuui-app-iframe"));
});

/////////////////////////////////////////////////////////////////////////////////

        
function openAllPanels(){
    var panels=appPanelSet.panelOrder.split(",");
    var tid=panels[0];
    $.each(panels, function(index,object){   
        if (object) {                                  
            openPanelNoScroll('#'+object);              
        }
    });
            
    scrollto("#"+tid);
    //UiSettingsSave(appPanelSet.key, appPanelSet);
}        
    
function closeAllPanels(){  
    var panels=appPanelSet.panelOrder.split(",");
    
    $.each(panels, function(index,object){             
        if (object) {                         
               closePanel('#'+object);        
        }
    });
}    
        
function createChildren(){  
    $('#appNav .navchild').each(function(){ 
        //console.log("-- id="+$(this).attr("id") +" parent="+$(this).data('parentid'));
        var id=$(this).attr("id");
        var pid=$(this).data('parentid');
        $("#"+id ).parent().remove().appendTo($("#"+pid).siblings("div")/*.parent()*/);

        //now move panels under parents
        var panel_id=id.substr(4);
        var panel_pid=pid.substr(4);
        $("#"+panel_id ).remove().appendTo( $("#"+panel_pid+"Body") );
        //console.log(" panel_pid="+panel_pid+" data="+$("#"+panel_pid).data("url"));
        $("#"+panel_pid).data("url","");
    });   
}        

function updatePanelsAfterNavSort(id){  
    
    $('#appNav .navchild').each(function(){ 
        //console.log("-- id="+$(this).attr("id") +" parent="+$(this).data('parentid'));
        var id=$(this).attr("id");
        var pid=$(this).data('parentid');
        //now move panels under parents
        var panel_id=id.substr(4);
        var panel_pid=pid.substr(4);
        $("#"+panel_id ).remove().appendTo( $("#"+panel_pid+"Body") );
        //console.log(" panel_pid="+panel_pid+" data="+$("#"+panel_pid).data("url"));
        $("#"+panel_pid).data("url","");
    });   
    $("#panelPadding").remove().appendTo("#container");
    $('.header').unbind('click');
    $('.header').click(handlePanelClick);
    
    scrollto(id);
}        

                
function handleNavClick(){
    //console.log(" nav click --dragged="+dragged);
    if(dragged){  
        //console.log(" calling scroll to from nav click");
        //scrollto(this.hash);
        dragged=false;
        return;
    }
    openPanel(this.hash);
    return false;        
}

function handlePanelClick() {
    //console.log(" panel click dragged="+dragged);
    if(dragged){
        dragged=false;
        return;
    }
    togglePanel(this);
    $(this).find('.closePanel').parent().addClass('vzuui-active-panel');
    $(this).find('.openPanel').parent().removeClass('vzuui-active-panel');
}           

        
function sortLeftNav(){
    $('#container .appPanel').each(function(){ 
        //console.log(" id="+$(this).attr("id"));
        $('#nav_' + $(this).attr('id') ).parent().remove().appendTo($('#appNav'));
    });
    
    //reattaching events--is there a better way--also sortable still seems to work???
    $('#appNav a').click(handleNavClick);
}
        
function sortRightPanels(id){
    
    var not_nested={};
   
    $('#appNav li a').each(function(){ 
        var p=$('#' + $(this).attr('id').substr(4) );
        var id=p.attr("id");
        //console.log(" parent id="+p.data("parentid"));
        if(p.data("parentid")==""){
            //console.log(" not_nested adding id="+id);
            not_nested[id]=id;
        }
    });
    
   $('#container iframe').each(function(){
        var id=$(this).parent().parent().attr("id");
        var pid=$(this).parent().parent().data("parentid");
        var obj=$(this).parent().parent();
        if(pid!=""){
            closePanel("#"+id);
            $(this).remove();
            ordered=true;
        }
   });
   
   $.each(not_nested,function(){
       //console.log(" removing "+this);
       var o=$("#"+this).remove();
       o.appendTo($('#container'));
   });
   
    $("#panelPadding").remove().appendTo("#container");
   
    //reattaching events--is there a better way--also sortable still seems to work???
    $('.header').unbind('click');//make sure no stale handlers 
    $('.header').click(handlePanelClick);
  
    scrollto(id);
}
  
function closeMsg(id) {
    if (id.indexOf("Msg") < 0) id = id + "Msg";
    $(id).hide();
    return false;
}
function showMsg(id, msg) {
    if (id.indexOf("Msg") < 0) id = id + "Msg";
    $(id).html(msg).show();
    return false;
}

function togglePanel(id) {
    var id = $(id).parent().attr('id');
   // console.log("togglePanel(id) ="+id);
    var pid = "#"+id + "Body";
   // console.log("pid ="+pid);
    var p = $(pid);
    //console.log("toggle before vis="+p.is(':visible'));
    if (p.is(':visible')) {
        closePanel("#"+id);
    } else {
        openPanel("#" + id);
    }
     //console.log("toggle after vis="+p.is(':visible'));
}
        
function scrollto(id,callback) {
    //console.log(" scrollto id="+id+" callback="+callback+" running="+scrollto.running);
    if (scrollto.running) return;
    scrollto.running = true;

//console.log(" scrolling to id="+id+"  scroll to="+$.scrollTo);
    var offset = {
        top:-120
    };
    if (!window.hideHeader) {
        offset = {
        /* top:0*/
         top:-120
        };
    }
    
    if (window.iframed) {
 
        offset = {
            top:-4     
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
                scrollto.running = false;                       
                if (callback) {
                    callback(id);
                }
            }
        });
        },500);
    }
}
scrollto.running = false;


function openPanelNoScroll(id) {
    //console.log(" open panel no scroll id="+id);
    var pid = id + "Body";
    var p = $(pid);
    if( p.is(":visible") ){
        scrollto(id);
        return;
    }
   
    if ($.trim(p.text()) == '') {
        if(p.html().indexOf('<iframe')==-1){
            refreshPanel(id);           
        }
    } 
    p.show();
    setOpenPanels();          
    return false;
}



function openPanel(id) {
    //console.log("open panel id="+id);
    var pid = id + "Body";
    var p = $(pid);
    
    var parent=$(id).data('parentid');
    
    if (parent) {        
   
    	$("#"+parent+"Body").show();      
    }
    
    if( p.is(":visible") ){
        //console.log("visible cya");
        scrollto(id);
        return;
    }
   // console.log("id="+id+" p text="+p.text()+"p.html="+p.html());
    if ($.trim(p.text()) == '') {
        if(p.html().indexOf('<iframe')>-1){
           // console.log(" scrollto");
            scrollto(id);
        }else{
           // console.log(" refresh");
            scrollto(id,refreshPanel);
        }

    } else {
        //console.log(" else scrollto")
        scrollto(id);
    }
    p.show();

    var header = $(id+"Head");
    var closePanel = $(header).find('.closePanel');
    var openPanel = $(header).find('.openPanel');

    closePanel.removeClass('closePanel').addClass('openPanel');

    openPanel.removeClass('openPanel').addClass('closePanel');
    
    setOpenPanels();          
    //UiSettingsSave(appPanelSet.key, appPanelSet);
    //console.log("finished open id="+id);
    return false;
}

function closePanel(id) {
    var pid = id + "Body";
    closeMsg(id);
    $(pid).hide();
    var header = $(id+"Head");
    var closePanel = $(header).find('.closePanel');
    var openPanel = $(header).find('.openPanel');

    closePanel.removeClass('closePanel').addClass('openPanel');         
    openPanel.removeClass('openPanel').addClass('closePanel');

    setOpenPanels();          
    //UiSettingsSave(appPanelSet.key, appPanelSet);

    return false;
}


function loadContent(id) {
    
	//console.log("load content id="+id);
    var idurl="";
    var external=($(id).data("external")==true);
    // console.log("external="+external);
    idurl=$(id).data("url");//+"?foo=3&callback=?";
   //  console.log(" load content: id="+id+" url="+idurl);
    if(idurl==""){return;}

   
  
    
   
    
    var bid=$(id+"Body"); 
    //console.log("bid="+id+"Body");
    //var query_params = "&" + $.param(data_obj);
    //var query_params = "&" + $.param(postData);
 //console.log(" external = "+external);
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
         // console.log(" setting up form data="+ed+" CONTEXT_PATH="+CONTEXT_PATH);
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
/*
function loadContent(id) {
    
    //console.log("load content id="+id);
    var idurl="";

    if($(id).data("external")==true){
        idurl=$(id).data("url");//+"?foo=3&callback=?";
    }
    else{
        //temporary for task summary
        var query_params = "?data="+encodeURIComponent(JSON.stringify(data_obj));
        idurl=CONTEXT_PATH+$(id).data("url")+query_params;
        
        
    }
    if(idurl==""){return;}
    
    //console.log(" load content: id="+id+" url="+idurl);
    
    var bid=$(id+"Body"); 
    //var query_params = "&" + $.param(data_obj);
    //var query_params = "&" + $.param(postData);
    
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
*/

        
function refreshPanel(id,callback) {     
   // console.log("refresh..id="+id);
    loadContent(id);
    return;
    
    //moved to iframes
    
    var idurl="";

    if($(id).data("external")==true){
        idurl=$(id).data("url")+"?foo=3&callback=?";
    }
    else{
        idurl=CONTEXT_PATH+$(id).data("url");
    }
    if(idurl==""){return;}

    showMsg(id, "<span class='iconLoading'> </span> &nbsp; Loading Data");
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
        closeMsg(id);
        if (callback) {
            callback();
        }
        return false;
    });

    request.fail(function (jqXHR, textStatus, errorThrown) {
        showMsg(id, "Failed to load data for " + id + ".  ts:" + textStatus + ", et:" + errorThrown);
        return false;
    });

    return false;
}

function getContent(str) {
    var s = str.indexOf("<body>");
    var e = str.lastIndexOf("</body>");
    if (s > -1 && e > s) {
        str = str.substr(s + 6, e - s - 6);
    }
    return str;
}
        
function saveMenuSortOrder(){
        var pids="";
        $( "#appNav a" ).each(function() {
                var idstr = $(this).attr('id');
                pids=pids+idstr.substring(4)+","
        });
       // console.log("nav pids="+pids);
        appPanelSet.panelOrder=pids;
        UiSettingsSave(appPanelSet.key, appPanelSet);
}


function savePanelSortOrder(){
        var pids="";
        $( "#container  .appPanel" ).each(function() {           
            var idstr = $(this).attr('id');
            pids=pids+idstr.substring(0)+","

        });
        setOpenPanels();
        appPanelSet.panelOrder=pids;
        //console.log("--panel pids="+pids);
        UiSettingsSave(appPanelSet.key, appPanelSet);
}
    
function setOpenPanels(){
    var op="";
    $( "#container  .appPanel" ).each(function() {           
        var idstr = $(this).attr('id');                         
        var pid = idstr + "Body";

        var p = $("#"+pid);
        if (p.is(':visible')) {

            op=op+idstr.substring(0)+","
        }
    });
    //console.log("open panels="+op);

    appPanelSet.openOnLoad=op;      
}