var Page = function() {
	var module = {};
	var table;
	var counter = 0;
	var counter_parameter = 1;
	module.init = function() {
		Page.createDataTable();
		Page.loadThreedots();
		Page.loadExpand();


	};
	
			module.loadThreedots = function() {

				$(".three_dots").click(
						function() {
							if ($(".vzuui-action-select-info").is(":hidden")) {
								actionposition = $(this).offset();
								// // console.log(actionposition)
								var width = parseInt($(
										".vzuui-action-select-info").css(
										"width"));
								$(".vzuui-action-select-info").css("left",
										"0px");
								$(".actionbubble").css("left", "0px");
								$(".vzuui-action-select-info")
										.css("top", "0px");

								$(".vzuui-action-select-info").offset({
									left : (actionposition.left - 16)
								});
								$(".vzuui-action-select-info").offset({
									top : (actionposition.top + 30)
								});
								$(".actionbubble").offset({
									left : width / 2 - 80
								});
								$(".vzuui-action-select-info").show();
							} else {
								$(".vzuui-action-select-info").hide();
							}
						});
			},
		
			module.createDataTable = function() {
				obj = uuiscreensDataObj.getDataTableObj();
				var domPos = 'f<"toolbar">tilp';
				configurationSettings = {
					"bAutoWidth" : false,
      "tableTools": {
				        "aButtons": [
				        
				           {
				            "sExtends": "xls",
				            "sButtonText": "Export to Excel"
				              }
				],
				        "sSwfPath":   "D:/work/UI Components Demo/1-Grid Example/boom_v_1/assets/js/DataTables-1.10.5/extensions/TableTools/swf/copy_csv_xls_pdf.swf"
				      },
					"bSort" : true,
					"bInfo" : false,
					"dom" : domPos,
					"responsive":true,
					"aaData" : obj.aaData,
					"aoColumns" : obj.aoColumns,
					"pageLength" : 10,
					"oLanguage" : {
						"sSearch" : "Filter :"
					},
					"sPaginationType" : "extStyle",
					"order" : [ [ 3, "desc" ] ],
					"columnDefs" : [ {
						"targets" : 0,
						"orderable" : false,
						"width" : "55px",
					}, {
						"targets" : 1,
						"orderable" : false,
						"width" : "20px",
					} ],
					"fnRowCallback" : function(nRow, aData, iDisplayIndex,
							iDisplayIndexFull) {
						$('td:eq(1)', nRow).addClass("details-control");
					}
				};
				taskdataTable = $('#tasksdata').on("draw.dt", function() {
				}).DataTable(configurationSettings);
				$("div.toolbar")
						.html(
								'<a id="addbtn" class="cr-scr-with-api"  href="#" >Create Screen with API</a><a id="addbtn-sql" class="cr-scr-with-sql"  href="#" >Create Screen with SQL</a>');

			},	module.loadExpand = function() {

				$('#tasksdata tbody').on('click', 'td.details-control',
						function() {
							var tr = $(this).parents('tr');
							var row = taskdataTable.row(tr);

							if (row.child.isShown()) {
								// This row is already open - close it
								row.child.hide();
								tr.removeClass('shown');
							} else {
								// Open this row
								row.child(Page.childData()).show();
								tr.addClass('shown');
							}
						});
			},	module.childData = function() {
				return '<div class="tableparent"><table lass="vzuui-dataGrid display no-footer childtable" style="width:100%;border:1px solid #ccc"><thead><tr><th>ConnectionPoolName</th><th>Transformations</th><th>URL</th></tr></thead><tbody><tr><td>SaulHudson</td><td>Y</td><td>https://uui.verizon.com/OSP.ReviewFacilities.GetContactInfo?Order_id=<Actual Order ID Here></td></tr></tbody></table></div>';
			}
		
	
	return module;

}();

$(function() {
	Page.init();

});

