function getContent(str) {
    var s = str.indexOf("<body>");
    var e = str.lastIndexOf("</body>");
    if (s > -1 && e > s) {
        str = str.substr(s + 6, e - s - 6);
    }
    return str;
}
  
function doTaskAction(evt) {
    evt.preventDefault();
    var dialog = makeWaitDialog();

    var url = $(this).attr('href');
    var dataServiceName = $(this).data('ds');
    var selected_rows;
//????????????????????????????????  was vgrid-searchResult
    $("#searchResult").vgrid('getSelectedRowsData', function(rows) {
       selected_rows = rows;
    });
    
    if (selected_rows.length == 0) {
        alert("Please select a row first");
        return false;
    }
    
    if (!url.substring(0, 1) == "/" && !url.substring(0, 4) == "http") {
        url = CONTEXT_PATH + "/" + url;
    }
    
    var deferredCollection = [];
    $.each(selected_rows,function(index,obj) {
        
        obj.push({
            name: 'ds',
            value: dataServiceName
        });
        
        deferredCollection.push($.ajax({
            url: url,
            type: 'POST',
            data: obj,
            cache:false
        }));
    });
    
    $.when.apply( $, deferredCollection ).done(function() {
        dialog.dialog('close');
        window.location.reload(true);
    });
    
    return false;
}

