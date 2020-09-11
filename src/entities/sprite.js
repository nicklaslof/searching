import Entity from "./entity.js";
import Mesh from "../gl/mesh.js";
import MeshBuilder from "../gl/meshbuilder.js";
class Sprite extends Entity{
    constructor(n, x,y,z,texture,gl, health, triggerId){
        super(n, x,y,z, health, triggerId);
        if (texture instanceof Array){
            this.animated = true;
            this.numberOfFrames = texture.length;
            this.texture = texture[0];
            this.textureAnimation = texture;
            this.currentFrame = 0;
            this.frameCounter = 0;         
        }else{
            this.texture = texture;
            this.animated = false;
        }

        this.c = this.baseColor = [1,1,1,1];
        this.light = 0.7;
        this.hitCCountDown = 0;
        this.changeBackCAfterHit = false;
        let r = MeshBuilder.start(gl,x,y,z);
        MeshBuilder.front(this.texture.getUVs(),r,0,0,0,this.light,1);
        this.mesh = MeshBuilder.build(r);
    }

    setC(c){
        this.c = c;
        this.colorChanged = true;
    }

    setS(scale){
        this.mesh.setS(scale);
        return this;
    }

    hit(level,hitByEntity, amount){
        if (this.hitCounter>= 0.3){
            this.setC([1,0,0,1]);
            this.hitCCountDown = 0.5;
            this.changeBackCAfterHit = true;

        }
        super.hit(level,hitByEntity,amount);
    }

    tick(deltatime,level){
        super.tick(deltatime,level);
        if (this.changeBackCAfterHit && this.hitCCountDown > 0) this.hitCCountDown -= deltatime;
        if (this.changeBackCAfterHit && this.hitCCountDown <= 0){
            this.setC(this.baseColor);
            this.changeBackCAfterHit = false;
        }

        this.mesh.setPos(this.p.x,this.p.y,this.p.z);

        if (this.animated){
            this.frameCounter += deltatime;
            if (this.frameCounter >= 0.016*15){
                this.frameChanged = true;
                this.currentFrame++;
                if (this.currentFrame > this.numberOfFrames-1) this.currentFrame = 0;
                this.texture = this.textureAnimation[this.currentFrame];
                this.frameCounter = 0;
            }
        }
    }

    render(gl,shaderprogram,perspectiveMatrix,darkness){
        if (this.dispose) return;
    
        if (this.frameChanged){
            this.mesh.render(gl,shaderprogram,perspectiveMatrix,this.texture.texture, darkness, this.texture.getUVs());
            this.frameChanged = false;
        }else{
            this.mesh.render(gl,shaderprogram,perspectiveMatrix,this.texture.texture,darkness,null,this.colorChanged?[this.c, this.c, this.c, this.c]:null);
            this.colorChanged = false;
        }
    }
}
export default Sprite;