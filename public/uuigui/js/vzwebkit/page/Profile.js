$("#profileSaveBtn").click(function(){
	var params = $("#profileUpdateForm").serializeArray();
	 $.ajax({
	        type: "POST",
	        url: CONTEXT_PATH + "/ute/admin/profile/save",
	        data: params,
	    }).done(function (uteReturnData) {
	    	
	    });
});