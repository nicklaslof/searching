import LevelRender from "./levelrender.js";
import WallTile from "../tiles/walltile.js";
import Tiles from "../tiles/tiles.js";
import Player from "../entities/player.js";
import Mesh from "../gl/mesh.js";
import Billboardsprite from "../entities/billboardsprite.js";
import Bat from "../entities/bat.js";

class Level{
    constructor(gl,shaderprogram,levelname) {
        this.levelrender = new LevelRender(gl,shaderprogram);
        new Tiles();
        this.gl = gl;
        this.tiles = new Array(64*64);
        this.tiles.fill(Tiles.airtile);
        this.entities = new Array();


        this.read(levelname,() => {
            this.parse();
        });

 
       
    }

    read(levelname,done){
        var canvas = document.createElement( 'canvas' );
        canvas.width = 64;
        canvas.height = 64;

        var context = canvas.getContext( '2d' );
        var img = new Image();
        img.src="assets/"+levelname+".png";

        var level = this;
        img.onload = function() {
            context.drawImage(img,0,0);
            for (let x = 0; x < 64; x++) {
                for (let z = 0; z < 64; z++) {
                    var c = new Uint32Array(context.getImageData(x, z, 1, 1).data.buffer);
                    if (c == 0xffffffff)level.tiles[ x + (z*64)] = new WallTile();
                    if (c == 0xff00ff00)level.entities.push(new Player(x,0,z));
                    if (c == 0xff00aa00){
                        if (Math.random()< 0.5) level.entities.push(new Billboardsprite(x,Math.random()/0.95,z,LevelRender.roofGrassTexture,level.gl));
                        else level.entities.push(new Billboardsprite(x,Math.min(0,-0.1+Math.random()/0.95),z,LevelRender.grassTexture,level.gl));
                        
                    }
                    //if (c == 0xff00ffff)level.entities.push(new Torch(x,0.10,z,scene));
                    
                    if (c == 0xff202020)level.entities.push(new Bat(x,0.2,z,level.gl));
                }
            }
            done();
        }
    }

    parse(){
        let wr = this.levelrender.start();
        let fr = this.levelrender.start();   
        let rr = this.levelrender.start();       
        for (let x = 0; x < 64; x++) {
            for (let z = 0; z < 64; z++) {
                var tile = this.tiles[x + (z * 64)];
                if (tile != Tiles.airtile){
                    let f = this.getTile(x,z+1) == Tiles.airtile;
                    let b = this.getTile(x,z-1) == Tiles.airtile;
                    let l = this.getTile(x-1,z) == Tiles.airtile;
                    let r = this.getTile(x+1,z) == Tiles.airtile;
                    if (l) this.levelrender.left(wr,x,0,z);
                    if (r) this.levelrender.right(wr,x,0,z);
                    if (f) this.levelrender.front(wr,x,0,z);
                    if (b) this.levelrender.back(wr,x,0,z);
                    
                }else{
                    this.levelrender.floor(fr,x,-1,z);
                    this.levelrender.roof(rr,x,1,z);
                }
            }
        }
        this.levelrender.endWall(wr);
        this.levelrender.endRoof(rr);
        this.levelrender.endFloor(fr);
    }

    getTile(x,z){
        var tile = this.tiles[x + (z*64)];
        if (tile == null) return Tiles.airtile;
        return tile;
    }

    tick(deltaTime){
        this.levelrender.tick(deltaTime);
        this.entities.forEach(entity => {
            entity.tick(deltaTime,this);
        });
    }
    render(){
        this.levelrender.render();
        this.entities.forEach(entity => {
            this.levelrender.renderEntity(entity);
        });
    }
}
export default Level