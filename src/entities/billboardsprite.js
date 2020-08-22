import LevelRender from "../level/levelrender.js";
import Sprite from "./sprite.js";
class Billboardsprite extends Sprite{
    constructor(x,y,z,tex,gl){
        super(x,y,z,tex,gl);
    }

    tick(deltatime){
        this.mesh.setQuaternion(LevelRender.camera.getQuaternion());
    }
}
export default Billboardsprite;