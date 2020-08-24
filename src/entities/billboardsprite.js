import LevelRender from "../level/levelrender.js";
import Sprite from "./sprite.js";
class Billboardsprite extends Sprite{
    constructor(name, x,y,z,tex,gl){
        super(name, x,y,z,tex,gl);
    }

    tick(deltatime,level){
        super.tick(deltatime,level);
        this.mesh.setQuaternion(LevelRender.camera.getQuaternion());
    }
}
export default Billboardsprite;