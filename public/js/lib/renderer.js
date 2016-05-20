import { Observable } from './observable'
import { Slot, Shelf, Card, CardSlotContainer, GroupComponent } from './shelf'

export class RenderEngine extends Observable {
  constructor(selector){
    super()
    this.componentsCollection = []
    this.paper = Snap(selector)
    this.buildControls()
    this.handleSelection()
  }
  
  buildControls(){
    this.slotBuilder = this.paper.rect(50, 10, 20, 50, 3, 3)
    this.slotBuilder.attr({
      fill: "#990000",
      stroke: "#000",
      strokeWidth: 2
    })
    let self = this;
    this.slotBuilder.click(function(){
      self.trigger('buildSlot', self.slotBuilder)
    })
  }
  
  _setView(component, view){
    component.view = view

    if (this.componentsCollection.indexOf(component) == -1){
      this.componentsCollection.push(component)
    }

    component.view.click(function(){
      component.trigger('click', component)
    })
    component.view.drag(function(dx, dy, x, y, event){
      component.trigger('dragMove', {dx: dx, dy: dy, x: x, y: y, event: event})
    }, function(x, y, event){
      component.trigger('dragStart', {x: x, y: y, event: event})
    }, function(event){
      component.trigger('dragEnd', event)
    })
    return view;
  }
  
  appendShelf(shelf){
    return this._setView(shelf, this._buildShelf(shelf.options))
  }
  
  _buildShelf(options){
    let shelf = this.paper.rect(options.x, options.y, options.width, options.height, 3, 3)
    shelf.attr({
        fill: "#c0c0c0",
        stroke: "#000",
        strokeWidth: 3
    })
    return shelf
  }
  
  appendComponent(parent, component){
    if (Array.isArray(component)){
      component.forEach(item => item.render())
    }
    else {
      component.render()
    }
  }
  
  appendGroup(component){
    if (!(component instanceof GroupComponent)){
      throw Error("Component is not a group")
    }
    
    return this._setView(component, this._buildGroup(component))
  }
  
  _buildGroup(component){
    let group = this.paper.g()
    
    component.elements.forEach(element => {
      element.render()
      group.add(element.view)
    })
    
    return group;
  }

  appendSlot(slot){
    return this._setView(slot, this._buildSlot(slot.options))
  }
  
  _buildSlot(options){
    let slot = this.paper.rect(options.x, options.y, options.width, options.height,1,1)
    slot.attr({
        fill: "#000099",
        stroke: "#000",
        strokeWidth: 2
    });
    return slot;
  }
  
  cloneSlot(){
    let clone = this.slotBuilder.clone()
    clone.attr({
      x: parseInt(this.slotBuilder.node.attributes.x.value) + parseInt(this.slotBuilder.node.attributes.width.value) + 20
    })
    clone.drag()
    
    return clone
  }
  
  buildCard(){
    let card = this.paper.rect(300, 100, 500, 250, 3, 3)
    card.attr({
        fill: "#c0c0c0",
        stroke: "#000",
        strokeWidth: 3
    });
    return card;
  }
  
  map(views){
    if (typeof views === 'undefined' || views === null)
      throw Error('Invalid operation')
      
    let result = []
    if (Array.isArray(views)){
      views.forEach(view => {
        let item = this._map(view)
        if (item != null){
          result.push(item)
        }
      })
    } else {
      return this._map(views)
    }
    return result
  }
  
  _map(view){
    let current = null
    this.componentsCollection.forEach(component => {
      if (component.view === view){
        current = component
      }
    })
    return current
  }
  
  handleSelection(){
    // selection starts
    let self = this
    this.paper.node.onmousedown = function(event){
      if (self.paper.node !== event.target)
        return

      let selection = self.paper.rect(event.clientX, event.clientY, 0, 0)
      selection.attr({
        fill: "transparent",
        stroke: "#303030",
        strokeWidth: 0.5,
        strokeDasharray: "5, 5"
      });
      
      // selection is in process
      self.paper.node.onmousemove = function(event){
        selection.attr({
          width: event.clientX - selection.node.attributes.x.value,
          height: event.clientY - selection.node.attributes.y.value
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
            typeof item.node.attributes.height !== 'undefined'
        });
        
        filtered.forEach(function(item){
          if (item.getBBox().x >= selection.getBBox().x &&
            item.getBBox().y >= selection.getBBox().y &&
            item.getBBox().width <= selection.getBBox().width &&
            item.getBBox().height <= selection.getBBox().height){
            candidates.push(item)
          }
        })
        
        try {
          self.trigger('onComponentsSelected', candidates)
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
}