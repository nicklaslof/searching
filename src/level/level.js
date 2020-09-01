import LevelRender from "./levelrender.js";
import Tiles from "../tiles/tiles.js";
import Player from "../entities/player.js";
import Bat from "../entities/bat.js";
import Bars from "../entities/bars.js";
import Tile from "../tiles/tile.js";
import CollisionTile from "./collisiontile.js";
import Dagger from "../entities/dagger.js";
import Wand from "../entities/wand.js";
import ItemSprite from "../entities/itemsprite.js";
import FloorTrigger from "../entities/floortrigger.js";
import Pot from "../entities/pot.js";
import Apple from "../entities/apple.js";
import Box from "../entities/box.js";
import MeshBuilder from "../gl/meshbuilder.js";
import AppareringFloor from "../entities/appareringfloor.js";
import ProjectileShooter from "../entities/projectileshooter.js";
import Endboss from "../entities/endboss.js";

const maxLight = 2;
const levelsize = 64;
class Level{
    constructor(gl,shaderprogram,type) {
        this.type = type;
        this.levelrender = new LevelRender(gl,shaderprogram);
        new Tiles();
        this.gl = gl;
        this.tiles = new Array(levelsize*levelsize);
        this.tiles.fill(Tiles.airtile);

        this.metadata = new Array(levelsize*levelsize);

        this.collisionTiles = new Array(levelsize*levelsize);
        for (let x = 0; x < levelsize; x++){
            for (let z = 0; z < levelsize; z++){
                this.collisionTiles[x + (z*levelsize)] = new CollisionTile(x,z);
            }
        }
        this.lightmap = new Array(levelsize*levelsize);
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
        this.hintsShown = false;
        this.hintsShown2 = false;
    }

    read(done){
        let level = this;
        fetch('m.txt')
            .then(response => response.text())
            .then(data => {
                for (let x = 0; x < levelsize; x++) {
                    for (let z = 0; z < levelsize; z++) {
                        level.metadata[x + (z*levelsize)] = Math.abs(126-(255+data.charCodeAt(x + (z*levelsize))));
                    }
                }
                fetch('l.txt')
                .then(response => response.text())
            .then(data => {
                for (let x = 0; x < levelsize; x++) {
                    for (let z = 0; z < levelsize; z++) {
                        let c = data.charAt(x + (z*levelsize));
                        let alpha = level.metadata[x + (z*levelsize)];
                        if (c == 's')level.addTile(x,z,Tiles.stoneWallTile);
                        if (c == 'g')level.addTile(x,z,Tiles.grassyStoneWallTile);
                        if (c == 'p'){
                            level.player = new Player(x,0,z);
                            level.addEntity(level.player);
                            level.displayMessage("where am i? i cant find my things!!","and where is my 04?",10);
                            this.showHints = 10;
                        }
                        if (c == 'l')level.addTile(x,z,Tiles.lava);
                        if (c == 'b')level.addEntity(new Bat(x,0.2,z,level.gl));
                        if (c == 'd')level.addEntity(new ItemSprite(new Dagger(x,0,z,level.gl,0.3,1),x,0,z,LevelRender.dagger,level.gl).setNotRespawn());
                        if (c == 'w')level.addEntity(new ItemSprite(new Wand(x,0,z,level.gl,0.3,1),x,0,z,LevelRender.wand,level.gl).setNotRespawn());
                        if (c == 'j')level.addEntity(new Pot(x,0,z,level.gl));
                        if (c == 'c')level.addEntity(new Box(x,0,z,level.gl,alpha).setNotRespawn());
                        if (c == 'f'){
                            level.addEntity(new AppareringFloor(x,0,z,level.gl,alpha).setNotRespawn());
                            level.addTile(x,z,Tiles.appareringFloor);
                        };
                        if (c == 'a')level.addEntity(new ItemSprite(new Apple(x,0,z,level.gl,0.3),x,0,z,LevelRender.apple,level.gl));
                        if (c == 'e'){
                            level.addEntity(new Bars(x,0,z,level.gl,alpha));
                            level.addTile(x,z,new Tile().setBlocksLight(false));
                        }
                        if (c == 't')level.addEntity(new FloorTrigger(x,0,z,level.gl,alpha).setNotRespawn());
                        if (c == 'o')level.addEntity(new ProjectileShooter(x,0,z,level,alpha).setNotRespawn());
                        if (c == 'z')level.addEntity(new Endboss(x,0,z,level.gl).setNotRespawn());

                    }
                }
                done();
            });
         });
    }

