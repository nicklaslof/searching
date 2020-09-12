import Billboardsprite from "./billboardsprite.js"

//Particle is just a sprite facing the player with a movement velocity in all directions and limited liftime (using entity health)
class Particle extends Billboardsprite{
    constructor(x,y,z,tex,gl, health,velX,velY,velZ,s,color) {
        super("pa",x,y,z,tex,gl,health,0);
        this.velX = velX;
        this.velY = velY;
        this.velZ = velZ;
        this.setS(s);
        this.setC(color);
        this.setNotRespawn();
    }
    tick(deltatime,level){
        this.currentHealth -= deltatime;
        this.p.x += this.velX * deltatime;
        this.p.y += this.velY * deltatime;
        this.p.z += this.velZ * deltatime;
        super.tick(deltatime,level);
    }
}

export default Particle