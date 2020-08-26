import Entity from "./entity.js";
import Mesh from "../gl/mesh.js";
class Sprite extends Entity{
    constructor(name, x,y,z,texture,gl, health, triggerId){
        super(name, x,y,z, health, triggerId);
        if (texture instanceof Array){
            this.animated = true;
            this.numberOfFrames = texture.length;
            this.texture = texture[0];
            this.textureAnimation = texture;
            console.log(this.numberOfFrames);
            this.currentFrame = 0;
            this.frameCounter = 0;


        }else{
            this.texture = texture;
            this.animated = false;
        }

        this.color = [1,1,1,1];
        this.hitColorCountDown = 0;
        this.changeBackColorAfterHit = false;
        
        let s = 0.5;
        let v = [];
        let c = [];
        let u = [];        

        this.texture.getUVs().forEach(uv => { u.push(uv); });
        v.push(
            0-s,0-s,0+s,
            0+s,0-s,0+s,
            0+s,0+s,0+s,
            0-s,0+s,0+s);
        c.push(this.color, this.color, this.color, this.color);

        this.mesh = new Mesh(gl,x,y,z);
        this.mesh.addVerticies(v,c,u);
        this.mesh.updateMesh();
    }

    setColor(color){
        this.color = color;
        this.colorChanged = true;
    }

    setScale(scale){
        this.mesh.setScale(scale);
        return this;
    }

    hit(hitByEntity, amount){
        if (this.hitCounter>= 0.3){
            this.setColor([1,0,0,1]);
            this.hitColorCountDown = 0.5;
            this.changeBackColorAfterHit = true;

        }
        super.hit(hitByEntity,amount);
    }

    tick(deltatime,level){
        super.tick(deltatime,level);
            if (this.changeBackColorAfterHit && this.hitColorCountDown > 0) this.hitColorCountDown -= deltatime;
            if (this.changeBackColorAfterHit && this.hitColorCountDown <= 0){
                this.setColor([1,1,1,1]);
                this.changeBackColorAfterHit = false;
            }

        this.mesh.position.x = this.position.x;
        this.mesh.position.y = this.position.y;
        this.mesh.position.z = this.position.z;
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

    render(gl,shaderprogram,pm,vm){
        let c = null;
        if (this.colorChanged){
            c = [this.color, this.color, this.color, this.color];
            this.colorChanged = false;
        }
        if (this.frameChanged){
            this.mesh.render(gl,shaderprogram,pm,vm,this.texture.texture, this.texture.getUVs(),c);
            this.frameChanged = false;
        }else{
            this.mesh.render(gl,shaderprogram,pm,vm,this.texture.texture,null,c);
        }
    }
}
export default Sprite;