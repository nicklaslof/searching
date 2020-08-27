import ItemSprite from "./itemsprite.js";
import LevelRender from "../level/levelrender.js";
import Billboardsprite from "./billboardsprite.js";
import Apple from "./apple.js";
class Pot extends Billboardsprite{
    constructor(x,y,z,gl, triggerId) {
        super("pot", x,y-0.2,z,LevelRender.pot,gl, 2, triggerId);
        this.mesh.setScale(0.6);
    }
    removeThisEntity(level){
        if (Math.random(1) < 0.2){
            let itemSprite = new ItemSprite(new Apple(0,0,0,level.gl,0.3),this.position.x-LevelRender.camera.getDirection().x/2,-0.2,this.position.z-LevelRender.camera.getDirection().z/2,LevelRender.apple,level.gl);
            itemSprite.knockback(LevelRender.camera.getDirection().x,LevelRender.camera.getDirection().z);
            level.addEntity(itemSprite); 
        }
        super.removeThisEntity(level);
    }
}

export default Pot;