import Billboardsprite from "./billboardsprite.js";
import LevelRender from "../level/levelrender.js";

class Bat extends Billboardsprite{
    constructor(x,y,z,gl){
        super(x,y,z,LevelRender.batTexture,gl);
        this.mesh.setScale(0.5);
        this.counter = 0;
    }

    tick(deltaTime,level){
        super.tick(deltaTime,level);
        this.counter += deltaTime;
        var c = Math.cos((this.counter + this.random)/50);
        this.mesh.translate(0,0.2,0);
    }
}
export default Bat;