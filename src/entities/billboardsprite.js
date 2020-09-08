import LevelRender from "../level/levelrender.js";
import Sprite from "./sprite.js";
import ItemSprite from "./itemsprite.js";
class Billboardsprite extends Sprite{
    constructor(n, x,y,z,tex,gl, health, triggerId){
        super(n, x,y,z,tex,gl, health, triggerId);
    }

    tick(deltatime,level){
        super.tick(deltatime,level);
        this.mesh.setQuaternion(LevelRender.camera.getQuaternion());
    }

    drop(level,item){
        let itemSprite = new ItemSprite(item,this.p.x,-0.2,this.p.z,item.texture,level.gl).setNotRespawn();
        level.addEntity(itemSprite); 
    }
}
export default Billboardsprite;