import LevelRender from "../level/levelrender.js";
import Item from "./item.js";
import * as quaternion from "../gl/quaternion.js";
class Dagger extends Item{
    constructor(x,y,z,gl,onGroundScale) {
        super("dagger",x,y,z,LevelRender.dagger,gl);
        this.onGroundScale = onGroundScale;
    }

    renderPlayerAttack(pos,scale){     
        this.setPosition(pos.x,pos.y+0.08,pos.z);
        this.setRotations(-0.8,-0.4,0.1)
        this.mesh.setScale(scale);
    }

    renderPlayerHolding(pos,scale){
        this.setPosition(pos.x,pos.y+0.05,pos.z);
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
}
export default Dagger;