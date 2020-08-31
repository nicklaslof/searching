import Bat from "./bat.js";
import Projectile from "./projectile.js";
class Endboss extends Bat{
    constructor(x,y,z,gl){
        super(x,y,z,gl);
        this.maxHealth = 20;
        this.currentHealth = 20;
        this.mesh.setS(3.0);
        this.setC([0.3,0.3,1,1]);
        this.shootCounter = 0;
    }
    tick(deltaTime,level){
        this.shootCounter += deltaTime;
        if (this.shootCounter >= 3){
            if (this.distanceToOtherEntity(level.player) < 20){
                this.shootCounter = 0;
                let dir = {x:level.player.p.x - (this.p.x), y:0, z:level.player.p.z - (this.p.z)};
                this.normalize(dir);
                level.addEntity(new Projectile(this.p.x, 0.3, this.p.z,level.gl, dir.x*5, dir.z*5));
            }
        }
        super.tick(deltaTime,level);
    }
}
export default Endboss