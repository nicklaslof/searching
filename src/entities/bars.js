import Sprite from "./sprite.js"
import LevelRender from "../level/levelrender.js";
import Tile from "../tiles/tile.js";
class Bars extends Sprite{
    constructor(x,y,z,gl, triggerId) {
        super("bars", x+0.5,y,z,LevelRender.bars,gl,0,triggerId);
        //console.log("bars at "+x+" "+z);
        this.mesh.setRotationY(270);
        this.neededTriggers = 1;
        if (triggerId == 199) this.neededTriggers = 2;
        this.neededTrigger = 0;
        this.triggered = false;
    }

    trigger(level, source){
        super.trigger(level,source);
        if (source == this) return;
        this.neededTrigger++;
        if (!this.triggered && this.neededTrigger == this.neededTriggers){
            this.mesh.t(0,1,0);
            level.removeTile(this.p.x-0.5, this.p.z);
            this.triggered = true;
        }
    }

    untrigger(level, source){
        super.untrigger(level,source);
        if (source == this) return;
        this.neededTrigger--;
        if (this.triggered){
            if (this.triggerId == 253) return;
            this.mesh.t(0,0,0);
            level.addTile(this.p.x-0.5, this.p.z, new Tile());
            this.triggered = false;
        }
    }

    tick(deltatime,level){
        super.tick(deltatime,level);
    }
    render(gl,shaderprogram,pm,vm){
        gl.disable(gl.CULL_FACE);
        super.render(gl,shaderprogram,pm,vm);
        gl.enable(gl.CULL_FACE);
    }
}
export default Bars;