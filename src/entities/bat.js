import Billboardsprite from "./billboardsprite.js";
import LevelRender from "../level/levelrender.js";
import Particle from "./particle.js";

class Bat extends Billboardsprite{
    constructor(x,y,z,gl){
        super("bat", x,y,z,LevelRender.bat,gl,5);
        this.mesh.setS(0.5);
        this.counter = 0;
        this.r = this.getRand();
        this.radius = 0.2;
        this.frameCounter = Math.round(this.r);
    }

    tick(deltaTime,level){
        super.tick(deltaTime,level);
        if (this.knockBack.x !=0 || this.knockBack.z !=0) return;
        this.counter += deltaTime;
        let y = Math.sin(this.counter*4* 0.9+this.r)/100;
        let x = Math.cos(this.counter* 0.7+this.r)/50;
        let z = 0;
        
        if (this.r < 0.5)z = Math.cos((this.counter/2) * 0.9+this.r)/30;
        else z = Math.sin((this.counter/2) * 0.9+this.r)/30;
        
        if (this.canMove(level,x+this.p.x,z+this.p.z)){
           this.p.x += x;
           this.p.y += y;
           this.p.z += z;
        }else{
            this.p.y += y;
        }
    }

    removeThisEntity(level){
       this.addParticles(level,0.12,-0.8);
       super.removeThisEntity(level);
    }

    hit(level,hitByEntity, amount){
        if (this.hitCounter>= 0.3){
            this.addParticles(level,0.02,-0.4);
        }
        super.hit(level,hitByEntity,amount);
    }

    addParticles(level,s,dirY){
        for(let i = 0; i < 5;i++){
            level.addEntity(new Particle(this.p.x-0.2+this.getRand()/3,0.2,this.p.z-0.2+this.getRand()/3,LevelRender.lava,level.gl,0.8,0,dirY,0,s));
        }
    }
}
export default Bat;