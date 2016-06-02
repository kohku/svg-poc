
function Init() {
    
    
    var tableHeader="";
    for(key in columns){
        tableHeader+="<th scope='col'>" + columns[key] + "</th>";
    }
    $('#thead').html(tableHeader);
    var tableItems = '';
    $.each(lvlOneTableData, function() {      
        tableItems+="<tr>";
        for(key in columns){
            tableItems+="<td>" + this[key] + "</td>";
        }
        tableItems += "</tr>";
    });
    
    
    tableItems = "<table class='vzuui-my-task-table' cellpadding='5'>" + tableItems + "</table>";
    $('.vzuui-lvlOne-table-container').html(tableItems);
    
  
      var tableTotal = 0;
    $('.vzuui-my-task-table tbody tr td:last-child').each(function(){
     tableTotal += parseFloat($(this).text());
    });
    $('#vzuui-table-total').text(tableTotal); 
  
  }
  
  $(function() {
    Init();
});
  


