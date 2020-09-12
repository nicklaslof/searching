import Billboardsprite from "./billboardsprite.js";
import LevelRender from "../level/levelrender.js";
import Particle from "./particle.js";

//Projectile is just a sprite facing the camera moving in a direction
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
        //Check if projectile can move to the new position. If not just destroy it (hit a wall).
        if (this.canMove(level,this.p.x + this.dirX*deltatime,this.p.z + this.dirZ*deltatime)){
                this.p.x += this.dirX*deltatime;
                this.p.z += this.dirZ*deltatime;
        }else{
            this.removeThisEntity(level);
        }

        //Show some particles in randomdirections with low timespawn every 100ms.
        if (this.particleCounter >= 0.1){
            level.addEntity(new Particle(this.p.x-0.3+(this.getRand()/5), 0.2+this.getRand()/5, this.p.z-0.3+this.getRand()/5,LevelRender.lava,level.gl,0.15,
            this.getRandDirection(),this.getRandDirection(),this.getRandDirection(),0.05,this.c));
            this.particleCounter = 0;
        }
    }

    getRandDirection(){
        return ((this.getRand()*2)-1)/5;
    }
}
export default Projectile;