function init() {
    ////console.log(" -window height="+$(window).height());
   
    
    $("#getnext").click(function(){
        ////console.log(" get next")
        $.ajax({
             url: CONTEXT_PATH + '/ute/apps/tasks/getnext',
             type: "POST",
             cache: false,
             success: function(data) {

            	 try{
            		 if(data.Body.Fault === undefined){
            			 window.location.reload();
            		 }else
            		 {
            			 alert(data.Body.Fault.detail.VZTaskFault.FaultDescription);
            		 }
            	 }
            	 catch(e){
            		 alert("Failure response from UTE for getNext call.");
            	 }

            	 if(window.parent && window.parent.HomeLinks){
            		 window.parent.HomeLinks.refreshLevelZeros();
            	 }      
             },
             fail:function(){
                 alert(" Not able to get the next task.");
             }
        });
                    
                                     
        return false;           
    });
    
    
    $(".count-link").click(function(){
        
        var cb=$(this).data("countby");  
        ////console.log("cb="+cb+"  --url ="+window.location.href);
        var url=""+window.location.href;
        var prefix=url;
        var suffix="";
        if(url.indexOf("filter")!=-1){
            var s=url.split("&filter=");
            ////console.log(" s[1]="+s[1]);
            var i=s[1].indexOf("&");
            if(i==-1){
                i=s[1].length;
            }
            var s2=s[1].substring(0,i);
            ////console.log("i="+i+" value=("+s2+")");
            prefix=s[0];
            suffix=s[1].substring(i);
        }
        
        ////console.log(" countby="+countby+" filter="+filter);
        var d=new Date();
        var df=d.getFullYear()+"-"+('0'+(d.getMonth()+1)).slice(-2)+"-"+('0'+d.getDate()).slice(-2);
        ////console.log(" date="+df);
        var f="";
        if(countby=="DueDate"){
            if(cb=="pastDue"){
                f="orderDueDate:1999-10-06 - "+df;
            }
            else if(cb=="dueToday"){
                f="orderDueDate:"+df;
            }
            else if (cb=="future"){
                f="orderDueDate:"+df+" - 2029-10-06";
            }
            else{
                f="none";
            }
        }
        else{
            //countby=Status
            if(cb=="assigned"){
                f="taskStatus:ASSIGNED";
            }else if(cb=="suspended"){
                f="taskStatus:SUSPENDED";
            }else if(cb=="withdrawn"){
                f="taskStatus:WITHDRAWN";
            }
            else if(cb=="stale"){
                f="taskStatus:STALE";
            }      
            else{
                f="none";
            }
        }
        ////console.log(" f="+f);
        f=encodeURIComponent(f);
        var nu=prefix;
        if(f!="none"){
            ////console.log(" adding filter");
            nu+="&filter="+f+suffix;
        }
        else{
            nu+=suffix;
        }
        ////console.log(" url ="+nu);
        var nnu=replace_url_param(nu,"count_type",cb);
        ////console.log(" nurl="+nnu);
        if(nnu!=""){
            nu=nnu;
        }
        
        ////console.log(" nu="+nu);
        window.location.href=nu;
    });
    
    
    setTimeout(function() {
        $('#searchResult > .vgrid-body').height($(window).height() - $('#searchResult  > .vgrid-body').offset().top );
    },700);
    
    $(window).resize(function() {
        ////console.log("-window height="+$(window).height());
        $('#searchResult > .vgrid-body').height($(this).height() - $('#searchResult  > .vgrid-body').offset().top );
    });
 
    
    $("#searchResult").vgrid({
    	
        uiObjectName: "UnifiedTasking.Tasks",
        trackGridHorizScroll: true,
        settingsMenu: true,
        enhancedSettingsMenu: false, //set to true to see new filter/sorting dialog
        multiSelect:true,
        sortJs: true,    
        multiSelectCallback: function(checkbox,selected) {
       
            $('#searchResult').vgrid('getSelectedRowsCount', function(count) {              
                if (count > 1) {
                	 
                       ////console.log(" count="+count);
                    $('.vgrid .vgrid-row .vzuui-om-menu').addClass('disabled');
                    $('.vgrid .vgrid-row .vzuui-om-menu').hide();
                    $('.vgrid .vgrid-head .vzuui-om-menu').show();
                } else {
                	 
                    $('.vgrid .vgrid-row .vzuui-om-menu').removeClass('disabled');
                    $('.vgrid .vgrid-row .vzuui-om-menu').show();
                    $('.vgrid .vgrid-head .vzuui-om-menu').hide();
                }
            });
        },
        drawerOpenCallback: function(drawer, open) {
            var order_number = $(drawer).siblings('[data-name=serviceOrderNumber]').text();
            var order_id = $(drawer).siblings('[data-name=internalWorkOrderNumber]').text();
            if (open) {
                var postData = {
                    orderNum: order_number,
                    orderId: order_id,
                    lob: "layer1"
                };
                var request = $.ajax({
                    url: 'http://elmo.ebiz.verizon.com:8008/pcgui/apps/ordermanager/RegionalCktDt',
                    type: "GET",
                    data: postData,
                    dataType: "html",
                    cache: false,
                    xhrFields: {
                        withCredentials: true
                    }
                });
                request.done(function(msg) {
                    msg = getContent(msg);
                    $(drawer).find('.order_details_panel').html(msg);
                    return false;
                });

                request.fail(function(jqXHR, textStatus, errorThrown) {
                    $(drawer).find('.order_details_panel').text("Failed to load data for " + order_number);
                    return false;
                });
            } else {
            }
        }
    });
    
  
    ////////////////////////////////////////////////////////////////////
    
    $('#vzuui-om-menu').on('click',function(evt){
                  
            $('.vzuui-om-dropdown').hide();
            evt.preventDefault();
            //var row = $(this).closest('.vgrid-row');
           // $('.vgrid-selector-checkbox').prop('checked', false);
            var cb=$(this).prev('.vgrid-selector-checkbox');
            var selected_rows;
            cb.prop('checked', true);
            var row=jQuery;  
            var cont=true;
            $("#searchResult").vgrid('getSelectedRowsData', function(rows) {
            	selected_rows = rows;
               
                if(rows.length<1){
    
                    cont=false;
                } 
                row=rows[0];
            });
            
            $("#searchResult").vgrid('getSelectedRowsDataHashmap', function(rows) {
         
          
                
                row=jQuery.parseJSON(rows[0].value);
            });
            
            if(!cont){return;}
                  
            //taskName = $(row).find('[data-name=title]').text();
            //lob =  $(row).find('[data-name=lineOfBusiness]').text();
            //orderSource = $(row).find('[data-name=orderSource]').text();  
            taskName = row.title;
           
            lob =  row.lineOfBusiness;
            orderSource = row.orderSource;
            
            parameters = {            
                "taskName": taskName,              
                "orderSource": orderSource,              
                "lob": lob, 
                "multi":"true"
            };
          
            var $menu = $(".header-tooltipDiv");
            if ($menu.size() > 0) {
                if ($menu.data("parent-icon") == this) {
                    $menu.slideUp(300, function() {
                        $menu.remove();
                    });
                    return false;
                } else {
                    $menu.remove();
                }
            }

            $menu = $("<div>");
            $menu.addClass('header-tooltipDiv hidedropdown');
            $menu.data("parent-icon", this);
            $(document.body).append($menu);
            $menu.offset({            	
                top: $(this).offset().top+14,
                left: $(this).offset().left
            });
            
            $menu.cw=parseInt($(this).parent().css("width"));
                       
           // if ($menu.children("li").length == 0) {                   
                var promise = $.ajax({
                	data: selected_rows,
                    url: CONTEXT_PATH + "/ute/apps/viewAction/admin",
                    type: "POST"
                });
                promise.done(function(result, textStatus) {                      
                    $menu.append(result);  
                    $menu.show();
                });
                  
            //}
         });
    
    
    
    
    
    
    /*var selected_rows;
         	
         	var lob ="";
         	var value ="";
         	var label = "";
         	$("#searchResult").vgrid('getSelectedRowsDataHashmap', function(rows,rowArr) {
                 selected_rows = rows;              
                 menuRow = rowArr;
             });        	
                var prom=
         	$.ajax({
         	     data: selected_rows,
                     url: CONTEXT_PATH + "/apps/usertasks/MultiViewAction",
                     type: "POST",
                     dataType: 'json',
                     cache: false
         		});
                 prom.done(function(result, textStatus) {
                 	
                 	 var list = result.list;
                 	 
                      var ul = $('#vzuui-task-actions');
                     
                      ul.empty();
                     
                      for (var i = 0; i < list.length; i++) {
                     	
                          var li = $("<li>");
                          var a = $("<a>");
                          a.text(list[i].label);
                          a.attr('href',list[i].url); //hack
                          a.attr('data-ds',list[i].ds);
                          a.attr('data-desc' , list[i].label);
                          a.attr('data-action' , list[i].action);
                          a.attr('data-urlType' , list[i].urlType);
                          a.click(menuOnClickPopup);
                          li.append(a);
                          ul.append(li);
                      }
                 }); 
        */
    
    
    function doSomething(){
        ////console.log(" hello");
    }
    
    
    function replace_url_param(url,name,value){   
////console.log("name="+name+" value="+value);        
        
        if(url.indexOf(name)!=-1){
            var s=url.split(name+"=");           
            var i=s[1].indexOf("&");
            var s2="";
            if(i==-1){
                i=s[1].length;
            }else{
                s2+=s[1].substring(i);
            }               
            return s[0]+name+"="+value+s2;
        }
        else{
            return url+"&"+name+"="+value;
        }
    }
    
    /////////////////////////////////////////////////////////////////////
    
   
     $('#searchResult .vgrid-body .vzuui-om-menu').click(function(evt) {
         
         
            $('.vzuui-om-dropdown').hide();
            evt.preventDefault();
            var row = $(this).closest('.vgrid-row');
            $('.vgrid-selector-checkbox').prop('checked', false);
            var cb=$(this).prev('.vgrid-selector-checkbox');
  
            cb.prop('checked', true);
              
            var cont=true;
            $("#searchResult").vgrid('getSelectedRowsData', function(rows) {
                if(rows.length<1){cont=false;}      
            });
            if(!cont){return;}
                  
            taskName = $(row).find('[data-name=title]').text();
            lob =  $(row).find('[data-name=lineOfBusiness]').text();
            orderSource = $(row).find('[data-name=orderSource]').text();
            taskStatus = $(row).find('[data-name=taskStatus]').text();   
            
            parameters = {            
                "taskName": taskName,              
                "orderSource": orderSource,              
                "lob": lob,       
                "multi":"false",
                "taskStatus" : taskStatus
            };
          
            var $menu = $(".header-tooltipDiv");
            if ($menu.size() > 0) {
                if ($menu.data("parent-icon") == this) {
                    $menu.slideUp(300, function() {
                        $menu.remove();
                    });
                    return false;
                } else {
                    $menu.remove();
                }
            }


            $menu = $("<div>");
            $menu.addClass('header-tooltipDiv hidedropdown');
            $menu.data("parent-icon", this);
        

            $(document.body).append($menu);
            
            $menu.cw=parseInt($(this).parent().css("width"));
            
            $menu.offset({            	
                top: $(this).offset().top+14,
                left: $(this).offset().left
            });
            
           // $menu.css("top",$(row).offset().top+14);
          //  $menu.css("left",$(row).offset().left);

          //alert($menu);
          ////console.log(" setting up menu leng="+$menu.children("li").length+" top="+$menu.css("top"));
          /*
            if ($menu.is(':visible')) {
                //console.log(" viz");
                $menu.slideUp(300);
            } else*/ {
                if ($menu.children("li").length == 0) {
                   // //console.log(" ajax params="+parameters);
                    var promise = $.ajax({
                        data: parameters,
                        url: CONTEXT_PATH + "/ute/apps/viewAction",
                        type: "POST"
                    });
                    promise.done(function(result, textStatus) {
                       // //console.log(" result = "+result);
                        //$menu.show();
                        $menu.append(result);
     /*$menu.show();*/                   
                        // $("#testDiv").show();
                        // $("#testDiv").html(result);
                        
                        
                        $menu.slideDown(300,function(){
                   //  //console.log(" slidedown--");         
                    var h=$menu.height();
                    var wh=$(window).height();
                    var top=$menu.position().top;      

                   // //console.log("cw="+$menu.cw+" mh="+h+"  wh="+wh+" st="+$(window).scrollTop()+" top="+$menu.position().top+" left:"+ $menu.position().left);
                    var minY=parseInt($(window).scrollTop());
                    var maxY=minY+wh;
                   // //console.log("h="+h+" range ="+minY+" - "+maxY);

                    //menu is 0 height initially --in this case we should show to the side
                    if(h!=0){           
                        if( (top+14+h) < maxY){
                            //display below
                            $menu.css("top",top);
                        }
                        else if( (minY+h)< (top-18)){ //top row y=18
                            //display above
                            $menu.css("top",top-(h+14+6));
                        }
                        else{
                            //display adjacent
                            $menu.css("top",minY);
                            $menu.css("left",$menu.cw);
                        }
                    }
                    else{
                        //display adjacent
                        $menu.css("top",minY);
                        $menu.css("left",$menu.cw);
                    }   
                    
                });
                        
                        
                    });
                }
                
                /*
                $menu.slideDown(300,function(){
                     //console.log(" slidedown-");         
                    var h=$menu.height();
                    var wh=$(window).height();
                    var top=$menu.position().top;      

                    //console.log("cw="+$menu.cw+" mh="+h+"  wh="+wh+" st="+$(window).scrollTop()+" top="+$menu.position().top+" left:"+ $menu.position().left);
                    var minY=parseInt($(window).scrollTop());
                    var maxY=minY+wh;
                    //console.log("h="+h+" range ="+minY+" - "+maxY);

                    //menu is 0 height initially --in this case we should show to the side
                    if(h!=0){           
                        if( (top+14+h) < maxY){
                            //display below
                            $menu.css("top",top);
                        }
                        else if( (minY+h)< (top-18)){ //top row y=18
                            //display above
                            $menu.css("top",top-(h+14+6));
                        }
                        else{
                            //display adjacent
                            $menu.css("top",minY);
                            $menu.css("left",$menu.cw);
                        }
                    }
                    else{
                        //display adjacent
                        $menu.css("top",minY);
                        $menu.css("left",$menu.cw);
                    }   
                    
                });
                    */
                    
                    
            }
            

            return false;
        });
    
    
    
    
    
    
    //////////////////////////////////////////////////////////////////////
    
    
    
     $("#searchResult > .vgrid-body").css('display', 'block');
}


