import * as matrix4 from "./matrix4.js";
import * as quaternion from "./quaternion.js";

class Mesh{
    constructor(gl, x,y,z){
        //this.dirty = true;
        this.verticies = [];
        this.modelViewMatrix = matrix4.create();
        this.p = {x,y,z};
        this.scale = [1,1,1];
        this.gl = gl;
        this.quaternion = quaternion.create();
        this.rotX = 0;
        this.rotY = 0;
        this.ab = gl.ARRAY_BUFFER;
        this.dd = gl.DYNAMIC_DRAW;
        this.eab = gl.ELEMENT_ARRAY_BUFFER;
        this.float = gl.FLOAT;

        this.pBuffer = gl.createBuffer();
        this.cb = gl.createBuffer();
        this.lightBuffer = gl.createBuffer();
        this.uvBuffer = gl.createBuffer();
        this.indiciesBuffer = gl.createBuffer();
        this.darknessBuffer = gl.createBuffer();
    }

    addVerticies(verticies, cols, uvs,lights){
        verticies.forEach(vertex => { this.verticies.push(vertex); });
        this.updateCols(cols);  
        this.updateUVs(uvs);
        this.updateLights(lights);
    }

    updateMesh(){
        let indiciesNeeded = this.verticies.length/4;

        this.verticiesBuffer32 = new Float32Array(this.verticies.length*3);
        this.verticiesBuffer32.set(this.verticies);
        this.uvArrayBuffer32 = new Float32Array(this.uvs.length*12);
        this.indiciesBuffer16 = new Uint16Array(indiciesNeeded*6);

        let vertexCounter = 0;
        let counter = 0;

        let indicies = [0,1,2,0,2,3];
        counter = 0;
        for (let i = 0; i < indiciesNeeded; i++){
            for (let c = 0; c < 6; c++){
                this.indiciesBuffer16[counter+c] = indicies[c] + vertexCounter;
            }
            vertexCounter += 4;
            counter += 6;
        }

        this.numberOfIndicies = counter;

        this.gl.bindBuffer(this.ab, this.pBuffer);
        this.gl.bufferData(this.ab, this.verticiesBuffer32, this.dd);

        this.uploadCols();
        this.uploadLights();
        this.uploadUVs();

        this.gl.bindBuffer(this.ab, this.uvBuffer);
        this.gl.bufferData(this.ab, this.uvArrayBuffer32, this.dd);

        this.gl.bindBuffer(this.eab, this.indiciesBuffer);
        this.gl.bufferData(this.eab, this.indiciesBuffer16, this.dd);

        //this.dirty = false;
    }

    t(x, y, z){
        this.p.x += x;
        this.p.y += y;
        this.p.z += z;
        this.updateMatrix();
    }

    setPos(x, y, z){
        this.p.x = x;
        this.p.y = y;
        this.p.z = z;
        this.updateMatrix();
    }

    setS(s){
        this.scale[0]=s;
        this.scale[1]=s;
        this.scale[2]=s;
        this.updateMatrix();
    }

    rotateX(r){
        quaternion.rotateX(this.quaternion, this.quaternion, r);
        this.updateMatrix();
    }

    rotateY(r){
        quaternion.rotateY(this.quaternion, this.quaternion, r);
        this.updateMatrix();
    }
    setQuaternion(q){
        this.quaternion = q;
        this.updateMatrix();
    }

    setRotationX(r){
        this.rotX = r;
        quaternion.fromEuler(this.quaternion,this.rotX,this.rotY,0);
        this.updateMatrix();
    }
    
    setRotationY(r){
        this.rotY = r;
        quaternion.fromEuler(this.quaternion,this.rotX,this.rotY,0);
        this.updateMatrix();
    }
    
    updateMatrix(){
        matrix4.fromRotationTranslationScale(this.modelViewMatrix, this.quaternion, [this.p.x, this.p.y, this.p.z],this.scale);
    }

    updateCols(c){
        this.cs = [];
        c.forEach(cc => { cc.forEach(c => {this.cs.push(c);})});
    }
    updateLights(lights){
        this.lights = [];
        lights.forEach(light => { light.forEach(l => {this.lights.push(l);})});
    }

    updateUVs(uvs){
        this.uvs = [];
        uvs.forEach(uv => { this.uvs.push(uv);});
    }

    uploadCols(){
        this.cArrayBuffer32 = new Float32Array(this.cs.length*4);
        this.cArrayBuffer32.set(this.cs);
        this.gl.bindBuffer(this.ab, this.cb);
        this.gl.bufferData(this.ab, this.cArrayBuffer32, this.dd);
    }
    uploadLights(){
        this.lightArrayBuffer32 = new Float32Array(this.lights.length*4);
        this.lightArrayBuffer32.set(this.lights);
        this.gl.bindBuffer(this.ab, this.lightBuffer);
        this.gl.bufferData(this.ab, this.lightArrayBuffer32, this.dd);
    }
    uploadUVs(){
        let counter = 0;
        this.uvs.forEach(uv => {
            this.uvArrayBuffer32[counter] = uv[0];
            this.uvArrayBuffer32[counter+1] = uv[1];
            counter += 2;
        });
        this.gl.bindBuffer(this.ab, this.uvBuffer);
        this.gl.bufferData(this.ab, this.uvArrayBuffer32, this.dd);

    }

    render(gl, shaderProgram, projectionMatrix, texture,playerHurt, uvs, cols){
        if (uvs != null){
            this.updateUVs(uvs);
            this.uploadUVs();
        }

        if (cols != null){
            this.updateCols(cols);
            this.uploadCols();
        }

        gl.bindBuffer(this.ab, this.pBuffer);
        gl.vertexAttribPointer(shaderProgram.locations.attribLocations.vertexPosition, 3, this.float, false, 0, 0);
        gl.enableVertexAttribArray(shaderProgram.locations.attribLocations.vertexPosition);

        gl.bindBuffer(this.ab, this.cb);
        gl.vertexAttribPointer(shaderProgram.locations.attribLocations.color, 4, this.float, false, 0, 0);
        gl.enableVertexAttribArray(shaderProgram.locations.attribLocations.color);

        gl.bindBuffer(this.ab, this.lightBuffer);
        gl.vertexAttribPointer(shaderProgram.locations.attribLocations.light, 4, this.float, false, 0, 0);
        gl.enableVertexAttribArray(shaderProgram.locations.attribLocations.light);

        gl.bindBuffer(this.ab, this.uvBuffer);
        gl.vertexAttribPointer(shaderProgram.locations.attribLocations.uv, 2, this.float, false, 0, 0);
        gl.enableVertexAttribArray(shaderProgram.locations.attribLocations.uv);

        gl.useProgram(shaderProgram.shaderProgram);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture.tex);
        gl.uniform1i(shaderProgram.locations.uniformLocations.uSampler, 0);
        gl.uniform1f(shaderProgram.locations.uniformLocations.playerHurt, playerHurt);
        gl.uniformMatrix4fv(shaderProgram.locations.uniformLocations.projectionMatrix, false, projectionMatrix);
        gl.uniformMatrix4fv(shaderProgram.locations.uniformLocations.modelViewMatrix, false, this.modelViewMatrix);

        gl.bindBuffer(this.eab, this.indiciesBuffer);
        gl.drawElements(gl.TRIANGLES,  this.numberOfIndicies,gl.UNSIGNED_SHORT,0);
    }
}

export default Mesh;