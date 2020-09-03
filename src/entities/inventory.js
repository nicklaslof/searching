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

    eat(e){
        for(let slot=0; slot < 9; slot++){
            let i = this.getItemInSlot(slot);
            if (i != null && i.n == "apple"){
               i.use(e);
               this.removeItemFromSlot(slot);
               return;
            }
        }
    }

    hasSpace(){
        return this.slotWithItems < 8
    }

    addItemToFirstAvailableSlot(level,itemToAdd){
        if (itemToAdd.n == "dagger") this.replaceAndShow(level,0,itemToAdd);
        else if (itemToAdd.n == "wand")this.replaceAndShow(level,1,itemToAdd);
        else
        for (let index = 2; index < this.is.length; index++) {
            let i = this.is[index];
            if (i == null){ 
                //this.is[index] = itemToAdd;
                this.pickupAndShow(level,index,itemToAdd);
                this.slotWithItems++;
                return;
            }
        }
    }

    replaceAndShow(level,slot,item){
        if (this.is[slot] == null){ this.pickupAndShow(level,slot,item); return}
        this.showMessage(level,"you replaced "+this.is[0].n + " "+this.is[0].getDamage()+" damage"," with "+item.n + " "+item.getDamage()+" damage");
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
        this.is[slot-1] = null;
        this.slotWithItems--;
    }
    
    getItemInSlot(index){
        return this.is[index-1];
    }
}

export default Inventory;