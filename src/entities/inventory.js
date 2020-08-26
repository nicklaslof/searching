import Game from "../game.js";
class Inventory{
    constructor() {
        this.items = new Array(8);
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
        return this.slotWithItems < 7
    }

    addItemToFirstAvailableSlot(itemToAdd){
        for (let index = 0; index < this.items.length; index++) {
            let item = this.items[index];
            if (item == null){ 
                this.items[index] = itemToAdd;
                this.slotWithItems++;
                return;
            }
        }
    }

    removeItemFromSlot(slot){
        this.items[slot-1] = null;
        this.slotWithItems--;
    }
    
    getItemInSlot(index){
        return this.items[index-1];
    }
}

export default Inventory;