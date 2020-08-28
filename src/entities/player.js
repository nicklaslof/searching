import Game from "../game.js";
import LevelRender from "../level/levelrender.js";
import Entity from "./entity.js";
import Inventory from "./inventory.js";
import ItemSprite from "./itemsprite.js";
import Tiles from "../tiles/tiles.js";

class Player extends Entity{
    constructor(x,y,z) {
        super("player",x,y,z,5);
        this.speed = 3;
        this.isAttacking = false;
        this.inventory = new Inventory();
        this.onAppareingfloor = false;
    }

    tick(deltaTime, level){
        super.tick(deltaTime,level);
        this.inventory.tick(deltaTime,level);
        this.item = this.inventory.getItemInSlot(this.inventory.selectedSlot);

        if (this.knockBack.x == 0 || this.knockBack.z == 0){
            let tv = this.tempVector;
            let pos = this.position;
            let inputHandler = Game.inputHandler;
            this.counter += deltaTime;
            let v = {x:0,y:0,z:0};
            let cameraDirection = LevelRender.camera.getDirection();
    
            if (inputHandler.isKeyDown(65))LevelRender.camera.rotate(3 * deltaTime);
            if (inputHandler.isKeyDown(68))LevelRender.camera.rotate(-3* deltaTime);
            if (inputHandler.isKeyDown(87))v.z = -2.5;
            if (inputHandler.isKeyDown(83))v.z = 2.5;
            if (inputHandler.isKeyDown(32)){
                this.isAttacking = true;
                this.attack(level);
            }else{
                this.isAttacking = false;
            }
            if (inputHandler.wasKeyJustPressed(69))this.useItem(level);

            if (inputHandler.wasKeyJustPressed(81)) this.dropCurrentItem(level);
            
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
        
        if (this.item != null){
            let itemPos = {x:this.position.x - LevelRender.camera.getDirection().x/4,y:0,z:this.position.z - LevelRender.camera.getDirection().z/4};
            if (!this.isAttacking){
             this.item.renderPlayerHolding(itemPos,0.11);
            }else{
                this.item.renderPlayerAttack(itemPos,0.10);
            }
        }
        LevelRender.camera.setPos(this.position.x, this.onAppareingfloor?+0:+0.3, this.position.z);

        this.onAppareingfloor=false;
    }

    dropCurrentItem(level){
        if (this.item != null){
            if (this.item.name == "torch") LevelRender.darkness = 5;
            let itemSprite = new ItemSprite(this.item,this.position.x-LevelRender.camera.getDirection().x/2,-0.2,this.position.z-LevelRender.camera.getDirection().z/2,this.item.texture,level.gl);
            itemSprite.knockback(LevelRender.camera.getDirection().x,LevelRender.camera.getDirection().z);
            level.addEntity(itemSprite); 
            this.inventory.removeItemFromSlot(this.inventory.selectedSlot);
        }
    }

    removeCurrentItem(){
        this.inventory.removeItemFromSlot(this.inventory.selectedSlot);
    }

    pickup(item){
        if (item.name == "torch") LevelRender.darkness = 20;
        this.inventory.addItemToFirstAvailableSlot(item);
    }
    useItem(level){
        if (this.item != null) this.item.use(level,this);
    }

    hasSpace(){
       return this.inventory.hasSpace();
    }

    collidedBy(entity, level){
        super.collidedBy(entity,level);
        let d = this.distanceToOtherEntity(entity);
        if (entity.name == "appareingfloor"){
            if (d < 1 && entity.visble){
                this.onAppareingfloor = true;
            }
        } 
        if (entity.name == "bat"){
            let dirX = entity.position.x - this.position.x;
            let dirZ = entity.position.z - this.position.z;
            
            if(d < 1){
                if (this.hitCounter>= 0.5){
                    //this.hitCounter = 0;
                    super.knockback(dirX*2, dirZ*2);
                    this.hit(entity,1);
                }
            }
        }
    }

    attack(level){
        if (this.item == null) return;
        let cameraDirection = LevelRender.camera.getDirection();
        if (!this.findEnemyAndAttack(level.getCollisionTile(Math.round(this.position.x - cameraDirection.x), Math.round(this.position.z - cameraDirection.z)))){
            this.findEnemyAndAttack(level.getCollisionTile(Math.round(this.position.x - cameraDirection.x*1.5), Math.round(this.position.z - cameraDirection.z*1.5)));
        }
    }
    findEnemyAndAttack(ct){
        ct.getEntities().forEach(e => {
            if (e == this) return;
            if (e.name == "bat" || e.name == "pot"){
                e.hit(this,1);
                return true;
            }
        });
        return false;
    }
}

export default Player;