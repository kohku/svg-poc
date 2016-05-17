import { Slot, Shelf, Card, CardSlotContainer } from './lib/shelf'

export class ComponentsFactory {
  constructor(){
  }
  
  createSlot(){
    return new Slot()
  }
  
  createCard(typeOfCard){
    if (typeOfCard === 'CardSlotContainer'){
      return new CardSlotContainer()
    }
    
    return new Card()
  }
  
  createShelf(){
    return new Shelf()
  }
}