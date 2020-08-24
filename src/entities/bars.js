import Sprite from "./sprite.js"
import LevelRender from "../level/levelrender.js";
class Bars extends Sprite{
    constructor(x,y,z,gl) {
        console.log("bar at "+x+" "+z);
        super("bars", x,y,z,LevelRender.bars,gl);
        this.mesh.setRotation(270);
    }

    tick(deltatime,level){
        super.tick(deltatime,level);
    }
    render(gl,shaderprogram,pm,vm){
        super.render(gl,shaderprogram,pm,vm);
    }
}
export default Bars;