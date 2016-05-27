import { Observable } from './observable'
import { Slot, Shelf, Card, CardSlotContainer } from './components'

export class RenderEngine extends Observable {
  constructor(selector){
    super()
    this.componentsCollection = []
    this.paper = Snap(selector)
    this.buildControls()
    this.handleSelection()
  }
  
  // Render our drawing component icons
  // this feature could be removed
  buildControls(){
//    this.slotBuilder = this.createSlot({50, 100, 25, 200, 3, 3})
    // this.slotBuilder.attr({
    //   fill: "red",
    //   stroke: "#000",
    //   strokeWidth: 3
    // })
    // let self = this;
    // this.slotBuilder.node.onclick = function(){
    //   self.trigger('onCloned', self.clone)
    // }
  }

  // Handles the selection. Draw the square selection rectangle and
  // triggers events
  handleSelection(){
    // selection starts
    let self = this
    this.paper.node.onmousedown = function(event){
      if (self.paper.node !== event.target)
        return
      
      let offsetX = event.offsetX
      let offsetY = event.offsetY
      let selection = self.paper.rect(offsetX, offsetY, 0, 0)
      selection.attr({
        fill: "#efefef",
        fillOpacity: 0.5,
        stroke: "#101010",
        strokeWidth: 0.1,
        strokeDasharray: "5, 5"
      });
      
      // selection is in process
      self.paper.node.onmousemove = function(event){
        selection.attr({
          width: event.offsetX,
          height: event.offsetY
        })
      }
      
      self.paper.node.mouseleave = self.paper.node.mouselout = function(){
        self.paper.node.onmousemove = null
        self.paper.node.onmouseup = null
        selection.remove()
        selection = null
      }
      
      // selection has been made
      self.paper.node.onmouseup = function(event){
        var candidates = []
        var all = self.paper.selectAll("svg *").items
        var filtered = all.filter(function(item){
          return item !== selection &&
            typeof item.node.attributes.x !== 'undefined' &&
            typeof item.node.attributes.y !== 'undefined' &&
            typeof item.node.attributes.width !== 'undefined' &&
            typeof item.node.attributes.height !== 'undefined';
        });
        
        filtered.forEach(function(item){
          if (item.getBBox().x >= selection.getBBox().x &&
            item.getBBox().y >= selection.getBBox().y &&
            item.getBBox().width <= selection.getBBox().width &&
            item.getBBox().height <= selection.getBBox().height){
            let length = self.componentsCollection.length
            for(let index = 0; index < length; index++){
              let component = self.componentsCollection[index]
              if (component.view === item){
                candidates.push(component)
              }
            }
          }
        })
        
        try {
          self.trigger('onSelected', candidates)
        }
        finally {
          self.paper.node.onmousemove = null
          self.paper.node.onmouseup = null
          selection.remove()
          selection = null
        }
      }     
    }
  }
  
  createShelf(options){
    return new Shelf(this, options)
  }
  
  createSlot(options){
    return new Slot(this, options)
  }
  
  createCard(options){
    return new Card(this, options)
  }
  
  createSlotContainer(options){
    return new CardSlotContainer(this, options)
  }
  
  setView(component, view){
    component.view = view
    
    if (this.componentsCollection.indexOf(component) === -1) {
      this.componentsCollection.push(component)
    }

    component.view.click(function () {
      component.trigger('click', component)
    })
    component.view.drag(function (dx, dy, x, y, event) {
      component.trigger('dragMove', { dx: dx, dy: dy, x: x, y: y, event: event })
    }, function (x, y, event) {
      component.trigger('dragStart', { x: x, y: y, event: event })
    }, function (event) {
      component.trigger('dragEnd', event)
    })
    
    return view;
  }
  
  // Creates the svg element associated to the component 
  // set the component's view (svg element) 
  // and listen for common events
  // returns the view
  appendComponent(component){
    let view = null
    
    if (component instanceof Shelf){
      view = this.buildShelf(component.options)
    } else if (component instanceof Slot){
      view = this.buildSlot(component.options)
    } else if (component instanceof Card){
      view = this.buildCard(component.options)
    } else if (component instanceof CardSlotContainer){
      view = this.buildCardSlot(component.options)
    } else {
      throw Error('Unknown component')
    }
    
    return this.setView(component, view) 
  }
  
  // Builds a svg element associated with a Shelf
  buildShelf(options){
    let shelf = this.paper.rect(options.x, options.y, options.width, options.height, 3, 3)
    shelf.attr({
        fill: "#c0c0c0",
        stroke: "#000",
        strokeWidth: 3
    })
    return shelf
  }

  // Builds a svg element associated with a Slot
  buildSlot(options){
    let slot = this.paper.rect(options.x, options.y, options.width, options.height, 3, 3)
    slot.attr({
        fill: "#000",
        stroke: "#000",
        strokeWidth: 3
    });
    return slot;
  }
  
  // Builds a svg element associated with a Card
  buildCard(options){
    let card = this.paper.rect(options.x, options.y, options.width, options.height, 3, 3)
    card.attr({
        fill: "#cdcd00",
        stroke: "#000",
        strokeWidth: 3
    });
    return card;
  }
  
  // Builds a svg element associated with a Card slot
  buildCardSlot(options){
    let cardSlot = this.paper.rect(options.x, options.y, options.width, options.height, 3, 3)
    cardSlot.attr({
        fill: "#00cdcd",
        stroke: "#000",
        strokeWidth: 3
    });
    return cardSlot;
  }
  
  removeComponent(component){
    // find component index
    let index = this.componentsCollection.indexOf(component)
    
    if (index !== -1) {
      // unbind events
      component.view.undrag()
      component.view.onclick = null
      // remove it from class
      this.componentsCollection.splice(index, 1)
    }
 }
}