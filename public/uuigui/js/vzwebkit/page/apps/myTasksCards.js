function Init() {
    $('.task-card').click(function() {
       //console.log(this); 
       var params = {};
       $('[data-name]',this).each(function(index,obj) {
           var name = $(obj).data('name');
           name = name.toLowerCase();
           var pname = $(obj).data('pname');
           var value = $(obj).data(name);
           params[pname] = value;
       });

              
       //console.log(task_name);
       var home=window.parent.parent;
       //console.log(home);
       //console.log(home.HomeUser);
       home.HomeUser.handleCardClick(params);
       
       $('.task-card').find('.vzuui-task-card-header').css({'background-color': '#777777'});
       $('.task-card').find('.card-name-value-container').css({'border-color': '#777777'});
       
       $(this).find('.vzuui-task-card-header').css({'background-color': '#00a8e1'});
       $(this).find('.card-name-value-container').css({'border-color': '#00a8e1'});
       
       //alert(rgbToHex($(this).find('.vzuui-task-card-header').css('background-color')));
    });
    
    function rgbToHex(rgb){
        rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        return "#" +
         ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
         ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
         ("0" + parseInt(rgb[3],10).toString(16)).slice(-2);
   }
    $('.task-card').each(function(){
    $(this).hover(
       function(){
        var bgColor = rgbToHex($(this).find('.vzuui-task-card-header').css('background-color'));
        if (bgColor === '#00a8e1') {
            $(this).find('.card-order-number').css('border-color', '#ffffff');
            $(this).find('.vzuui-task-card-header').css({'background-color': '#00a8e1', 'color': '#ffffff'});
            $(this).find('.card-name-value-container').css('border-color', '#00a8e1'); 
        }
        else {
            $(this).find('.card-order-number').css('border-color', '#333333');
            $(this).find('.vzuui-task-card-header').css({'background-color': '#d2f4ff', 'color': '#333333'});
            $(this).find('.card-name-value-container').css('border-color', '#d2f4ff');
        }
    },
       function(){
         var bgColor = rgbToHex($(this).find('.vzuui-task-card-header').css('background-color'));
         if (bgColor === '#00a8e1') {
            $(this).find('.card-order-number').css('border-color', '#ffffff');
            $(this).find('.vzuui-task-card-header').css({'background-color': '#00a8e1', 'color': '#ffffff'});
            $(this).find('.card-name-value-container').css('border-color', '#00a8e1'); 
        }
        else {
            $(this).find('.card-order-number').css('border-color', '#ffffff');
            $(this).find('.vzuui-task-card-header').css({'background-color': '#777777', 'color': '#ffffff'});
            $(this).find('.card-name-value-container').css('border-color', '#777777');
       }  
       });
   });
        /*** Verticle Card Slider ***/
    
    $('#vzuui-card-slide-bottom').click(function() {
      var slideCardIndex = $('#vzuui-card-container').height() / $('#vzuui-card-container-inner').find('.task-card:first-child').height();
      slideCardIndex = slideCardIndex.toFixed(2).slice(0, -3);
      if (slideCardIndex <= 1) {
          slideCardIndex = 1;
      }
      
      if ($(this).data('counter') < $('#vzuui-card-container-inner').find('.task-card').length - slideCardIndex) {
          $('#vzuui-card-slide-top').addClass('vzuui-card-slide-top-enabled').removeClass('vzuui-card-slide-top-disabled');
          var topCardMargin = parseInt(Math.abs($('#vzuui-card-container-inner').find('.task-card:first-child').css('margin-top').slice(0,-2)));
          var cardHeight = parseInt($('#vzuui-card-container-inner').find('.task-card').eq($(this).data('counter')).height());
          var pushCardVal = 0;
          
          if ($('#vzuui-card-container').height() < $('#vzuui-card-container-inner').find('.task-card:first-child').height()) {
              pushCardVal = (topCardMargin + $('#vzuui-card-container').height() + 12) * -1;
          } else {
              pushCardVal = (topCardMargin + cardHeight + 12) * -1;
          }
          $('#vzuui-card-container-inner').find('.task-card:first-child').animate({'marginTop': pushCardVal}, 100, function(){
          
          });
          $('#vzuui-card-slide-bottom').data('counter', (parseInt($('#vzuui-card-slide-bottom').data('counter')) + 1));
     }
     if ($(this).data('counter') >= $('#vzuui-card-container-inner').find('.task-card').length - slideCardIndex){
              $(this).addClass('vzuui-card-slide-bottom-disabled').removeClass('vzuui-card-slide-bottom-enabled');
              return false;
          }
});
                                       
$('#vzuui-card-slide-top').click(function(){
       var slideCardIndex = $('#vzuui-card-container').height() / $('#vzuui-card-container-inner').find('.task-card:first-child').height();
       slideCardIndex = slideCardIndex.toFixed(2).slice(0, -3);
       if (slideCardIndex <= 1) {
          slideCardIndex = 1;
       }
       
       if ($('#vzuui-card-slide-bottom').data('counter') >= 1) {
           $('#vzuui-card-slide-bottom').addClass('vzuui-card-slide-bottom-enabled').removeClass('vzuui-card-slide-bottom-disabled');
          
          var topCardMargin = parseInt($('#vzuui-card-container-inner').find('.task-card:first-child').css('margin-top').slice(0,-2));
          var cardHeight = parseInt($('#vzuui-card-container-inner').find('.task-card').eq($('#vzuui-card-slide-bottom').data('counter') - 1).height());
          var pushCardVal = topCardMargin + cardHeight + 12;
          $('#vzuui-card-container-inner').find('.task-card:first-child').animate({'marginTop':  pushCardVal}, 100, function(){
             
          });
          $('#vzuui-card-slide-bottom').data('counter', $('#vzuui-card-slide-bottom').data('counter') - 1);
    }
    if ($('#vzuui-card-slide-bottom').data('counter') < 1) {
              $(this).addClass('vzuui-card-slide-top-disabled').removeClass('vzuui-card-slide-top-enabled');
              return false;
          }
});

}; 
    /* Init Function Ends */

