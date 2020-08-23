import LevelRender from "./levelrender.js";;
import Tiles from "../tiles/tiles.js";
import Player from "../entities/player.js";
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
                    if (c == 0xffffffff)level.tiles[ x + (z*64)] = Tiles.walltile;
                    if (c == 0xff00ff00)level.entities.push(new Player(x,0,z));
                    if (c == 0xff00aa00){
                        if (Math.random()< 0.5) level.entities.push(new Billboardsprite(x,Math.random()/0.95,z,LevelRender.roofGrass,level.gl));
                        else level.entities.push(new Billboardsprite(x,Math.min(0,-0.1+Math.random()/0.95),z,LevelRender.floorGrass,level.gl));
                        
                    }
                    /*
                    if (c == 0xffaaaaaa){
                        level.entities.push(new Bars(x,0,z,level.gl));
                        level.tiles[ x + (z*64)] = new Tile();
                    }
                    */
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
                if (tile == Tiles.walltile){
                    let f = !this.getTile(x,z+1).c(tile);
                    let b = !this.getTile(x,z-1).c(tile);
                    let l = !this.getTile(x-1,z).c(tile);
                    let r = !this.getTile(x+1,z).c(tile);
                    if (l) this.levelrender.left(tile,wr,x,0,z);
                    if (r) this.levelrender.right(tile,wr,x,0,z);
                    if (f) this.levelrender.front(tile,wr,x,0,z);
                    if (b) this.levelrender.back(tile,wr,x,0,z);
                    
                }else{
                    this.levelrender.floor(LevelRender.grassGround, fr,x,-1,z);
                    this.levelrender.roof(LevelRender.dirt,rr,x,1,z);
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
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.entities.forEach(entity => {
            this.levelrender.renderEntity(entity);
        });
    }
}
export default Level