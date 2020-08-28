import Game from "../game.js";
class Inventory{
    constructor() {
        this.is = new Array(8);
        this.selectedSlot = 1;
        this.slotWithItems = 0;
    }

    tick(){
        let inputHandler = Game.inputHandler;
        for (let key = 49; key < 57; key ++ ){
            if (inputHandler.isKeyDown(key)) this.selectedSlot=9-(57-key);
        }
    }

    hasSpace(){
        return this.slotWithItems < 8
    }

    addItemToFirstAvailableSlot(itemToAdd){
        for (let index = 0; index < this.is.length; index++) {
            let i = this.is[index];
            if (i == null){ 
                this.is[index] = itemToAdd;
                this.slotWithItems++;
                return;
            }
        }
    }

    removeItemFromSlot(slot){
        this.is[slot-1] = null;
        this.slotWithItems--;
    }
    
    getItemInSlot(index){
        return this.is[index-1];
    }
}

export default Inventory;