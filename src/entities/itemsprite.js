import Billboardsprite from "./billboardsprite.js";
import Game from "./../game.js";

class ItemSprite extends Billboardsprite{
constructor(i,x,y,z,tex, gl) {
    super(i.n, x,y,z,tex,gl, 1)
    this.i = i;
    this.counter = 0;
    this.nospace = false;
    
    this.mesh.setS(i.onGroundScale);
}

collidedBy(entity, level){
    if (this.dispose) return;
    if (entity.n == "player"){
        let d = this.distanceToOtherEntity(entity);
        if(d < 1){
            if (!this.nospace){
                level.displayMessage("Press shift to pickup "+this.n,"",0.1);
            }
            if (Game.inputHandler.wasKeyJustPressed(16)){
                if (entity.hasSpace()){
                    entity.pickup(this.i);
                    level.displayMessage("You picked up "+this.n,"", 2);
                    this.removeThisEntity(level);
                }else{
                    level.displayMessage("I don't have enough space!","",2);
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
    this.p.y += v;
}

}
export default ItemSprite;