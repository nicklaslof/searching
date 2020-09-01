import ItemSprite from "./itemsprite.js";
import LevelRender from "../level/levelrender.js";
import Billboardsprite from "./billboardsprite.js";
import Apple from "./apple.js";
class Pot extends Billboardsprite{
    constructor(x,y,z,gl, triggerId) {
        super("pot", x,y-0.2,z,LevelRender.pot,gl, 2, triggerId);
        this.mesh.setS(0.6);
    }
    removeThisEntity(level){
        if (this.getRand() < 0.4){
            let itemSprite = new ItemSprite(new Apple(0,0,0,level.gl,0.3),this.p.x-LevelRender.camera.getDirection().x/2,-0.2,this.p.z-LevelRender.camera.getDirection().z/2,LevelRender.apple,level.gl).setNotRespawn();
            itemSprite.knockback(LevelRender.camera.getDirection().x,LevelRender.camera.getDirection().z);
            level.addEntity(itemSprite); 
        }
        super.removeThisEntity(level);
    }
    collidedBy(entity, level){
        super.collidedBy(entity,level);
            if(entity.n == "projectile" && this.distanceToOtherEntity(entity) < 0.8 && this.hitCounter>= 0.5)this.hit(level,entity,entity.damage);
    }
}

export default Pot;