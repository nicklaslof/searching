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
import Pot from "../entities/pot.js";
import Aquamarine from "../entities/aquamarine.js";

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
        this.lightmap = new Array(64*64);
        this.lightmap.fill(0);

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
                    if (c == 0xffffffff)level.addTile(x,z,Tiles.walltile);
                    if (c == 0xff333324)level.addTile(x,z,Tiles.stoneWallTile);
                    if (c == 0xff444424)level.addTile(x,z,Tiles.grassyStoneWallTile);

                    if (c == 0xff00a0ff)level.addTile(x,z,Tiles.light);
                    if (c == 0xff00ff00){
                        level.player = new Player(x,0,z);
                        level.addEntity(level.player);
                    }

                    if (c == 0xff202020)level.addEntity(new Bat(x,0.2,z,level.gl));

                    if (c == 0xff808080)level.addEntity(new ItemSprite(new Dagger(x,0,z,level.gl,0.3),x,0,z,LevelRender.dagger,level.gl));

                    if (c == 0xff003359)level.addEntity(new Pot(x,0,z,level.gl));
                    if (c == 0xff836014)level.addEntity(new ItemSprite(new Aquamarine(x,0,z,level.gl,0.3),x,0,z,LevelRender.aquamarine,level.gl));

                    if (c == 0xfeaaaaaa || c == 0xfdaaaaaa){
                        level.addEntity(new Bars(x,0,z,level.gl,alpha));
                        level.addTile(new Tile());
                    }
                    if (c == 0xfeffffff || c == 0xfdffffff){
                        level.addEntity(new FloorTrigger(x,0,z,level.gl,alpha));
                    }
                }
            }
            done();
        }
    }

    addEntity(entity){
        this.entities.push(entity);
    }

    buildLight(){
        for (let x = 0; x < 64; x++) {
            for (let z = 0; z < 64; z++) {
                var tile = this.tiles[x + (z * 64)];
                if (tile == Tiles.light){
                    let baseradius = 15;
                    let radius = 0;
                    let negativepass = true;
                    let src = {x:x,z:z};
                    for (let zc = -baseradius; zc < baseradius; zc++) {
                        for (let xc = -radius; xc <= radius; ++xc) {
                            let dst = {x:x-xc,z:z-zc};
                            let v = (7-this.distance(src,dst))*0.30;
                            let light = Math.min(2,0.8*v);
                            this.setLight(x+xc,z+zc,x,z,light);
                        }
                        if (negativepass) radius++;
                        else radius--;
                        if (radius == baseradius) negativepass = false;
                    }
                }
            }
        }
    }

    setLight(x,z,sourceX, sourceZ, light){
        if (this.lightmap[x + (z * 64)] < light){
            let blockingLight = false;
            let b = this.bresenham(sourceX, sourceZ, x,z);

            for(let i = 0; i < b.length; i++){
                let v = b[i];
                if(sourceX == v.x && sourceZ == v.y){

                }else{
                    let tile = this.tiles[v.x + (v.y * 64)];
                    if (tile != Tiles.airtile){
                        blockingLight = true;
                        break;
                    } 
                }
            }
            if (!blockingLight){
                this.lightmap[x + (z * 64)] = light;
            }
        }
    }

    bresenham(startX,startY,endX,endY){
        let output = [];
        let w = endX - startX;
		let h = endY - startY;
		let dx1 = 0, dy1 = 0, dx2 = 0, dy2 = 0;
		if (w < 0) {
			dx1 = -1;
			dx2 = -1;
		} else if (w > 0) {
			dx1 = 1;
			dx2 = 1;
		}
		if (h < 0)
			dy1 = -1;
		else if (h > 0) dy1 = 1;
		let longest = Math.abs(w);
		let shortest = Math.abs(h);
		if (longest <= shortest) {
			longest = Math.abs(h);
			shortest = Math.abs(w);
			if (h < 0)
				dy2 = -1;
			else if (h > 0) dy2 = 1;
			dx2 = 0;
		}
		let numerator = longest >> 1;
		for (let i = 0; i <= longest; i++) {
			let point = {x:startX, y:startY};
			output.push(point);
			numerator += shortest;
			if (numerator > longest) {
				numerator -= longest;
				startX += dx1;
				startY += dy1;
			} else {
				startX += dx2;
				startY += dy2;
			}
		}
		return output;
    }

    distance(v1, v2) {
        let x = v1.x - v2.x
        let z = v1.z - v2.z;
        return Math.hypot(x, z);
    }



    parse(){
        this.buildLight();
        let wr = this.levelrender.start();
        let fr = this.levelrender.start();   
        let rr = this.levelrender.start();       
        for (let x = 0; x < 64; x++) {
            for (let z = 0; z < 64; z++) {
                var tile = this.tiles[x + (z * 64)];
                
                if (tile == Tiles.walltile || tile == Tiles.stoneWallTile || tile == Tiles.grassyStoneWallTile){
                    if (!this.getTile(x-1,z).c(tile)) this.levelrender.left(tile,wr,x,0,z,this.getLight(x-1,z));
                    if (!this.getTile(x+1,z).c(tile)) this.levelrender.right(tile,wr,x,0,z,this.getLight(x+1,z));
                    if (!this.getTile(x,z+1).c(tile)) this.levelrender.front(tile,wr,x,0,z,this.getLight(x,z+1));
                    if (!this.getTile(x,z-1).c(tile)) this.levelrender.back(tile,wr,x,0,z,this.getLight(x,z-1));
                }else{
                    var light = this.getLight(x,z);
                    if (x < 16 && z < 16){
                        this.levelrender.floor(LevelRender.grassGround, fr,x,-1,z,light);
                        this.levelrender.roof(LevelRender.dirt,rr,x,2,z,light);
                    }else{
                        this.levelrender.floor(LevelRender.floor, fr,x,-1,z,light);
                        this.levelrender.roof(LevelRender.dirt,rr,x,2,z,light);
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

    getLight(x,z){
        return this.lightmap[x + (z*64)];
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