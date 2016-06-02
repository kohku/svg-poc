

vzuui.ribbon=function(id,click_fnc,remove_fnc,height,max_fnc){
    var o={};
    o.id=id;
    o.height = height ? height : 170;
    o.click_fnc=click_fnc;
    o.remove_fnc=remove_fnc;
    o.cards=[];//original ordered objects
    o.cards_sorted=[];//sorted objects --used to show cards
    o.cards_hash={};// hash table for cards --quick access--after sort-used to build the new cards_sorted
    o.max_fnc=max_fnc;  
      
    o.init=function(){
        var target=$("#"+id);
        
        if(target){
            
            target.append(vzuui.ribbon.ribbon_html);
            target.addClass("body");
            target.data("click-callback",o.click_fnc);
            target.data("remove-callback",o.remove_fnc);
           // target.find(".vzuui-ribbon-slideRbn").css("height",(o.height+4));
            //target.find(".cardRbCntW").css("height",(o.height+4));
            
            //console.log(" data is="+target.data("click-callback"));
            //go get cards
/*
            UiSettingsRetrieve("ribbon."+id,function(cards){      
                //o.cards=jQuery.parseJSON(data);  
                if(cards){o.cards=cards;}
                //console.log(" cards="+JSON.stringify(cards));
                //UiSettingsSave("ribbon_"+id, UiSettingsSave("ribbon_"+id, monkey) );      
                if(cards){o._addCards(id,cards);}  
                target.data("ribbon_obj",o);
            });
*/
            $("#"+id+" .cardRbCntlt").data("id",id);
            $("#"+id+" .cardRbCntrt").data("id",id);
            
            $("#"+id+" .cardRbCntlt").click(vzuui.ribbon.moveLeft);
            $("#"+id+" .cardRbCntrt").click(vzuui.ribbon.moveRight);
        
        }     
    };
    
    o.add=function(url,callback){
        //console.log(" ribbon is adding");
        $("#"+o.id).hide();
        var rurl =CONTEXT_PATH+"/"+url;
	var areq = $.ajax({
		url: rurl,
		type: "GET",
		cache: false,
		data: ""
		
	}).done(function(data){
            var cards=jQuery.parseJSON(data);                   
            o.cards=[];
            o.cards_sorted=[];
            o.cards_hash={};
            
            for(var c in cards){
                //console.log("id="+id+" adding card for "+cards[c].id);               
                o.cards[c]=cards[c];
                o.cards_sorted[c]=cards[c];                  
                o._addCard(id,cards[c]);               
                o.cards_hash[cards[c].id]=cards[c];               
            }  
            
            vzuui.ribbon.moveExtremeLeft(id);	
            o.refreshLayout();
             //UiSettingsSave("ribbon."+o.id, o.cards);	 
            if(callback){callback(o);}
            $("#"+o.id).show();
            isMoveRightDisplay=($(".cardRbCntrt").css("display")=="block");
            if(isMoveRightDisplay)
            	$(".vzuui-ribbon-slideRbnContainer.cardRbCnt > :first-child").click();
            
            $(".vzuui-ribbon-icon-maximize").click(function(){                
                //console.log(" id="+$(this).parent().attr("cid"));
                if(o.max_fnc){o.max_fnc($(this));}
                //return false;
            });
        });
    };
    
    o.remove=function(cid){
        vzuui.ribbon.handleRemove(cid,this.id);
        o.refreshLayout();
    };
    
    o.removeAll=function(){
         //o.cards={};
         //o.sorted_cards={};
         //$("#"+o.id).find(".vzuui-ribbon-slideRbnContainer .cardRbCnt").empty();
         $("#"+o.id+" .cardRbCnt").empty();
     }
    /////////////////// private functions /////////////////////////
    
   
    o._addCards=function(id,cards){
        //console.log(" add Cards");
        for( c in cards){
            //console.log("id="+id+" adding card for "+cards[c].id);
            o._addCard(id,cards[c]);
        }
               
         vzuui.ribbon.moveExtremeLeft(id);	
         o.refreshLayout();
         //console.log(" done with cardssss");
    };
    
    o._addCard=function(id,c){
        try {
            var ht=parseInt(o.height)-12;
            $("#rb_"+c.id).remove();
            var h="<div class='vzuui-ribbon-slideRbnBox'   title='"+c.title+"' id='rb_"+c.id+"' onclick='vzuui.ribbon.cardClick(\""+c.id+"\",\""+id+"\" );' ";

//            for(k in c.ancillaryData){
//                //console.log(" anc data k="+k);
//                h+=" data-"+k+"="+c.ancillaryData[k];
//
//            }
//fix remove card!!!!
/*
            h+=" ><div><div class='vzuui-ribbon-ch' ><span class='vzuui-ribbon-card-icon'></span><span class='vzuui-ribbon-card-title' >";
            h+=c.title+"<span class='vzuui-ribbon-icon-notification'></span></span> <span class='vzuui-ribbon-icon-deleteOM cl' onclick='var event = arguments[0] || window.event; if(event.stopPropagation){event.stopPropagation();}event.cancelBubble=true; vzuui.ribbon.removeCard(\""+c.id+"\",\""+id+"\")'>";
            h+="</span><span>&nbsp;<a id='launchOM' title='Launch "+c.launchTitle+"' href ='"+c.launchUrl+"' target='_"+c.id+"' >";
            h+="<span class='vzuui-ribbon-icon-launchOM'/></a></span></div>";	
*/
            h+=" ><div><div class='vzuui-ribbon-ch' ><span class='vzuui-ribbon-card-icon'></span><span class='vzuui-ribbon-card-title' >";
            h+=c.title+"</span><span class='"+c.trailingHeaderIconClass+"' ></span>";
            h+="<a class='maximize' title='Maximize'  cid='cid_"+c.id+"' >";
            h+="<span class='vzuui-ribbon-icon-maximize'></span></a>";
            h+="<a id='launchOM' title='Launch "+c.launchTitle+"' onclick='vzuui.ribbon.cardClick2(\""+c.id+"\",\""+id+"\" );'>";
            h+="<span class='vzuui-ribbon-icon-launchOM'></span></a></div>";


            //mini kvtbl
            h+='<div id="rb_kvt_'+c.id+'" style="" >';
            h+='</div></div></div>';      
           
            var $card = $(h);
            
            
            for(k in c.ancillaryData){
                //console.log(" k="+k);
                $card.data(k.toLowerCase(), c.ancillaryData[k]);
                $card.data(k, c.ancillaryData[k]);
            }
            
            //$card.prependTo("#"+id+" .cardRbCnt");
            $card.appendTo("#"+id+" .cardRbCnt");
            
            var ni=$("#"+id+" .cardRbCnt");

         
            if(c.iconClassname!=""){
                ni.find(".vzuui-ribbon-card-icon").addClass(c.iconClassname);
            }

            var hash={data:c.data,colspans:c.colspans};   
            $('#rb_kvt_'+c.id).kvtbl('rb_kvt_'+c.id,hash,{});  

            //o.cards.push(card);
           
            //vzuui.ribbon.moveExtremeLeft(id);	
        } catch(e) {l(e);}
        //console.log(" done");
        //o.refreshLayout();
    };
    
    o.refreshLayout=function(){
        setTimeout(function(){
            //console.log(" hello");
            $("#"+o.id).trigger("resize");
        },100);
    };
    
    
    return o;
};



