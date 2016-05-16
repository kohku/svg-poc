export class Slot{
  constructor(){
    
  }
}

export class SlotContainer{
  constructor(){
    this.__slots = []
  }
  addCard(card){
    if (card === null || typeof card === 'undefined'){
      throw Error('Invald operation')
    }
    
    if (!(card instanceof Card)){
      throw Error('Cannot add a object that is not a card')
    }
    
    this.__slots.push(card);
  }
}

export class Shelf{
  constructor(){
    this.slots = new SlotContainer()
  }
}

export class Card {
  constructor(){
    
  }
}

export class CardSlotContainer extends Card{
  constructor(){
    super()
    this.slots = new SlotContainer()
  }
}