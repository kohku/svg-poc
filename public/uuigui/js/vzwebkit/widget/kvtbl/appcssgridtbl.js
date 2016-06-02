(function($) {

    $.fn.appcssgridtbl = function(data, options, orderNumber, orderVersion, orderId, orderSource) {
        var sObj = this;

        if (!data) {
            data = {};
            data.kv = [];
            $(sObj).children().each(function(index, obj) {
                var $obj = $(obj);
                var key = $obj.data("key");
                var value = $obj.data("value");
                if (key === '_orderNumber_') {
                    orderNumber = value;
                } else if (key === '_orderVersion_') {
                    orderVersion = value;
                } else if (key === '_orderId_') {
                    orderId = value;
                } else if (key === '_orderSource_') {
                    orderSource = value;
                } else {
                    data.kv.push([key, value]);
                }
            });
        }

        var odata = data;
        var numColumnsRendered = 1;

        var settings = $.extend({
            kvTblCls: "kvtbl",
            kCls: "kCls",
            vCls: "vCls"
        }, options);

        function drawTbl(sDiv) {
            var divWidth = sObj.width();
            if (sObj.is(':hidden')) {
                var parent = sObj.parent();
                while (parent.is(':hidden'))
                    parent = parent.parent();
                if (parent)
                    divWidth = parent.width();
            }
            var numCols = 1;
            if (divWidth > 250 && divWidth <= 400)
                numCols = 2;
            else if (divWidth > 400 && divWidth <= 600)
                numCols = 3;
            else if (divWidth > 600 && divWidth <= 800)
                numCols = 4;
            else if (divWidth > 800 && divWidth <= 1000)
                numCols = 5;
            else if (divWidth > 1000 && divWidth <= 1200)
                numCols = 6;
            else if (divWidth > 1200 && divWidth <= 1400)
                numCols = 7;
            else if (divWidth > 1400 && divWidth <= 1600)
                numCols = 8;
            else if (divWidth > 1600)
                numCols = 9;

            if (numCols !== numColumnsRendered && odata.kv.length > 0) {
                numColumnsRendered = numCols;

                var tbl = '';

                var ktd = "<td class='" + settings.kCls + "'>";
                var vtd = "<span class='" + settings.vCls + "'><div style='margin-bottom: -18px;'>";

                var columnNumber = 0;
                var vp = 0;
                var length = odata.kv.length;
                $(odata.kv).each(function(index, element) {
                    vp++;

                    if (element[0] === 'Circuit id' && orderSource === "FNE")
                    {
                        element[1] = "<a href='#' onclick='callCircuitNotePad(\"" + orderNumber + "\",\"" + orderVersion + "\",\"" + element[1] + "\",\"" + orderId + "\");'>" + element[1] + "</a>";
                    }

                    if ((index % numColumnsRendered) === 0) {
                        if (tbl.length > 0)
                            tbl += '</tr><tr>\n';
                        else
                            tbl += '<tr>';
                        columnNumber = 0;
                    }
                    columnNumber++;

                    if (vp === length) {
                        var cnt = numColumnsRendered - (columnNumber - 1);
                        var ktdcs = "<td class='" + settings.kCls + "' colspan='" + cnt + "'>";
                        tbl = tbl + ktdcs + element[0] + ':' + vtd + element[1] + '</div></span></td>';

                    } else {

                        tbl = tbl + ktd + element[0] + ':' + vtd + element[1] + '</div></span></td>';
                    }
                });

                tbl = "<table class='" + settings.kvTblCls + "'>" + tbl + "</tr></table>";
                sDiv.html(tbl);
            }
        }

        $(window).resize(function() {
            drawTbl(sObj);
        });

        drawTbl(this);
        return this;

    };

    window.setTimeout(function() {
        $('.-appcssgridtbl-div-').each(function(index, obj) {
            $(obj).appcssgridtbl();
        });
    }, 250);
}(jQuery));

function callCircuitNotePad(orderNumber, orderVersion, circuitId, orderId)
{
    var cp = CONTEXT_PATH;

    var i = (cp.toUpperCase()).indexOf("/PCGUI");

    var suffix = cp.substring((i + 6));
    // alert("suffix"+suffix+"env suffix"+ENV_SUFFIX+"local"+LOCAL);
    var ncp = cp.substring(0, i) + "/UPIIVOIPWeb" + suffix;

    if (LOCAL == true)
    {
        ncp = "http://localhost:7001" + ncp;
    }
    else
    {
        ncp = "http://pc" + ENV_SUFFIX.toLowerCase() + ".vzbi.com" + ncp;
    }
    // ncp = "http://pcad"+".vzbi.com"+ncp+"AD"; 

    //alert("ncp "+ncp);
    //var URL = ncp + "/jsp/upi/waitframe.jsp?newURL="+ncp +"/option1/jsp/orderCircuitNotes.jsp?orderId="+orderId+"&orderNumber="+orderNumber + "&orderVersion=" + orderVersion + "&circuitId=" + circuitId;

    var URL = ncp + "/option1/jsp/orderCircuitNotes.jsp?orderId=" + orderId + "&orderNumber=" + orderNumber + "&orderVersion=" + orderVersion + "&circuitId=" + circuitId;
    //alert("URL "+URL);


    var winName = "circuitNotePad_" + orderId;
    var width = 995;
    var height = 675;
    var winProps = "height=" + height + ",width=" + width + ",location=no,directories=no,left=20,top=20,menubar=no,resizable=yes,status=yes";

    var myWindow = window.open(URL, winName, winProps);
}
