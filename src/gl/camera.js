import * as matrix4 from "./matrix4.js";
import * as quaternion from "./quaternion.js";

class Camera{
    constructor(gl, x,y,z){
        this.fieldOfView = 64 * Math.PI / 180;   // in radians
        this.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        this.zNear = 0.1;
        this.zFar = 1000;
        this.pm = matrix4.create();
        this.cm = matrix4.create();
        this.vm = matrix4.create();
        this.pos = {x,y,z};
        this.currentRot = 0;
        matrix4.perspective(this.pm,this.fieldOfView,this.aspect,this.zNear,this.zFar);
        this.update();
        this.quaternion = quaternion.create();
    }

    rotate(rot){
        this.currentRot += rot;
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
        matrix4.perspective(this.pm,this.fieldOfView,this.aspect,this.zNear,this.zFar);
        this.update();
    }

    getDirection(){
        let x = Math.sin(this.currentRot);
        let y = 0;
        let z = Math.cos(this.currentRot);
        return {x,y,z};
    }

    update(){
        matrix4.rotateY(this.pm,this.pm,-this.currentRot);;
        matrix4.translate(this.pm, this.pm, [-this.pos.x, -this.pos.y, -this.pos.z]);
    }
}
export default Camera;
