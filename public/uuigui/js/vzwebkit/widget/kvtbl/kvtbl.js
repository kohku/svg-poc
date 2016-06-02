(function ( $ ) {
 	
    $.fn.kvtbl = function(key,data, options  ) {
    	
    	 //alert("orderNumber "+orderNumber+"orderVersion "+orderVersion+"orderId "+orderId +"orderSource "+orderSource);
        //console.log(" key="+key+" data="+data["foo"]);    	 
    	var odata=data[key].data;
        var cspans=data[key].colspans;
       // console.log(" odata="+odata);
    	var sObj=this;
    	var cols=1;

        var settings = $.extend({
        	kvTblCls: "kvtbl",
            kCls: "kCls",
            vCls: "vCls"
        }, options );
 
        function drawTbl(sDiv){
            
        	var d= sObj.width();
            
        	if(sObj.is(':hidden')){
        		var p = sObj.parent();
        		while(p.is(':hidden')) p= p.parent();
        		if(p) d = p.width();
        	}
        	var nc=1;
        	if(d>250 && d<=400) nc=2;
        	else if(d>400 && d<=600) nc=3;
        	else if(d>600 && d<=800) nc=4;
        	else if(d>800 && d<=1000) nc=5;
        	else if(d>1000 && d<=1200) nc=6;
        	else if(d>1200 && d<=1400) nc=7;
        	else if(d>1400 && d<=1600) nc=8;
        	else if(d>1600) nc=9;
        	
        	if(nc!=cols && odata.length>0){
                    cols=nc;
                    var tbl='';

                    var ktd="<td class='"+settings.kCls+"'>";
                    var vtd="<span class='"+settings.vCls+"'><div style='margin-bottom: -18px;'>";

                    var cNum = 0; 
                    var vp =0;
                    var len = odata.length;
                    
                    var perc=parseInt(100/cols);
                    for(var i=0;i<cols;++i){
                        tbl+="<col width="+perc+"%>";
                    }
                      
                    
                    $(odata).each(function(index, element){
                            vp++;          		
                            //console.log(" index="+index+" element="+element); 		
                            var first="";
                            
                            
                            if( (cNum)% cols ==0 ){
                                    if(tbl.length>0) tbl+='</tr><tr class="kvtbl-row">\n';
                                    else tbl+='<tr class="kvtbl-row">'; 
                                    first=" first-td ";
                            }
                            
                            cNum++;

                            var cs=cspans[element[0]];
                            //console.log("cols="+cols+" cNum="+cNum+" element0="+element[0]+"  cs="+cs);
                            
                            if(cs){
                                cnt=parseInt(cs);
                                cNum+=cnt-1;
                                var ktdcs = "<td class='"+settings.kCls+first+"' colspan='"+cnt+"'>";
                                tbl = tbl+ ktdcs +element[0]+':'+vtd+element[1]+'</div></span></td>';                       
                            }
                            else if(vp == len){                              
                                //console.log(" last one.....cNum="+cNum+" cols="+cols);
                                var cnt = 1+cols-(cNum % cols );
                                    var cs=cspans[element[0]];
                                    //console.log("element0="+element[0]+"  cs="+cs);
                                    if(cs){cnt=parseInt(cs);}
                                    var ktdcs = "<td class='"+settings.kCls+first+"' colspan='"+cnt+"'>";
                                    tbl = tbl+ ktdcs +element[0]+':'+vtd+element[1]+'</div></span></td>';
                                
                            }else{
                                tbl = tbl+ ktd +element[0]+':'+vtd+element[1]+'</div></span></td>';     		
                            }
                    });

                    tbl="<table class='"+settings.kvTblCls+"'>"+tbl+"</tr></table>";
                    sDiv.html(tbl);
        	}        	
        }
        
       
        $(window).resize(function() {
        	drawTbl(sObj);
        });
        
        drawTbl(this);
        return this;
    };
    
}( jQuery ));




$(document).ready(function () {
    //console.log(" hello");
   if(kvtbl_registry){
       
       for(key in kvtbl_registry){
//console.log(" calling kvtbl for "+key+" reg="+kvtbl_registry[key]);
           
            var hash= {};
            hash[key]=kvtbl_registry[key];
           $('#'+key).kvtbl(key,hash,{});          
       }
       
   } 
    
});

