import { RenderEngine } from './lib/renderer'
import { GroupComponent, Slot, Shelf, Card, CardSlotContainer } from './lib/shelf'

export function main() {

  let selectedItems = null;
  let width = $('#width');
  let height = $('#height');
  let name = $('#info span');
  let rLeft = $('#rLeft');
  let rTop = $('#rTop');
  let rel_Xpos = $('#relative_xposition span');
  let rel_Ypos = $('#relative_yposition span');


  $('#change_dimension').on('click', function (e) {
    e.preventDefault()
    if (Array.isArray(selectedItems)) {
      return
    }

    if (selectedItems !== null) {
      selectedItems.options.width = width.val()
      selectedItems.options.height = height.val()
      selectedItems.options.x = rLeft.val()
      selectedItems.options.y = rTop.val()
      selectedItems.options.rel_Xpos = (rLeft.val() - 300)
      selectedItems.options.rel_Ypos = (rLeft.val() - 100)
      selectedItems.render()

    }
  })


  $('#save').on('click', function (e) {
    e.preventDefault()
    
    // var pos = {}
    // 						pos.XPosition = rel_Xpos.text()
    // 						pos.YPosition = rel_Ypos.text()

    
    // $.ajax({
		
    // 								headers : {
    // 										'Accept' : 'application/json',
    // 										'Content-Type' : 'application/json'
    // 									},
    // 									type : "POST",
    // 									url : "http://" + window.location.hostname + ":7001/RackFace_Drawing/position",
    // 									data : pos,
    // 									dataType : 'json'
    // 								});
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
      + ",CurrentY=," + rel_Ypos.text());
    
    //     fetch('/position', {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     CurrentX: rel_Xpos.text(),
    //     CurrentY: rel_Ypos.text()
    //   })
    // })
    console.log("You clicked Save Button")
    // if (selectedItems !== null) {
    //   selectedItems.options.width = width.val()
    //   selectedItems.options.height = height.val()
    //   selectedItems.render()
      
    // }
  })

  let renderEngine = new RenderEngine("svg")

  let shelf = new Shelf(renderEngine, { x: 300, y: 100, width: 500, height: 250, name: 'Shelf', rel_Xpos: 300, rel_Ypos: 100 })
  let slot1 = new Slot(renderEngine, { x: 350, y: 125, width: 15, height: 200, name: 'Slot 1', rel_Xpos: 0, rel_Ypos: 0 })
  let slot2 = new Slot(renderEngine, { x: 375, y: 125, width: 15, height: 200, name: 'Slot 2', rel_Xpos: 0, rel_Ypos: 0 })
  let slot3 = new Slot(renderEngine, { x: 400, y: 125, width: 15, height: 200, name: 'Slot 3', rel_Xpos: 0, rel_Ypos: 0 })

  shelf.slots.addSlot(slot1)
  shelf.slots.addSlot(slot2)
  shelf.slots.addSlot(slot3)
  console.log(`Shelf has ${shelf.slots.elements.length} slots`)

  shelf.render()

  let onClick = function () {
    //console.log(this.options)
    width.val(this.options.width)
    height.val(this.options.height)
    name.text(this.options.name)
    rLeft.val(this.options.x)
    rTop.val(this.options.y)
    rel_Xpos.text(this.options.x - 300)
    rel_Ypos.text(this.options.y - 100)
    selectedItems = this
  }

  shelf.on('click', onClick)
  slot1.on('click', onClick)
  slot2.on('click', onClick)
  slot3.on('click', onClick)

  slot1.on('dragStart', function (e) {
    console.log('dragStart')
  })
  slot1.on('dragMove', function (e) {
    console.log('dragMove')
  })
  slot1.on('dragEnd', function (e) {
    console.log(`dragEnd x: ${e.clientX} y: ${e.clientY}`)
    console.log(`dragEnd x: ${e.clientX - 300} y: ${e.clientY - 100}`)
    // console.log(`dragEnd x: ${e.clientX-width} y: ${e.clientY-height}`)
    
  })

  slot2.on('dragStart', function (e) {
    console.log('dragStart')
  })
  slot2.on('dragMove', function (e) {
    console.log('dragMove')
  })
  slot2.on('dragEnd', function (e) {
    //console.log(`dragEnd x: ${e.clientX} y: ${e.clientY}`)
    //console.log(`dragEnd x: ${e.clientX+200} y : ${e.clientY-100}`)
  })

  slot1.drag()
  slot2.drag()
  slot3.drag()


  renderEngine.on('onComponentsSelected', function (selection) {
    // console.log(`You selected ${selection.length} items`)
    selectedItems = selection
    console.log(selection.length)
  })

  renderEngine.on('buildSlot', function (builder) {
    console.log(`Building slot1`)
    let newSlot = new Slot(renderEngine, { x: 90, y: 50, width: 20, height: 120 })
    shelf.slots.addSlot(slot1)
    console.log(`Shelf has ${shelf.slots.elements.length} slot1`)
    newSlot.render()
    newSlot.drag()
  })
  //let group=new Group(renderEngine)
  $('#group').on('click', function (e) {
    e.preventDefault()
    if (!Array.isArray(selectedItems) && selectedItems.length > 1) {
      return
    }

    var group = new GroupComponent(renderEngine, renderEngine.map(selectedItems))
    group.render()
    group.drag()
  })
  
  
  
  $('#draw').on('click', function (e) {
    e.preventDefault()
     let renderEngine = new RenderEngine("svg")
    var xmlhttp = new XMLHttpRequest();
    var url = "data.json";
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
      let shelf = new Shelf(renderEngine, { x: 300, y: 100, width: 500, height: 250, name: 'Shelf', rel_Xpos: 300, rel_Ypos: 100 })
      for (i = 0; i < arr.length; i++) {console.log(arr[i].X);
        let slot1 = new Slot(renderEngine, { x: arr[i].X, y: arr[i].Y, width: arr[i].width, height: arr[i].height, name: 'Slot 1', rel_Xpos: 0, rel_Ypos: 0 })
        shelf.slots.addSlot(slot1)
      }
      shelf.render()
    }
    // xmlhttp.open("GET", url, true);
    // xmlhttp.send();
//console.log(`Shelf has ${shelf.slots.elements.length} slots`)
console.log('Hello')

  // shelf.render()

  })
  
  

}

main();