function menuOnclickPopup(desc,action,url,urltype,racf){
    
    ////console.log(" desc"+desc+" action"+action+" url="+url+" urltype="+urltype+" racf="+racf);

    var $menu = $(".header-tooltipDiv");
    var row = $($menu.data("parent-icon")).closest('.vgrid-row');
    
    var taskName = $(row).find('[data-name=title]').text();
    var    lob =  $(row).find('[data-name=lineOfBusiness]').text();
    var  orderSource = $(row).find('[data-name=orderSource]').text();
    var  vzid = $(row).find('[data-name=VzId]').text(); 
    
    
    ////console.log(" len="+$(row).find("[data-name]").length  );
    
    var hm={};
    
    $(row).find("[data-name]").each(function(){
    	
        hm[$(this).data("name")]=$(this).text();
    });
    
    
    
    ////console.log(" taskName="+taskName);
	 
    if ($menu.size() > 0) {
        if ($menu.data("parent-icon") == this) {
            $menu.slideUp(300, function() {
                $menu.remove();
            });
            return false;
        } else {
            $menu.remove();
        }
    }
    
   var selected_task_rows=[];
   
     $("#searchResult").vgrid('getSelectedRowsDataHashmap', function(rows) {
         
          
        selected_task_rows = rows;
       
         //console.log(" rows="+rows[0]+ " value="+selected_task_rows[0].value);
         //console.log(" rows="+rows[1]+ " value="+selected_task_rows[1].value);
       ////console.log("rows="+rows[0].length+"  data="+jQuery.parseJSON(selected_task_rows[0].value));
       
    });
    
      
    if(action=="singleRoleToMultiUsers"){   
        handleAdminMultiVzid(url,row,taskName,lob,orderSource,hm,selected_task_rows);
    }
    
}

