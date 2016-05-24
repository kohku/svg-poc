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
  let Abs_X = $('#absXpos span');
  let Abs_Y = $('#absYpos span');
  let dpi_x = document.getElementById('dpi').offsetWidth;
  let dpi_y = document.getElementById('dpi').offsetHeight;


  $('#change_dimension').on('click', function (e) {
    e.preventDefault()
    if (Array.isArray(selectedItems)) {
      return
    }

    if (selectedItems !== null) {
      selectedItems.options.width = width.val() * dpi_x
      selectedItems.options.height = height.val() * dpi_y
      selectedItems.options.x = rLeft.val()
      selectedItems.options.y = rTop.val()
      selectedItems.options.rel_Xpos = (rLeft.val())
      selectedItems.options.rel_Ypos = (rLeft.val())
      selectedItems.options.Abs_X = rLeft.val()
      selectedItems.options.Abs_Y = rTop.val()
      selectedItems.render()

      
    }
  })

  $('#save').on('click', function (e) {
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
      + ",CurrentY=," + rel_Ypos.text() + ",Width=," + width.val() + ".height=," + height.val());

  })

  let renderEngine = new RenderEngine("svg")

  let shelf = new Shelf(renderEngine, { x: 200, y: 100, width: 700, height: 400, name: 'Shelf', rel_Xpos: 0, rel_Ypos: 0, Abs_X: 300, Abs_Y: 100 })
  shelf.render()

  let onClick = function () {
    width.val((this.options.width / dpi_x).toPrecision(4))
    height.val((this.options.height / dpi_y).toPrecision(4))
    name.text(this.options.name)
    rLeft.val(this.options.x)
    rTop.val(this.options.y)
    rel_Xpos.text(this.options.x - 200)
    rel_Ypos.text(this.options.y - 100)
    Abs_X.text(this.options.x)
    Abs_Y.text(this.options.y)

    selectedItems = this
  }
 $('#change_dimension').on('click', onClick)
  shelf.on('click', onClick)
  renderEngine.on('onComponentsSelected', function (selection) {
    selectedItems = selection
    console.log(selection.length)
  })


  renderEngine.on('buildSlot', function (builder) {
    console.log(`Building slot`)
    let newSlot = new Slot(renderEngine, { x: 20, y: 50, width: 20, height: 150, name: 'slot' })
    shelf.slots.addSlot(newSlot)
    console.log(`Shelf has ${shelf.slots.elements.length} slots`)
    newSlot.render()
    newSlot.drag()
    newSlot.on('click', onClick)
  })

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
      let shelf = new Shelf(renderEngine, { x: 200, y: 100, width: 700, height: 400, name: 'Shelf', rel_Xpos: 300, rel_Ypos: 100 })
      for (i = 0; i < arr.length; i++) {
        let slot = new Slot(renderEngine, { x: arr[i].X, y: arr[i].Y, width: arr[i].width, height: arr[i].height, name: arr[i].name, rel_Xpos: 0, rel_Ypos: 0 })
        shelf.slots.addSlot(slot)
        slot.on('click', onClick)
      }
      shelf.render()
      //slot.on('click', onClick)
    }

  })

}

main();