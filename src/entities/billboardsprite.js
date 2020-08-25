import LevelRender from "../level/levelrender.js";
import Sprite from "./sprite.js";
class Billboardsprite extends Sprite{
    constructor(name, x,y,z,tex,gl, health, triggerId){
        super(name, x,y,z,tex,gl, health, triggerId);
    }

    tick(deltatime,level){
        super.tick(deltatime,level);
        this.mesh.setQuaternion(LevelRender.camera.getQuaternion());
    }
}
export default Billboardsprite;