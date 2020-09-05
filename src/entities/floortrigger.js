import LevelRender from "../level/levelrender.js";
import Sprite from "./sprite.js"
class FloorTrigger extends Sprite{
    constructor(x,y,z,gl,triggerId) {
        super("",x,y-0.98,z,LevelRender.floorTriggerNoActive,gl,0,triggerId);
        if (triggerId == 198 || triggerId == 197 || this.triggerId == 194 || this.triggerId == 193) this.setC([0.5,0.5,0.6,1]);
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
        }
        if (this.untriggerCounter > 0.1){
            this.somethingTriggering = false;
        }
    }

    collidedBy(entity, level){
        if (entity.n == "ba" || entity.n == "pp" || entity.n == "pa") return;
        if ((this.triggerId == 198 || this.triggerId == 197 || this.triggerId == 194 || this.triggerId == 193) && entity.n != "b") return;
        if (this.distanceToOtherEntity(entity) < 0.8){
            this.somethingTriggering = true;
            this.untriggerCounter = 0;
            if(!this.triggered){
                level.trigger(this.triggerId,this);
                this.frameChanged = true;
                this.texture = LevelRender.floorTriggerActive;
                this.triggered = true;
            }
        }
    }
}

export default FloorTrigger;