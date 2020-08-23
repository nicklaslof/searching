import Billboardsprite from "./billboardsprite.js";
import LevelRender from "../level/levelrender.js";

class Bat extends Billboardsprite{
    constructor(x,y,z,gl){
        super(x,y,z,LevelRender.bat,gl);
        this.mesh.setScale(0.5);
        this.counter = 0;
        this.random = Math.random();
        this.radius = 0.2;
    }

    tick(deltaTime,level){
        super.tick(deltaTime,level);
        this.counter += deltaTime;
        let y = Math.sin(this.counter*4* 0.9+this.random)/200;
        let x = Math.cos(this.counter* 0.7+this.random)/50;
        let z = 0;
        if (this.random < 0.5){
            z = Math.cos((this.counter/2) * 0.9+this.random)/30;
        }else{
            z = Math.sin((this.counter/2) * 0.9+this.random)/30;
        }
        

        if (this.canMove(level,x+this.position.x,z+this.position.z)){
            this.mesh.translate(x,y,z);
        }else{
            this.mesh.translate(0,y,0);
        }
    }
}
export default Bat;