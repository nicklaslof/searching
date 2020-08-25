import LevelRender from "./levelrender.js";
import Tiles from "../tiles/tiles.js";
import Player from "../entities/player.js";
import Billboardsprite from "../entities/billboardsprite.js";
import Bat from "../entities/bat.js";
import Bars from "../entities/bars.js";
import Tile from "../tiles/tile.js";
import CollisionTile from "./collisiontile.js";
import Dagger from "../entities/dagger.js";
import ItemSprite from "../entities/itemsprite.js";
import FloorTrigger from "../entities/floortrigger.js";

class Level{
    constructor(gl,shaderprogram,levelname) {
        this.levelrender = new LevelRender(gl,shaderprogram);
        new Tiles();
        this.gl = gl;
        this.tiles = new Array(64*64);
        this.tiles.fill(Tiles.airtile);

        this.collisionTiles = new Array(64*64);
        for (let x = 0; x < 64; x++){
            for (let z = 0; z < 64; z++){
                this.collisionTiles[x + (z*64)] = new CollisionTile(x,z);
            }
        }

        this.entities = new Array();
        this.items = new Array();
        this.read(levelname,() => {
            this.parse();
        });

        this.text = "darkness! it is so dark in here"
        this.player = null;
        this.displayMessageCounter = 0;
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
                    var alpha = (c >> 24 )& 0xff;
                    //console.log(alpha);
                    if (c == 0xffffffff)level.tiles[ x + (z*64)] = Tiles.walltile;
                    if (c == 0xff333324)level.tiles[ x + (z*64)] = Tiles.stoneWallTile;
                    if (c == 0xff444424)level.tiles[ x + (z*64)] = Tiles.grassyStoneWallTile;
                    if (c == 0xff00ff00){
                        level.player = new Player(x,0,z);
                       // let dagger = new Dagger(0,0,0,level.gl);
                        //level.player.addItem(dagger);
                        level.entities.push(level.player);
                    }
                    if (c == 0xff00aa00){
                        if (Math.random()< 0.5) level.entities.push(new Billboardsprite("grass", x,Math.random()/0.95,z,LevelRender.roofGrass,level.gl));
                        else level.entities.push(new Billboardsprite("grass",x,Math.min(0,-0.1+Math.random()/0.95),z,LevelRender.floorGrass,level.gl));
                        
                    }
                    
                   
                    
                    if (c == 0xff202020)level.entities.push(new Bat(x,0.2,z,level.gl));

                    if (c == 0xff808080)level.entities.push(new ItemSprite(new Dagger(x,0,z,level.gl,0.3),x,0,z,LevelRender.dagger,level.gl));

                    if (c == 0xfeaaaaaa){
                        level.entities.push(new Bars(x,0,z,level.gl,alpha));
                        level.tiles[ x + (z*64)] = new Tile();
                    }

                    if (c == 0xfeffffff){
                        level.entities.push(new FloorTrigger(x,0,z,level.gl,alpha));
                    }
                }
            }
            done();
        }
    }

    addEntity(entity){
        this.entities.push(entity);
    }

    parse(){
        let wr = this.levelrender.start();
        let fr = this.levelrender.start();   
        let rr = this.levelrender.start();       
        for (let x = 0; x < 64; x++) {
            for (let z = 0; z < 64; z++) {
                var tile = this.tiles[x + (z * 64)];
                if (tile == Tiles.walltile || tile == Tiles.stoneWallTile || tile == Tiles.grassyStoneWallTile){
                    let f = !this.getTile(x,z+1).c(tile);
                    let b = !this.getTile(x,z-1).c(tile);
                    let l = !this.getTile(x-1,z).c(tile);
                    let r = !this.getTile(x+1,z).c(tile);
                    if (l) this.levelrender.left(tile,wr,x,0,z);
                    if (r) this.levelrender.right(tile,wr,x,0,z);
                    if (f) this.levelrender.front(tile,wr,x,0,z);
                    if (b) this.levelrender.back(tile,wr,x,0,z);
                    
                }else{
                    if (x < 16 && z < 16){
                        this.levelrender.floor(LevelRender.grassGround, fr,x,-1,z);
                        this.levelrender.roof(LevelRender.dirt,rr,x,2,z);
                    }else{
                        this.levelrender.floor(LevelRender.floor, fr,x,-1,z);
                        this.levelrender.roof(LevelRender.dirt,rr,x,2,z);
                    }
                    

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

    addTile(x,z, tile){
        this.tiles[x + (z*64)] = tile;
    }

    removeTile(x,z){
        console.log("Removing "+x+" "+z);
        this.tiles[x + (z*64)] = Tiles.airtile;
    }

    getCollisionTile(x,z){
        return this.collisionTiles[x + (z*64)];
    }

    getUIText(){
        return this.text;
    }

    trigger(triggerId,source){
        this.entities.forEach(entity => {
            if (entity.triggerId !=null && entity.triggerId == triggerId){
                entity.trigger(this, source);
            }
        });
    }

    untrigger(triggerId,source){
        this.entities.forEach(entity => {
            if (entity.triggerId !=null && entity.triggerId == triggerId){
                entity.untrigger(this, source);
            }
        });
    }

    displayMessage(text,timeToShow){
        this.text = text;
        this.displayMessageCounter = timeToShow;
    }

    removeEntity(entity){
        for(var i = this.entities.length - 1; i >= 0; i--) {
            if(this.entities[i] === entity) {
                this.entities.splice(i, 1);
            }
        }
    }

    tick(deltaTime){
        if (this.displayMessageCounter > 0){
            this.displayMessageCounter -=deltaTime;
        }

        if (this.displayMessageCounter <= 0){
            this.text = "";
        }

        this.entities.forEach(entity => {
            entity.tick(deltaTime,this);
        });

        this.items.forEach(item => {
            item.tick(deltaTime,this,true);
        });
    }
    render(){
        this.levelrender.render();
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.entities.forEach(entity => {
            this.levelrender.renderEntity(entity);
        });
        this.items.forEach(item => {
            this.levelrender.renderItem(item);
        });

        if (this.player != null && this.player.item != null){
            this.levelrender.renderEntity(this.player.item);
        }
    }
}
export default Level