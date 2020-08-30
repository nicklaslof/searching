import LevelRender from "../level/levelrender.js";
import Sprite from "./sprite.js"
class FloorTrigger extends Sprite{
    constructor(x,y,z,gl,triggerId) {
        console.log("floor trigger at "+x+" "+z);
        super("floortrigger",x,y-0.98,z,LevelRender.floorTriggerNoActive,gl,0,triggerId);
        if (triggerId == 197) this.setColor([0.5,0.5,0.6,1]);
        else this.setColor([0.8,0.6,0.3,1]);
        this.mesh.setRotationX(-90);
        this.counter = 0;
        this.somethingTriggering = false;
    }

    tick(deltatime,level){
        super.tick(deltatime,level);
        if (!this.somethingTriggering && this.triggered){
            //console.log("unsetting triggered");
            this.triggered = false;
            this.frameChanged = true;
            this.texture = LevelRender.floorTriggerNoActive;
            level.untrigger(this.triggerId, this);
        }
        this.somethingTriggering = false;
        
    }

    collidedBy(entity, level){
        if (entity.n == "bat") return;
        if (this.triggerId == 197 && entity.n != "box") return;
        let d = this.distanceToOtherEntity(entity);
        if (d < 0.6){
            this.somethingTriggering = true;
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