function handleAdminMultiVzid(url,row,taskName,lob,orderSource,hm,selected_task_rows){ 
    $.ajax({
    	 data: selected_task_rows,
         url: CONTEXT_PATH +"/ute/admin/securityAdmin/getVzid",
         type: "POST",
         dataType: 'json',
         cache: false,
       
         error: function(xhr, textStatus, errorThrown) {
        	
             var resp = xhr.responseText;
             var jo=window.jQuery;
             var dbox=jo("#dialog-task-action");
             dbox.empty();
             dbox.append(resp);
             initDialog("#dialog-task-action",row,taskName,lob,orderSource,hm,window,selected_task_rows); //all dialog jsps need this function
         },
        success: function(data) {
        	
            var jo=window.jQuery;
            var dbox=jo("#dialog-task-action");
              
            dbox.empty();
            dbox.append(data);
              
                       
            
                initDialog("#dialog-task-action",row,taskName,lob,orderSource,hm,window,selected_task_rows); //all dialog jsps need this function
            
        }
    
    
    
        });          
}  
      

function initDialog(selector,row,taskName,lob,orderSource,hm,iframe_window,selected_task_rows){
    //console.log("init dail");
    var jo=window.jQuery;
    
    var dbox=jo(selector);
    
    /*$(selector)*/dbox.dialog({
            title: "Associate Single Role to Multiple Users",
            resizable: false,
            width: 892,
            height:300,
            modal: true,
            buttons: {	
                
                Cancel: function() {
                        $(this).dialog("close");
                }
        }
            
     });
  
   
}


  








      
      

$(function(){
    init();   
});
  
  
  
  
  
   //var test=[{hi:'foo'},{moo:'monkey'}];
   //var td=JSON.stringify(test);
   /*
    $.ajax({
        url: CONTEXT_PATH + "/tasks/execute",
        data:{data:td},
        type:"POST",
        success: function(data) {
            
            //console.log("hi");
        }
    });*/