    addEntity(entity){
        this.e.push(entity);
    }

    buildLight(){
        let lightLoop = true;
        while(lightLoop){
            lightLoop = false;
            for (let x = 0; x < levelsize; x++) {
                for (let z = 0; z < levelsize; z++) {
                    let light = this.calculateLight(x,z);
                    if (light != this.getLight(x,z)){
                        lightLoop = this.setLight(x,z,light);
                    }
                }
            }
        }
    }

    calculateLight(x,z){
        let tile = this.tiles[x + (z * levelsize)];
        if (tile == Tiles.light || tile == Tiles.lava){
            return maxLight;
        }

        let falloff = 0.2;
        if (tile.blocksLight) falloff = 2;
        if (tile == Tiles.appareringFloor) falloff = 0;

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
        for (let x = 0; x < levelsize; x++) {
            for (let z = 0; z < levelsize; z++) {
                let tile = this.tiles[x + (z * levelsize)];
                if (tile == Tiles.walltile || tile == Tiles.stoneWallTile || tile == Tiles.grassyStoneWallTile){
                    if (!this.getTile(x-1,z).c(tile)) MeshBuilder.left(tile.getUVs(),wr,x,0,z,this.getLight(x-1,z),tile.height,tile.YOffset);
                    if (!this.getTile(x+1,z).c(tile)) MeshBuilder.right(tile.getUVs(),wr,x,0,z,this.getLight(x+1,z),tile.height,tile.YOffset);
                    if (!this.getTile(x,z+1).c(tile)) MeshBuilder.front(tile.getUVs(),wr,x,0,z,this.getLight(x,z+1),tile.height,tile.YOffset);
                    if (!this.getTile(x,z-1).c(tile)) MeshBuilder.back(tile.getUVs(),wr,x,0,z,this.getLight(x,z-1),tile.height,tile.YOffset);
                }else if (tile == Tiles.lava || tile == Tiles.appareringFloor){
                    let light = this.getLight(x,z);
                    MeshBuilder.bottom(tile.getUVs(), fr,x,-0.15,z,light,tile.YOffset);
                    MeshBuilder.top(LevelRender.dirt.getUVs(),rr,x,2.9,z,light, tile.YOffset,[0.4,0.4,0.45,1]);
                }else{
                    
                    let light = this.getLight(x,z);
                    if ((x < 16 && z < 16) || ((x >32 && x < 66) && (z > 19 && z < 38))){
                        MeshBuilder.bottom(LevelRender.grassGround.getUVs(), fr,x,-1,z,light,tile.YOffset);
                        MeshBuilder.top(LevelRender.dirt.getUVs(),rr,x,2,z,light, tile.YOffset,[0.9,0.5,0,1]);
                    }else{
                        MeshBuilder.bottom(LevelRender.floor.getUVs(), fr,x,-1,z,light, tile.YOffset);
                        MeshBuilder.top(LevelRender.dirt.getUVs(),rr,x,2,z,light, tile.YOffset, [0.4,0.4,0.45,1]);
                    }
                }
            }
        }

        this.levelrender.wallmeshes.push(MeshBuilder.build(wr));
        this.levelrender.roofMeshes.push(MeshBuilder.build(rr));
        this.levelrender.floorMeshes.push(MeshBuilder.build(fr));
    }

    getTile(x,z){
        let tile = this.tiles[x + (z*levelsize)];
        if (tile == null) return Tiles.airtile;
        return tile;
    }

    getLight(x,z){
        return this.lightmap[x + (z*levelsize)];
    }
    setLight(x,z,light){
        let existingLight = this.lightmap[x + (z*levelsize)];
        if (existingLight != light){
            this.lightmap[x + (z*levelsize)] = light
            return true;
        }
        return false;
    }

    addTile(x,z, tile){
        this.tiles[x + (z*levelsize)] = tile;
    }

    removeTile(x,z){
        this.tiles[x + (z*levelsize)] = Tiles.airtile;
    }

    getCollisionTile(x,z){
        let c = this.collisionTiles[x + (z*levelsize)];
        return c;
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

        if (this.showHints > 0 && (!this.hintsShown || !this.hintsShown2)){
            this.showHints -= deltaTime;
        }

        if (this.showHints<=0 && !this.hintsShown){
            this.displayMessage("move with WASD. fight with space","drop things with q and use with e",12);
            this.hintsShown = true;
            this.showHints = 12;
        }
        if (this.showHints<=0 && !this.hintsShown2){
            this.displayMessage("browse inventory with number keys","pick up items with shift",12);
            this.hintsShown2 = true;
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