import Camera from "../gl/camera.js"
import Texture from "../gl/texture.js"
import Mesh from "../gl/mesh.js"
const s = 0.5;
class Level{
    constructor(gl,shaderprogram) {
        this.shaderprogram = shaderprogram;
        this.gl = gl;
        this.camera = new Camera(gl, 0,-0.2,-10);
        this.wallTexture = new Texture(gl, "./assets/bricks.png");
        this.floorTexture = new Texture(gl, "./assets/floor.png");
        this.roofTexture = new Texture(gl, "./assets/roof.png");

        this.wallmeshes = [];
        this.roofMeshes = [];
        this.floorMeshes = [];

        this.addWalls();
        this.addRoof();
        this.addFloor();
    }

    addRoof(){
        let m = new Mesh(this.gl,0,0,0);
        let v = [];
        let c = [];
        let u = [];
        for (let z = 0; z < 16; z++) {
            this.roof(v, c, u,0,0,z);
        }
        m.addVerticies(v, c, u);
        m.updateMesh();
        this.roofMeshes.push(m);
    }
    addFloor(){
        let m = new Mesh(this.gl,0,0,0);
        let v = [];
        let c = [];
        let u = [];
        
        for (let z = 0; z < 16; z++) {
            this.floor(v, c, u,0,0,z);
        }
        m.addVerticies(v, c, u);
        m.updateMesh();
        this.floorMeshes.push(m);
    }

    addWalls(){
        let m = new Mesh(this.gl,0,0,0);
        let v = [];
        let c = [];
        let u = [];
        for (let z = 0; z < 16; z++) {
            this.left(v, c, u,0,0,z);
            this.right(v, c, u,0,0,z);
        }
        m.addVerticies(v, c, u);
        m.updateMesh();
        this.wallmeshes.push(m);
    }

    ac(colors){
        colors.push([1,1,1,1.0],[1,1,1,1.0],[1,1,1,1.0],[1,1,1,1.0]);
    }

    roof(verticies, colors,uvs,x,y,z){
        this.ac(colors);
        uvs.push([0,0],[1,0],[1,1],[0,1]);
        verticies.push(
            [x-s,y+s,z-s],
            [x-s,y+s,z+s],
            [x+s,y+s,z+s],
            [x+s,y+s,z-s]
        );
    }
    floor(verticies,colors,uvs,x,y,z){
        this.ac(colors);
        uvs.push([1,0],[0,0],[0,1],[1,1]);
        verticies.push(
            [x-s,y-s,z-s],
            [x+s,y-s,z-s],
            [x+s,y-s,z+s],
            [x-s,y-s,z+s]
        ); 
    }

    left(verticies, colors,uvs,x,y,z){
        this.ac(colors);
        uvs.push([0,1],[1,1],[1,0],[0,0]);
        verticies.push(
            [x-s,y-s,z-s],
            [x-s,y-s,z+s],
            [x-s,y+s,z+s],
            [x-s,y+s,z-s]
        );
    }
    right(verticies, colors,uvs,x,y,z){
        this.ac(colors);
        uvs.push([1,1],[1,0],[0,0],[0,1]);
        verticies.push(
            [x+s,y-s,z-s],
            [x+s,y+s,z-s],
            [x+s,y+s,z+s],
            [x+s,y-s,z+s]
        );
    }

    tick(inputHandler){
        let deltaTime = 0.016;
        this.counter += deltaTime;
        let v = {x:0,y:0,z:0};

        if (inputHandler.isKeyDown(65))this.camera.rotate(-1 * deltaTime);
        if (inputHandler.isKeyDown(68))this.camera.rotate(1 * deltaTime);
        if (inputHandler.isKeyDown(87))v.z = 4;
        if (inputHandler.isKeyDown(83))v.z = -4;
        this.camera.translate(v.x*deltaTime, v.y*deltaTime, v.z*deltaTime);
        this.camera.update();
    }

    render(){
        this.wallmeshes.forEach(mesh =>{
            mesh.render(this.gl,this.shaderprogram,this.camera.pm, this.camera.vm, this.wallTexture);
        });
        this.roofMeshes.forEach(mesh =>{
            mesh.render(this.gl,this.shaderprogram,this.camera.pm, this.camera.vm,this.roofTexture);
        });
        this.floorMeshes.forEach(mesh =>{
            mesh.render(this.gl,this.shaderprogram,this.camera.pm, this.camera.vm,this.floorTexture);
        });
    }
}

export default Level