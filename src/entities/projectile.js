import Billboardsprite from "./billboardsprite.js";
import LevelRender from "../level/levelrender.js";
import Particle from "./particle.js";

class Projectile extends Billboardsprite{
    constructor(x,y,z,gl, dirX, dirZ,damage,source,c){
        super("pp", x,y,z,LevelRender.projectile,gl,0);
        this.mesh.setS(0.15);
        this.radius = 0.2;
        this.dirX = dirX;
        this.dirZ = dirZ;
        this.particleCounter = 0.2;
        this.setC(c);
        this.respawn = false;
        this.damage = damage;
        this.source = source;
    }

    tick(deltatime,level){
        super.tick(deltatime,level);
        this.particleCounter += deltatime;
        if (this.canMove(level,this.p.x + this.dirX*deltatime,this.p.z + this.dirZ*deltatime)){
                this.p.x += this.dirX*deltatime;
                this.p.z += this.dirZ*deltatime;
        }else{
            this.removeThisEntity(level);
        }
        if (this.particleCounter >= 0.1){
            level.addEntity(new Particle(this.p.x-0.2+(this.getRand()/5), 0+this.getRand()/5, this.p.z-0.2+this.getRand()/5,LevelRender.lava,level.gl,0.4,
            this.getRandDirection(),this.getRandDirection(),this.getRandDirection(),0.05,this.c));
            this.particleCounter = 0;
        }
    }

    getRandDirection(){
        return ((this.getRand()*2)-1)/5;
    }
}
export default Projectile;