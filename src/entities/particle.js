import Billboardsprite from "./billboardsprite.js"

class Particle extends Billboardsprite{
    constructor(x,y,z,tex,gl, health,velX,velY,velZ,s) {
        super("particle",x,y,z,tex,gl,health,0);
        this.velX = velX;
        this.velY = velY;
        this.velZ = velZ;
        this.setS(s);
        this.setC([1,0,0,1]);
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