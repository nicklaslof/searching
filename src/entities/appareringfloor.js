import Sprite from "./sprite.js";
import Box from "./box.js";
import LevelRender from "../level/levelrender.js";

class AppareringFloor extends Sprite{
    constructor(x,y,z, gl,triggerId) {
        super("", x,y-1,z,LevelRender.floor,gl, 0, triggerId);
        this.neededTrigger = 0;
        this.neededTriggers = triggerId==200?2:triggerId==196?4:0;
        this.mesh.setRotationX(-90);
        this.visble = false;
        
    }
    trigger(level, source){
        if (source == this) return;
        this.neededTrigger++;
        if (this.neededTrigger ==this.neededTriggers){
            level.removeTile(this.p.x, this.p.z);
            this.visble = true;

        }
    }

    untrigger(level, source){
        if (source == this) return;
        this.neededTrigger--;
    }
    render(gl,shaderprogram,perspectiveMatrix,darkness){
        if (!this.visble) return;
        super.render(gl,shaderprogram,perspectiveMatrix,darkness);
    }

}
export default AppareringFloor;