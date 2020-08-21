import Vector3 from "./vector3.js";
import * as matrix4 from "./matrix4.js";

class Camera{


    constructor(gl, initialPosition){
        
        const fieldOfView = 64 * Math.PI / 180;   // in radians
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

        const zNear = 0;
        const zFar = 1000;

        this.projectionMatrix = matrix4.create();
        this.cameraMatrix = matrix4.create();
        this.viewMatrix = matrix4.create();
        this.viewProjectionMatrix = matrix4.create();
        this.position = new Vector3(initialPosition.x, initialPosition.y, initialPosition.z);
        this.translation = new Vector3(this.position.x, this.position.y, this.position.z);
        this.rot = 0;

        matrix4.perspective(this.projectionMatrix,
            fieldOfView,
            aspect,
            zNear,
            zFar);



           
            console.log(this.cameraMatrix);

       this.update();
    }

    rotate(rot){
        this.rot = rot;
    }

    translate(x,y,z){
        this.translation.x = x;
        this.translation.y = y;
        this.translation.z = z;

        this.position.x += x;
        this.position.y += y;
        this.position.z += z;
    }

    update(){
        matrix4.translate(this.cameraMatrix,this.cameraMatrix, [0,0,-this.position.z]);
        matrix4.rotateY(this.cameraMatrix,this.cameraMatrix,-this.rot*5);;
        matrix4.translate(this.cameraMatrix,this.cameraMatrix, [0,0,this.position.z]);
        matrix4.invert(this.viewMatrix, this.cameraMatrix);
        matrix4.translate(this.projectionMatrix,
            this.projectionMatrix,
            [this.translation.x, this.translation.y, this.translation.z]);
        this.translation.x = 0;
        this.translation.y = 0;
        this.translation.z = 0;
        this.rot = 0;
    }
}

export default Camera;
