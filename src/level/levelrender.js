import Camera from "../gl/camera.js"
import GLTexture from "../gl/gltexture.js"
import Mesh from "../gl/mesh.js"
import Texture from "../gl/texture.js";
const s = 0.5;
class LevelRender{
    static camera;

    static stoneWall;
    static grassyStoneWall;
    static bricks;
    static dirt;
    static grassGround;
    static roofGrass;
    static floorGrass;
    static bat;
    static floor;
    static bars;
    static dagger;
    static floorTriggerActive;
    static floorTriggerNoActive;
    static pot;
    static aquamarine;

    constructor(gl,shaderprogram) {
        this.shaderprogram = shaderprogram;
        this.gl = gl;
        LevelRender.camera = new Camera(gl, 0,-0.2,0);
        LevelRender.camera.setRotation(180);
        this.atlas = new GLTexture(gl, "./assets/atlas.png");
        LevelRender.stoneWall = this.newAtlasTexture(16,64,16,16);
        LevelRender.grassyStoneWall = this.newAtlasTexture(16,96,16,16);
        LevelRender.bricks = this.newAtlasTexture(80,0,16,16);
        LevelRender.dirt = this.newAtlasTexture(80,64,16,16);
        LevelRender.grassGround = this.newAtlasTexture(48,64,16,16);
        LevelRender.roofGrass = this.newAtlasTexture(0,0,16,16);
        LevelRender.floorGrass = this.newAtlasTexture(32,0,16,16);
        LevelRender.floor = this.newAtlasTexture(96,0,16,16);
        LevelRender.bars = this.newAtlasTexture(80,16,16,16);
        LevelRender.floorTriggerNoActive = this.newAtlasTexture(48,20,6,6);
        LevelRender.floorTriggerActive = this.newAtlasTexture(55,20,6,6);
        LevelRender.pot = this.newAtlasTexture(32,32,16,16);
        LevelRender.aquamarine = this.newAtlasTexture(104,32,8,16);

        LevelRender.dagger = this.newAtlasTexture(96,32,8,16);

        LevelRender.bat = new Array();

        for (let i = 0; i < 2; i++) {
            LevelRender.bat.push(new Texture(this.atlas,16*i,32,16,16));
        }

        this.wallmeshes = [];
        this.roofMeshes = [];
        this.floorMeshes = [];
    }

    newAtlasTexture(x,y,w,h){
        return new Texture(this.atlas,x,y,w,h);
    }

    start(){
        let m = new Mesh(this.gl,0,0,0);
        let v = [];
        let c = [];
        let u = [];
        return {m,v,c,u};
    }
    endWall(r){
        //console.log(r);
        r.m.addVerticies(r.v, r.c, r.u);
        r.m.updateMesh();
        this.wallmeshes.push(r.m);
    }
    endRoof(r){
        //console.log(r);
        r.m.addVerticies(r.v, r.c, r.u);
        r.m.updateMesh();
        this.roofMeshes.push(r.m);
    }
    endFloor(r){
        //console.log(r);
        r.m.addVerticies(r.v, r.c, r.u);
        r.m.updateMesh();
        this.floorMeshes.push(r.m);
    }

    ac(colors){
        colors.push([1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1]);
    }

    roof(texture,render,x,y,z){
        this.ac(render.c);
        //render.u.push([0,0],[1,0],[1,1],[0,1]);
        texture.getUVs().forEach(uv => { render.u.push(uv); });
        render.v.push(
            x-s,y-s,z-s,
            x+s,y-s,z-s,
            x+s,y-s,z+s,
            x-s,y-s,z+s
        );
    }
    floor(texture,render,x,y,z){
        this.ac(render.c);
        //render.u.push([1,0],[0,0],[0,1],[1,1]);
        texture.getUVs().forEach(uv => { render.u.push(uv); });
        render.v.push(

            x-s,y+s,z-s,
            x-s,y+s,z+s,
            x+s,y+s,z+s,
            x+s,y+s,z-s
        ); 
    }

    left(tile,render,x,y,z){

        //render.u.push([0,1],[1,1],[1,0],[0,0]);
        //render.u.push(tile.getUVs());

        
        //console.log(tile.getUVs());
        for(let i = 0; i < 2; i++){
            this.ac(render.c);
            tile.getUVs().forEach(uv => { render.u.push(uv); });
            render.v.push(
                x-s,y+i-s,z-s,
                x-s,y+i-s,z+s,
                x-s,y+i+s,z+s,
                x-s,y+i+s,z-s
            );
        }
       
    }
    right(tile,render,x,y,z){
        for(let i = 0; i < 2; i++){
            this.ac(render.c);
            //render.u.push([1,1],[1,0],[0,0],[0,1]);
            //render.u.push(tile.getUVs());
            tile.getUVs().forEach(uv => { render.u.push(uv); });
            render.v.push(
                x+s,y+i-s,z-s,
                x+s,y+i+s,z-s,
                x+s,y+i+s,z+s,
                x+s,y+i-s,z+s
            );
        }
    }
    front(tile,render,x,y,z){
        for(let i = 0; i < 2; i++){
            this.ac(render.c);
            //render.u.push([1,1],[0,1],[0,0],[1,0]);
            //render.u.push(tile.getUVs());
            tile.getUVs().forEach(uv => { render.u.push(uv); });
            render.v.push(
                x-s,y+i-s,z+s,
                x+s,y+i-s,z+s,
                x+s,y+i+s,z+s,
                x-s,y+i+s,z+s
            );
        }
    }
    back(tile,render,x,y,z){
        for(let i = 0; i < 2; i++){
            this.ac(render.c);
            //render.u.push([1,1],[1,0],[0,0],[0,1]);
            //render.u.push(tile.getUVs());
            tile.getUVs().forEach(uv => { render.u.push(uv); });
            render.v.push(
                x-s,y+i-s,z-s,
                x-s,y+i+s,z-s,
                x+s,y+i+s,z-s,
                x+s,y+i-s,z-s
            );
        }
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

    renderItem(item){
        item.render(this.gl, this.shaderprogram, LevelRender.camera.pm, LevelRender.camera.vm, this.floorTexture,true);
    }
}
export default LevelRender