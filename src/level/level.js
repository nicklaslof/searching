import LevelRender from "./levelrender.js";
import Tiles from "../tiles/tiles.js";
import Player from "../entities/player.js";
import Bat from "../entities/bat.js";
import Bars from "../entities/bars.js";
import Tile from "../tiles/tile.js";
import CollisionTile from "./collisiontile.js";
import Dagger from "../entities/dagger.js";
import ItemSprite from "../entities/itemsprite.js";
import FloorTrigger from "../entities/floortrigger.js";
import Pot from "../entities/pot.js";
import Apple from "../entities/apple.js";
import Box from "../entities/box.js";
import MeshBuilder from "../gl/meshbuilder.js";
import AppareringFloor from "../entities/appareringfloor.js";

const maxLight = 2;
class Level{
    constructor(gl,shaderprogram) {
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
        this.lightmap = new Array(64*64);
        this.lightmap.fill(0);

        this.e = new Array();
        this.i = new Array();
        this.read(() => {
            this.parse();
        });

        this.t = "";
        this.t2 = "";
        this.player = null;
        this.displayMessageCounter = 0.1;
    }

    read(done){
        let c = document.createElement( 'canvas' );
        c.width = 64;
        c.height = 64;

        let context = c.getContext( '2d' );
        let img = new Image();
        img.src="l.png";

        let level = this;
        img.onload = function() {
            context.drawImage(img,0,0);
            for (let x = 0; x < 64; x++) {
                for (let z = 0; z < 64; z++) {
                    let c = new Uint32Array(context.getImageData(x, z, 1, 1).data.buffer);
                    let alpha = (c >>> 24 );
                    c = (c & 0x0FFFFFF);
                    if (c == 0x333324)level.addTile(x,z,Tiles.stoneWallTile);
                    if (c == 0x444424)level.addTile(x,z,Tiles.grassyStoneWallTile);
                    if (c == 0x00a0ff)level.addTile(x,z,Tiles.light);
                    if (c == 0x0050ff)level.addTile(x,z,Tiles.lava);
                    if (c == 0x00ff00){
                        level.player = new Player(x,0,z);
                        level.addEntity(level.player);
                        level.displayMessage("where am i? i cant find my things!!","and where is my 04?",10);
                    }
                    if (c == 0x202020)level.addEntity(new Bat(x,0.2,z,level.gl));
                    if (c == 0x808080)level.addEntity(new ItemSprite(new Dagger(x,0,z,level.gl,0.3),x,0,z,LevelRender.dagger,level.gl));
                    if (c == 0x003359)level.addEntity(new Pot(x,0,z,level.gl));
                    if (c == 0x3f3f7f)level.addEntity(new Box(x,0,z,level.gl,alpha));
                    if (c == 0xffff99){
                        level.addEntity(new AppareringFloor(x,0,z,level.gl,alpha));
                        level.addTile(x,z,Tiles.appareringFloor);
                    };
                    if (c == 0x0000ff)level.addEntity(new ItemSprite(new Apple(x,0,z,level.gl,0.3),x,0,z,LevelRender.apple,level.gl));
                    if (c == 0xaaaaaa){
                        level.addEntity(new Bars(x,0,z,level.gl,alpha));
                        level.addTile(x,z,new Tile().setBlocksLight(false));
                    }
                    if (c == 0xffffff){
                        level.addEntity(new FloorTrigger(x,0,z,level.gl,alpha));
                    }
                }
            }
            done();
        }
    }

    addEntity(entity){
        this.e.push(entity);
    }

    buildLight(){
        let lightLoop = true;
        while(lightLoop){
            lightLoop = false;
            for (let x = 0; x < 64; x++) {
                for (let z = 0; z < 64; z++) {
                    let light = this.calculateLight(x,z);
                    if (light != this.getLight(x,z)){
                        lightLoop = this.setLight(x,z,light);
                    }
                }
            }
        }
    }

    calculateLight(x,z){
        let tile = this.tiles[x + (z * 64)];
        if (tile == Tiles.light || tile == Tiles.lava){
            return maxLight;
        }

        let falloff = 0.2;
        if (tile.blocksLight) falloff = 2;

        let l = this.getLight(x-1,z);
        let r = this.getLight(x+1,z);
        let f = this.getLight(x,z+1);
        let b = this.getLight(x,z-1);

        let finalLight = 0;

        if (l > finalLight) finalLight = l - falloff;
        if (r > finalLight) finalLight = r - falloff;
        if (f > finalLight) finalLight = f - falloff;
        if (b > finalLight) finalLight = b - falloff;

        return finalLight>2?2:finalLight<0?0:finalLight;
    }

    distance(v1, v2) {
        let x = v1.x - v2.x
        let z = v1.z - v2.z;
        return Math.hypot(x, z);
    }

