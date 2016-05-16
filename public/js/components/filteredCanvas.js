import { rotateCommand, grayscaleCommand, blurCommand, contrastCommand, invertCommand, cssFilterCommandBase, undoableCommandBase, commandBase } from './filters'

export class FilteredCanvasController{
  constructor(){
   
    this.outputStyle = { }
    
    this.commandChain = []
    
    this.commands = [
      new grayscaleCommand(this.outputStyle),
      new blurCommand(this.outputStyle),
      new contrastCommand(this.outputStyle),
      new invertCommand(this.outputStyle),
      new rotateCommand(this.outputStyle)
    ]
  }
    
  apply(name){
    let action = this.commands.find(item => item.name == name)
    console.log(`adding the ${name} to the command chain and executing it`);
    action.execute()
    this.commandChain.push(action)
  }
    
  undo(){
    if (this.commandChain.length > 0){
      if (this.commandChain[this.commandChain.length-1] instanceof undoableCommandBase){           
        let action = this.commandChain.pop()
        console.log("Undoing last command")
        action.undo()
      }
    } else{
      console.log("Nothing to undo")
    }
  }
  
  save(){
    if (window.localStorage){
      window.localStorage.clear()
      
      this.commandChain.forEach(function(element, index) {
        // Create a wrapper just here
        window.localStorage.setItem(`${index}`, JSON.stringify(element))
      }, this)
    }
  }
  
  reset(){
    this.outputStyle.filter = '';
    this.outputStyle['-webkit-filter'] = ''
    this.outputStyle.transform = '';
  }
  
  load(){
    this.reset()
    
    if (window.localStorage){
      this.commandChain = []
      var that = this;

      for(let index = 0; index < window.localStorage.length; index++){
        let json = JSON.parse(window.localStorage.getItem(`${index}`))
        this.apply(json.name);
      }
    }
  }
  
  // create(filter) {
  //   let args = Array.prototype.slice.call(arguments, 1)
  //   let obj = eval(filter)
  //   function Obj() {
  //       return obj.apply(this, args);
  //   }
  //   Obj.prototype = obj.prototype;
  //   return new Obj();
  // }
}