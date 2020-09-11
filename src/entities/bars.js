import Sprite from "./sprite.js"
import LevelRender from "../level/levelrender.js";
import Tile from "../tiles/tile.js";
import MeshBuilder from "../gl/meshbuilder.js";
class Bars extends Sprite{
    constructor(x,y,z,gl, triggerId) {
        super("br", x,y+1,z,LevelRender.bars,gl,0,triggerId);
        let meshBuild = MeshBuilder.start(gl,x,y+1,z);
        for(let x = 0; x < 4;x++){
            for (let y = 0; y < 8; y++){
                MeshBuilder.front(this.texture.getUVs(),meshBuild,(0.24*x),(-0.24*y),0,this.light,1);
            }
        }
        
        this.mesh = MeshBuilder.build(meshBuild);

        this.mesh.setRotationY(270);
        if (triggerId == 196){
            this.mesh.setRotationY(180);
            this.p.z += 0.5;
            this.mesh.t(0.0,0,0.5);
        } 
        this.neededTriggers = triggerId == 199 || triggerId == 197?2:triggerId == 191?3:triggerId == 196 || triggerId == 193?4:1;
        this.neededTrigger = 0;
        this.triggered = false;
    }

    trigger(level, source){
        super.trigger(level,source);
        if (source == this) return;
        this.neededTrigger++;
        if (!this.triggered && this.neededTrigger == this.neededTriggers){;
            this.p.y += 1;
            if (this.triggerId == 196) level.removeTile(this.p.x, this.p.z-0.5);
            else level.removeTile(this.p.x, this.p.z);
            level.player.setCheckpoint(Math.round(this.p.x), Math.round(this.p.z));
            this.triggered = true;
        }
    }

    untrigger(level, source){
        super.untrigger(level,source);
        if (source == this) return;
        this.neededTrigger--;
        if (this.triggered){
            if (this.triggerId == 253) return;
            this.p.y -= 1;
            level.addTile(this.p.x, this.p.z, new Tile());
            this.triggered = false;
            level.player.revertCheckpoint();
        }
    }

    tick(deltatime,level){
        super.tick(deltatime,level);
    }
    render(gl,shaderprogram,perspectiveMatrix,playerHurt){
        gl.disable(gl.CULL_FACE);
        super.render(gl,shaderprogram,perspectiveMatrix,playerHurt);
        gl.enable(gl.CULL_FACE);
    }
}
export default Bars;