import LevelRender from "../level/levelrender.js";
import MeshBuilder from "../gl/meshbuilder.js";
import * as quaternion from "../gl/quaternion.js";
class Item{
    constructor(n, x,y,z,texture,gl) {
        this.texture = texture;
        this.p = {x,y,z};
        this.rotation = {x,y,z};
        this.n = n;
        this.color = [1,1,1,1];
        this.light = 0.5;
        
        let r = MeshBuilder.start(gl,x,y,z);
        MeshBuilder.front(this.texture.getUVs(),r,0.75,0,0,this.light,1);
        this.mesh = MeshBuilder.build(r);
    }
    renderPlayerAttack(pos,scale){     
        this.setPos(pos.x,pos.y+0.22,pos.z);
        this.setRotations(-0.8,-0.4,0.1)
        this.mesh.setS(scale);
    }

    renderPlayerHolding(pos,scale){
        this.setPos(pos.x,pos.y+0.15,pos.z);
        this.setRotations(-0.1,-0,0.3);
        this.mesh.setS(scale);
    }

    setPos(x,y,z){
        this.mesh.p.x = x;
        this.mesh.p.y = y;
        this.mesh.p.z = z;
    }
    setRotations(x,y,z){
        let cq = LevelRender.camera.getQuaternion();
        let q =[cq[0], cq[1], cq[2], cq[3]];
        quaternion.rotateZ(q,q,z);
        quaternion.rotateY(q,q,y);
        quaternion.rotateX(q,q,x);
        this.mesh.setQuaternion(q);
    }
    use(level, entity){

    }

    render(gl,shaderprogram,pm,darkness){

        this.mesh.render(gl,shaderprogram,pm,this.texture.texture,darkness);
    }
}
export default Item