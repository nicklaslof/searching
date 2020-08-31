import Billboardsprite from "./billboardsprite.js";
import LevelRender from "../level/levelrender.js";
import Particle from "./particle.js";

class Projectile extends Billboardsprite{
    constructor(x,y,z,gl, dirX, dirZ){
        super("projectile", x,y,z,LevelRender.projectile,gl,0);
        this.mesh.setS(0.15);
        this.radius = 0.2;
        this.dirX = dirX;
        this.dirZ = dirZ;
        this.particleCounter = 0.2;
        this.setC([1,0,0,1]);
    }

    tick(deltatime,level){
        super.tick(deltatime,level);
        this.particleCounter += deltatime;
        let x = this.p.x + this.dirX*deltatime;
        let z = this.p.z + this.dirZ*deltatime;
        if (this.canMove(level,x,z)){
                this.p.x += this.dirX*deltatime;
                this.p.z += this.dirZ*deltatime;
        }else{
            this.removeThisEntity(level);
        }
        if (this.particleCounter >= 0.2){
            level.addEntity(new Particle(this.p.x-0.2+(this.getRand()/5), 0+this.getRand()/5, this.p.z-0.2+this.getRand()/5,LevelRender.lava,level.gl,0.4,
            this.getRandDirection(),this.getRandDirection(),this.getRandDirection(),0.01));
            this.particleCounter = 0;
        }
    }

    getRandDirection(){
        return ((this.getRand()*2)-1)/5;
    }
}
export default Projectile;