import Entity from "./entity.js";
import Mesh from "../gl/mesh.js";
class Sprite extends Entity{
    constructor(x,y,z,tex,gl){
        super(x,y,z);
        this.tex = tex;
        let s = 0.5;
        let v = [];
        let c = [];
        let u = [];

        u.push([1,1],[0,1],[0,0],[1,0]);
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
        this.position.x = this.mesh.position.x;
        this.position.y = this.mesh.position.y;
        this.position.z = this.mesh.position.z;
    }

    render(gl,shaderprogram,pm,vm){
        this.mesh.render(gl,shaderprogram,pm,vm,this.tex);
    }
}
export default Sprite;