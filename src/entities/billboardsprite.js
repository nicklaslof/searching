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
        let itemSprite = new ItemSprite(item,this.p.x-LevelRender.camera.getDirection().x/2,-0.2,this.p.z-LevelRender.camera.getDirection().z/2,item.texture,level.gl).setNotRespawn();
        itemSprite.knockback(LevelRender.camera.getDirection().x,LevelRender.camera.getDirection().z);
        level.addEntity(itemSprite); 
    }
}
export default Billboardsprite;