import Entity from "./entity.js";
import Mesh from "../gl/mesh.js";
class Sprite extends Entity{
    constructor(name, x,y,z,texture,gl, health){
        super(name, x,y,z, health);
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
        
        let s = 0.5;
        let v = [];
        let c = [];
        let u = [];        

        this.texture.getUVs().forEach(uv => { u.push(uv); });
        v.push(
            [0-s,0-s,0+s],
            [0+s,0-s,0+s],
            [0+s,0+s,0+s],
            [0-s,0+s,0+s]);
        c.push([1,1,1,1.0],[1,1,1,1.0],[1,1,1,1.0],[1,1,1,1.0]);

        this.mesh = new Mesh(gl,x,y,z);
        this.mesh.addVerticies(v,c,u);
        this.mesh.updateMesh();
    }

    tick(deltatime,level){
        super.tick(deltatime,level);
        this.mesh.position.x = this.position.x;
        this.mesh.position.y = this.position.y;
        this.mesh.position.z = this.position.z;
        if (this.animated){
            this.frameCounter += deltatime;
            if (this.frameCounter >= 0.016*5){
                this.frameChanged = true;
                this.currentFrame++;
                if (this.currentFrame > this.numberOfFrames-1) this.currentFrame = 0;
                this.texture = this.textureAnimation[this.currentFrame];
                this.frameCounter = 0;
            }
        }

    }

    render(gl,shaderprogram,pm,vm){
        if (this.frameChanged){
            this.mesh.render(gl,shaderprogram,pm,vm,this.texture.texture, this.texture.getUVs());
            this.frameChanged = false;
        }else{
            this.mesh.render(gl,shaderprogram,pm,vm,this.texture.texture);
        }
        
    }
}
export default Sprite;