    parse(){
        this.buildLight();
        let wr = MeshBuilder.start(this.gl);
        let fr = MeshBuilder.start(this.gl);   
        let rr = MeshBuilder.start(this.gl);       
        for (let x = 0; x < 64; x++) {
            for (let z = 0; z < 64; z++) {
                let tile = this.tiles[x + (z * 64)];
                if (tile == Tiles.walltile || tile == Tiles.stoneWallTile || tile == Tiles.grassyStoneWallTile){
                    if (!this.getTile(x-1,z).c(tile)) MeshBuilder.left(tile.getUVs(),wr,x,0,z,this.getLight(x-1,z),tile.height,tile.YOffset);
                    if (!this.getTile(x+1,z).c(tile)) MeshBuilder.right(tile.getUVs(),wr,x,0,z,this.getLight(x+1,z),tile.height,tile.YOffset);
                    if (!this.getTile(x,z+1).c(tile)) MeshBuilder.front(tile.getUVs(),wr,x,0,z,this.getLight(x,z+1),tile.height,tile.YOffset);
                    if (!this.getTile(x,z-1).c(tile)) MeshBuilder.back(tile.getUVs(),wr,x,0,z,this.getLight(x,z-1),tile.height,tile.YOffset);
                }else if (tile == Tiles.lava || tile == Tiles.appareringFloor){
                    let light = this.getLight(x,z);
                    MeshBuilder.bottom(tile.getUVs(), fr,x,-0.5,z,light,tile.YOffset);
                    MeshBuilder.top(LevelRender.dirt.getUVs(),rr,x,2.9,z,light, tile.YOffset);
                }else{
                    
                    let light = this.getLight(x,z);
                    if (x < 16 && z < 16){
                        MeshBuilder.bottom(LevelRender.grassGround.getUVs(), fr,x,-1,z,light,tile.YOffset);
                        MeshBuilder.top(LevelRender.dirt.getUVs(),rr,x,2,z,light, tile.YOffset);
                    }else{
                        MeshBuilder.bottom(LevelRender.floor.getUVs(), fr,x,-1,z,light, tile.YOffset);
                        MeshBuilder.top(LevelRender.dirt.getUVs(),rr,x,2,z,light, tile.YOffset);
                    }
                }
            }
        }

        this.levelrender.wallmeshes.push(MeshBuilder.build(wr));
        this.levelrender.roofMeshes.push(MeshBuilder.build(rr));
        this.levelrender.floorMeshes.push(MeshBuilder.build(fr));
    }

    getTile(x,z){
        let tile = this.tiles[x + (z*64)];
        if (tile == null) return Tiles.airtile;
        return tile;
    }

    getLight(x,z){
        return this.lightmap[x + (z*64)];
    }
    setLight(x,z,light){
        let existingLight = this.lightmap[x + (z*64)];
        if (existingLight != light){
            this.lightmap[x + (z*64)] = light
            //console.log(x+" "+z+" "+existingLight+" "+light +" returning true");
            return true;
        }
        return false;
    }

    addTile(x,z, tile){
        this.tiles[x + (z*64)] = tile;
    }

    removeTile(x,z){
        //console.log("Removing "+x+" "+z);
        this.tiles[x + (z*64)] = Tiles.airtile;
    }

    getCollisionTile(x,z){
        return this.collisionTiles[x + (z*64)];
    }

    getUIText(){
        return [this.t,this.t2];
    }

    trigger(triggerId,source){
        this.e.forEach(entity => {
            if (entity.triggerId !=null && entity.triggerId == triggerId){
                entity.trigger(this, source);
            }
        });
    }

    untrigger(triggerId,source){
        this.e.forEach(entity => {
            if (entity.triggerId !=null && entity.triggerId == triggerId){
                entity.untrigger(this, source);
            }
        });
    }

    displayMessage(text,text2,timeToShow){
        this.t = text;
        this.t2 = text2;
        this.displayMessageCounter = timeToShow;
    }

    removeEntity(entity){
        for(let i = this.e.length - 1; i >= 0; i--) {
            if(this.e[i] === entity) {
                this.e.splice(i, 1);
            }
        }
    }

    tick(deltaTime){
        if (this.displayMessageCounter > 0){
            this.displayMessageCounter -=deltaTime;
        }

        if (this.displayMessageCounter <= 0){
            this.t = "";
            this.t2 = "";
        }
        let level = this;
        this.e.sort(function (a, b) {
            let aDest = level.distance(a.p,level.player.p);
            let bDest = level.distance(b.p,level.player.p);
            if (aDest > bDest) {
                return -1;
            }
            if (bDest > aDest) {
                return 1;
            }
            return 0;
        });

        this.e.forEach(e => {
            e.tick(deltaTime,this);
        });

        this.i.forEach(i => {
            i.tick(deltaTime,this,true);
        });
    }
    render(){
        this.levelrender.render();
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.e.forEach(entity => {
            this.levelrender.renderEntity(entity);
        });
        this.i.forEach(i => {
            this.levelrender.renderItem(i);
        });

        if (this.player != null && this.player.i != null){
            this.levelrender.renderEntity(this.player.i);
        }
    }
}
export default Level