// Datatable enhancements
$.fn.dataTableExt.oApi.fnExtStylePagingInfo = function(oSettings) {
	return {
		"iStart" : oSettings._iDisplayStart,
		"iEnd" : oSettings.fnDisplayEnd(),
		"iLength" : oSettings._iDisplayLength,
		"iTotal" : oSettings.fnRecordsTotal(),
		"iFilteredTotal" : oSettings.fnRecordsDisplay(),
		"iPage" : oSettings._iDisplayLength === -1 ? 0 : Math
				.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength),
		"iTotalPages" : oSettings._iDisplayLength === -1 ? 0 : Math
				.ceil(oSettings.fnRecordsDisplay() / oSettings._iDisplayLength)
	};
};
$.fn.dataTableExt.oApi.fnPagingInfo = function(oSettings) {
	return {
		"iStart" : oSettings._iDisplayStart,
		"iEnd" : oSettings.fnDisplayEnd(),
		"iLength" : oSettings._iDisplayLength,
		"iTotal" : oSettings.fnRecordsTotal(),
		"iFilteredTotal" : oSettings.fnRecordsDisplay(),
		"iPage" : oSettings._iDisplayLength === -1 ? 0 : Math
				.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength),
		"iTotalPages" : oSettings._iDisplayLength === -1 ? 0 : Math
				.ceil(oSettings.fnRecordsDisplay() / oSettings._iDisplayLength)
	};
};
$.fn.dataTableExt.oPagination.extStyle = {

	"fnInit" : function(oSettings, nPaging, fnCallbackDraw) {

		var oPaging = oSettings.oInstance.fnExtStylePagingInfo();

		nFirst = $('<span/>', {
			'class' : 'paginate_button first  pagination-icon-first-symbol',
			text : ""
		});
		nPrevious = $('<span/>', {
			'class' : 'paginate_button pagination-icon-prev-symbol',
			text : ""
		});
		nNext = $('<span/>', {
			'class' : 'paginate_button next pagination-icon-next-symbol',
			text : ""
		});
		nLast = $('<span/>', {
			'class' : 'paginate_button last pagination-icon-last-symbol',
			text : ""
		});
		nPageTxt = $("<span />", {
			text : 'Page'
		});
		nPageNumBox = $('<input />', {
			type : 'text',
			val : 1,
			'class' : 'pageinate_input_box'
		});
		nPageOf = $('<span />', {
			text : ' of '
		});
		nTotalPages = $('<span />', {
			"class" : "paginate_total",
			text : oPaging.iTotalPages
		});
		nTotalLength = $('<span />', {
			"class" : "length_total",
			text : "Showing " + oPaging.iStart + "-" + oPaging.iEnd + " of "
					+ oPaging.iTotal + " items"
		});

		$(nPaging).append(nFirst).append(nPrevious).append(nPageNumBox).append(
				nPageOf).append(nTotalPages).append(nNext).append(nLast)
				.append(nTotalLength);
		nFirst.click(
				function() {
					if ($(this).hasClass("disabled"))
						return;
					oSettings.oApi._fnPageChange(oSettings, "first");
					fnCallbackDraw(oSettings);
					$(".length_total").html(
							"Showing " + oSettings._iDisplayStart + "-"
									+ oSettings.fnDisplayEnd() + " of "
									+ oPaging.iTotal);

				}).bind('selectstart', function() {
			return false;
		});

		nPrevious.click(
				function() {
					if ($(this).hasClass("disabled"))
						return;
					oSettings.oApi._fnPageChange(oSettings, "previous");
					fnCallbackDraw(oSettings);
					$(".length_total").html(
							"Showing " + oSettings._iDisplayStart + "-"
									+ oSettings.fnDisplayEnd() + " of "
									+ oPaging.iTotal);

				}).bind('selectstart', function() {
			return false;
		});

		nNext.click(
				function() {
					if ($(this).hasClass("disabled"))
						return;
					oSettings.oApi._fnPageChange(oSettings, "next");
					fnCallbackDraw(oSettings);
					$(".length_total").html(
							"Showing " + oSettings._iDisplayStart + "-"
									+ oSettings.fnDisplayEnd() + " of "
									+ oPaging.iTotal);
				}).bind('selectstart', function() {
			return false;
		});

		nLast.click(
				function() {
					if ($(this).hasClass("disabled"))
						return;
					oSettings.oApi._fnPageChange(oSettings, "last");
					fnCallbackDraw(oSettings);
					$(".length_total").html(
							"Showing " + oPaging.iStart + "-" + oPaging.iEnd
									+ " of " + oPaging.iTotal);
				}).bind('selectstart', function() {
			return false;
		});

		nPageNumBox.change(function() {
			var pageValue = parseInt($(this).val(), 10) - 1; // -1 because
																// pages are 0
																// indexed, but
																// the UI is 1
			var oPaging = oSettings.oInstance.fnPagingInfo();

			if (pageValue === NaN || pageValue < 0) {
				pageValue = 0;
			} else if (pageValue >= oPaging.iTotalPages) {
				pageValue = oPaging.iTotalPages - 1;
			}
			oSettings.oApi._fnPageChange(oSettings, pageValue);
			fnCallbackDraw(oSettings);
		});

	},

	"fnUpdate" : function(oSettings, fnCallbackDraw) {
		if (!oSettings.aanFeatures.p) {
			return;
		}

		var oPaging = oSettings.oInstance.fnExtStylePagingInfo();

		/* Loop over each instance of the pager */
		var an = oSettings.aanFeatures.p;

		$(an).find('span.paginate_total').html(oPaging.iTotalPages);
		$(an).find('.pageinate_input_box').val(oPaging.iPage + 1);

		$(an)
				.each(
						function(index, item) {

							var $item = $(item);

							if (oPaging.iPage == 0) {
								var prev = $item
										.find('span.paginate_button.first')
										.add(
												$item
														.find('span.paginate_button.previous'));
								prev.addClass("disabled");
							} else {
								var prev = $item
										.find('span.paginate_button.first')
										.add(
												$item
														.find('span.paginate_button.previous'));
								prev.removeClass("disabled");
							}

							if (oPaging.iPage + 1 == oPaging.iTotalPages) {
								var next = $item
										.find('span.paginate_button.last')
										.add(
												$item
														.find('span.paginate_button.next'));
								next.addClass("disabled");
							} else {
								var next = $item
										.find('span.paginate_button.last')
										.add(
												$item
														.find('span.paginate_button.next'));
								next.removeClass("disabled");
							}
						});
	}
};