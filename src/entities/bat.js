import Billboardsprite from "./billboardsprite.js";
import LevelRender from "../level/levelrender.js";
import Particle from "./particle.js";
import Projectile from "./projectile.js";
import Tiles from "../tiles/tiles.js";
import Game from "../game.js"

class Bat extends Billboardsprite{
    constructor(x,y,z,gl,metadata){
        super("ba", x,y,z,LevelRender.bat,gl,metadata==252?80:metadata==253?6:5,metadata);
        this.mesh.setS(metadata==252?3:metadata==253?1:0.5);
        this.counter = 0;
        this.random = this.getRand();
        this.radius = 0.2;
        this.frameCounter = Math.round(this.random);
        this.c = this.baseColor = metadata==252?[0.6,0.6,1,1]:metadata==253?[0.0,0.8,0,1]:[1,1,1,1];
        this.cChanged = true;
        this.shootCounter = 0;
        this.shootDelay = this.triggerId==252?4:7;
        this.light = 1;
    }

    tick(deltaTime,level){
        if (this.triggerId == 252 && this.currentHealth <=0){
            this.respawnTimer = 20;
        }
        super.tick(deltaTime,level);
        if (this.knockBack.x !=0 || this.knockBack.z !=0) return;
        this.counter += deltaTime;
        let y = Math.sin(this.counter*4* 0.9+this.random)/100;
        let x = Math.cos(this.counter* 0.7+this.random)/50;
        let z = 0;
        
        if (this.random < 0.5)z = Math.cos((this.counter/2) * 0.9+this.random)/30;
        else z = Math.sin((this.counter/2) * 0.9+this.random)/30;
        
        if (this.canMove(level,x+this.p.x,z+this.p.z)){
           this.p.x += x;
           this.p.y += y;
           this.p.z += z;
        }else{
            this.p.y += y;
        }

        if (this.triggerId < 254){
            this.shootCounter += deltaTime;
            if (this.shootCounter >= this.shootDelay){
                if (this.distanceToOtherEntity(level.player) < this.triggerId==252?20:10){
                    this.shootCounter = 0;
                    this.spit(level);
                }
            }
        }

    }

    collidedBy(entity, level){
        super.collidedBy(entity,level);
            if(entity.n == "pp" && this.distanceToOtherEntity(entity) < 1.3 && this.hitCounter>= 0.5)this.hit(level,entity,entity.damage);
    }

    removeThisEntity(level){
        if (this.triggerId == 252)level.displayMessage("the bat drops dead revelaing a note that says","04 is in another dungeon",500);
        this.addParticles(level,0.12,-0.8);
        if (this.getRand() < 0.1 && level.getTile(Math.round(this.p.x), Math.round(this.p.z)) != Tiles.lava){
            if (this.triggerId == 254)this.drop(level,level.getDagger(level.player.daggerItemLevel+1));
            if (this.triggerId == 253)this.drop(level,level.getWand(level.player.wandItemLevel+1));
        }
       super.removeThisEntity(level);
    }
    spit(level){
        let dir = {x:level.player.p.x - (this.p.x), y:0, z:level.player.p.z - (this.p.z)};
        this.normalize(dir);
        level.addEntity(new Projectile(this.p.x, 0.3, this.p.z,level.gl, dir.x*5, dir.z*5,0,this,this.c));
    }

    hit(level,hitByEntity, amount){
        if (amount == null) return;
        if (this.hitCounter>= 0.3){
            if (amount>0){
                Game.playAudio(3000,0.20);
                this.addParticles(level,0.02,-0.4);
            }
        }
        super.hit(level,hitByEntity,amount);
    }

    addParticles(level,s,dirY,lifetime,amount){
        lifetime=lifetime==null?0.8:lifetime;
        amount=amount==null?5:amount;
        for(let i = 0; i < amount;i++){
            level.addEntity(new Particle(this.p.x-0.2+this.getRand()/3,0.2,this.p.z-0.2+this.getRand()/3,LevelRender.lava,level.gl,lifetime,0,dirY,0,s,[1,0,0,1]));
        }
    }
}
export default Bat;