vzuui.ribbon.ribbon_html='<div  class="vzuui-ribbon-slideRbn" style=" overflow: hidden;margin-left:0px;width:100%;">';   
vzuui.ribbon.ribbon_html+='<div class="vzuui-ribbon-slideRbnContainer cardRbCntlt" style="float: left; width: 35px; margin-top:1px;" ><span class="vzuui-ribbon-icon-moveleft"></span></div>';
vzuui.ribbon.ribbon_html+='<div class="vzuui-ribbon-slideRbnContainer cardRbCntrt" style="float: right; width: 35px; margin-right:2px; margin-top:1px;" ><span class="vzuui-ribbon-icon-moveright"></span></div>';
vzuui.ribbon.ribbon_html+='<div class="cardRbCntW">';
vzuui.ribbon.ribbon_html+='<div class="vzuui-ribbon-slideRbnContainer cardRbCnt" style="background-color:#E6E6E6; "></div></div></div>';

/* 
vzuui.ribbon.ribbon_html='<div  class="vzuui-ribbon-slideRbn" style="height:158px; overflow: hidden;margin-left:0px;width:100%;">';   
vzuui.ribbon.ribbon_html+='<div class="vzuui-ribbon-slideRbnContainer cardRbCntlt" style="float: left; width: 35px; margin-top:1px;" ><span class="vzuui-ribbon-icon-moveleft"></span></div>';
vzuui.ribbon.ribbon_html+='<div class="vzuui-ribbon-slideRbnContainer cardRbCntrt" style="float: right; width: 35px; margin-right:2px; margin-top:1px;" ><span class="vzuui-ribbon-icon-moveright"></span></div>';
vzuui.ribbon.ribbon_html+='<div class="cardRbCntW" style="top:2px;margin-right:35px; margin-left:35px; overflow:hidden; position: relative; height:170px; background-color:#E6E6E6;">';
vzuui.ribbon.ribbon_html+='<div class="vzuui-ribbon-slideRbnContainer cardRbCnt" style="background-color:#E6E6E6; position: absolute;"></div></div></div>';

 */
