import { RenderEngine } from './lib/renderer'
import { Slot, Shelf, Card, CardSlotContainer } from './lib/shelf'

export function main(){
  
  let renderEngine = new RenderEngine("svg")
  
  let shelf = new Shelf(renderEngine)
  
  let slot = new Slot(renderEngine, {x: 325, y: 125})
  
  shelf.slots.addSlot(slot)
  
  console.log(`Shelf has ${shelf.slots.elements.length} slot`)
    
  shelf.render()
  
  renderEngine.on('onComponentsSelected', function(selection){
    console.log(`You selected ${selection.length} items`)
    
  })
  
  renderEngine.on('buildSlot', function(builder){
    console.log(`Building slot`)
    let newSlot = new Slot(renderEngine, {x: 50, y: 50})
    shelf.slots.addSlot(slot)
    console.log(`Shelf has ${shelf.slots.elements.length} slot`)
    newSlot.render()
    newSlot.drag()
  })
  
}

main();