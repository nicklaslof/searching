import Game from "../game.js";
import LevelRender from "../level/levelrender.js";
import Entity from "./entity.js";

class Player extends Entity{
    constructor(x,y,z) {
        super("player",x,y,z);
        this.speed = 3;
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
    
    
            if (inputHandler.isKeyDown(65))LevelRender.camera.rotate(5 * deltaTime);
            if (inputHandler.isKeyDown(68))LevelRender.camera.rotate(-5 * deltaTime);
            if (inputHandler.isKeyDown(87))v.z = -5;
            if (inputHandler.isKeyDown(83))v.z = 5;
            
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
        
        LevelRender.camera.setPos(this.position.x, +0.2, this.position.z);
    }

    collidedBy(entity, level){
        super.collidedBy(entity,level);
        if (this.hitCounter>= 0.3){
            this.hitCounter = 0;

            let dirX = entity.position.x - this.position.x;
            let dirZ = entity.position.z - this.position.z;
            super.knockBack(dirX, dirZ);            
        }
    }

    
}

export default Player;