/*
vzuui.ribbon.ribbon_html='<div  class="vzuui-ribbon-slideRbn" style="height:170px; overflow: hidden;">';   
vzuui.ribbon.ribbon_html+='<div class="vzuui-ribbon-slideRbnContainer" id="cardRbCntlt" style="float: left; width: 35px; margin-top:1px;"  onclick="vzuui.ribbon.moveLeft();"><span class="vzuui-ribbon-icon-moveleft"></span></div>';
vzuui.ribbon.ribbon_html+='<div class="vzuui-ribbon-slideRbnContainer" id="cardRbCntrt" style="float: right; width: 35px; margin-right:2px; margin-top:1px;" onclick="vzuui.ribbon.moveRight();"><span class="vzuui-ribbon-icon-moveright"></span></div>';
vzuui.ribbon.ribbon_html+='<div id="cardRbCntW" style="margin-right:35px; margin-left:35px; overflow:hidden; position: relative; height:170px; background-color:#E6E6E6;">';
vzuui.ribbon.ribbon_html+='<div class="vzuui-ribbon-slideRbnContainer" id="cardRbCnt" style="background-color:#E6E6E6; position: absolute;"></div></div></div>';
*/

vzuui.ribbon.cardClick=function(cid,id){
	var ob = $("#rb_"+cid);	
	var temp="#rb_"+cid;
if($(window).width()<=531){
    	$(".card-ribbon-wrapper").css("min-height","0px");
	    $("#foo").hide();
    	$("#foo").css("min-height","0px");
	    $(".card-ribbon-section").children("div:first-child").hide();
	    $(".cards_header_rwd").show();
	    $(".panels-wrapper").show();
	    title=$(".vzuui-ribbon-card-title").html()
	    taskName=$(temp+" .kvtbl-row:nth-child(2) .first-td .vCls").text();
	    $(".cards_title").html(title);
	    $(".cards_task_name").html(taskName);
	    //$('.ribbon-vertical-control').show();
	   }
	//console.log(" ob"+ob+" id="+id);
        $("#"+id+" .cardRbCnt > .vzuui-ribbon-slideRbnBox").children(0).removeClass("vzuui-ribbon-slideRbnBoxSel");
        ob.children(0).addClass("vzuui-ribbon-slideRbnBoxSel");    
        var body=$("#"+id);     
        var callback=body.data("click-callback");
        //console.log(" callback="+callback);
        if(callback){callback(ob);}
};

vzuui.ribbon.cardClick2=function(cid,id){
	var card_jo = $("#rb_"+cid);	
    var id="ute.panels.LAYER1.REGIONAL_PC.Circuit-Design";
    var d_obj=card_jo.data();
    d_obj["panel_template_id"]=id;
    d_obj["debug"]="true";
    var ds=JSON.stringify(d_obj);
    $("#panelposterdata").val(ds);
    var taragetName = "card_app_window_"+card_jo.attr("id");
    window.open('', taragetName);
    $("#panel-poster").attr("target",taragetName);
    $("#panel-poster").attr("action",CONTEXT_PATH+"/tasks/panels/main").submit();
};

