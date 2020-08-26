import LevelRender from "../level/levelrender.js";
import Sprite from "./sprite.js"
class FloorTrigger extends Sprite{
    constructor(x,y,z,gl,triggerId) {
        super("floortrigger",x,y-0.98,z,LevelRender.floorTriggerNoActive,gl,0,triggerId);
        this.mesh.setRotationX(-90);
        this.counter = 0;
        this.collisionActive = false;
    }

    tick(deltatime,level){
        super.tick(deltatime,level);
        if (!this.collisionActive && this.triggered){
            console.log("unsetting triggered");
            this.triggered = false;
            this.frameChanged = true;
            this.texture = LevelRender.floorTriggerNoActive;
            level.untrigger(this.triggerId, this);
        }
        this.collisionActive = false;
        
    }

    collidedBy(entity, level){
        if (entity.name == "bat") return;
        let d = this.distanceToOtherEntity(entity);
        if (d < 0.6){
            this.collisionActive = true;
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