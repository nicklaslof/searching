import LevelRender from "../level/levelrender.js";
import Sprite from "./sprite.js"
import Game from "../game.js";
//Floortriggers are plates on the floor that will cause various items in the level to trigger when the player is walking over them or an item is dropped or a box is placed over it.
class FloorTrigger extends Sprite{
    constructor(x,y,z,gl,triggerId) {
        super("",x,y-0.98,z,LevelRender.floorTriggerNoActive,gl,0,triggerId);
        if (triggerId == 200 || triggerId == 198 || triggerId == 197 || this.triggerId < 195) this.setC([0.5,0.5,0.6,1]);
        else this.setC([0.8,0.6,0.3,1]);
        this.mesh.setRotationX(-90);
        this.counter = 0;
        this.somethingTriggering = false;
        this.untriggerCounter = 0;
    }

    tick(deltatime,level){
        super.tick(deltatime,level);
        this.untriggerCounter += deltatime;
        if (!this.somethingTriggering && this.triggered){
            this.triggered = false;
            this.frameChanged = true;
            this.texture = LevelRender.floorTriggerNoActive;
            level.untrigger(this.triggerId, this);
            Game.playAudio(120,0.1);
        }
        //Since there is no method to detect when something is not colliding any more we just reset this here and wait for it to be set again in the trigger-function.
        if (this.untriggerCounter > 0.1)this.somethingTriggering = false;
    }

    collidedBy(entity, level){
        //Bats, particiles and projectiles can't trigger.
        if (entity.n == "ba" || entity.n == "pp" || entity.n == "pa") return;
        //If the collided entitiy is not a box and only boxes can be used then ignore the collision.
        if ((this.triggerId == 200 || this.triggerId == 198 || this.triggerId == 197 || this.triggerId < 195) && entity.n != "b") return;
        if (this.distanceToOtherEntity(entity) < 0.8){
            this.somethingTriggering = true;
            this.untriggerCounter = 0;
            if(!this.triggered){
                level.trigger(this.triggerId,this);
                this.frameChanged = true;
                this.texture = LevelRender.floorTriggerActive;
                this.triggered = true;
                Game.playAudio(150,0.1);
            }
        }
    }
}

export default FloorTrigger;