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

        //All the tiles in the game. Fill it with air to start with
        this.tiles = new Array(levelsize*levelsize);
        this.tiles.fill(Tiles.airtile);

        //Metadata. Is used to connect entities with other entities (Floortriggers opening a bar for example but also various kind of bats)
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

        //The entities in the game
        this.e = new Array();
        //The items in the game
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
        //Read the metadata file
        fetch('m.txt')
            .then(response => response.text())
            .then(data => {
                for (let x = 0; x < levelsize; x++) {
                    for (let z = 0; z < levelsize; z++) {
                        level.metadata[x + (z*levelsize)] = Math.abs(126-(255+data.charCodeAt(x + (z*levelsize))));
                    }
                }
                //When finished read the level file
                fetch('l.txt')
                .then(response => response.text())
            .then(data => {
                //Iterate over the file and create entities and tiles based on the string in the textfile at the position
                for (let x = 0; x < levelsize; x++) {
                    for (let z = 0; z < levelsize; z++) {
                        let levelItem = data.charAt(x + (z*levelsize));
                        let metaData = level.metadata[x + (z*levelsize)];
                        if (levelItem == 's')level.addTile(x,z,Tiles.stoneWallTile);
                        if (levelItem == 'g')level.addTile(x,z,Tiles.grassyStoneWallTile);
                        if (levelItem == 'p'){
                            level.player = new Player(x,0.3,z);
                            level.addEntity(level.player);
                            level.displayMessage("Where am I? I can't find my things","and where is 04?",10);
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
        //Iterate and calculate light until not a single tile is reporting light has changed.
        //Silly and stupid and inefficent but javascript seems to be amazingly fast iterating over 1000s of objects in just a few ms.
        while(lightLoop){
            lightLoop = false;
            for (let x = 0; x < levelsize; x++) {
                for (let z = 0; z < levelsize; z++) {
                    let light = this.calculateLight(x,z);
                    if (light != this.getLight(x,z)){
                        //If setLight reports light was changed indicate loop needs to run another time. Will be overwritten and not be false
                        //until every tile reports that light wasnt changed.
                        lightLoop = this.setLight(x,z,light);
                    }
                }
            }
        }
    }

    calculateLight(x,z){
        let tile = this.tiles[x + (z * levelsize)];
        //Light tiles always have maxLight value
        if (tile == Tiles.light || tile == Tiles.lava){
            return maxLight;
        }

        //Lights will falloff with 0.2 for every unit away from the light source
        //Apparering floor is just airblocks so no falloff
        //If a tile blocks light (walls) instantly set darkness
        let falloff = 0.2;
        if (tile.blocksLight) falloff = 2;
        if (tile == Tiles.appareringFloor) falloff = 0;

        //Get the light value from neighouring tiles
        let leftLight = this.getLight(x-1,z);
        let rightLight = this.getLight(x+1,z);
        let frontLight = this.getLight(x,z+1);
        let backLilght = this.getLight(x,z-1);

        let finalLight = 0;
        //If any of the neighouring tiles have a higher ligt value then the final light value use that value and substract the falloff.
        //This is what is causing the lights to spread from a lightsource and get darker the further away the tile is located from the source. 
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
        
        //Iterate over all tiles in the level and build wall, floor and roof
        for (let x = 0; x < levelsize; x++) {
            for (let z = 0; z < levelsize; z++) {
                let tile = this.tiles[x + (z * levelsize)];
                if (tile == Tiles.walltile || tile == Tiles.stoneWallTile || tile == Tiles.grassyStoneWallTile){
                    //Add left,right,front or back mesh side depending on if the tile is connected with this tile
                    //This will avoid creating meshes between tiles that isn't visible for the player and saving up alot of verticies
                    //and increasing performance
                    //This will also get the light the side is FACING. This makes sure that the light is not shining trough the wall so one side is lighted
                    //and the other isn't (unless there is lights on both sides off course).
                    if (!this.getTile(x-1,z).connectsWith(tile)) MeshBuilder.left(tile.getUVs(),wallMeshBuilder,x,0,z,this.getLight(x-1,z),tile.height,tile.YOffset);
                    if (!this.getTile(x+1,z).connectsWith(tile)) MeshBuilder.right(tile.getUVs(),wallMeshBuilder,x,0,z,this.getLight(x+1,z),tile.height,tile.YOffset);
                    if (!this.getTile(x,z+1).connectsWith(tile)) MeshBuilder.front(tile.getUVs(),wallMeshBuilder,x,0,z,this.getLight(x,z+1),tile.height,tile.YOffset);
                    if (!this.getTile(x,z-1).connectsWith(tile)) MeshBuilder.back(tile.getUVs(),wallMeshBuilder,x,0,z,this.getLight(x,z-1),tile.height,tile.YOffset);
                }else if (tile == Tiles.lava || tile == Tiles.appareringFloor){
                    //Lava is treated a little different
                    let light = this.getLight(x,z);
                    MeshBuilder.bottom(tile.getUVs(), floorMeshBuilder,x,-0.15,z,light/3,tile.YOffset,[1,0.4,0,1]);
                    MeshBuilder.top(LevelRender.dirt.getUVs(),roofMeshBuilder,x,2.9,z,light, tile.YOffset,[0.4,0.4,0.45,1]);
                }else{
                    //Add roof and floor. In some places use dirt color and grassy floor. Ugly hardcoded position values...
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

    //Set the light of a tile. If the light differs from the current light return true. If the light is the same return false.
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

    //Trigger entities connected togheter with a triggerId(metadata).
    trigger(triggerId,source){
        this.e.forEach(entity => {
            if (entity.triggerId !=null && entity.triggerId == triggerId){
                entity.trigger(this, source);
            }
        });
    }

    //Untrigger entities connected togheter with a triggerId(metadata).
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

    //Somehow the removeEntity function leaves entities in the array. Probably an error with the respawning so this method will make sure
    //to remove particles and projectiles that are not visible anymore
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

        //We need to sort entities based on distance to the player. Otherwise it will cause issues with alpha blending where
        //items are drawn in the wrong order.
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
        //Don't bother render entities 15 units away from the player
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