vzuui.ribbon.removeCard=function(cid,id){
	//console.log(" removing id="+cid);
        
	//do some other stuff
        var ob = $("#rb_"+cid);	
        var body=$("#"+id);      
        var callback=body.data("remove-callback");
        
        if(callback ){
            if( callback(ob) ){
                vzuui.ribbon.handleRemove(cid,id);
            }
        }
        else{
            vzuui.ribbon.handleRemove(cid,id);
        }
    
};


vzuui.ribbon.handleRemove=function(cid,id){
    
    $("#rb_"+cid).remove();
    var body=$("#"+id); 
    var ro=body.data("ribbon_obj");
    //console.log(" ro.cards="+JSON.stringify(ro.cards[cid]));   
    delete ro.cards[cid];
    delete ro.sorted_cards[cid];
    
    vzuui.ribbon.refreshLayout();
   // UiSettingsSave("ribbon."+id, ro.cards);	 
};



vzuui.ribbon.moveRight=function(){
        var id=$(this).data("id");
	var rbnW = $("#"+id+" .cardRbCntW");
	var rbn = $("#"+id+" .cardRbCnt");
	var w = rbn.width();
	var wW = rbnW.width()-140;
	var p = rbn.position();
	//var pW = rbnW.position();
	
	var nx = p.left - wW;
	var t = nx+w;
	if( t <= 0 ) nx=p.left;
           
        var anx=Math.abs(nx);
        var found=false;
        var adjusted_nx=nx;
        var pl=0;
        $("#"+id+" .vzuui-ribbon-slideRbnBox").each(function(){
           pl=$(this).position().left;
           if(!found && pl>anx){
               //console.log("found");
               adjusted_nx=-pl;
               found=true;
           }
            //console.log("nx="+nx+" position="+$(this).position().left);         
        });
        if(!found){
            adjusted_nx=-pl;
        }
        
      //  var t = nx+w;
	//if( t <= 0 ) nx=p.left;
	
	//lst.css({color:'red'});
	rbn.animate({
		position: 'absolute',
		left: adjusted_nx+'px'
	});
}


vzuui.ribbon.moveLeft=function(){
        var id=$(this).data("id");
	var rbnW = $("#"+id+" .cardRbCntW");
	var rbn = $("#"+id+" .cardRbCnt");
	//var w = rbn.width();
	var wW = rbnW.width()-140;
	var p = rbn.position();
	//var pW = rbnW.position();	
	var nx = p.left +wW;
        if(nx>0) nx=0;

        var anx=Math.abs(nx);
        var found=false;
        var adjusted_nx=nx;
        $($("#"+id+" .vzuui-ribbon-slideRbnBox").get().reverse()).each(function(){     
           var pl=$(this).position().left;
           if(!found && pl<anx){
               //console.log(" found");
               adjusted_nx=-pl;
               found=true;
           }
            //console.log("nx="+nx+" position="+$(this).position().left);            
        });
        
      //  if(nx>0) nx=0;
        
	rbn.animate({
		position: 'absolute',
		left: adjusted_nx+'px'
	});
              
};

vzuui.ribbon.moveExtremeLeft=function(id){	
	var rbn = $("#"+id+" .cardRbCnt");	
	rbn.animate({
		position: 'absolute',
		left: 0+'px'
	});
};


 

function l(msg){
	if(window.console) console.log(msg);
};


/*  working template do not delete!!!
 *  h+=" ><div><div class='vzuui-ribbon-ch' ><span class='vzuui-ribbon-card-icon'></span><span class='vzuui-ribbon-card-title' >";
            h+=c.title+"</span>";
            h+="</span><span>&nbsp;<a id='launchOM' title='Launch "+c.launchTitle+"' href ='"+CONTEXT_PATH+c.launchUrl+"' target='_"+c.id+"' >";
            h+="<span class='vzuui-ribbon-icon-launchOM'/></a></span></div>";


            //mini kvtbl
            h+='<div id="rb_kvt_'+c.id+'" style="" >';
            h+='</div></div></div>';      
 */