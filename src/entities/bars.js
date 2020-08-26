import Sprite from "./sprite.js"
import LevelRender from "../level/levelrender.js";
import Tile from "../tiles/tile.js";
class Bars extends Sprite{
    constructor(x,y,z,gl, triggerId) {
        super("bars", x+0.5,y,z,LevelRender.bars,gl,0,triggerId);
        this.mesh.setRotationY(270);
        this.triggered = false;
    }

    trigger(level, source){
        super.trigger(level,source);
        if (source == this) return;
        if (!this.triggered){
            this.mesh.translate(0,1,0);
            level.removeTile(this.position.x-0.5, this.position.z);
            this.triggered = true;
        }
    }

    untrigger(level, source){
        super.untrigger(level,source);
        if (source == this) return;
        if (this.triggered){
            if (this.triggerId == 253) return;
            this.mesh.translate(0,0,0);
            level.addTile(this.position.x-0.5, this.position.z, new Tile());
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