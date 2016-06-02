import { RenderEngine } from './lib/builder'
import { Rack, Slot, Shelf, Card, CardSlotContainer } from './lib/components'

export function main(){
  
  let selection = null;
  let wdth=$('#wdth_create')
  let hght=$('#hght_create')
  let hdr = $('#hdr_create')
  let ftr = $('#ftr_create')
  
 // let view = $('#view span');
 // let margin = 50
    
 let builder = new RenderEngine("svg")
  
  function resize(){
    wdth.val(this.options.width)
    hght.val(this.options.height)
    selection = this
  }
  // let zoom=[]
  // for (let i=0.1;i<3;i+=0.02){
  //   zoom.push(i)
  //   console.log(zoom.push(i))
  // }
  let zoom = [2, 1.75, 1.5, 1.25, 1, .75, .5, .25, .1]
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
      // let noOfMounts=Math.floor(dbWidth/1.75)
      // for (let i=0;i<noOfMounts; i++){
      //  console.log(i)
      //  let component1 = builder.createRack({ x: margin, y: margin+i*calcWidth/noOfMounts, width: 0.1*calcWidth, height: 1})
      //  component1.render()
      
     // }
      
    }
  })
  
   $('#draw').on('click', function (e) {
     //debugger
 let margin = 50
  let rect=builder.paper.node.getBoundingClientRect()
  let dbWidth=$('#wdth_create').val()
  let dbHeight=$('#hght_create').val()
  
  let maxShape = Math.max(dbWidth, dbHeight)
  let maxSvg = Math.max(rect.height, rect.width)
  
  let calcHeight = (dbHeight*maxSvg)/maxShape * currentZoom - (margin * 2)
  let calcWidth = (dbWidth*maxSvg)/maxShape * currentZoom - (margin * 2)
  let calcHdr=(hdr.val()*maxSvg)/maxShape * currentZoom 
  let calcFtr=(ftr.val()*maxSvg)/maxShape * currentZoom 
  console.log("CalWIdth "+calcWidth)
  console.log("CalHGT "+calcHeight)
  console.log("Max SVG "+rect.height)
  console.log("calcHdr " +calcHdr )
  console.log("calcFtr " +calcFtr )
  e.preventDefault()
    rack = builder.createRack({ x: margin, y: margin, width: calcWidth, height: calcHeight})
     rack.render()
   let noOfMounts=Math.floor(dbHeight/1.75);
  // console.log("No of Mount " + noOfMounts)
   let Header = builder.createRack({ x: margin, y: margin-calcHdr, width: calcWidth, height: calcHdr})
   let Footer = builder.createRack({ x: margin, y: margin+calcHeight, width: calcWidth, height: calcFtr})
    Header.render()
    Footer.render()
   
     for (let i=0;i<noOfMounts; i++){
      // console.log(i)
       let component1 = builder.createRack({ x: margin, y: margin+i*calcWidth/noOfMounts, width: 0.1*calcWidth, height: 1})
       let component2 = builder.createRack({ x: calcWidth+margin-0.1*calcWidth, y: margin+i*calcWidth/noOfMounts, width: 0.1*calcWidth, height: 1})
      component1.render()
      component2.render()
    }
      //let Header = builder.createRack({ x: 200, y: 80-header.val()*dpi_y, width: wdth.val()*dpi_x, height: header.val()*dpi_y})
      // let Footer = new Rack, { x: 200, y: 80+hght.val()*dpi_y, width: width.val()*dpi_x, height: footer.val()*dpi_y})
      // Header.render();
      // Footer.render();
   
  })
    
   builder.on('onSelected', function(selection){
  //  console.log(`You selected ${selection.length} items`)
    
    builder.group(selection)
    builder.group(selection).drag()
  })
  
  // feature to be removed
  builder.on('onCloned', function(builder){
   
  })
}

main();