import Entity from "./entity.js"
import Particle from "./particle.js"
import LevelRender from "../level/levelrender.js"
class LavaEffect extends Entity{
    constructor(x,y,z) {
        super("le",x,y,z,0);
        this.counter = this.getRand()*5;
    }

    tick(deltaTime, level){
        super.tick(deltaTime,level);
        this.counter -=deltaTime;
        if (this.counter <= 0){
            level.addEntity(new Particle(this.p.x+ this.getRand()/2,-0.5,this.p.z+ this.getRand()/2,LevelRender.lava,level.gl,this.getRand()*2,0,this.getRand(),0,this.getRand()/8,
            this.getRand()<0.5?[1,0.4,0,1]:[0.8,0.2,0,1]));
            this.counter = this.getRand()*5;
        }
    }
}
export default LavaEffect