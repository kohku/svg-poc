change_history_settigns=[
  { 
    "version":"1.2.1",
	"changes":"End User Contact",
    "updatedBy":"Doe, John",
    "date": "2016-10-10" 
  },  {     
"version":"1.2.0",
	"changes":"End User Phone",
    "updatedBy":"Doe, John",
    "date": "2016-10-8"
  },  {    
  "version":"1.1.9",
	"changes":"LCON Email",
    "updatedBy":"Doe, John",
    "date": "2016-10-7"
  },  {  
  "version":"1.1.8",
	"changes":"Alternative End User Contact",
    "updatedBy":"Doe, John",
    "date": "2016-10-6"
  } , {
	"version":"1.1.7",
	"changes":"Alternative End User Email",
    "updatedBy":"Doe, John",
    "date": "2016-10-6"
  }
]


changeHistorySettignsDataObj={
		
		getAllData:function(){		
			return change_history_settigns;
		},
		getById:function(id){		
			return change_history_settigns[id-1];
		},getChildrenById:function(id){		
			children= change_history_settigns[id-1].childData;
			childrenArr=[];
			for(i=0;i<children.length;i++){
				childrenArr.push(change_history_settigns[children[i]-1])
			}
			return childrenArr;
		},hasChildren:function(id){
			return change_history_settigns[id-1].childData.length>0;
		},getDataTableObj:function(){

			var columns = ["version", "changes","updatedBy", "date"];
			var columnNames = ["Version","Changes","Updated By", "Date"];
			
			var dataTableObj = {
			aaData: [],
			aoColumns: []
			};

			//Stuff the aoColumns array
			for (var i=0; i < columnNames.length; i++) {

			 dataTableObj.aoColumns.push({sTitle: columnNames[i]})
			}

			//Stuff the aaData array
			for (var i=0; i < change_history_settigns.length; i++) {
			 var row = change_history_settigns[i];
			 var dataTableRow = [];
			 
			 for (var j=0; j < columns.length; j++) {
				if(columns[j]=='Name'){
				if(row.isPublish){
					str=row[columns[j]]+"<span class='publish'></span>"
					dataTableRow.push(str);

				}else if(row.isSave){
					str=row[columns[j]]+"<span class='save'></span>"
					dataTableRow.push(str);

				}
				}else{
					dataTableRow.push(row[columns[j]]);
				}
				     
			 }
			 dataTableObj.aaData.push(dataTableRow);
			}
             return dataTableObj;
		}		
}