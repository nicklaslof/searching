import * as matrix4 from "./matrix4.js";

class Camera{
    constructor(gl, x,y,z){
        
        let fieldOfView = 64 * Math.PI / 180;   // in radians
        let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        let zNear = 0.1;
        let zFar = 100;
        this.pm = matrix4.create();
        this.cm = matrix4.create();
        this.vm = matrix4.create();
        this.pos = {x,y,z};
        this.trans = {x,y,z};
        this.rot = 0;
        matrix4.perspective(this.pm,
            fieldOfView,
            aspect,
            zNear,
            zFar);
       this.update();
    }

    rotate(rot){
        this.rot = rot;
    }

    translate(x,y,z){
        this.trans.x = x;
        this.trans.y = y;
        this.trans.z = z;

        this.pos.x += x;
        this.pos.y += y;
        this.pos.z += z;
    }

    update(){
        matrix4.translate(this.cm,this.cm, [0,0,-this.pos.z]);
        matrix4.rotateY(this.cm,this.cm,-this.rot*5);;
        matrix4.translate(this.cm,this.cm, [0,0,this.pos.z]);
        matrix4.invert(this.vm, this.cm);
        matrix4.translate(this.pm,
            this.pm,
            [this.trans.x, this.trans.y, this.trans.z]);
        this.trans.x = 0;
        this.trans.y = 0;
        this.trans.z = 0;
        this.rot = 0;
    }
}

export default Camera;
