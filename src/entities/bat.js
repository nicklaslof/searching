import Billboardsprite from "./billboardsprite.js";
import LevelRender from "../level/levelrender.js";

class Bat extends Billboardsprite{
    constructor(x,y,z,gl){
        super("bat", x,y,z,LevelRender.bat,gl,5);
        this.mesh.setScale(0.5);
        this.counter = 0;
        this.random = Math.random();
        this.radius = 0.2;
    }

    tick(deltaTime,level){
        super.tick(deltaTime,level);
        if (this.knockBack.x !=0 || this.knockBack.z !=0) return;
        this.counter += deltaTime;
        let y = Math.sin(this.counter*4* 0.9+this.random)/200;
        let x = Math.cos(this.counter* 0.7+this.random)/50;
        let z = 0;
        
        if (this.random < 0.5)z = Math.cos((this.counter/2) * 0.9+this.random)/30;
        else z = Math.sin((this.counter/2) * 0.9+this.random)/30;
        
        if (this.canMove(level,x+this.position.x,z+this.position.z)){
           this.position.x += x;
           this.position.y += y;
           this.position.z += z;
        }else{
            this.position.y += y;
        }
    }

    hit(hitByEntity, amount){
        super.hit(hitByEntity,amount);
    }
}
export default Bat;