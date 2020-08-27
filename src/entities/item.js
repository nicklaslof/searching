import LevelRender from "../level/levelrender.js";
import Mesh from "../gl/mesh.js";
import * as quaternion from "../gl/quaternion.js";
class Item{
    constructor(name, x,y,z,texture,gl) {
        this.texture = texture;
        this.position = {x,y,z};
        this.rotation = {x,y,z};
        this.name = name;
        this.color = [1,1,1,1];
        this.light = [0,0,0,1];
        
        let s = 0.5;
        let v = [];
        let c = [];
        let u = [];
        let l = [];      

        this.texture.getUVs().forEach(uv => { u.push(uv); });
        v.push(
            0.75-s,0-s,0+s,
            0.75+s,0-s,0+s,
            0.75+s,0+s,0+s,
            0.75-s,0+s,0+s);
        c.push(this.color,this.color,this.color,this.color);
        l.push(this.light,this.light,this.light,this.light);

        this.mesh = new Mesh(gl,x,y,z);
        this.mesh.addVerticies(v,c,u,l);
        this.mesh.updateMesh();
    }

    tick(deltaTime, level){

    }
    renderPlayerAttack(pos,scale){     
        this.setPosition(pos.x,pos.y+0.22,pos.z);
        this.setRotations(-0.8,-0.4,0.1)
        this.mesh.setScale(scale);
    }

    renderPlayerHolding(pos,scale){
        this.setPosition(pos.x,pos.y+0.15,pos.z);
        this.setRotations(-0.1,-0,0.3);
        this.mesh.setScale(scale);
    }

    setPosition(x,y,z){
        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;
    }
    setRotations(x,y,z){
        let cq = LevelRender.camera.getQuaternion();
        let q =[cq[0], cq[1], cq[2], cq[3]];
        quaternion.rotateZ(q,q,z);
        quaternion.rotateY(q,q,y);
        quaternion.rotateX(q,q,x);
        this.mesh.setQuaternion(q);
    }

    render(gl,shaderprogram,pm,vm){

        this.mesh.render(gl,shaderprogram,pm,vm,this.texture.texture);
    }
}
export default Item