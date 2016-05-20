import { Observable } from './observable'

export class Component extends Observable {
  constructor(renderEngine, options){
    super()
    this.renderEngine = renderEngine
    this.options = options
    this.view = undefined
  }
  render() {
    if (typeof this.view !== 'undefined' && this.view !== null) {
      this.view.attr({ x: this.options.x, y: this.options.y, width: this.options.width, height: this.options.height, rel_Xpos:this.options.rel_Xpos, rel_Ypos:this.options.rel_Ypos  })
      return
    }
    this._render()
  }
  
  drag(){
    if (this.view === 'undefined'){
      throw Error(`Component has not been rendered`)
    }
    
    this.view.drag()
  }
}

export class GroupComponent extends Component{
 constructor(renderEngine, elements, options){
    super(renderEngine, options)
    this.elements = elements
  }
  _render(){
    this.renderEngine.appendGroup(this)
    return this.view;
  }  
}

export class Slot extends Component {
  constructor(renderEngine, options){
    super(renderEngine, options)
  }
  _render(){
    this.renderEngine.appendSlot(this)
    return this.view;
  }
}

export class SlotContainer extends Component {
  constructor(renderEngine, options){
    super(renderEngine, options)
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
  constructor(renderEngine, options){
    super(renderEngine, options)
    this.slots = new SlotContainer()
  }
  _render(){
    this.renderEngine.appendShelf(this)
    this.renderEngine.appendComponent(this, this.slots.elements)
    return this.view;
  }
}

export class Card extends Component {
  constructor(renderEngine, options){
    super(renderEngine, options)
  }
}

export class CardSlotContainer extends Card {
  constructor(renderEngine, options){
    super(renderEngine, options)
    this.slots = new SlotContainer()
  }
} 