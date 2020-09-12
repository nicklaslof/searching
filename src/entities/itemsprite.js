import Billboardsprite from "./billboardsprite.js";
import Game from "./../game.js";

//ItemSprite is an Item when rendered on the floor in the level.
class ItemSprite extends Billboardsprite{

constructor(i,x,y,z,tex, gl) {
    super(i.n, x,y,z,tex,gl, 1)
    this.i = i;
    this.setC(i.c);
    this.counter = 0;
    this.radius = 0.1;
    this.mesh.setS(i.onGroundScale);
}

collidedBy(entity, level){
    if (this.dispose) return;
    //If collided entity is the player and it's closer than 1 unit away show the pickup message.
    //Distance could have been a bit bigger but that would case a classic "pick up things trough walls" issue.
    if (entity.n == "p"){
        if( this.distanceToOtherEntity(entity) < 1){
            level.displayMessage("Shift: Pickup",this.n=="dagger"||this.n=="wand"?this.n+" ("+this.i.getDamage()+" damage)":this.n,0.1);
            if (Game.inputHandler.isKeyDown(16)){
                    entity.pickup(level,this.i);
                    this.removeThisEntity(level);
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