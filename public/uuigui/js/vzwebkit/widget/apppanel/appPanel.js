
var dragged=false;
var ordered=false;

$(document).ready(function () {
              
    try{
            $(".body").hide();
            $(".appMsg").hide();
            createChildren();
            
            $('#appNav a').click(handleNavClick); 
            $('.header').click(handlePanelClick);    
           
            $("#appNav").sortable(
            {
                items: "> li",
                handle: "",
                axis: "y",
                revert:true,
                start: function(event,ui){                       
                        dragged=true;
                },
                stop: function( event, ui ) {                   
                    saveMenuSortOrder();                
                },
                update:function(event, ui){                       
                    var j=event.target || event.srcElement;
                    var k="#"+j.id.substring(4);                   
                    sortRightPanels(k);
                    scrollto.running = false;                                      
                }           
            });
                      
            var p={};
            
            $('#appNav .navchild').each(function(){ 
               p[$(this).data("parentid")]=true;
            });
            
            for(var key in p){
               
                $("#"+key).next().sortable(
                {              
                    items: "> li",
                    handle: "",
                    axis: "y",
                    revert:true,
                    start: function(event,ui){                        
                        dragged=true;
                    },
                    stop: function( event, ui ) {                         
                        saveMenuSortOrder();                      
                    },
                     update:function(event, ui){
                         var j=event.target || event.srcElement;
                         var k="#"+j.id.substring(4);                                                
                          updatePanelsAfterNavSort(k);
                          scrollto.running = false;                       
                    }                   
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
            $(".appNavToggle").animate({'margin-left':  (appNavWidthOut + 3) + 'px'});
            $('#container').animate({'margin-left': (appNavWidthOut ) + 'px'});
            $(".appNavToggle").addClass("active");

            // Toggle Function to show/hide side navigation bar.
            $('.appNavToggle').toggle(function() {
                $(this).removeClass("active");
                $('#appNav').hide('slide');
                $(this).animate({'margin-left': '0px'});
                $(this).css({
                    'background': 'url("' + CONTEXT_PATH + '/css/vzwebkit/images/Sprite-pcgui/unified-new/vzuui-left-push.png") scroll no-repeat',
                    'background-position-y': '24.1%'
                });
                $('#container').animate({'margin-left': '0px'});
            }, function() {
                $(this).addClass("active");
                var appNavWidth = $('#appNav').show('slide').width();
                $(this).animate({'margin-left':  (appNavWidth + 3) + 'px'});
                $(this).css({
                    'background': 'url("' + CONTEXT_PATH + '/css/vzwebkit/images/Sprite-pcgui/unified-new/vzuui-left-pull.png") scroll  no-repeat',
                    'background-position-y': '24.1%'
                });
                $('#container').animate({'margin-left': (appNavWidth ) + 'px'});
            });
            hideForRWD();
            windowResize();   
            var tid=openOnLoad[0];
            $.each(openOnLoad, function(index,object){   
                if (object) {                                   
                     openPanelNoScroll('#'+object);                     
                }
            });
            
            scrollto("#"+tid);
      
    }catch(e){
        //console.log(e);
    }
    
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
    if($(this).hasClass('navchild')){
        $(this).parent().siblings().find('a').removeClass('navchildselect');
        $(this).addClass('navchildselect');
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
   //console.log(" sort right panels");
   
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
   //console.log("pid="+pid);     
        if(pid!=""){
   //console.log(" closing panels id="+id);         
            closePanel("#"+id);
            $(this).remove();
            ordered=true;
        }
   });
   
   $.each(not_nested,function(){
       //console.log(" removing "+this);
       closePanel("#"+this);  //iframe content is lost on a remove-->appendTo
       $("#iframe_content_"+this).remove();
       var o=$("#"+this).remove();
       o.appendTo($('#container'));
   });
   
    $("#panelPadding").remove().appendTo("#container");
   
    //reattaching events--is there a better way--also sortable still seems to work???
    $('.header').unbind('click');//make sure no stale handlers 
    $(".header .vzuui-app-panel-refresh").unbind('click');
    $('.header').click(handlePanelClick);
    
    $(".header .vzuui-app-panel-refresh").click(function(evt){
            evt.preventDefault();
            //console.log(" refresh click id="+$(this).data("panel-id"));
            loadContent("#"+$(this).data("panel-id"));
            return false;
     });
  
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
    var pid = "#"+id + "Body";
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
        top:-40
    };
    if (!window.hideHeader) {
        offset = {
        /* top:0*/
         top:-45
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
    var header = $(id+"Head");
    var closePanel = $(header).find('.closePanel');
    var openPanel = $(header).find('.openPanel');

    closePanel.removeClass('closePanel').addClass('openPanel');

    openPanel.removeClass('openPanel').addClass('closePanel');
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
    var external=(""+$(id).data("external")=="true");
    var method=$(id).data("method");
    var render=$(id).data("render");
    //console.log(" external="+external+" method="+method+"  data-external="+$(id).data("external"));
    idurl=$(id).data("url");//+"?foo=3&callback=?";
    //console.log(" load content: id="+id+" url="+idurl);
    
    if(external){
        idurl=$(id).data("url");
    }
    else{     
        idurl=CONTEXT_PATH+$(id).data("url");        
    }
    if(idurl==""){return;}
   
    var bid=$(id+"Body"); 
    
    var html = "<div class='spinny' style='text-align:left;height:40px;background:white;' ><span class='vzuui-progress-image'></span></div>";
        var c=$(bid);
        c.css({"overflow":"hidden","height":"40px"});
        c.html(html);
 
    if(method=="post"){   
        if(render=="embedded"){
            var ds=JSON.stringify(data_obj);
            //console.log(" embedded do="+data_obj+"jd="+JSON.stringify(data_obj));
            $.ajax( { 
                url:idurl,
                type:"POST",
                data:{panelposterdata:ds},     
                success : function(data){                   
                    //var data_obj=jQuery.parseJSON(data);    
                    //console.log(" data="+data);
                    c.html(getContent(data));
                    
                }
            });
        }
        else{
            //SSO does not allow ajax GETs therefore no render/embedded code for gets
            html = '<iframe name="iframe_content_'+id.substr(1)+'" id="iframe_content_'+id.substr(1)+'"  style="width:100%;height:100%;" frameBorder="0" '+' class="vzuui-app-iframe" scrolling="no" src="about:blank"></iframe>';  
            var iframe = $(html);    
            c.append(iframe);  
            var ed=JSON.stringify(data_obj);     
            $("#panelposterdata").val(ed);
            $("#panel-poster").attr("target","iframe_content_"+id.substr(1));
            setTimeout(function() {
                    $("#panel-poster").attr("action",idurl).submit();
            }, 1000); 
        }
    }
    else{     
        html = '<iframe id="iframe_content_'+id.substr(1)+'"  style="width:100%;height:100%;" frameBorder="0" '+' class="vzuui-app-iframe" scrolling="no" src="' + idurl + '"></iframe>';
        var iframe = $(html);     
        c.append(iframe);       
    }
    
    $(iframe).one('load', function() {
        c.find(".spinny").remove();
        c.css({"overflow":"visible","height":"auto"});          
    });

    setTimeout(function() {
        $(iframe).autoiframeresize();
        var l=$(id+" .ui-resizable").length; 
 
        if(l==1){
            try{bid.resizable("destroy");}catch(e){}
        }
        bid.resizable({handles:'n,s'});
    }, 1000);
}

function getContent(str) {
    var s = str.indexOf("<body>");
    var e = str.lastIndexOf("</body>");
    if (s > -1 && e > s) {
        str = str.substr(s + 6, e - s - 6);
    }
    return str;
} 


function refreshPanel(id,callback) {     
    //console.log("refresh..id="+id);
    loadContent(id);
    return;
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
        UiSettingsSave(appPanelSet.key, appPanelSet);  // Commenting the UISetting Save for panel order as currently grandchild level is not handled and Remarks panels stops working
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
function hideForRWD(){
  widthOfWindow=$(window).width();
   // console.log("The width of window is "+widthOfWindow);
    if(widthOfWindow<400 && $('.appNavToggle').hasClass('active')){
    //    console.log("Width is less than 400");
            $('.appNavToggle').trigger('click');
    }   
}

function windowResize(){

$(window).resize(hideForRWD);

}