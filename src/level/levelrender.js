import Camera from "../gl/camera.js"
import Texture from "../gl/texture.js"
import Mesh from "../gl/mesh.js"
const s = 0.5;
class LevelRender{
    static camera;
    static wallTexture;
    static floorTexture;
    static roofTexture;
    static batTexture;
    constructor(gl,shaderprogram) {
        this.shaderprogram = shaderprogram;
        this.gl = gl;
        LevelRender.camera = new Camera(gl, 0,-0.2,0);
        LevelRender.wallTexture = new Texture(gl, "./assets/bricks.png");
        LevelRender.floorTexture = new Texture(gl, "./assets/floor.png");
        LevelRender.roofTexture = new Texture(gl, "./assets/roof.png");
        LevelRender.batTexture = new Texture(gl, "./assets/bat.png");

        this.wallmeshes = [];
        this.roofMeshes = [];
        this.floorMeshes = [];


    }

    start(){
        let m = new Mesh(this.gl,0,0,0);
        let v = [];
        let c = [];
        let u = [];
        return {m,v,c,u};
    }
    endWall(r){
        console.log(r);
        r.m.addVerticies(r.v, r.c, r.u);
        r.m.updateMesh();
        this.wallmeshes.push(r.m);
    }
    endRoof(r){
        console.log(r);
        r.m.addVerticies(r.v, r.c, r.u);
        r.m.updateMesh();
        this.roofMeshes.push(r.m);
    }
    endFloor(r){
        console.log(r);
        r.m.addVerticies(r.v, r.c, r.u);
        r.m.updateMesh();
        this.floorMeshes.push(r.m);
    }

    ac(colors){
        colors.push([1,1,1,1.0],[1,1,1,1.0],[1,1,1,1.0],[1,1,1,1.0]);
    }

    roof(render,x,y,z){
        this.ac(render.c);
        render.u.push([0,0],[1,0],[1,1],[0,1]);
        render.v.push(
            [x-s,y-s,z-s],
            [x+s,y-s,z-s],
            [x+s,y-s,z+s],
            [x-s,y-s,z+s]
        );
    }
    floor(render,x,y,z){
        this.ac(render.c);
        render.u.push([1,0],[0,0],[0,1],[1,1]);
        render.v.push(

            [x-s,y+s,z-s],
            [x-s,y+s,z+s],
            [x+s,y+s,z+s],
            [x+s,y+s,z-s]
        ); 
    }

    left(render,x,y,z){
        this.ac(render.c);
        render.u.push([0,1],[1,1],[1,0],[0,0]);
        render.v.push(
            [x-s,y-s,z-s],
            [x-s,y-s,z+s],
            [x-s,y+s,z+s],
            [x-s,y+s,z-s]
        );
    }
    right(render,x,y,z){
        this.ac(render.c);
        render.u.push([1,1],[1,0],[0,0],[0,1]);
        render.v.push(
            [x+s,y-s,z-s],
            [x+s,y+s,z-s],
            [x+s,y+s,z+s],
            [x+s,y-s,z+s]
        );
    }
    front(render,x,y,z){
        this.ac(render.c);
        render.u.push([1,1],[0,1],[0,0],[1,0]);
        render.v.push(
            [x-s,y-s,z+s],
            [x+s,y-s,z+s],
            [x+s,y+s,z+s],
            [x-s,y+s,z+s]
        );
    }
    back(render,x,y,z){
        this.ac(render.c);
        render.u.push([1,1],[1,0],[0,0],[0,1]);
        render.v.push(
            [x-s,y-s,z-s],
            [x-s,y+s,z-s],
            [x+s,y+s,z-s],
            [x+s,y-s,z-s]
        );
    }

    tick(deltaTime){
        //this.mesh.setQuaternion(LevelRender.camera.getQuaternion());
    }

    render(){
        this.wallmeshes.forEach(mesh =>{
            mesh.render(this.gl,this.shaderprogram,LevelRender.camera.pm, LevelRender.camera.vm, LevelRender.wallTexture);
        });
        this.roofMeshes.forEach(mesh =>{
            mesh.render(this.gl,this.shaderprogram,LevelRender.camera.pm, LevelRender.camera.vm,LevelRender.roofTexture);
        });
        this.floorMeshes.forEach(mesh =>{
            mesh.render(this.gl,this.shaderprogram,LevelRender.camera.pm, LevelRender.camera.vm,LevelRender.floorTexture);
        });

        //this.mesh.render(this.gl,this.shaderprogram,LevelRender.camera.pm, LevelRender.camera.vm,this.floorTexture);
    }

    renderEntity(entity){
        entity.render(this.gl, this.shaderprogram, LevelRender.camera.pm, LevelRender.camera.vm, this.floorTexture);
    }
}

export default LevelRender