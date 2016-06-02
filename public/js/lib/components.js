import { Observable } from './observable'

export class Component extends Observable {
  constructor(builder, options){
    super()
    this.builder = builder
    this.options = options
    this.view = undefined
  }
  render(){
    if (typeof this.view !== 'undefined' && this.view !== null){
      this.view.attr({
        x: this.options.x,
        y: this.options.y,
        width: this.options.width, 
        height: this.options.height
      })
      return this.view
    }
    this.generate()
    return this.view
  }
  
  drag(){
    if (this.view === 'undefined'){
      throw Error(`Component has not been rendered`)
    }
    this.view.drag()
  }
  
  generate(){
    this.builder.appendComponent(this)
  }
  
  onClick(callback){
    if (typeof callback === 'function'){
      this.view.node.onclick = callback
    }
  }
  
  clone(){
    var component = Object.create(Object.getPrototypeOf(this))
    component.constructor(this.builder, JSON.parse(JSON.stringify(this.options)))
    return component
  }
}

export class Rack extends Component{
  constructor(builder, options){
    super(builder, options)
    if (typeof this.options.header !== 'undefined' && this.options.header !== null){
      this.header = new RackHeader(this.builder, {})
    }
    if (typeof this.options.footer !== 'undefined' && this.options.footer !== null){
      this.footer = new RackFooter(tuis.builder, {})
    }
  }
  render(){
    super.render()
    if (typeof this.header !== 'undefined' && this.header !== null){
      let options = {
        x: this.options.x,
        y: this.options.y,
        width: this.options.width,
        height: this.options.header.height
      }
      this.header.options = options
      this.header.render()
    }
    if (typeof this.footer !== 'undefined' && this.footer !== null){
      let options = {
        x: this.options.x,
        y: this.options.y + this.options.height - this.options.footer.height,
        width: this.options.width,
        height: this.options.header.height
      }
      this.footer.options = options
      this.footer.render()
    }
  }
}

export class RackHeader extends Component {
  constructor(builder, options){
    super(builder, options)
  }
}

export class RackFooter extends Component {
  constructor(){
    super(builder, options)
  }
}

export class Slot extends Component {
  constructor(builder, options){
    super(builder, options)
  }
}

export class SlotContainer extends Component {
  constructor(builder, options){
    super(builder, options)
    this.elements = []
  }
  addSlot(slot){
    if (slot === null || typeof slot === 'undefined'){
      throw Error('Invald operation')
    }
    
    if (!(slot instanceof Slot)){
      throw Error('Cannot add a object that is not a slot')
    }
    
    this.elements.push(slot);
  }
}

export class Shelf extends Component {
  constructor(builder, options){
    super(builder, options)
    this.slots = new SlotContainer()
  }
  generate(){
    super.generate()
    this.slots.elements.forEach(component => component.render())
  }
}

export class Card extends Component {
  constructor(builder, options){
    super(builder, options)
  }
}

export class CardSlotContainer extends Card {
  constructor(builder, options){
    super(builder, options)
    this.slots = new SlotContainer()
  }
  generate(){
    super.generate()
    this.slots.elements.forEach(component => component.render())
  }
} 