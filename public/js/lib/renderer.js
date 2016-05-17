import { Observable } from './observable'
import { Slot, Shelf, Card, CardSlotContainer } from './shelf'

export class RenderEngine extends Observable {
  constructor(selector){
    super()
    this.paper = Snap(selector)
    this.buildControls()
    this.handleSelection()
  }
  
  buildControls(){
    this.slotBuilder = this.paper.rect(50, 100, 25, 200, 3, 3)
    this.slotBuilder.attr({
      fill: "red",
      stroke: "#000",
      strokeWidth: 3
    })
    let self = this;
    this.slotBuilder.node.onclick = function(){
      self.trigger('buildSlot', self.slotBuilder)
    }
  }
  
  _setView(component, view){
    component.view = view
    return view;
  }
  
  appendShelf(shelf){
    return this._setView(shelf, this._buildShelf(shelf.options))
  }
  
  _buildShelf(options){
    let shelf = this.paper.rect(300, 100, 500, 250, 3, 3)
    shelf.attr({
        fill: "#c0c0c0",
        stroke: "#000",
        strokeWidth: 3
    })
    return shelf
  }
  
  appendComponent(parent, component){
    if (Array.isArray(component)){
      this.appendComponents(parent, component);
    }
    else {
      let group = this.paper.group()
      group.add(parent.view, component.render())
    }
  }

  appendComponents(parent, components){
    components.forEach(item => this.appendComponent(parent, item))
  }
  
  appendSlot(slot){
    return this._setView(slot, this._buildSlot(slot.options))
  }
  
  _buildSlot(options){
    let slot = this.paper.rect(options.x, options.y, 25, 200, 3, 3)
    slot.attr({
        fill: "#000",
        stroke: "#000",
        strokeWidth: 3
    });
    return slot;
  }
  
  cloneSlot(){
    let clone = this.slotBuilder.clone()
    clone.attr({
      x: parseInt(slotBuilder.node.attributes.x.value) + parseInt(slotBuilder.node.attributes.width.value) + 20
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
            typeof item.node.attributes.height !== 'undefined';
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