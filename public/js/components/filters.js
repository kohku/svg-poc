export class commandBase {
    constructor(target){
        this.target = target
    }
    execute(){
    }
}

export class undoableCommandBase extends commandBase {
    constructor(target){
        super(target)
    }
    undo(){
    }
}

export class cssFilterCommandBase extends undoableCommandBase {
    constructor(target){
        super(target)
        this.cssFilter = undefined
    }
    execute(){
      this.target['-webkit-filter'] = this.target['filter'] = 
        (this.target['filter'] || '') + this.cssFilter
      
      return this
    }
    undo(){
      this.target['-webkit-filter'] = this.target['filter'] = 
        this.target['filter'] && this.target['filter'].lastIndexOf(this.cssFilter) != -1 ?
        this.target['filter'].replace(this.cssFilter, '') : this.target['filter']
      
      return this
    }
}

export class grayscaleCommand extends cssFilterCommandBase {
    constructor(target){
        super(target)
        this.name = 'grayscale'
        this.cssFilter = ' grayscale(1)'
    }
}

export class blurCommand extends cssFilterCommandBase {
    constructor(target){
        super(target)
        this.name = 'blur'
        this.cssFilter = ' blur(5px)'
    }
}

export class contrastCommand extends cssFilterCommandBase {
    constructor(target){
        super(target)
        this.name = 'contrast'
        this.cssFilter = ' contrast(4)'
    }
}

export class invertCommand extends cssFilterCommandBase {
    constructor(target){
        super(target)
        this.name = 'invert'
        this.cssFilter = ' invert(.8)'
    }
}

export class rotateCommand extends undoableCommandBase{
  constructor(target){
    super(target)
    this.name = 'rotate'
  }
  
  execute(){
    this.previousState = this.target.transform;
    this.target.transform = 'rotate(0.5turn)'
  }
  
  undo(){
    this.target.transform = this.previousState;
  }
}