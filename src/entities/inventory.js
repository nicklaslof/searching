import Game from "../game.js";
class Inventory{
    constructor() {
        this.is = new Array(3);
        this.selectedSlot = 1;
        this.apples = 0;
    }

    tick(){
        let inputHandler = Game.inputHandler;
        //Switch inventory slots based on keys 1-3 pressed
        for (let key = 49; key < 52; key ++ ){
            if (inputHandler.isKeyDown(key)) this.selectedSlot=3-(51-key);
        }

    }

    eat(e){
        if (this.apples > 0){
            this.getItemInSlot(3).use(e);
            //reduce the number of apples until it reaches 0. Then remove the last apple too.
            this.apples--;
            if (this.apples <= 0) this.is[2] = null;
        }
    }

    addItemToFirstAvailableSlot(level,itemToAdd){
        if (itemToAdd.n == "dagger") this.replaceAndShow(level,0,itemToAdd);
        else if (itemToAdd.n == "wand")this.replaceAndShow(level,1,itemToAdd);
        else {this.is[2] = itemToAdd; this.apples++};
    }

    replaceAndShow(level,slot,item){
        if (this.is[slot] == null){ this.is[slot] = item; return}
        this.showMessage(level,"Replaced "+this.is[slot].n + " ("+this.is[slot].getDamage()+" damage)"," with "+item.n + " ("+item.getDamage()+" damage)");
        this.is[slot] = item;
    }

    showMessage(level,t1,t2){
        level.displayMessage(t1 ,t2, 4);
    }

    removeItemFromSlot(slot){
        //If the slot is the apple slot reduce the number of apples until it reaches 0. Then remove the last apple too.
        if (slot == 3){
            this.apples--;
            if (this.apples <= 0) this.is[2] = null;
            return;
        } 
        this.is[slot-1] = null;
    }
    
    getItemInSlot(index){
        return this.is[index-1];
    }
}

export default Inventory;