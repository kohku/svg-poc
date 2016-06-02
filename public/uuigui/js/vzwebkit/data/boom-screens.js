uuiscreens = [
		{
			"action" : "<input type='checkbox' class='checkbox'/><img  src='uuigui/css/ute/images/three_dots.png' class='three_dots child-item' style=' width: 15px; height: 15px;'> ",
			"expand" : "",
			"Name" : "OSP.ReviewFacilities.DummyName",
			"Service Provider" : "RQN",
			"Output Type" : "Screen",
			"Version" : "1.2.1",
			"Output Format" : "grid",
			"Creation Date" : "Sep 15 2015",
			"Published Date" : "Sep 15 2015",
			"isPublish" : true,
			"isSave" : false
		},
		{
			"action" : "<input type='checkbox' class='checkbox'/><img  src='uuigui/css/ute/images/three_dots.png' class='three_dots child-item' style=' width: 15px; height: 15px;'> ",
			"expand" : "",
			"Name" : "OSP.ReviewFacilities.DummyName",
			"Service Provider" : "QN",
			"Output Type" : "Screen",
			"Version" : "1.2.1",
			"Output Format" : "grid",
			"Creation Date" : "Sep 15 2015",
			"Published Date" : "Sep 15 2015",
			"isPublish" : true,
			"isSave" : false
		},
		{
			"action" : "<input type='checkbox' class='checkbox'/><img  src='uuigui/css/ute/images/three_dots.png' class='three_dots child-item' style=' width: 15px; height: 15px;'> ",
			"expand" : "",
			"Name" : "OSP.ReviewFacilities.DummyName",
			"Service Provider" : "RN",
			"Output Type" : "Screen",
			"Version" : "1.2.1",
			"Output Format" : "grid",
			"Creation Date" : "Sep 15 2015",
			"Published Date" : "Sep 15 2015",
			"isPublish" : true,
			"isSave" : false
		},
		{
			"action" : "<input type='checkbox' class='checkbox'/><img  src='uuigui/css/ute/images/three_dots.png' class='three_dots child-item' style=' width: 15px; height: 15px;'> ",
			"expand" : "",
			"Name" : "OSP.ReviewFacilities.DummyName",
			"Service Provider" : "NUP",
			"Output Type" : "Screen",
			"Version" : "1.2.1",
			"Output Format" : "grid",
			"Creation Date" : "Sep 15 2015",
			"Published Date" : "Sep 15 2015",
			"isPublish" : false,
			"isSave" : true
		},
		{
			"action" : "<input type='checkbox' class='checkbox'/><img  src='uuigui/css/ute/images/three_dots.png' class='three_dots child-item' style=' width: 15px; height: 15px;'> ",
			"expand" : "",
			"Name" : "OSP.ReviewFacilities.DummyName",
			"Service Provider" : "ABC",
			"Output Type" : "Screen",
			"Version" : "1.2.1",
			"Output Format" : "grid",
			"Creation Date" : "Sep 15 2015",
			"Published Date" : "Sep 15 2015",
			"isPublish" : false,
			"isSave" : true
		} ]

uuiscreensDataObj = {

	getAllData : function() {
		return uuiscreens;
	},
	getById : function(id) {
		return uuiscreens[id - 1];
	},
	getChildrenById : function(id) {
		children = uuiscreens[id - 1].childData;
		childrenArr = [];
		for (i = 0; i < children.length; i++) {
			childrenArr.push(uuiscreens[children[i] - 1])
		}
		return childrenArr;
	},
	hasChildren : function(id) {
		return uuiscreens[id - 1].childData.length > 0;
	},
	getDataTableObj : function() {

		var columns = [ "action", "expand", "Name", "Service Provider",
				"Output Type", "Version", "Output Format", "Creation Date",
				"Published Date" ];
		var columnNames = [
				"<input type='checkbox'  class='checkbox' /><img  src='uuigui/css/ute/images/three_dots.png' class='three_dots parent-item' style=' width: 15px; height: 15px;display:none;'>",
				"", "Name", "Service Provider", "Output Type", "Version",
				"Output Format", "Creation Date", "Published Date" ];

		var dataTableObj = {
			aaData : [],
			aoColumns : []
		};

		// Stuff the aoColumns array
		for (var i = 0; i < columnNames.length; i++) {

			dataTableObj.aoColumns.push({
				sTitle : columnNames[i]
			})
		}

		// Stuff the aaData array
		for (var i = 0; i < uuiscreens.length; i++) {
			var row = uuiscreens[i];
			var dataTableRow = [];

			for (var j = 0; j < columns.length; j++) {
				if (columns[j] == 'Name') {
					if (row.isPublish) {
						str =  "<span class='publish'></span>" + row[columns[j]] ;
						dataTableRow.push(str);

					} else if (row.isSave) {
						str =  "<span class='save'></span>" +row[columns[j]] ;
						dataTableRow.push(str);

					}
				} else {
					dataTableRow.push(row[columns[j]]);
				}

			}
			dataTableObj.aaData.push(dataTableRow);
		}
		return dataTableObj;
	}
}