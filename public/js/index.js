import { Slot, Shelf, Card, CardSlotContainer } from './lib/shelf'

export function main(){
  
  let card = new Card();
  let cardSlotContainer = new CardSlotContainer()
  let shelf = new Shelf();
  let slot = new Slot();
  
  try{  
    shelf.slots.addCard(card);
    shelf.slots.addCard(cardSlotContainer);
    cardSlotContainer.slots.addCard(card);
  }
  catch(e){
    console.log(e.message)
  }
  
  var s = Snap("svg");

  s.node.onmousedown = function(event){
    if (this !== event.target)
      return;

    var selection = s.rect(event.clientX, event.clientY, 0, 0);
    selection.attr({
      fill: "transparent",
      stroke: "#303030",
      strokeWidth: 0.5,
      strokeDasharray: "5, 5"
    });
    
    s.node.onmousemove = function(event){
      selection.attr({
        width: event.clientX - selection.node.attributes.x.value,
        height: event.clientY - selection.node.attributes.y.value
      })
    } 
    s.node.onmouseup = function(event){
      var candidates = [];
      var all = s.selectAll("svg > *").items
      
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
          candidates.push(item);
        }
      })
      
      if (candidates.length > 1){
        var group = s.group();
        candidates.forEach(function(item){
          item.attr({
            strokeOpacity: 0.3
          });
          item.undrag();
          group.add(item);
        })
        group.drag();
      }
      
      s.node.onmousemove = null;
      s.node.onmouseup = null;
      selection.remove();
      selection = null;
      // delete selection;
    }     
  }
  
  var rack = s.rect(300, 100, 500, 250, 3, 3);
  rack.attr({
      fill: "#c0c0c0",
      stroke: "#000",
      strokeWidth: 3
  });
  var mySlot = s.rect(50, 100, 25, 200, 3, 3);
  mySlot.attr({
    fill: "red",
    stroke: "#000",
    strokeWidth: 3
  })
  mySlot.node.onclick = function(){
    var clone = mySlot.clone();
    clone.attr({
      x: parseInt(mySlot.node.attributes.x.value) + parseInt(mySlot.node.attributes.width.value) + 20
    })
    clone.drag();
  };
  console.log("end");
}

main();