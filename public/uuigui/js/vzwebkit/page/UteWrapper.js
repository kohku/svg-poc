/**
 * 
 */

Page = function() {
    var o = {};

    o.init = function() {
        /*                                        */
        /*        Initialize UteAdminLinks        */
        /*                                        */
    	UteAdminLinks.init();
    	
    	try{
            $(".body").hide();
            $(".appMsg").hide();
            
            var p={};
            
            $('#appNav .navchild').each(function(){ 
               p[$(this).data("parentid")]=true;
            });
            
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
            $(".appNavToggle").animate({'margin-left':  (appNavWidthOut + 16) + 'px'});
            $('#container').animate({'margin-left': (appNavWidthOut + 20) + 'px'});
            

            // Toggle Function to show/hide side navigation bar.
            $('.appNavToggle').toggle(function() {
                $('#appNav').hide('slide');
                $(this).animate({'margin-left': '2px'});
                $(this).css({
                    'background': 'url("' + CONTEXT_PATH + '/css/vzwebkit/images/Sprite-pcgui/unified-new/Uni_widget_arrow_nxt_enbl.png") scroll no-repeat',
                    'background-position-y': '24.1%'
                });
                $('#container').animate({'margin-left': '17px'});
            }, function() {
            	
            	var appNavWidth = $('#appNav').show('slide').width();
                $(this).animate({'margin-left':  (appNavWidth + 16) + 'px'});
                $(this).css({
                    'background': 'url("' + CONTEXT_PATH + '/css/vzwebkit/images/Sprite-pcgui/unified-new/Uni_widget_arrow_prv_enbl.png") scroll  no-repeat',
                    'background-position-y': '24.1%'
                });
                $('#container').animate({'margin-left': (appNavWidth + 20) + 'px'});
            });
                     
    }catch(e){
        //console.log(e);
    }
    

    };

    return o;
}();



//var alertOption = { title: "Info" };
//$(document).ready(function(){
//	
//	
//});


///////////////////////////////////////////////////////////////////////////////////
//////////////////////////////UTE LINKS /////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
UteAdminLinks = function() {
	var o = {};

	o.init = function() {
//		if vzuui-main-menu is not there then add it
//		if ($('#appNav li').size() === 0) {
//			var container = $('<div>');
//			container.attr('id', 'vzuui-main-menu');
//			container.addClass('vzuui-main-menu');
//			container.append($('<ul>'));
//			$('.vzuui-logo').after(container);
//		}

		var url = CONTEXT_PATH + "/uui/user/settings/POST/SYSTEM/UteAdmin.Links"
		if (window.isManager) {
			url += '.Supervisor';
		}

		uuiAjax({
			url: url,
			dataType: 'json',
			type: 'POST',
			global: false,
			success: UteAdminLinks.UteAdminLinksProcess
		});
	};

	o.UteAdminLinksProcess = function(data) {
		
		var links = data.links;
		var ul = $('#appNavWrapper ul#appNav');
		ul.empty();
		for (var i = 0; i < links.length; i++) {
			
			var li = $("<li>");
			var a = $('<a>');
			if(links[i].external){
				a.attr("href", links[i].app_url);
			} else {
				a.attr("href", CONTEXT_PATH + links[i].app_url);
			}

			a.data('iframe_id', "page_" + i);
			a.html(links[i].label);

			if (links[i]["default"]) {
				a.addClass('active');
			}
			a.click(UteAdminLinks.handleClick);
			li.append(a);
			ul.append(li);
		}
		setTimeout(function() {
			$('#appNavWrapper ul#appNav li a.active').click();
		}, 100);
	};

	o.handleClick = function(evt) {
		
		$('#appNavWrapper ul#appNav li a').removeClass('active');
		$(this).addClass('active');

		$('.vzuui-app-iframe').css({
			display: 'none'
		});

		UteAdminLinks.getIframe(this, function(id, url, iframe) {
			iframe.css({
				display: "block"
			});
		});

		return false;
	};

	o.getIframe = function(link, callback) {
		var url = $(link).attr("href");
		var id = $(link).data("iframe_id");
		var iframe = $("#" + id);
		if (iframe.size() === 0) {
			iframe = UteAdminLinks.addIframe(id, url, callback);
		} else {
			callback && callback(id, url, iframe);
		}
		return iframe;
	};

	o.addIframe = function(id, url, callback) {
		var container = $('#container');
		var html = "<div class='spinny'><span class='vzuui-progress-image'></span></div>";
		container.append(html);

		var iframe = $("<iframe>");
		iframe.addClass("vzuui-app-iframe");
		iframe.attr("src", url);
		iframe.attr("id", id);
		container.append(iframe);

		$(iframe).one('load', function() {
			container.find(".spinny").remove();
			iframe.show();
			iframe.autoiframeresize();
			callback && callback(id, url, iframe);
		});

		return iframe;
	};

	return o;
}();


///////////////////////////////////////////////////////////////////////////////////
////////////////////////////Initialize the Page //////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
$(Page.init);

