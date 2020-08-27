import Camera from "../gl/camera.js"
import GLTexture from "../gl/gltexture.js"
import Mesh from "../gl/mesh.js"
import Texture from "../gl/texture.js";
const s = 0.5;
class LevelRender{
    static camera;
    static darkness;

    static stoneWall;
    static grassyStoneWall;
    static bricks;
    static dirt;
    static grassGround;
    static bat;
    static floor;
    static bars;
    static dagger;
    static floorTriggerActive;
    static floorTriggerNoActive;
    static pot;
    static aquamarine;
    static apple;
    static torch;

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
        LevelRender.floor = this.newAtlasTexture(96,0,16,16);
        LevelRender.bars = this.newAtlasTexture(80,16,16,16);
        LevelRender.floorTriggerNoActive = this.newAtlasTexture(48,20,6,6);
        LevelRender.floorTriggerActive = this.newAtlasTexture(55,20,6,6);
        LevelRender.pot = this.newAtlasTexture(32,32,16,16);
        LevelRender.aquamarine = this.newAtlasTexture(104,32,8,16);
        LevelRender.apple = this.newAtlasTexture(72,38,8,10);
        LevelRender.torch = this.newAtlasTexture(84,32,8,16);

        LevelRender.dagger = this.newAtlasTexture(96,32,8,16);

        LevelRender.bat = new Array();

        for (let i = 0; i < 2; i++) {
            LevelRender.bat.push(new Texture(this.atlas,16*i,32,16,16));
        }

        this.wallmeshes = [];
        this.roofMeshes = [];
        this.floorMeshes = [];
        LevelRender.darkness = 7;
    }

    newAtlasTexture(x,y,w,h){
        return new Texture(this.atlas,x,y,w,h);
    }

    render(){
        this.wallmeshes.forEach(mesh =>{
            mesh.render(this.gl,this.shaderprogram,LevelRender.camera.pm, this.atlas,LevelRender.darkness);
        });
        this.roofMeshes.forEach(mesh =>{
            mesh.render(this.gl,this.shaderprogram,LevelRender.camera.pm,this.atlas,LevelRender.darkness);
        });
        this.floorMeshes.forEach(mesh =>{
            mesh.render(this.gl,this.shaderprogram,LevelRender.camera.pm,this.atlas,LevelRender.darkness);
        });
        
    }

    renderEntity(entity){
        entity.render(this.gl, this.shaderprogram, LevelRender.camera.pm,LevelRender.darkness);
    }

    renderItem(item){
        item.render(this.gl, this.shaderprogram, LevelRender.camera.pm,LevelRender.darkness, true);
    }
}
export default LevelRender