import Game from "../game.js";
class Inventory{
    constructor() {
        this.is = new Array(3);
        this.selectedSlot = 1;
        this.slotWithItems = 0;
        this.apples = 0;
    }

    tick(){
        let inputHandler = Game.inputHandler;
        for (let key = 49; key < 52; key ++ ){
            if (inputHandler.isKeyDown(key)) this.selectedSlot=3-(51-key);
        }

    }

    eat(e){
        if (this.apples > 0){
            this.getItemInSlot(3).use(e);
            this.apples--;
            if (this.apples <= 0) this.is[2] = null;
        }
    }

    addItemToFirstAvailableSlot(level,itemToAdd){
        if (itemToAdd.n == "dagger") this.replaceAndShow(level,0,itemToAdd);
        else if (itemToAdd.n == "wand")this.replaceAndShow(level,1,itemToAdd);
        else {this.pickupAndShow(level,2,itemToAdd); this.apples++};
    }

    replaceAndShow(level,slot,item){
        if (this.is[slot] == null){ this.pickupAndShow(level,slot,item); return}
        this.showMessage(level,"you replaced "+this.is[slot].n + " "+this.is[slot].getDamage()+" damage"," with "+item.n + " "+item.getDamage()+" damage");
        this.is[slot] = item;
    }

    pickupAndShow(level,slot,item){
        this.showMessage(level,"You picked up "+item.n);
        this.is[slot] = item;
    }

    showMessage(level,t1,t2){
        level.displayMessage(t1 ,t2, 4);
    }

    removeItemFromSlot(slot){
        if (slot == 3){
            this.apples--;
            if (this.apples <= 0) this.is[2] = null;
            return;
        } 
        this.is[slot-1] = null;
        this.slotWithItems--;
    }
    
    getItemInSlot(index){
        return this.is[index-1];
    }
}

export default Inventory;