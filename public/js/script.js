function submit(){
var hght = $("#hght_create").val().parseFloat();
var wdth = $("#wdth_create").val().parseFloat();
alert(hght);
alert(wdth);

var xmlhttp = new XMLHttpRequest();
xmlhttp.open("POST", "/json-handler");
xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
xmlhttp.send(JSON.stringify({ Height: hght, Width: wdth }));
}