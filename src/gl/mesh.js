import * as matrix4 from "./matrix4.js";
import * as quaternion from "./quaternion.js";

class Mesh{
    constructor(gl, x,y,z){
        this.dirty = true;
        this.verticies = [];
        this.colors = [];
        this.uvs = [];
        this.modelViewMatrix = matrix4.create();
        this.position = {x,y,z};
        this.scale = [1,1,1];
        this.gl = gl;
        this.quaternion = quaternion.create();

        this.positionBuffer = gl.createBuffer();
        this.colorBuffer = gl.createBuffer();
        this.uvBuffer = gl.createBuffer();
        this.indiciesBuffer = gl.createBuffer();
    }

    addVerticies(verticies, colors, uvs){
        verticies.forEach(vertex => { this.verticies.push(vertex); });
        colors.forEach(color => { this.colors.push(color);});
        uvs.forEach(uv => { this.uvs.push(uv);});
    }

    updateMesh(){
        let gl = this.gl;
        
        let indiciesNeeded = this.verticies.length/4;

        this.verticiesBuffer32 = new Float32Array(this.verticies.length*10);
        this.colorArrayBuffer32 =  new Float32Array(this.verticies.length*10);
        this.uvArrayBuffer32 = new Float32Array(this.verticies.length*10);
        this.indiciesBuffer16 = new Uint16Array(indiciesNeeded*10);

        let vertexCounter = 0;

        let counter = 0;
        this.verticies.forEach(vertex => { 
            this.verticiesBuffer32[counter] = vertex[0];
            this.verticiesBuffer32[counter+1] = vertex[1];
            this.verticiesBuffer32[counter+2] = vertex[2];
            counter += 3;
        });

        counter = 0;
        this.colors.forEach(color => {
            this.colorArrayBuffer32[counter] = color[0];
            this.colorArrayBuffer32[counter+1] = color[1];
            this.colorArrayBuffer32[counter+2] = color[2];
            this.colorArrayBuffer32[counter+3] = color[3];
            counter += 4;
        });

        counter = 0;
        this.uvs.forEach(uv => {
            this.uvArrayBuffer32[counter] = uv[0];
            this.uvArrayBuffer32[counter+1] = uv[1];
            counter += 2;
        });
        //console.log(this.uvs);

        counter = 0;
        for (let i = 0; i < indiciesNeeded; i++){
            this.indiciesBuffer16[counter] = 0 + vertexCounter;
            this.indiciesBuffer16[counter+1] = 1 + vertexCounter;
            this.indiciesBuffer16[counter+2] = 2 + vertexCounter;
            this.indiciesBuffer16[counter+3] = 0 + vertexCounter;
            this.indiciesBuffer16[counter+4] = 2 + vertexCounter;
            this.indiciesBuffer16[counter+5] = 3 + vertexCounter;
            vertexCounter += 4;
            counter += 6;
        }

        this.numberOfIndicies = counter;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.verticiesBuffer32, gl.DYNAMIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.colorArrayBuffer32, gl.DYNAMIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.uvArrayBuffer32, gl.DYNAMIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indiciesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indiciesBuffer16, gl.DYNAMIC_DRAW);

        this.dirty = false;
    }

    translate(x, y, z){
        this.position.x += x;
        this.position.y += y;
        this.position.z += z;
        matrix4.fromRotationTranslationScale(this.modelViewMatrix, this.quaternion, [this.position.x, this.position.y, this.position.z],this.scale);
    }

    setPosition(x, y, z){
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
        matrix4.fromRotationTranslationScale(this.modelViewMatrix, this.quaternion, [this.position.x, this.position.y, this.position.z],this.scale);
    }

    setScale(s){
        this.scale[0]=s;
        this.scale[1]=s;
        this.scale[2]=s;
        matrix4.fromRotationTranslationScale(this.modelViewMatrix, this.quaternion, [this.position.x, this.position.y, this.position.z],this.scale);
    }

    rotateY(r){
        quaternion.rotateY(this.quaternion, this.quaternion, r);
        matrix4.fromRotationTranslationScale(this.modelViewMatrix, this.quaternion, [this.position.x, this.position.y, this.position.z],this.scale);
    }
    setQuaternion(q){
        this.quaternion = q;
        matrix4.fromRotationTranslationScale(this.modelViewMatrix, this.quaternion, [this.position.x, this.position.y, this.position.z],this.scale);
    }
    setRotation(r){
        quaternion.fromEuler(this.quaternion,0,r,0);
        matrix4.fromRotationTranslationScale(this.modelViewMatrix, this.quaternion, [this.position.x, this.position.y, this.position.z],this.scale);
    }

    render(gl, shaderProgram, projectionMatrix, viewMatrix, texture, uvs){
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
            gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.uvArrayBuffer32, gl.DYNAMIC_DRAW);

        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(shaderProgram.locations.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shaderProgram.locations.attribLocations.vertexPosition);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(shaderProgram.locations.attribLocations.color, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shaderProgram.locations.attribLocations.color);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.vertexAttribPointer(shaderProgram.locations.attribLocations.uv, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shaderProgram.locations.attribLocations.uv);

        gl.useProgram(shaderProgram.shaderProgram);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture.tex);
        gl.uniform1i(shaderProgram.locations.uniformLocations.uSampler, 0);

        gl.uniformMatrix4fv(shaderProgram.locations.uniformLocations.projectionMatrix, false, projectionMatrix);
        gl.uniformMatrix4fv(shaderProgram.locations.uniformLocations.modelViewMatrix, false, this.modelViewMatrix);
        gl.uniformMatrix4fv(shaderProgram.locations.uniformLocations.viewMatrix, false, viewMatrix);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indiciesBuffer);
        gl.drawElements(gl.TRIANGLES,  this.numberOfIndicies,gl.UNSIGNED_SHORT,0);
    }
}

export default Mesh;