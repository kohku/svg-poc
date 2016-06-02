
	$(document).ready(function(){

		/* Search Fields Starts */	  
	$("#vzuui-searchDropdownBox").change(function(){
		var Search_Str = $(this).val();
		if($(this).val().length>11){
			Search_Str=Search_Str.slice(0,10)+"..."
		}
		$("#vzuui-nav-search-in-content").text(Search_Str);
		$("#vzuui-searchDropdownBox").attr("title",$(this).val())
	});
	$("#vzuui-searchDropdownBox-rwd").change(function(){
		var Search_Str = $(this).val();
		  if($(this).val().length>11){
			Search_Str=Search_Str.slice(0,10)+"..."
		  }
		  $("#vzuui-nav-search-in-content-rwd").text(Search_Str);
		  $("#vzuui-searchDropdownBox-rwd").attr("title",$(this).val())
	});
	var availableTags = [
	"12345",
	"1234511",
	"1234512",
	"278752369 ",
	"3787523 ",
	"47875 ",
	"5787523 ",
	"67875 ",
	"77875 ",
	"8787",
	"9787",
	];
	$( ".vzuui-twotabsearchtextbox" ).autocomplete({
		source: availableTags
	});
	/* Search Fields Ends */	
	$(".vzuui-favourites-new").click(function(){
		$(".vzuui-favourites-overlay").toggle();
		favouritesposition=$(".vzuui-favourites-new").position();
		var width=parseInt($(".vzuui-favourites-overlay").css("width"));
		leftwidht=parseInt(favouritesposition.left)-width/2;
		$(".vzuui-favourites-overlay").offset({left:leftwidht});
		$(".favouritesborder").offset({left:favouritesposition.left+5});	
		$(".vzuui-alerts-notification-overlay-new, .accordion").hide();
		$('.vzuui-user-detail-info-new').hide();
		$(".vzuui-action-select-info").hide();
	});
	$(".vzuui-favourites-close").click(function(){
		$(".vzuui-favourites-overlay").hide();
	});
/* -----------------------------------------------------------------------------------  */
/* ------------------------------ Notification - Starts ------------------------------  */
/* -----------------------------------------------------------------------------------  */
/*// On click of Notification Icon
	isNotificationClickFirstTime=true;
	$(".vzuui-notification-display-new").click(function(){
		if($(".vzuui-alerts-notification-overlay-new, .accordion").is(":hidden")){
			$("#vzuui-tasks-menu").hide();
			$(".vzuui-alerts-notification-overlay-new, .accordion").show();
			w = window.innerWidth;
			if(w<640 && isNotificationClickFirstTime ){
				isNotificationClickFirstTime=false;
				$(".vzuui-system-example-table").DataTable({responsive:true});
			}
			notificationposition=$(".vzuui-notification-display-new").position();
			$(".notificationborder").offset({left:notificationposition.left+7});
			$(".vzuui-favourites-overlay").hide();
			$('.vzuui-user-detail-info-new').hide();
			$(".vzuui-action-select-info").hide();
		}else{
			$(".vzuui-alerts-notification-overlay-new, .accordion").hide();
		}
		$(".vz-styled-select").removeClass("vz-active-mini");
		$(".vz-search").hide();
		$(".vz-mini-menu").hide();
		$(".vzui-searchicon").removeClass("vzui-search-selected");

	});
	$(".vzuui-overlay-close").click(function(){
		$(".vzuui-alerts-notification-overlay-new").hide();
	});
	$("#vzuui-system-notification").accordion({collapsible : true});		
	$(".vzuui-alerts-notification-overlay-new").hide();
	$('.vzuui-system-notification').accordion();
	$("#badge-notification, #ideas-notification").accordion({collapsible:true,active:false});
*/
	$('.vzuui-userdropdown-arrow-new').click(function(){
		if ($('.vzuui-user-detail-info-new').is(':hidden')) {
			$(".vzui-searchicon").removeClass("vzui-search-selected");
		    $(".vz-search").hide();
			$('.vzuui-user-detail-info-new').show();
			userpositon=$(".vzuui-user-info").position();
			$(".userinfoborder ").offset({left:userpositon.left+15});
			$(".vzuui-favourites-overlay").hide();
			$(".vzuui-alerts-notification-overlay-new, .accordion").hide();
			$(".vzuui-action-select-info").hide();
			$(this).addClass('vzuui-userdropdown-arrow-selected');	
		}else {
			$('.vzuui-user-detail-info-new').hide();
			$(this).removeClass('vzuui-userdropdown-arrow-selected');
		}
	});
	$('#vzuui-order-search-input-new ').click(function(){
		searchtoggle();
	});
	$('.searchdropdown ').click(function(){
       searchtoggle();
    });
	function searchtoggle(){ 
		if ($('.searchdropdown-info-new').is(':hidden')) {
			$('.searchdropdown-info-new').show();
        }
    }

/* -----------------------------------------------------------------------------------  */		
/* ------------------------------ Notification - End ---------------------------------  */
/* -----------------------------------------------------------------------------------  */


	$('a.maxmin').click(function(){
		$(this).parent().siblings('.dragbox-content').toggle();
	});

	$('a.delete').click(function(){
		if($(this).hasClass("deleteCardWidget")){
			var sel = confirm('Do you want to remove the widget?');
			if(sel){
				//del code here
				$(".vzuui-level2-widget-container").hide();
				$(".vzuui-content-box div").removeClass("widget-header-selected widget-body-selected");
				}
				else{
					return false;
				}
		}else{
			$(".vzuui-level2-widget-container").hide();
			$(".vzuui-content-box div").removeClass("widget-header-selected widget-body-selected");
			$(".collapsewidgets").hide();
		}	
	});
	$('.column').sortable({
		connectWith: '.column',
		handle: 'h2',
		cursor: 'move',
		placeholder: 'placeholder',
		forcePlaceholderSize: true,
		opacity: 0.4,	
		stop: function(event, ui){
			$(ui.item).find('h2').click();
			var sortorder='';
			$('.column').each(function(){
				var itemorder=$(this).sortable('toArray');
				var columnId=$(this).attr('id');
				sortorder+=columnId+'='+itemorder.toString()+'&';
			});
			sortorder = sortorder.substring(0, sortorder.length - 1)
			alert('SortOrder: '+sortorder);

		}
	}).disableSelection();
		
	// For hiding the user info and search popups on cli
	$(document).click(function(e){
		xPosition=parseInt(e.pageX);
		yPosition =parseInt(e.pageY);
		userinfodis=$(".vzuui-user-detail-info-new").css("display");
		dis=$('.searchdropdown-info-new').css("display")
		if(userinfodis=="block"){
			searchtop=parseInt($('.vzuui-user-detail-info-new').position().top);
			searchleft=parseInt($('.vzuui-user-detail-info-new').position().left);
			searchleftwidth=parseInt($('.vzuui-user-detail-info-new').css("width"));
			searchtopheight=parseInt($('.vzuui-user-detail-info-new').css("height"));
			if((xPosition<searchleft  ||xPosition>(searchleft+searchleftwidth) ) || ( yPosition>(searchtop+searchtopheight ))){
				$('.vzuui-user-detail-info-new').hide();
			 }
		}
	 
		if(dis=="block"){
			searchtop=parseInt($('#vzuui-order-search-input-new').position().top);
			searchleft=parseInt($('#vzuui-order-search-input-new').position().left);
			searchleftwidth=parseInt($('#vzuui-order-search-input-new').css("width"));
			searchtopheight=parseInt($('#vzuui-order-search-input-new').css("height"));
			if((xPosition<searchleft  ||xPosition>(searchleft+searchleftwidth) ) || (yPosition<searchtop  ||yPosition>(searchtop+searchtopheight ))){
				$('.searchdropdown-info-new').hide();
			 }
		 } 
		 actionblock=$('.vzuui-action-select-info').css("display")
		if(actionblock=="block"){
		    actionblocktop=parseInt($('.three-dots').offset().top);
			actionblockleft=parseInt($('.three-dots').offset().left);
			actionblockwidth=parseInt($('.three-dots').css("width"));
			actionblockheight=parseInt($('.three-dots').css("height"));
			if((xPosition<actionblockleft  ||xPosition>(actionblockleft+actionblockwidth) ) || ( yPosition>(actionblocktop+actionblockheight ))){
				$('.vzuui-action-select-info').hide();
			}
		}
	});
	$('.vzuui-submenu').accordion({heightStyle: "content"});
	$(".starttour").on("click",function(){
		$(".tourModalContainer").load("html/tour-dialog.html",function(){
			$(".tourModal").addClass("modalVisible");
			$(".tourDialogClose").click(function(){
				$(".tourModal").removeClass("modalVisible");
			})
		});
	});

$(".vzuui-action-select-info").click(function(){$(this).toggle()});
$(".three-dots").click(function(){
	if($(".vzuui-action-select-info").is(":hidden")){
		actionposition=$(".three-dots").position();
		var width=parseInt($(".vzuui-action-select-info").css("width"));
		$(".vzuui-action-select-info").css("left","0px");	
		$(".actionbubble").css("left","0px");	
		$(".vzuui-action-select-info").offset({left:(actionposition.left-width/2)});	
		$(".actionbubble").offset({left:width/2-8});
		$(".vzuui-action-select-info").show();
		$(".vzuui-favourites-overlay").hide();
		$(".vzuui-alerts-notification-overlay-new, .accordion").hide();
		$('.vzuui-user-detail-info-new').hide()
	}else{
		$(".vzuui-action-select-info").hide();
	}
});
$(".three-dotss").click(function(){
	if($(".vzuui-action-select-info").is(":hidden")){
		actionposition=$(this).position();
		var width=parseInt($(".vzuui-action-select-info").css("width"));
		$(".vzuui-action-select-info").css("left","0px");	
		$(".actionbubble").css("left","0px");	
		$(".vzuui-action-select-info").css("top","0px");	
		$(".vzuui-action-select-info").offset({left:(actionposition.left)});	
		$(".vzuui-action-select-info").offset({top:(actionposition.top+140)});	
		$(".actionbubble").offset({left:width/2-73});
		$(".vzuui-action-select-info").show();
		$(".vzuui-favourites-overlay").hide();
		$(".vzuui-alerts-notification-overlay-new, .accordion").hide();
		$('.vzuui-user-detail-info-new').hide()
	}else{
		$(".vzuui-action-select-info").hide();
	}
});

// On click of Hamburger Icon  for RWD
$(".vz-styled-select").click(function(){
	$(".vzuui-alerts-notification-overlay-new, .accordion").hide();
	$(".vz-search").hide();
	$(".vzui-searchicon").removeClass("vzui-search-selected");
	if($(this).hasClass("vz-active-mini")){
		$(this).removeClass("vz-active-mini");
		$(".vz-mini-menu").hide();
	}else{
		 $(this).removeClass("vz-active-mini");    
		 $(this).addClass("vz-active-mini");
		 $(".vz-mini-menu").show();
	}
});
// On click of Search Icon
$(".vzui-searchicon ").click(function(){
	if($(this).hasClass("vzui-search-selected")){
		$(this).removeClass("vzui-search-selected");
	}else{
		$(this).addClass("vzui-search-selected");
	}
	$(".vz-mini-menu").hide();
	$(".vz-styled-select").removeClass("vz-active-mini");
	$(".vzuui-alerts-notification-overlay-new, .accordion").hide();
	$(".vz-search").toggle();
});

	});
