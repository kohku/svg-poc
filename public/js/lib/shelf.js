export class Component {
  constructor(renderEngine, options){
    this.renderEngine = renderEngine
    this.options = options
    this.view = undefined
  }
  render(){}
  drag(){
    if (this.view === 'undefined'){
      throw Error(`Component has not been rendered`)
    }
    
    this.view.drag()
  }
}

export class Slot extends Component {
  constructor(renderEngine, options){
    super(renderEngine, options)
  }
  render(){
    this.view = this.renderEngine.buildSlot(this.options)
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
  render(){
    this.elements.forEach(s => {
      s.render()
    })
  }
}

export class Shelf extends Component {
  constructor(renderEngine, options){
    super(renderEngine, options)
    this.slots = new SlotContainer()
  }
  render(){
    this.renderEngine.buildShelf()
    this.slots.render()
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