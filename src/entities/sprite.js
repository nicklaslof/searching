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

        this.color = [1,1,1,1];
        this.light = 0.5;
        this.hitColorCountDown = 0;
        this.changeBackColorAfterHit = false;
        let r = MeshBuilder.start(gl,x,y,z);
        MeshBuilder.front(this.texture.getUVs(),r,0,0,0,this.light,1);
        this.mesh = MeshBuilder.build(r);
    }

    setColor(color){
        this.color = color;
        this.colorChanged = true;
    }

    setS(scale){
        this.mesh.setS(scale);
        return this;
    }

    hit(level,hitByEntity, amount){
        if (this.hitCounter>= 0.3){
            this.setColor([1,0,0,1]);
            this.hitColorCountDown = 0.5;
            this.changeBackColorAfterHit = true;

        }
        super.hit(level,hitByEntity,amount);
    }

    tick(deltatime,level){
        super.tick(deltatime,level);
            if (this.changeBackColorAfterHit && this.hitColorCountDown > 0) this.hitColorCountDown -= deltatime;
            if (this.changeBackColorAfterHit && this.hitColorCountDown <= 0){
                this.setColor([1,1,1,1]);
                this.changeBackColorAfterHit = false;
            }

        this.mesh.p.x = this.p.x;
        this.mesh.p.y = this.p.y;
        this.mesh.p.z = this.p.z;
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

    render(gl,shaderprogram,pm,darkness){
        let c = null;
        if (this.colorChanged){
            c = [this.color, this.color, this.color, this.color];
            this.colorChanged = false;
        }
        if (this.frameChanged){
            this.mesh.render(gl,shaderprogram,pm,this.texture.texture, darkness, this.texture.getUVs(),c);
            this.frameChanged = false;
        }else{
            this.mesh.render(gl,shaderprogram,pm,this.texture.texture,darkness,null,c);
        }
    }
}
export default Sprite;