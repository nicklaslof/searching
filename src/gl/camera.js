import * as matrix4 from "./matrix4.js";
import * as quaternion from "./quaternion.js";

class Camera{
    constructor(gl, x,y,z){
        this.gl = gl;
        this.pm = matrix4.create();
        this.pos = {x,y,z};
        this.currentRot = 0;
        this.createP();
        this.update();
        this.quaternion = quaternion.create();
    }

    rotate(rot){
        this.currentRot += rot;
        this.updateRotation();
    }

    setRotation(rot){
        this.currentRot = rot * Math.PI / 180;
        this.updateRotation();
    }

    updateRotation(){
        this.currentRot = this.currentRot%(Math.PI*2);
        if (this.currentRot < 0) this.currentRot = Math.PI*2;
        quaternion.fromEuler(this.quaternion, 0, this.getRotationDeg(), 0);
    }

    getRotationDeg(){
        return this.currentRot* (180/Math.PI);
    }
    getQuaternion(){
        return this.quaternion;
    }

    setPos(x,y,z){
        this.pos = {x,y,z};
        this.pm = matrix4.create();
        this.createP();
        this.update();
    }
    createP(){
        return matrix4.perspective(this.pm,64 * Math.PI / 180,this.gl.canvas.clientWidth / this.gl.canvas.clientHeight,0.1,1000);
    }

    getDirection(){
        return {x:Math.sin(this.currentRot),y:0,z:Math.cos(this.currentRot)};
    }

    update(){
        matrix4.rotateY(this.pm,this.pm,-this.currentRot);;
        matrix4.translate(this.pm, this.pm, [-this.pos.x, -this.pos.y, -this.pos.z]);
    }
}
export default Camera;
