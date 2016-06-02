columnsettings=[
  { 
    "field":"contact",
	"label":"End User Contact",
    "display":"<input type='radio' name='par1' class='checkbox'/>",
    "displayinHidden": "<input type='radio' name='par1' class='checkbox'/>",
    "hiddenColumns": "<input type='radio' name='par1' class='checkbox'/>"
 
  },  {     
"field":"phone",
	"label":"End User Phone",
    "display":"<input type='radio' name='par2' class='checkbox'/>",
    "displayinHidden": "<input type='radio' name='par2' class='checkbox'/>",
    "hiddenColumns": "<input type='radio' name='par2' class='checkbox'/>"
  },  {    
  "field":"email",
	"label":"LCON Email",
    "display":"<input type='radio' name='par3' class='checkbox'/>",
    "displayinHidden": "<input type='radio' name='par3' class='checkbox'/>",
    "hiddenColumns": "<input type='radio' name='par3' class='checkbox'/>"
  },  {  
  "field":"alt-phone",
	"label":"Alternative End User Contact",
    "display":"<input type='radio' name='par4' class='checkbox'/>",
    "displayinHidden": "<input type='radio' name='par4' class='checkbox'/>",
    "hiddenColumns": "<input type='radio' name='par4' class='checkbox'/>"
  } , {
"field":"alt-email",
	"label":"Alternative End User Email",
    "display":"<input type='radio' name='par5' class='checkbox'/>",
    "displayinHidden": "<input type='radio' name='par5' class='checkbox'/>",
    "hiddenColumns": "<input type='radio' name='par5' class='checkbox'/>"
  }
]


columnsettingsDataObj={
		
		getAllData:function(){		
			return columnsettings;
		},
		getById:function(id){		
			return columnsettings[id-1];
		},getChildrenById:function(id){		
			children= columnsettings[id-1].childData;
			childrenArr=[];
			for(i=0;i<children.length;i++){
				childrenArr.push(columnsettings[children[i]-1])
			}
			return childrenArr;
		},hasChildren:function(id){
			return columnsettings[id-1].childData.length>0;
		},getDataTableObj:function(){

			var columns = ["field", "label","display", "displayinHidden","hiddenColumns"];
			var columnNames = ["Field","Label","Display in Columns", "Display in Row Expansion","Hidden Columns"];
			
			var dataTableObj = {
			aaData: [],
			aoColumns: []
			};

			//Stuff the aoColumns array
			for (var i=0; i < columnNames.length; i++) {

			 dataTableObj.aoColumns.push({sTitle: columnNames[i]})
			}

			//Stuff the aaData array
			for (var i=0; i < columnsettings.length; i++) {
			 var row = columnsettings[i];
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