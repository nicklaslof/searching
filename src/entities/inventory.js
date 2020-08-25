import Game from "../game.js";
class Inventory{
    constructor() {
        this.items = new Array(8);
        this.selectedSlot = 1;
        this.slotWithItems = 0;
    }

    tick(deltaTime, level){
        let inputHandler = Game.inputHandler;
        if (inputHandler.isKeyDown(49)) this.selectedSlot=1;
        if (inputHandler.isKeyDown(50)) this.selectedSlot=2;
        if (inputHandler.isKeyDown(51)) this.selectedSlot=3;
        if (inputHandler.isKeyDown(52)) this.selectedSlot=4;
        if (inputHandler.isKeyDown(53)) this.selectedSlot=5;
        if (inputHandler.isKeyDown(54)) this.selectedSlot=6;
        if (inputHandler.isKeyDown(55)) this.selectedSlot=7;
        if (inputHandler.isKeyDown(56)) this.selectedSlot=8;
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
                console.log("added to "+index);
                return;
            }
        }
    }

    removeItemFromSlot(slot){
        this.items[slot] = null;
    }
    
    getItemInSlot(index){
        return this.items[index-1];
    }
}

export default Inventory;