function containerHeight() {
                    
     function calculateHeight(){
        var parentHeight = $('body').height();
        var elementHeight = parseFloat($('#vzuui-card-slide-top').height() * 2) + parseFloat($('#vzuui-card-container').css('margin-bottom').slice(0, -2) * 5);
        $('#vzuui-card-container').height(parentHeight - elementHeight);
     }
                    
     function slideIconStatus(){
         var cardHeight = 0;
         $('#vzuui-card-container-inner .task-card').each(function(){
             cardHeight += $(this).height();
         });
         
         /*if ($('#vzuui-card-container-inner .task-card').size() <= 0) {
             $('#vzuui-card-container').hide();
             $('#vzuui-card-slide-bottom, #vzuui-card-slide-top').hide();
         }
         else {
             $('#vzuui-card-container').show();
             $('#vzuui-card-slide-bottom, #vzuui-card-slide-top').show();
         }*/
             
         
         if ($('#vzuui-card-container-inner .task-card').size() <= 1 ||
            cardHeight < $('#vzuui-card-container').height()) {
            $('#vzuui-card-slide-top-container, #vzuui-card-slide-bottom-container').hide();
            $('#vzuui-card-container').css({
                '-moz-box-shadow': 'none',
                '-webkit-box-shadow': 'none',
                'box-shadow': 'none'
            });
            $('#vzuui-card-container-inner .task-card:first-child').removeAttr('style');//css('margin-top', '0px');
            $('#vzuui-card-slide-bottom').data('counter', 0)
                              .addClass('vzuui-card-slide-bottom-enabled').removeClass('vzuui-card-slide-bottom-disabled');
            $('#vzuui-card-slide-top').addClass('vzuui-card-slide-top-disabled').removeClass('vzuui-card-slide-top-enabled');
        }
        else { 
            $('#vzuui-card-slide-top-container, #vzuui-card-slide-bottom-container').show();
        }
        
        var slideCardIndex = $('#vzuui-card-container').height() / $('#vzuui-card-container-inner').find('.task-card:first-child').height();
        slideCardIndex = slideCardIndex.toFixed(2).slice(0, -3);
        if (slideCardIndex <= 1) {
            slideCardIndex = 1;
      }
     }
     
     setTimeout(function() {
       calculateHeight();
       slideIconStatus();
     }, 50);
                    
     $(window).resize(function(){
       calculateHeight();
       slideIconStatus();
     });
}

$(function() {
   containerHeight();
   Init();   
}); 