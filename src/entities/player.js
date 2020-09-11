import Game from "../game.js";
import LevelRender from "../level/levelrender.js";
import Entity from "./entity.js";
import Inventory from "./inventory.js";
import ItemSprite from "./itemsprite.js";
import Projectile from "./projectile.js";
const up = {x:0,y:1,z:0};
const down = {x:0,y:-1,z:0}
class Player extends Entity{
    constructor(x,y,z) {
        super("p",x,y,z,5);
        this.isAttacking = false;
        this.inventory = new Inventory();
        this.showAttack = false;
        this.attackCounter = 0;
        this.eatDelay = 0;
        this.daggerItemLevel = 0;
        this.wandItemLevel = 0;
        this.hitCounter = 0.5;
        this.velocity = {x:0,z:0};
        this.strafe = {x:0,z:0};
        this.tempVector = {x:0,z:0};
    }

    spawnAtCheckpoint(level){
        level.displayMessage("Respawned","",2);
        this.currentHealth = this.health;
        this.p.x = this.checkpoint.x;
        this.p.z = this.checkpoint.z;
    }

    tick(deltaTime, level){
        super.tick(deltaTime,level);
        if (this.currentHealth <= 0 || level.finished){
            if (level.finished) this.i = null;
            LevelRender.camera.rotate(0.15*deltaTime);
            LevelRender.camera.setPos(this.p);
            if (Game.inputHandler.isKeyDown(32) && !level.finished) Game.restart();
            return;
        }

        LevelRender.playerHurt=this.hitCounter < 0.1?1:0;
        this.inventory.tick(deltaTime,level);
        this.i = this.inventory.getItemInSlot(this.inventory.selectedSlot);
        if (this.showAttack && this.attackCounter > 0) this.attackCounter -= deltaTime;
        if (this.attackCounter <= 0) this.showAttack = false;
        if (this.eatDelay >0) this.eatDelay -= deltaTime;

        if (this.knockBack.x == 0 || this.knockBack.z == 0){
            this.velocity.x = 0;
            this.velocity.z = 0;
            this.strafe.x = 0;
            this.strafe.z = 0;
            let inputHandler = Game.inputHandler;
            this.counter += deltaTime;

            LevelRender.camera.rotate((inputHandler.getMouseX()/9) * deltaTime);
            
            let cameraDirection = LevelRender.camera.getDirection();
            if (inputHandler.isKeyDown(87))this.velocity.z = -1;
            if (inputHandler.isKeyDown(83))this.velocity.z = 1;
           
            if (inputHandler.isKeyDown(65))this.cross(this.strafe,cameraDirection,up);
            if (inputHandler.isKeyDown(68))this.cross(this.strafe,cameraDirection,down);
            if (inputHandler.getClicked() && this.attackCounter <= 0){
                this.isAttacking = this.showAttack = true;
                this.attackCounter = 0.3;
                this.attack(level);
                               
            }else{
                this.isAttacking = false;
            }
            if (inputHandler.isKeyDown(69))this.eat();

            if (inputHandler.isKeyDown(81)){ this.dropCurrentItem(level); inputHandler.kp[81] = false} ;
            
            if (this.velocity.x !=0 || this.velocity.z != 0 || this.strafe.x != 0 || this.strafe.z !=0){
                this.tempVector.x = cameraDirection.x * this.velocity.z + this.strafe.x;
                this.tempVector.z = cameraDirection.z * this.velocity.z + this.strafe.z;
                this.normalize(this.tempVector);
                this.tempVector.x *= deltaTime*2.5;
                this.tempVector.z *= deltaTime*2.5;
                this.tempVector.x += this.p.x;
                this.tempVector.z += this.p.z;
                if (this.canMove(level,this.tempVector.x,this.p.z)) this.p.x += this.tempVector.x-this.p.x;
                if (this.canMove(level,this.p.x,this.tempVector.z)) this.p.z += this.tempVector.z-this.p.z;

            }
        }
        
        if (this.i != null && (this.currentHealth>0 || !level.finished)){
            let itemPos = {x:this.p.x - LevelRender.camera.getDirection().x/4,y:0,z:this.p.z - LevelRender.camera.getDirection().z/4};
            if (!this.showAttack){
                this.i.renderPlayerHolding(itemPos,0.11);
            }else{
                this.i.renderPlayerAttack(itemPos,0.10);
            }
        }
        LevelRender.camera.setPos(this.p);
        if (Math.round(this.p.x) == 32 && Math.round(this.p.z) == 47) level.displayMessage("Prepare for boss fight!" ,"", 4);

    }

