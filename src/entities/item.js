import Mesh from "../gl/mesh.js";
class Item{
    constructor(name, x,y,z,texture,gl) {
        this.texture = texture;
        this.position = {x,y,z};
        this.rotation = {x,y,z};
        this.name = name;
        this.color = [1,1,1,1];
        
        let s = 0.5;
        let v = [];
        let c = [];
        let u = [];        

        this.texture.getUVs().forEach(uv => { u.push(uv); });
        v.push(
            0.75-s,0-s,0+s,
            0.75+s,0-s,0+s,
            0.75+s,0+s,0+s,
            0.75-s,0+s,0+s);
        c.push(this.color,this.color,this.color,this.color);

        this.mesh = new Mesh(gl,x,y,z);
        this.mesh.addVerticies(v,c,u);
        this.mesh.updateMesh();
    }

    tick(deltaTime, level){

    }

    render(gl,shaderprogram,pm,vm){

        this.mesh.render(gl,shaderprogram,pm,vm,this.texture.texture);
    }
}
export default Item