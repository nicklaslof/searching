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
import LavaEffect from "../entities/lavaeffect.js";

const maxLight = 2;
const levelsize = 64;
class Level{
    constructor(gl,shaderprogram) {
        this.levelrender = new LevelRender(gl,shaderprogram);
        new Tiles();
        this.gl = gl;
        this.tiles = new Array(levelsize*levelsize);
        this.tiles.fill(Tiles.airtile);

        this.metadata = new Array(levelsize*levelsize);

        this.collisionTiles = new Array(levelsize*levelsize);
        for (let x = 0; x < levelsize; x++){
            for (let z = 0; z < levelsize; z++){
                this.collisionTiles[x + (z*levelsize)] = new CollisionTile();
            }
        }
        this.oobCollisionTile = new CollisionTile(-1,-1);
        this.lightmap = new Array(levelsize*levelsize);
        this.lightmap.fill(0);

        this.e = new Array();
        this.i = new Array();
        this.read(() => {
            this.parse();
        });

        this.uiMessage1 = "";
        this.uiMessage2 = "";
        this.player = null;
        this.displayMessageCounter = 0.1;
        this.finished = false;
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
                        let levelItem = data.charAt(x + (z*levelsize));
                        let metaData = level.metadata[x + (z*levelsize)];
                        if (levelItem == 's')level.addTile(x,z,Tiles.stoneWallTile);
                        if (levelItem == 'g')level.addTile(x,z,Tiles.grassyStoneWallTile);
                        if (levelItem == 'p'){
                            level.player = new Player(x,0.3,z);
                            level.addEntity(level.player);
                            level.displayMessage("Where am I?  I can't find my things","and where is 04?",10);
                        }
                        if (levelItem == 'l'){
                            level.addTile(x,z,Tiles.lava);
                            if (Math.random() < 0.5)level.addEntity(new LavaEffect(x,0,z));
                        }
                        if (levelItem == 'b')level.addEntity(new Bat(x,0.2,z,level.gl,metaData));
                        if (levelItem == 'd')level.addEntity(new ItemSprite(this.getDagger(1),x,0,z,LevelRender.dagger,level.gl).setNotRespawn());
                        if (levelItem == 'w')level.addEntity(new ItemSprite(this.getWand(1),x,0,z,LevelRender.wand,level.gl).setNotRespawn());
                        if (levelItem == 'j')level.addEntity(new Pot(x,0,z,level.gl));
                        if (levelItem == 'c')level.addEntity(new Box(x,0,z,level.gl,metaData).setNotRespawn());
                        if (levelItem == 'f'){
                            level.addEntity(new AppareringFloor(x,0,z,level.gl,metaData).setNotRespawn());
                            level.addTile(x,z,Tiles.appareringFloor);
                        };
                        if (levelItem == 'a')level.addEntity(new ItemSprite(this.getApple(),x,0,z,LevelRender.apple,level.gl));
                        if (levelItem == 'e'){
                            level.addEntity(new Bars(x,0,z,level.gl,metaData));
                            level.addTile(x,z,new Tile().setBlocksLight(false));
                        }
                        if (levelItem == 't')level.addEntity(new FloorTrigger(x,0,z,level.gl,metaData).setNotRespawn());
                        if (levelItem == 'o')level.addEntity(new ProjectileShooter(x,0,z,level,metaData).setNotRespawn());

                    }
                }
                done();
            });
         });
    }

    getDagger(itemLevel){
        return new Dagger(0,0,0,this.gl,0.3,itemLevel);
    }

    getWand(itemLevel){
        return new Wand(0,0,0,this.gl,0.3,itemLevel)
    }

    getApple(){
        return new Apple(0,0,0,this.gl,0.6);
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

        let leftLight = this.getLight(x-1,z);
        let rightLight = this.getLight(x+1,z);
        let frontLight = this.getLight(x,z+1);
        let backLilght = this.getLight(x,z-1);

        let finalLight = 0;

        if (leftLight > finalLight) finalLight = leftLight - falloff;
        if (rightLight > finalLight) finalLight = rightLight - falloff;
        if (frontLight > finalLight) finalLight = frontLight - falloff;
        if (backLilght > finalLight) finalLight = backLilght - falloff;

        return finalLight>2?2:finalLight<0?0:finalLight;
    }

    parse(){
        this.buildLight();
        let wallMeshBuilder = MeshBuilder.start(this.gl);
        let floorMeshBuilder = MeshBuilder.start(this.gl);   
        let roofMeshBuilder = MeshBuilder.start(this.gl);       
        for (let x = 0; x < levelsize; x++) {
            for (let z = 0; z < levelsize; z++) {
                let tile = this.tiles[x + (z * levelsize)];
                if (tile == Tiles.walltile || tile == Tiles.stoneWallTile || tile == Tiles.grassyStoneWallTile){
                    if (!this.getTile(x-1,z).connectsWith(tile)) MeshBuilder.left(tile.getUVs(),wallMeshBuilder,x,0,z,this.getLight(x-1,z),tile.height,tile.YOffset);
                    if (!this.getTile(x+1,z).connectsWith(tile)) MeshBuilder.right(tile.getUVs(),wallMeshBuilder,x,0,z,this.getLight(x+1,z),tile.height,tile.YOffset);
                    if (!this.getTile(x,z+1).connectsWith(tile)) MeshBuilder.front(tile.getUVs(),wallMeshBuilder,x,0,z,this.getLight(x,z+1),tile.height,tile.YOffset);
                    if (!this.getTile(x,z-1).connectsWith(tile)) MeshBuilder.back(tile.getUVs(),wallMeshBuilder,x,0,z,this.getLight(x,z-1),tile.height,tile.YOffset);
                }else if (tile == Tiles.lava || tile == Tiles.appareringFloor){
                    let light = this.getLight(x,z);
                    MeshBuilder.bottom(tile.getUVs(), floorMeshBuilder,x,-0.15,z,light/3,tile.YOffset,[1,0.4,0,1]);
                    MeshBuilder.top(LevelRender.dirt.getUVs(),roofMeshBuilder,x,2.9,z,light, tile.YOffset,[0.4,0.4,0.45,1]);
                }else{
                    
                    let light = this.getLight(x,z);
                    if ((x < 16 && z < 16) || ((x >32 && x < 56) && (z > 19 && z < 38))){
                        MeshBuilder.bottom(LevelRender.grassGround.getUVs(), floorMeshBuilder,x,-1,z,light,tile.YOffset);
                        MeshBuilder.top(LevelRender.dirt.getUVs(),roofMeshBuilder,x,2,z,light, tile.YOffset,[0.9,0.5,0,1]);
                    }else{
                        MeshBuilder.bottom(LevelRender.floor.getUVs(), floorMeshBuilder,x,-1,z,light, tile.YOffset);
                        MeshBuilder.top(LevelRender.dirt.getUVs(),roofMeshBuilder,x,2,z,light, tile.YOffset, [0.4,0.4,0.45,1]);
                    }
                }
            }
        }

        this.levelrender.wallMesh = MeshBuilder.build(wallMeshBuilder);
        this.levelrender.roofMesh = MeshBuilder.build(roofMeshBuilder);
        this.levelrender.floorMesh = MeshBuilder.build(floorMeshBuilder);
        this.levelrender.dirty = false;
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
        if (c == null) c = this.oobCollisionTile;
        return c;
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
        this.uiMessage1 = text;
        this.uiMessage2 = text2;
        this.displayMessageCounter = timeToShow;
    }

    removeEntity(entity){
        
        for(let i = this.e.length - 1; i >= 0; i--) {
            if(this.e[i]=== entity) {
                this.e.splice(i, 1);
            }
        }
        this.cleanUp();
    }

    cleanUp(){
        for (let i = 0; i < this.e.length; i++){
            if((this.e[i].n == "pa" || this.e[i].n == "pp") && this.e[i].currentHealth <= 0){
                this.e.splice(i, 1);
            }
        }
    }

    tick(deltaTime){
        if (this.displayMessageCounter > 0){
            this.displayMessageCounter -=deltaTime;
        }

        if (this.displayMessageCounter <= 0){
            this.uiMessage1 = "";
            this.uiMessage2 = "";
        }
        let level = this;
        this.e.sort(function (a, b) {
            let aDest = a.distanceToOtherEntity(level.player);
            let bDest = b.distanceToOtherEntity(level.player);
            if (aDest > bDest) return -1;
            if (bDest > aDest) return 1;
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
            if (entity.distanceToOtherEntity(this.player)< 15)this.levelrender.renderEntity(entity);
        });
        this.i.forEach(i => {
            this.levelrender.renderItem(i);
        });

        if (this.player != null && this.player.i != null){
            this.levelrender.renderEntity(this.player.i);
        }
    }

    restart(){
        this.player.spawnAtCheckpoint(this);
    }
}
export default Level