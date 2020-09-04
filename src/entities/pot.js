
import LevelRender from "../level/levelrender.js";
import Billboardsprite from "./billboardsprite.js";
import Apple from "./apple.js";
class Pot extends Billboardsprite{
    constructor(x,y,z,gl, triggerId) {
        super("po", x,y-0.2,z,LevelRender.pot,gl, 2, triggerId);
        this.mesh.setS(0.6);
    }
    removeThisEntity(level){
        if (this.getRand() < 0.4)this.drop(level,level.getApple());
        super.removeThisEntity(level);
    }
    collidedBy(entity, level){
        super.collidedBy(entity,level);
            if(entity.n == "pp" && this.distanceToOtherEntity(entity) < 0.8 && this.hitCounter>= 0.5)this.hit(level,entity,entity.damage);
    }
}

export default Pot;