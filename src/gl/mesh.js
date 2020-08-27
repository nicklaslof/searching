import * as matrix4 from "./matrix4.js";
import * as quaternion from "./quaternion.js";
import LevelRender from "../level/levelrender.js";

class Mesh{
    constructor(gl, x,y,z){
        this.dirty = true;
        this.verticies = [];
        this.colors = [];
        this.uvs = [];
        this.lights = [];
        this.modelViewMatrix = matrix4.create();
        this.position = {x,y,z};
        this.scale = [1,1,1];
        this.gl = gl;
        this.quaternion = quaternion.create();
        this.rotX = 0;
        this.rotY = 0;
        this.ab = gl.ARRAY_BUFFER;
        this.dd = gl.DYNAMIC_DRAW;
        this.eab = gl.ELEMENT_ARRAY_BUFFER;
        this.float = gl.FLOAT;

        this.positionBuffer = gl.createBuffer();
        this.colorBuffer = gl.createBuffer();
        this.lightBuffer = gl.createBuffer();
        this.uvBuffer = gl.createBuffer();
        this.indiciesBuffer = gl.createBuffer();
        this.darknessBuffer = gl.createBuffer();
    }

    addVerticies(verticies, colors, uvs,lights){
        verticies.forEach(vertex => { this.verticies.push(vertex); });
        this.updateColors(colors);  
        uvs.forEach(uv => { this.uvs.push(uv);});
        this.updateLights(lights);
    }

    updateMesh(){
        let gl = this.gl;
        let indiciesNeeded = this.verticies.length/4;

        this.verticiesBuffer32 = new Float32Array(this.verticies.length*3);
        this.verticiesBuffer32.set(this.verticies);
        this.uvArrayBuffer32 = new Float32Array(this.uvs.length*12);
        this.indiciesBuffer16 = new Uint16Array(indiciesNeeded*6);

        let vertexCounter = 0;
        let counter = 0;

        this.uvs.forEach(uv => {
            this.uvArrayBuffer32[counter] = uv[0];
            this.uvArrayBuffer32[counter+1] = uv[1];
            counter += 2;
        });

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

        gl.bindBuffer(this.ab, this.positionBuffer);
        gl.bufferData(this.ab, this.verticiesBuffer32, this.dd);

        this.uploadColors();
        this.uploadLights();

        gl.bindBuffer(this.ab, this.uvBuffer);
        gl.bufferData(this.ab, this.uvArrayBuffer32, this.dd);

        gl.bindBuffer(this.eab, this.indiciesBuffer);
        gl.bufferData(this.eab, this.indiciesBuffer16, this.dd);

        this.dirty = false;
    }

    translate(x, y, z){
        this.position.x += x;
        this.position.y += y;
        this.position.z += z;
        this.updateMatrix();
    }

    setPosition(x, y, z){
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
        this.updateMatrix();
    }

    setScale(s){
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
        matrix4.fromRotationTranslationScale(this.modelViewMatrix, this.quaternion, [this.position.x, this.position.y, this.position.z],this.scale);
    }

    updateColors(colors){
        this.colors = [];
        colors.forEach(color => { color.forEach(c => {this.colors.push(c);})});
    }
    updateLights(lights){
        this.lights = [];
        lights.forEach(light => { light.forEach(l => {this.lights.push(l);})});
    }

    uploadColors(){
        this.colorArrayBuffer32 = new Float32Array(this.colors.length*4);
        this.colorArrayBuffer32.set(this.colors);
        this.gl.bindBuffer(this.ab, this.colorBuffer);
        this.gl.bufferData(this.ab, this.colorArrayBuffer32, this.dd);
    }
    uploadLights(){
        this.lightArrayBuffer32 = new Float32Array(this.lights.length*4);
        this.lightArrayBuffer32.set(this.lights);
        this.gl.bindBuffer(this.ab, this.lightBuffer);
        this.gl.bufferData(this.ab, this.lightArrayBuffer32, this.dd);
    }

    render(gl, shaderProgram, projectionMatrix, texture,darkness, uvs, colors){
        if (this.dirty) return;
        if (uvs != null){
            this.uvs = [];
            uvs.forEach(uv => { this.uvs.push(uv);});
            let counter = 0;
            this.uvs.forEach(uv => {
                this.uvArrayBuffer32[counter] = uv[0];
                this.uvArrayBuffer32[counter+1] = uv[1];
                counter += 2;
            });
            gl.bindBuffer(this.ab, this.uvBuffer);
            gl.bufferData(this.ab, this.uvArrayBuffer32, this.dd);

        }

        if (colors != null){
            this.updateColors(colors);
            this.uploadColors();
        }

        gl.bindBuffer(this.ab, this.positionBuffer);
        gl.vertexAttribPointer(shaderProgram.locations.attribLocations.vertexPosition, 3, this.float, false, 0, 0);
        gl.enableVertexAttribArray(shaderProgram.locations.attribLocations.vertexPosition);

        gl.bindBuffer(this.ab, this.colorBuffer);
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
        gl.uniform1f(shaderProgram.locations.uniformLocations.darkness, darkness);
        gl.uniformMatrix4fv(shaderProgram.locations.uniformLocations.projectionMatrix, false, projectionMatrix);
        gl.uniformMatrix4fv(shaderProgram.locations.uniformLocations.modelViewMatrix, false, this.modelViewMatrix);

        gl.bindBuffer(this.eab, this.indiciesBuffer);
        gl.drawElements(gl.TRIANGLES,  this.numberOfIndicies,gl.UNSIGNED_SHORT,0);
    }
}

export default Mesh;