import Camera from "../gl/camera.js"
import GLTexture from "../gl/gltexture.js"
import Texture from "../gl/texture.js";
const s = 0.5;
class LevelRender{
    static camera;
    static darkness;

    static stoneWall;
    static grassyStoneWall;
    static dirt;
    static grassGround;
    static bat;
    static floor;
    static bars;
    static dagger;
    static floorTriggerActive;
    static floorTriggerNoActive;
    static pot;
    static apple;
    static lava;
    static projectile;
    constructor(gl,shaderprogram) {
        this.shaderprogram = shaderprogram;
        this.gl = gl;
        LevelRender.camera = new Camera(gl);
        LevelRender.camera.setRotation(180);
        this.atlas = new GLTexture(gl, "a.png");
        LevelRender.stoneWall = this.newAtlasTexture(16,16,16,16);
        LevelRender.grassyStoneWall = this.newAtlasTexture(16,48,16,16);
        LevelRender.dirt = this.newAtlasTexture(3,35,10,10);
        LevelRender.grassGround = this.newAtlasTexture(48,16,16,16);
        LevelRender.floor = this.newAtlasTexture(0,32,16,16);
        LevelRender.bars = this.newAtlasTexture(32,32,15,15);
        LevelRender.floorTriggerNoActive = this.newAtlasTexture(0,20,6,6);
        LevelRender.floorTriggerActive = this.newAtlasTexture(7,20,6,6);
        LevelRender.pot = this.newAtlasTexture(32,0,15,15);
        LevelRender.apple = this.newAtlasTexture(1,49,12,13);
        LevelRender.lava = this.newAtlasTexture(1,28,1,1);
        LevelRender.projectile = this.newAtlasTexture(0,27,5,5);

        LevelRender.dagger = this.newAtlasTexture(34,17,12,14);
        LevelRender.wand = this.newAtlasTexture(18,34,13,12);

        LevelRender.bat = new Array();

        for (let i = 0; i < 2; i++) {
            LevelRender.bat.push(new Texture(this.atlas,16*i,0,16,14,65,65));
        }

        this.wallmeshes = [];
        this.roofMeshes = [];
        this.floorMeshes = [];
        LevelRender.darkness = 18;
    }

    newAtlasTexture(x,y,w,h){
        return new Texture(this.atlas,x,y,w,h,65,65);
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