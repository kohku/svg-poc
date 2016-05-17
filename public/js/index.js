import { RenderEngine } from './lib/renderer'
import { Slot, Shelf, Card, CardSlotContainer } from './lib/shelf'

export function main(){
  
  let selection = null;
  let width = $('#width');
  let height = $('#height');
  
  let submit = $('form button[type="submit"]').on('click', function(e){
    e.preventDefault()
    
    if (selection !== null){
      selection.options.width = width.val()
      selection.options.height = height.val()
      selection.render()
    }
  })
    
  let renderEngine = new RenderEngine("svg")
  
  let shelf = new Shelf(renderEngine, {x: 300, y: 100, width: 500, height: 250})
  
  let slot1 = new Slot(renderEngine, {x: 325, y: 125, width: 25, height: 200})
  let slot2 = new Slot(renderEngine, {x: 375, y: 125, width: 25, height: 200})
  
  shelf.slots.addSlot(slot1)
  shelf.slots.addSlot(slot2)
  
  console.log(`Shelf has ${shelf.slots.elements.length} slot1`)
    
  shelf.render()
  
  shelf.on('click', function(){
    console.log(shelf.options)
    width.val(shelf.options.width)
    height.val(shelf.options.height)
    selection = shelf
  });
  
  slot1.on('click', function(){
    width.val(slot1.options.width)
    height.val(slot1.options.height)
    selection = slot1
  })
  
  renderEngine.on('onComponentsSelected', function(selection){
    console.log(`You selected ${selection.length} items`)
    
  })
  
  renderEngine.on('buildSlot', function(builder){
    console.log(`Building slot1`)
    let newSlot = new Slot(renderEngine, {x: 50, y: 50})
    shelf.slots.addSlot(slot1)
    console.log(`Shelf has ${shelf.slots.elements.length} slot1`)
    newSlot.render()
    newSlot.drag()
  })
  
}

main();