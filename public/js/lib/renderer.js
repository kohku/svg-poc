import { Observable } from './observable'
import { Slot, Shelf, Card, CardSlotContainer } from './shelf'

export class RenderEngine {
  constructor(selector){
    this.snap = Snap(selector)
    this.observable = new Observable()
    this.buildControls()
    this.handleSelection()
  }
  
  buildControls(){
    this.slotBuilder = this.snap.rect(50, 100, 25, 200, 3, 3)
    this.slotBuilder.attr({
      fill: "red",
      stroke: "#000",
      strokeWidth: 3
    })
    let self = this;
    this.slotBuilder.node.onclick = function(){
      self.observable.trigger('buildSlot', self.slotBuilder)
    }
  }
  
  buildShelf(){
    let shelf = this.snap.rect(300, 100, 500, 250, 3, 3)
    shelf.attr({
        fill: "#c0c0c0",
        stroke: "#000",
        strokeWidth: 3
    })
    return shelf
  }
  
  buildSlot(options){
    let slot = this.snap.rect(options.x, options.y, 25, 200, 3, 3)
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
    let card = this.snap.rect(300, 100, 500, 250, 3, 3)
    card.attr({
        fill: "#c0c0c0",
        stroke: "#000",
        strokeWidth: 3
    });
    return card;
  }
  
  on(event, fn){
    this.observable.on(event, fn)
  }
  
  off(event, fn){
    this.observable.off(event, fn)
  }
  
  trigger(event, fn){
    this.observable.trigger(evetn, fn)
  }
  
  handleSelection(){
    // selection starts
    let self = this
    this.snap.node.onmousedown = function(event){
      if (self.snap.node !== event.target)
        return

      let selection = self.snap.rect(event.clientX, event.clientY, 0, 0)
      selection.attr({
        fill: "transparent",
        stroke: "#303030",
        strokeWidth: 0.5,
        strokeDasharray: "5, 5"
      });
      
      // selection is in process
      self.snap.node.onmousemove = function(event){
        selection.attr({
          width: event.clientX - selection.node.attributes.x.value,
          height: event.clientY - selection.node.attributes.y.value
        })
      }
      
      self.snap.node.mouseleave = self.snap.node.mouselout = function(){
        self.snap.node.onmousemove = null
        self.snap.node.onmouseup = null
        selection.remove()
        selection = null
      }
      
      // selection has been made
      self.snap.node.onmouseup = function(event){
        var candidates = []
        var all = self.snap.selectAll("svg > *").items
        
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
          self.observable.trigger('onComponentsSelected', candidates)
        }
        finally {
          self.snap.node.onmousemove = null
          self.snap.node.onmouseup = null
          selection.remove()
          selection = null
        }
      }     
    }
  }
}