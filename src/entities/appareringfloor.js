import Sprite from "./sprite.js";
import Box from "./box.js";
import LevelRender from "../level/levelrender.js";

class AppareringFloor extends Sprite{
    constructor(x,y,z, gl,triggerId) {
        super("appareingfloor", x,y-1.2,z,LevelRender.floor,gl, 0, triggerId);
        this.neededTrigger = 0;
        if (triggerId == 200) this.neededTriggers = 2;
        if (triggerId == 196) this.neededTriggers = 4;
        this.mesh.setRotationX(-90);
        this.visble = false;
        
    }
    trigger(level, source){
        if (source == this) return;
        this.neededTrigger++;
        
        console.log("triggered floor "+this.neededTrigger);
        if (this.neededTrigger ==this.neededTriggers){
            level.removeTile(this.p.x, this.p.z);
            this.visble = true;

        }
    }

    untrigger(level, source){
        if (source == this) return;
        this.neededTrigger--;
    }
    render(gl,shaderprogram,pm,darkness){
        if (!this.visble) return;
        super.render(gl,shaderprogram,pm,darkness);
    }

}
export default AppareringFloor;