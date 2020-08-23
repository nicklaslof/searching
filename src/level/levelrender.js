import Camera from "../gl/camera.js"
import GLTexture from "../gl/gltexture.js"
import Mesh from "../gl/mesh.js"
import Texture from "../gl/texture.js";
const s = 0.5;
class LevelRender{
    static camera;

    static stoneWall;
    static dirt;
    static grassGround;
    static roofGrass;
    static floorGrass;
    static bat;

    constructor(gl,shaderprogram) {
        this.shaderprogram = shaderprogram;
        this.gl = gl;
        LevelRender.camera = new Camera(gl, 0,-0.2,0);
        LevelRender.camera.setRotation(180);
        this.atlas = new GLTexture(gl, "./assets/atlas.png");
        LevelRender.stoneWall = new Texture(this.atlas,0,0,16,16);
        LevelRender.dirt = new Texture(this.atlas,32,0,16,16);
        LevelRender.grassGround = new Texture(this.atlas,16,0,16,16);
        LevelRender.roofGrass = new Texture(this.atlas,48,0,16,16);
        LevelRender.floorGrass = new Texture(this.atlas,64,0,16,16);
        LevelRender.bat = new Array();

        for (let i = 0; i < 5; i++) {
            LevelRender.bat.push(new Texture(this.atlas,16*i,32,16,16));
        }

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

    roof(texture,render,x,y,z){
        this.ac(render.c);
        //render.u.push([0,0],[1,0],[1,1],[0,1]);
        texture.getUVs().forEach(uv => { render.u.push(uv); });
        render.v.push(
            [x-s,y-s,z-s],
            [x+s,y-s,z-s],
            [x+s,y-s,z+s],
            [x-s,y-s,z+s]
        );
    }
    floor(texture,render,x,y,z){
        this.ac(render.c);
        //render.u.push([1,0],[0,0],[0,1],[1,1]);
        texture.getUVs().forEach(uv => { render.u.push(uv); });
        render.v.push(

            [x-s,y+s,z-s],
            [x-s,y+s,z+s],
            [x+s,y+s,z+s],
            [x+s,y+s,z-s]
        ); 
    }

    left(tile,render,x,y,z){
        this.ac(render.c);
        //render.u.push([0,1],[1,1],[1,0],[0,0]);
        //render.u.push(tile.getUVs());

        tile.getUVs().forEach(uv => { render.u.push(uv); });
        //console.log(tile.getUVs());
        render.v.push(
            [x-s,y-s,z-s],
            [x-s,y-s,z+s],
            [x-s,y+s,z+s],
            [x-s,y+s,z-s]
        );
    }
    right(tile,render,x,y,z){
        this.ac(render.c);
        //render.u.push([1,1],[1,0],[0,0],[0,1]);
        //render.u.push(tile.getUVs());
        tile.getUVs().forEach(uv => { render.u.push(uv); });
        render.v.push(
            [x+s,y-s,z-s],
            [x+s,y+s,z-s],
            [x+s,y+s,z+s],
            [x+s,y-s,z+s]
        );
    }
    front(tile,render,x,y,z){
        this.ac(render.c);
        //render.u.push([1,1],[0,1],[0,0],[1,0]);
        //render.u.push(tile.getUVs());
        tile.getUVs().forEach(uv => { render.u.push(uv); });
        render.v.push(
            [x-s,y-s,z+s],
            [x+s,y-s,z+s],
            [x+s,y+s,z+s],
            [x-s,y+s,z+s]
        );
    }
    back(tile,render,x,y,z){
        this.ac(render.c);
        //render.u.push([1,1],[1,0],[0,0],[0,1]);
        //render.u.push(tile.getUVs());
        tile.getUVs().forEach(uv => { render.u.push(uv); });
        render.v.push(
            [x-s,y-s,z-s],
            [x-s,y+s,z-s],
            [x+s,y+s,z-s],
            [x+s,y-s,z-s]
        );
    }

    tick(deltaTime){
    }

    render(){
        this.wallmeshes.forEach(mesh =>{
            mesh.render(this.gl,this.shaderprogram,LevelRender.camera.pm, LevelRender.camera.vm, this.atlas);
        });
        this.roofMeshes.forEach(mesh =>{
            mesh.render(this.gl,this.shaderprogram,LevelRender.camera.pm, LevelRender.camera.vm,this.atlas);
        });
        this.floorMeshes.forEach(mesh =>{
            mesh.render(this.gl,this.shaderprogram,LevelRender.camera.pm, LevelRender.camera.vm,this.atlas);
        });
    }

    renderEntity(entity){
        entity.render(this.gl, this.shaderprogram, LevelRender.camera.pm, LevelRender.camera.vm, this.floorTexture);
    }
}
export default LevelRender