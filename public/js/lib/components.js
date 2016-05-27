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
      this.view.attr({width: this.options.width, height: this.options.height})
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
  
  clone(){
    var component = Object.create(command.prototype)
    component.constructor(JSON.parse(JSON.string(commandInfo.options)))
    return component
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