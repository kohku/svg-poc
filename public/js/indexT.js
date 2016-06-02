import { RenderEngine } from './lib/builder'
import { Rack, Slot, Shelf, Card, CardSlotContainer } from './lib/components'

export function main(){
  
  let selection = null;
  let wdth = $('#wdth_create');
  let hght = $('#hght_create');
  // console.log(height.val());
 // let manufacturer = $('#selectManufacturer_create');
  //let name = $('#info span');
  // let rLeft = $('#rLeft');
  // let rTop = $('#rTop');
  // let header=$('#hdr_create');
  // let footer=$('#ftr_create');
  let rel_Xpos = $('#relative_xposition span');
  let rel_Ypos = $('#relative_yposition span');
  let dpi_x = document.getElementById('dpi').offsetWidth;
  let dpi_y = document.getElementById('dpi').offsetHeight;
  let view = $('#view span');
  
   let margin = 50
  // let builder = new RenderEngine("svg")
  
  
  
  
  // let submit = $('form button[type="submit"]').on('click', function(e){
  //   e.preventDefault()
    
  //   if (selection !== null){
  //     selection.options.width = width.val()
  //     selection.options.height = height.val()
  //     selection.render()
  //   }
  // })
  
  // let renderEngine = new RenderEngine("svg")
    
    $('#saveRackDisplayCatalog_create').on('click', function (e) {
    e.preventDefault()
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (xhttp.readyState == 4
        && xhttp.status == 200) {
      }
    };
    xhttp.open("POST", "http://"
      + window.location.hostname + ":7001/RackFace_Drawing/position",
      true);
    xhttp.setRequestHeader("Content-type",
      "application/json");

    xhttp.send("CurrentX=," + rel_Xpos.text()
      + ",CurrentY=," + rel_Ypos.text() + ",Width=," + wdth.val() + ",height=," + hght.val() + ",manufacturer=,"+manufacturer.val());

  })
    
 let builder = new RenderEngine("svg")
 let component = new Shelf(builder, { x: 200, y: 80, width: wdth.val(), height: hght.val(), name: 'Shelf', rel_Xpos: 0, rel_Ypos: 0 })
  
  //let component = new Shelf(builder, { x: 200, y: 80, width: 440, height: 360, name: 'Shelf', rel_Xpos: 0, rel_Ypos: 0 })
  
  // let shelf = builder.createShelf({x: 300, y: 100, width: 500, height: 250})
  
  // let slot1 = builder.createSlot({x: 325, y: 125, width: 25, height: 200})
  // let slot2 = builder.createSlot({x: 375, y: 125, width: 25, height: 200})
  
  // shelf.slots.addSlot(slot1)
  // shelf.slots.addSlot(slot2)
  
  // console.log(`Shelf has ${shelf.slots.elements.length} slot1`)
    
  // shelf.render()
  
  // shelf.on('click', function(){
  //   console.log(shelf.options)
  //   width.val(shelf.options.width)
  //   height.val(shelf.options.height)
  //   selection = shelf
  // });
  
  function resize(){
    wdth.val(this.options.width)
    hght.val(this.options.height)
    selection = this
  }
  
  var xmlhttp = new XMLHttpRequest();

  $('input:radio[name=view]').change(function () {
    if (this.value == 'Front') {
      var url = 'data.json'
      view.text("Front View")
    }
    else if (this.value == 'Rear') {
      var url = 'dataN.json'
      view.text("Rear View")
    }

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        loadSlot(xmlhttp.responseText);
      }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();


    function loadSlot(response) {
      var arr = JSON.parse(response);
      var i;

       for (i = 0; i < arr.length; i++) {
        let slot = new Slot(builder, { x: arr[i].X, y: arr[i].Y, width: arr[i].width * dpi_x, height: arr[i].height * dpi_y, name: arr[i].name, manufacturer: arr[i].manufacturer, rel_Xpos: 0, rel_Ypos: 0 })
        component.slots.addSlot(slot)
        slot.on('click', function () {
          var $this = $(this);
          $this.addClass("hover");
        })
        let allCards = $('svg.shelf.slots > *');
        console.log(allCards);
        allCards.on('click', function () {
          allCards.removeClass('hover');
          $(this).addClass('hover')
        })
      }

      component.render()
    }

  });
  
  // let rect=builder.paper.getBBox()
  // let dbwidth=$('#wdth_create');
  // let inRatio=rect.width/dbwidth
  // let $('#hght_create');=100
  // let y=inratio*dbHeight
  let zoom = [2, 1.5, 1.25, 1, .75, .5, .25, .1]
  let currentZoom = zoom[zoom.indexOf(.5)]
  let rack = null
  
  $('#zoomIn').on('click', function(e){
    let newIndex = zoom.indexOf(currentZoom)
    if (newIndex > 0){
      currentZoom = zoom[newIndex - 1]
      let rect=builder.paper.node.getBoundingClientRect()
      
      let dbWidth=$('#wdth_create').val()
      let dbHeight=$('#hght_create').val()
      
      let maxShape = Math.max(dbWidth, dbHeight)
      let maxSvg = Math.max(rect.height, rect.width)
      
      let calcHeight = (dbWidth*maxSvg)/maxShape * currentZoom
      let calcWidth = (dbWidth*maxSvg)/maxShape * currentZoom
      rack.options.width = calcWidth
      rack.options.height = calcHeight
      rack.render()
      
    }
  })
  
  $('#zoomOut').on('click', function(e){
    let newIndex = zoom.indexOf(currentZoom)
    if (newIndex < zoom.length - 1){
      currentZoom = zoom[newIndex + 1]
      let rect=builder.paper.node.getBoundingClientRect()
      
      let dbWidth=$('#wdth_create').val()
      let dbHeight=$('#hght_create').val()
      
      let maxShape = Math.max(dbWidth, dbHeight)
      let maxSvg = Math.max(rect.height, rect.width)
      
      let calcHeight = (dbWidth*maxSvg)/maxShape * currentZoom
      let calcWidth = (dbWidth*maxSvg)/maxShape * currentZoom
      rack.options.width = calcWidth
      rack.options.height = calcHeight
      rack.render()
      let noOfMounts=Math.floor(dbWidth/1.75)
      for (let i=0;i<noOfMounts; i++){
       console.log(i)
       let component1 = builder.createRack({ x: margin, y: margin+i*calcWidth/noOfMounts, width: 0.1*calcWidth, height: 1})
       component1.render()
      
     }
      
    }
  })
  
   $('#draw').on('click', function (e) {
     //debugger
 
    let rect=builder.paper.node.getBoundingClientRect()
  
  let dbWidth=$('#wdth_create').val()
  let dbHeight=$('#hght_create').val()
  
  let maxShape = Math.max(dbWidth, dbHeight)
  let maxSvg = Math.max(rect.height, rect.width)
  
  let calcHeight = (dbWidth*maxSvg)/maxShape * currentZoom - (margin * 2)
  let calcWidth = (dbWidth*maxSvg)/maxShape * currentZoom - (margin * 2)
   //console.log("max "+max)
   console.log("CalWIdth "+calcWidth)
   console.log("CalHGT "+calcHeight)
  // if(dbWidth.val()> dbHeight.val()){
  //   let inRatio=rect.width/dbWidth
  //   let y=inRatio*dbHeight
  // } else{
  //   let inRatio=rect.height/dbHeight
  //   let x=inRatio*dbWidth
  // }
  e.preventDefault()
    rack = builder.createRack({ x: margin, y: margin, width: calcWidth, height: calcHeight})
     // let noOfMounts=Math.floor(dbWidth/1.75);
     // console.log("No of Mount " + noOfMounts)
    
    // rack.render()
    //  for (let i=0;i<noOfMounts; i++){
    //    console.log(i)
    //    let component1 = builder.createRack({ x: margin, y: margin+i*calcWidth/noOfMounts, width: 0.1*calcWidth, height: 1})
     // let component2 = new Rack(builder, { x: 200 + width.val(), y: 80+10*i, width: 20, height: 1})
     // component1.render()
      // component1.render()
   //  }
      // let Header = builder.createRack({ x: 200, y: 80-header.val()*dpi_y, width: wdth.val()*dpi_x, height: header.val()*dpi_y})
      //  let Footer = new Rack, { x: 200, y: 80+hght.val()*dpi_y, width: width.val()*dpi_x, height: footer.val()*dpi_y})
      //  Header.render();
      //  Footer.render();
  // let url='dataAll.json'
  //   var xmlhttp = new XMLHttpRequest();
  //    xmlhttp.onreadystatechange = function () {
  //     if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
  //       loadSlot(xmlhttp.responseText);
  //     }
  //   }
  //   xmlhttp.open("GET", url, true);
  //   xmlhttp.send();


    // function loadSlot(response) {
    //   var arr = JSON.parse(response);
    //   var i;

     // let component = new Shelf(builder, { x: 200, y: 100, width: 700, height: 400, name: 'Shelf', rel_Xpos: 300, rel_Ypos: 100 })
      // for (i = 0; i < arr.length; i++) {
      //   let slot = new Slot(builder, { x: arr[i].X, y: arr[i].Y, width: arr[i].width * dpi_x, height: arr[i].height * dpi_y, name: arr[i].name, manufacturer: arr[i].manufacturer, rel_Xpos: 0, rel_Ypos: 0 })
      //  component.slots.addSlot(slot)
      //   slot.on('click', function () {
      //     var $this = $(this);
      //     $this.addClass("hover");
      //   })
      //   let allCards = $('svg.shelf.slots > *');
      //   console.log(allCards);
      //   allCards.on('click', function () {
      //     allCards.removeClass('hover');
      //     $(this).addClass('hover')
      //   })


      // }

    //   component.render()
    // }
  })
    
  
  // slot1.on('click', resize)
  // slot2.on('click', resize)
  
  builder.on('onSelected', function(selection){
    console.log(`You selected ${selection.length} items`)
    
    builder.group(selection)
    builder.group(selection).drag()
  })
  
  // feature to be removed
  builder.on('onCloned', function(builder){
    // console.log(`Building slot1`)
    // let newSlot = new Slot(builder, {x: 50, y: 50})
    // shelf.slots.addSlot(slot1)
    // console.log(`Shelf has ${shelf.slots.elements.length} slot1`)
    // newSlot.render()
    // newSlot.drag()
  })
}

main();