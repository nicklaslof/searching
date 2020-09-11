import * as matrix4 from "./matrix4.js";
import * as quaternion from "./quaternion.js";

class Camera{
    constructor(gl, x,y,z){
        this.gl = gl;
        this.perspectiveMatrix = matrix4.create();
        this.position = {x,y,z};
        this.currentRot = 0;
        this.updatePerspective();
        this.updateRotationTranslation();
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

    setPos(position){
        this.position = position;
        this.updatePerspective();
        this.updateRotationTranslation();
    }
    updatePerspective(){
        return matrix4.perspective(this.perspectiveMatrix,64 * Math.PI / 180,this.gl.canvas.clientWidth / this.gl.canvas.clientHeight,0.1,30);
    }

    getDirection(){
        return {x:Math.sin(this.currentRot),y:0,z:Math.cos(this.currentRot)};
    }

    updateRotationTranslation(){
        matrix4.rotateY(this.perspectiveMatrix,this.perspectiveMatrix,-this.currentRot);;
        matrix4.translate(this.perspectiveMatrix, this.perspectiveMatrix, [-this.position.x, -this.position.y, -this.position.z]);
    }
}
export default Camera;
