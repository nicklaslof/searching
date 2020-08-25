import Game from "../game.js";
import LevelRender from "../level/levelrender.js";
import Entity from "./entity.js";
import Sprite from "./sprite.js";
import * as quaternion from "../gl/quaternion.js";

class Player extends Entity{
    constructor(x,y,z) {
        super("player",x,y,z,5);
        this.speed = 3;
        this.isAttacking = false;

    }

    tick(deltaTime, level){
        super.tick(deltaTime,level);
        
        if (this.knockBack.x == 0 || this.knockBack.z == 0){
            let tv = this.tempVector;
            let pos = this.position;
            let inputHandler = Game.inputHandler;
            this.counter += deltaTime;
            let v = {x:0,y:0,z:0};
            let cameraDirection = LevelRender.camera.getDirection();
    
    
            if (inputHandler.isKeyDown(65))LevelRender.camera.rotate(4 * deltaTime);
            if (inputHandler.isKeyDown(68))LevelRender.camera.rotate(-4 * deltaTime);
            if (inputHandler.isKeyDown(87))v.z = -4;
            if (inputHandler.isKeyDown(83))v.z = 4;
            if (inputHandler.isKeyDown(32)){
                this.isAttacking = true;
                this.attack(level);
            }else{
                this.isAttacking = false;
            }
            
            if (v.x !=0 || v.z != 0){
                tv.x = cameraDirection.x * v.z * deltaTime;
                tv.y = cameraDirection.y * v.z * deltaTime;
                tv.z = cameraDirection.z * v.z * deltaTime;
    
                tv.x += pos.x;
                tv.z += pos.z;
            
                if (this.canMove(level,tv.x,pos.z)) pos.x += tv.x-pos.x;
                if (this.canMove(level,pos.x,tv.z)) pos.z += tv.z-pos.z;
            }
        }
        let itemPos = {x:this.position.x - LevelRender.camera.getDirection().x/4,y:0,z:this.position.z - LevelRender.camera.getDirection().z/4};
        if (!this.isAttacking){
            this.item.renderPlayerHolding(itemPos,0.11);
        }else{
            this.item.renderPlayerAttack(itemPos,0.10);
        }
        LevelRender.camera.setPos(this.position.x, +0.2, this.position.z);
    }

    addItem(item){
        this.item = item;
    }

    collidedBy(entity, level){
        super.collidedBy(entity,level);
        if (entity.name == "bat"){
            let dirX = entity.position.x - this.position.x;
            let dirZ = entity.position.z - this.position.z;
            let myPos = {x:this.position.x,z:this.position.z}
            let ePos = {x:entity.position.x,z:entity.position.z}
            let d = super.distance(myPos, ePos);
            if(d < 1){
                if (this.hitCounter>= 0.3){
                    this.hitCounter = 0;
                    super.knockback(dirX, dirZ);
                }
            }
        }
    }

    attack(level){
        let cameraDirection = LevelRender.camera.getDirection();
        if (!this.findEnemyAndAttack(level.getCollisionTile(Math.round(this.position.x - cameraDirection.x), Math.round(this.position.z - cameraDirection.z)))){
            this.findEnemyAndAttack(level.getCollisionTile(Math.round(this.position.x - cameraDirection.x*1.5), Math.round(this.position.z - cameraDirection.z*1.5)));
        }
    }
    findEnemyAndAttack(ct){
        ct.getEntities().forEach(e => {
            if (e == this) return;
            if (e.name == "bat"){
                e.hit(this,1);
                return true;
            }
        });
        return false;
    }
}

export default Player;