    cross(out, a, b) {
        out.x = a.y * b.z - a.z * b.y;
        out.y = a.z * b.x - a.x * b.z;
        out.z = a.x * b.y - a.y * b.x;
        return out;
      }

    removeThisEntity(level){
        level.displayMessage("You have died.","Press space to try again");
    }
    
    dropCurrentItem(level){
        if (this.i != null){
            let itemSprite = new ItemSprite(this.i,this.p.x-LevelRender.camera.getDirection().x/2,-0.2,this.p.z-LevelRender.camera.getDirection().z/2,this.i.texture,level.gl);
            itemSprite.knockback(LevelRender.camera.getDirection().x,LevelRender.camera.getDirection().z);
            level.addEntity(itemSprite); 
            this.inventory.removeItemFromSlot(this.inventory.selectedSlot);
        }
    }

    removeCurrentItem(){
        this.inventory.removeItemFromSlot(this.inventory.selectedSlot);
    }

    pickup(level,item){
        Game.playAudio(350,0.1);
        this.inventory.addItemToFirstAvailableSlot(level,item);
        if (item.n == "dagger") if (this.daggerItemLevel < item.level) this.daggerItemLevel = item.level;
        if (item.n == "wand") if (this.wandItemLevel < item.level) this.wandItemLevel = item.level;
    }

    eat(){
        if (this.currentHealth < this.health && this.eatDelay <= 0){
            this.inventory.eat(this);
            this.eatDelay = 0.2;
        } 
    }

    collidedBy(entity, level){
        if (level.finished) return;
        super.collidedBy(entity,level);
        if (entity.n == "ba" || (entity.n == "pp" && entity.source != this)){
            if(this.distanceToOtherEntity(entity) < 0.6){
                if (this.hitCounter>= 1){
                    Game.playAudio(60,0.3);
                    super.knockback(entity.p.x - this.p.x*2, entity.p.z - this.p.z*2);
                    this.hit(level,entity,1);
                }
            }
        }
    }

    setCheckpoint(x,z){
        this.checkpoint = {x,z};
    }
    attack(level){
        if (this.i == null) return;
        if (this.i.n == "wand"){
            level.addEntity(new Projectile(this.p.x - LevelRender.camera.getDirection().x, 0.3, this.p.z - LevelRender.camera.getDirection().z,level.gl, -LevelRender.camera.getDirection().x*7, -LevelRender.camera.getDirection().z*7,this.i.getDamage(),this,[0.3,0.3,0,1]));
        }else{
            if (!this.findEnemyAndAttack(level,level.getCollisionTile(Math.round(this.p.x - LevelRender.camera.getDirection().x), Math.round(this.p.z - LevelRender.camera.getDirection().z)))){
                this.findEnemyAndAttack(level,level.getCollisionTile(Math.round(this.p.x - LevelRender.camera.getDirection().x*2), Math.round(this.p.z - LevelRender.camera.getDirection().z*2)));
            }
        }
    }
    findEnemyAndAttack(level,ct){
        ct.getEntities().forEach(e => {
            if (e == this) return;
            if (e.n == "ba" || e.n == "po" || e.n == "b"){
                e.hit(level,this,this.i.getDamage());
                return true;
            }
        });
        return false;
    }
}

export default Player;