
var level_one_key=null;


function Init() {
/* Creating Alert Boxes Dynamicaly */
//console.log(" new init");
    var items = '';
 $.each(lvlOneData, function() {
      items += "<span id='vzuui-lvl-one-" + this['id'] + "'><label id='vzuui-label-lvl-one-" + this['id'] + "-alerts' class='vzuui-label-widget-alerts' role='alert'>" + this['alert'] + "</label><label id='vzuui-label-lvl-one-" + this['id'] +"' class='vzuui-label-alert-name'>" + this['alertname'] + "</label></span>";
    });
  $('.vzuui-lvl-one-alerts-section').html(items);
  $('span').css('width', (100/parseInt(lvlOneData.length)).toFixed(2)+'%'); 
 
    /* Counting total Alerts */
    var totalAlerts = 0;
    $('.vzuui-label-widget-alerts').each(function(){
        if ($(this).text() <= 0) {
             $(this).parent().prop('disabled', true);  
             $(this).parent().css({
                      'background': '#eee', 
                      'cursor': 'default', 
                      'color': '#999'
                      
                     });
             $(this).parent().find('label').css({'background': '#eee', 'color': '#999', 'cursor': 'default'}).prop('disabled', true);
        }
        totalAlerts += parseFloat($(this).text());
    });
    $('#vzuui-lvl-one-total-alerts span').text(totalAlerts); 
  
    /* Initializing Widget */
    var inilvlOneAlert = parseFloat($('div.vzuui-lvl-one-alerts-section').find('span:first-child').find('label:first-child').text());
    var inilvlOneTotalAlerts = parseFloat($('#vzuui-lvl-one-total-alerts span').text());
    var inilvlOneName = $('div.vzuui-lvl-one-alerts-section').find('span:first-child').find('label:last-child').text();
    var inilvlOneParcentage = 0;
    
    if (lvlOneData.length <= 0) {
        $('#vzuui-lvl-one-widget').data('info', '')
                                  .data('text', 0)
                                  .data('percent', 0)
                                  .data('fill', '#ddd');
        $('.vzuui-lvl-one-alerts-section, #vzuui-lvl-one-total-alerts').hide();
    }
    else if (lvlOneData.length === 1){
        $('#vzuui-lvl-one-widget').data('info', inilvlOneName )
                                  .data('text', inilvlOneAlert)
                                  .data('percent', 0)
                                  .data('fill', '#ddd');
        $('.vzuui-lvl-one-alerts-section, #vzuui-lvl-one-total-alerts').hide();
    }
    else if (lvlOneData.length > 1)
    {
        if (inilvlOneTotalAlerts <= 0 ){
          $('#vzuui-lvl-one-widget').data('info', '')
                                    .data('text', 0)
                                    .data('percent', 0)
                                    .data('fill', '#ddd');
          $('#vzuui-lvl-one-total-alerts, .vzuui-lvl-one-alerts-section').hide();
          $('#vzuui-lvl-one-widget .circle-text').css({'bottom': '2px'});
        }
        else if (inilvlOneTotalAlerts > 0 )
        {
          $('#vzuui-lvl-one-widget').data('info', 'Total')
                                    .data('text', totalAlerts)
                                    .data('percent', 100)
                                    .data('border', 'inline');
          $('#vzuui-lvl-one-total-alerts').hide();
          $('#vzuui-lvl-one-widget .circle-text').css({'bottom': '15px'});
        }
    }
    $('#vzuui-lvl-one-widget').circliful();
    
    function getHash()   {
           var ifs = window.top.document.getElementsByTagName("iframe");
           for(var i = 0, len = ifs.length; i < len; i++)  {
              var f = ifs[i];
              var fDoc = f.contentDocument || f.contentWindow.document;
              if(fDoc === document)   {
                 var parentID = f.getAttribute("id").replace("level_one_", "");
                 $('#'+parentID, parent.document).addClass('vzuui-effect-widget-selected');/*.css({
                     'border': '4px solid black'
                  }).find('.vzuui-app-icon-title-bar').css({
                      //'left': '1px',
                      //'width': '240px'
                  });*/
                         //.find('.vzuui-app-icon-title-bar, .vzuui-app-content, .vzuui-flip-content').css({'border': '4px solid #333333'});
                 //$('#'+parentID, parent.document).find('.vzuui-app-icon-title-bar').css({'border-bottom': 'none'});
                 //alert($('#'+parentID, parent.document).attr('class'));
                 //alert($(document).find('.vzuui-drag-section').attr('class'));
                 //vzuui.messenger.post("myfilterevent",{name:f.getAttribute("id")});
              }
           }
        }
    
   /* Alert Box On Click Initialization */
$('div.vzuui-lvl-one-alerts-section span').on('click', function(){
    vzuui.messenger.post("myfilterevent",{name:window.FRAME_ID});
  
    //getHash();
    //var ifs = window.top.document.getElementsByTagName("iframe");
    //alert(ifs.getAttribute("id"));
    if ($(this).find('label:first-child').text() > 0)
    {
        $('.vzuui-label-widget-alerts').each(function(){
        if ($(this).text() <= 0) {  
            $(this).parent().find('label').css({'background': '#eee', 'color': '#999', 'cursor': 'default'});
            $(this).parent().find('label').prop('disabled', true);
            $(this).parent().css({'background': '#eee', 'color': '#999', 'cursor': 'default'});
            $(this).parent().prop('disabled', true);
        }
        else {
            $(this).parent().find('label').css({'background': '', 'color': ''});
            $(this).parent().css({'background': '', 'color': ''});
        }
    });
    $(this).css('background', '#333333').find('label').css('color', 'white');
   
    level_one_key= $(this).attr("id").split("vzuui-lvl-one-")[1];
//console.log(" level one key="+level_one_key);



        var cb=level_one_key;
        var d=new Date();
        var df=d.getFullYear()+"-"+('0'+(d.getMonth()+1)).slice(-2)+"-"+('0'+d.getDate()).slice(-2);
        //console.log(" date="+df);
        var f="";
        var taskby = "";
        if(countby==null || countby=="" || countby=="DueDate"){
            if(cb=="pastDue"){
                f="orderDueDate:1999-10-06 - "+df;
                taskby = "PASTDUE";
            }
            else if(cb=="dueToday"){
                f="orderDueDate:"+df;
                taskby = "DUETODAY";
            }
            else if (cb=="future"){
                f="orderDueDate:"+df+" - 2029-10-06";
                taskby = "FUTUREDUE";
            }
            else{
                f="none";
            }
        }
        else if(countby=="GenericFilter"){
        	f=cb;
        }
        else{
            //countby=Status
            if(cb=="assigned"){
                f="taskStatus:ASSIGNED";
                taskby = "ASSIGNED";
            }else if(cb=="suspended"){
                f="taskStatus:SUSPENDED";
                taskby = "SUSPENDED";
            }else if(cb=="withdrawn"){
                f="taskStatus:WITHDRAWN";
            }
            else if(cb=="stale"){
                f="taskStatus:STALE";
            }     
            else if(cb=="expired"){
                f="taskStatus:EXPIRED";
                taskby = "EXPIRED";
            }
            else{
                f="none";
            }
        }
        //console.log("- f="+f);
        f=encodeURIComponent(f);
       level_one_key=f;
    //vzuui.messenger.post("LEVEL_ONE_FILTER_EVENT",{frame_id:window.FRAME_ID,filter:level_one_key,url:window.location});
    vzuui.messenger.post("LEVEL_ONE_FILTER_EVENT",{frame_id:window.FRAME_ID,filter:f,task_by:taskby,url:window.location});

    $('#vzuui-lvl-one-total-alerts').show();
    
    var lvlOneAlert = parseFloat($(this).find('label:first-child').text());
    var lvlOneTotalAlerts = parseFloat($('#vzuui-lvl-one-total-alerts span').text());
    var lvlOneName = $(this).find('label:last-child').text();
    var lvlOneParcentage = 0;
    
    if (lvlOneAlert == 0 || lvlOneTotalAlerts == 0 ){
        lvlOneParcentage = 0;
        $('#vzuui-lvl-one-widget').data('info', lvlOneParcentage);
    }
    else {
        lvlOneParcentage = ((lvlOneAlert / lvlOneTotalAlerts) * 100).toFixed();
        $('#vzuui-lvl-one-widget').data('info', lvlOneParcentage + '%');
    }
    
    $('#vzuui-lvl-one-widget')
                        .data('text', lvlOneAlert)
                        .data('percent', lvlOneParcentage);
    $('#vzuui-lvl-one-widget canvas, #vzuui-lvl-one-widget .circle-info, #vzuui-lvl-one-widget .circle-text').remove();
    $('#vzuui-lvl-one-widget').circliful();
    }
    else {return false;}
        
  });
  
  
  $('#vzuui-lvl-one-total-alerts').on('click', function(event){
        level_one_key=null;
        //console.log(" total!!!");
        vzuui.messenger.post("LEVEL_ONE_FILTER_EVENT",{frame_id:window.FRAME_ID,filter:null,url:window.location});
        
        
        $('.vzuui-label-widget-alerts').each(function(){
        if ($(this).text() <= 0) {  
            $(this).css({'background': '#eee', 'color': '#999', 'cursor': 'default'});
            $(this).prop('disabled', true);
            $(this).parent().css({'background': '#eee', 'color': '#999', 'cursor': 'default'});
            $(this).parent().prop('disabled', true);
        }
        else {
            $(this).parent().find('label').css({'background': '', 'color': ''});
            $(this).parent().css({'background': '', 'color': ''});
        }
    });
        if (inilvlOneTotalAlerts <= 0 ){
        $('#vzuui-lvl-one-widget').data('info', '')
                                  .data('text', 0)
                                  .data('percent', 0);
        $('#vzuui-lvl-one-total-alerts').hide();
        $('div.vzuui-lvl-one-alerts-section span, div.vzuui-lvl-one-alerts-section span label').css({'background': '', 'color': ''});
   
       
        //$('#vzuui-lvl-one-widget').circliful();
    }
    else if (inilvlOneTotalAlerts > 0 )
    {
        $('#vzuui-lvl-one-widget').data('info', 'Total')
                                  .data('text', totalAlerts)
                                  .data('percent', 100)
                                  .data('border', 'inline');
       $('#vzuui-lvl-one-total-alerts').hide();
    }
       $('#vzuui-lvl-one-widget canvas, #vzuui-lvl-one-widget .circle-info, #vzuui-lvl-one-widget .circle-text').remove();
       $('#vzuui-lvl-one-widget').circliful();
       event.preventDefault();
    });
  
  
  /*console.log("--- app-url="+$(window).parent().html());//.data("app-url"));
  console.log(" parent="+$('window.parent').html());
  console.log("- parent2= "+$("#10988", window.parent.document).html());
  console.log("---- parent 3="+window.parent.Landing.tryMakeWidget);*/
 // console.log(" --- parent 1::"+$(window.frameElement).data("app-icon-id"));
  //console.log(" -- parent 5="+$(window).getHome().Landing.tryMakeWidget);
  
  //flipAndLoadBack();
    function makeTinyDiv() {
        var half_div = $('<div id="vzuui-lvl-half">');
        half_div.css({
            'font-size': '2.0em',
            'font-weight': 'bold',
            'text-align': 'center',
            position: 'relative',
            top: '50%',
            'transform': 'translateY(-50%)'
        });
        $('body').append(half_div);
        
        return half_div;
}
    
    function handleResize() {
        var width = $(window).width();
        var height = $(window).height();
        if (width < 201) {
            $('#vzuui-lvl-one-total-alerts').hide();
            $('#vzuui-lvl-one-widget').hide();
            $('#vzuui-my-tasks-alerts-section').hide();
            var count = $('#vzuui-lvl-one-total-alerts span').text();
            var half_div = $('#vzuui-lvl-half');
            if (half_div.length == 0) {
                half_div = makeTinyDiv();
            }
            half_div.text(count);
            half_div.show();
        } else {
            $('#vzuui-lvl-one-total-alerts').show();
            $('#vzuui-lvl-one-widget').show();
            $('#vzuui-my-tasks-alerts-section').show();
            var half_div = $('#vzuui-lvl-half');
            if (half_div.length == 0) {
                half_div = makeTinyDiv();
            }
            half_div.hide();
        }
    };

  $(window).smartresize(function() {
        handleResize();
  });
    $('#vzuui-lvl-one-total-alerts').hide();
    $('#vzuui-lvl-one-widget').hide();
    $('#vzuui-my-tasks-alerts-section').hide();
  setTimeout(function () {
    handleResize();      
  },125);
  
  if(widgetTitleUpdate == 'true'){
	  widgetSetMyTitle();
  }
  
}
/*
function flipAndLoadBack()
{
    var id=$(window.frameElement).data("app-icon-id");
    var home=$(window).getHome();
    var app_icon=home.$("#"+id);
   // console.log("--app_icon id="+app_icon.attr("id"));
    //console.log(" app icon jo="+app_icon.find(" a.flip"));
    app_icon.find(" a.flip").trigger("click");
   // home.Landing.handleFlipApp(app_icon);
}
*/
  
  $(function() {
    Init();
});
  
