import Billboardsprite from "./billboardsprite.js";
import Game from "./../game.js";

class ItemSprite extends Billboardsprite{

constructor(i,x,y,z,tex, gl) {
    super(i.n, x,y,z,tex,gl, 1)
    this.i = i;
    this.setC(i.c);
    this.counter = 0;
    
    this.mesh.setS(i.onGroundScale);
}

collidedBy(entity, level){
    if (this.dispose) return;
    if (entity.n == "player"){
        let d = this.distanceToOtherEntity(entity);
        if(d < 1){
            level.displayMessage("Press shift to pickup",this.na(),0.1);
            if (Game.inputHandler.isKeyDown(16)){
                    entity.pickup(level,this.i);
                    this.removeThisEntity(level);
            }
        }
    }
    
}
na(){
    return this.n+" !"+this.i.getDamage()+" damage!";
}


tick(deltatime,level){
    super.tick(deltatime,level);
    this.counter += deltatime;
    let v = Math.sin(this.counter*3)/400;
    this.p.y += v;
}

}
export default ItemSprite;