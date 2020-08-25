import Billboardsprite from "./billboardsprite.js";
import Game from "./../game.js";

class ItemSprite extends Billboardsprite{
constructor(item,x,y,z,tex, gl) {
    super(item.name, x,y,z,tex,gl, 1)
    this.item = item;
    this.counter = 0;
    this.nospace = false;
    console.log(item.onGroundScale);
    this.mesh.setScale(item.onGroundScale);
}


collidedBy(entity, level){
    if (this.dispose) return;
    if (entity.name == "player"){
        let d = this.distanceToOtherEntity(entity);
        if(d < 1){
            if (!this.nospace){
                level.displayMessage("Press shift to pickup "+this.name,1);
            }
            
            if (Game.inputHandler.wasKeyJustPressed(16)){
                if (entity.hasSpace()){
                    entity.pickup(this.item);
                    level.displayMessage("Woho! I found a "+this.name,2);
                    this.removeThisEntity(level);
                }else{
                    level.displayMessage("I don't have enough space!",2);
                    this.nospace = true;
                }
            }
        }
    }
}

tick(deltatime,level){
    super.tick(deltatime,level);
    this.counter += deltatime;
    let v = Math.sin(this.counter*3)/400;
    this.position.y += v;
}

}
export default ItemSprite;