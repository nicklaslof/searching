import Camera from "../gl/camera.js"
import Vector3 from "../gl/vector3.js"
import Texture from "../gl/texture.js"
import Mesh from "../gl/mesh.js"
import Color from "../gl/color.js"
class Level{
    constructor(gl,shaderprogram) {
        this.shaderprogram = shaderprogram;
        this.gl = gl;
        this.camera = new Camera(gl, new Vector3(0,-0.3,-10));
        this.wallTexture = new Texture(gl, "./assets/bricks.png");
        this.floorTexture = new Texture(gl, "./assets/floor.png");
        this.roofTexture = new Texture(gl, "./assets/roof.png");

        this.wallmeshes = [];
        this.roofMeshes = [];
        this.floorMeshes = [];

        this.addWalls();
        this.addRoofMesh();
        this.addFloorMesh();
    }

    addRoofMesh(){
        var m = new Mesh(this.gl,new Vector3(0,0,0));
        var v = [];
        var c = [];
        var u = [];
        for (let z = 0; z < 16; z++) {
            this.addRoof(v, c, u,0,0,z);
        }
        m.addVerticies(v, c, u);
        m.updateMesh();
        this.roofMeshes.push(m);
    }
    addFloorMesh(){
        var m = new Mesh(this.gl,new Vector3(0,0,0));
        var v = [];
        var c = [];
        var u = [];
        for (let z = 0; z < 16; z++) {
            this.addFloor(v, c, u,0,0,z);
        }
        m.addVerticies(v, c, u);
        m.updateMesh();
        this.floorMeshes.push(m);
    }

    addWalls(){
        var m = new Mesh(this.gl,new Vector3(0,0,0));
        var v = [];
        var c = [];
        var u = [];
        for (let z = 0; z < 16; z++) {
            this.addLeft(v, c, u,0,0,z);
            this.addRight(v, c, u,0,0,z);
        }
        m.addVerticies(v, c, u);
        m.updateMesh();
        this.wallmeshes.push(m);
    }

    addColors(colors){
        colors.push(new Color(1,1,1,1.0), new Color(1,1,1,1.0), new Color(1,1,1,1.0), new Color(1,1,1,1.0));
    }

    addRoof(verticies, colors,uvs,x,y,z){
        this.addColors(colors);
        uvs.push(new Vector3(0.0,0.0,0.0), new Vector3(1.0,0.0,0.0), new Vector3(1.0,1.0,0.0), new Vector3(0.0,1.0,0.0));
        verticies.push(
            this.av(x-1.0,y+1.0,z-1.0),
            this.av(x-1.0,y+1.0,z+1.0),
            this.av(x+1.0,y+1.0,z+1.0),
            this.av(x+1.0,y+1.0,z-1.0)
        );
    }
    addFloor(verticies,colors,uvs,x,y,z){
        this.addColors(colors);
        uvs.push(new Vector3(0.0,0.0,0.0), new Vector3(1.0,0.0,0.0), new Vector3(1.0,1.0,0.0), new Vector3(0.0,1.0,0.0));
        verticies.push(
            this.av(x-1.0, y-1.0, z-1.0),
            this.av(x+1.0, y-1.0, z-1.0),
            this.av(x+1.0, y-1.0, z+ 1.0),
            this.av(x-1.0, y-1.0, z+ 1.0)
        ); 
    }

    addLeft(verticies, colors,uvs,x,y,z){
        this.addColors(colors);
        uvs.push(new Vector3(0.0,1.0,0.0), new Vector3(1.0,1.0,0.0), new Vector3(1.0,0.0,0.0), new Vector3(0.0,0.0,0.0));
        verticies.push(
            this.av(x-1.0,y-1.0,z-1.0),
            this.av(x-1.0,y-1.0,z+1.0),
            this.av(x-1.0,y+1.0,z+1.0),
            this.av(x-1.0,y+1.0,z-1.0)
        );
    }
    addRight(verticies, colors,uvs,x,y,z){
        this.addColors(colors);
        uvs.push(new Vector3(1.0,1.0,0.0), new Vector3(1.0,0.0,0.0), new Vector3(0.0,0.0,0.0), new Vector3(0.0,1.0,0.0));
        verticies.push(
            this.av(x+1.0,y-1.0,z-1.0),
            this.av(x+1.0,y+1.0,z-1.0),
            this.av(x+1.0,y+1.0,z+1.0),
            this.av(x+1.0,y-1.0,z+1.0)
        );
    }

    av(x,y,z){
        return {x:x,y:y,z:z}; 
    }


    tick(inputHandler){
        var deltaTime = 0.016;
        this.counter += deltaTime;
        var v = new Vector3(0,0,0);

        if (inputHandler.isKeyDown(65)){
           this.camera.rotate(-1 * deltaTime);
        }

        if (inputHandler.isKeyDown(68)){
            this.camera.rotate(1 * deltaTime);
        }

        if (inputHandler.isKeyDown(87)){
            v.z = 4;
        }

        if (inputHandler.isKeyDown(83)){
            v.z = -4;
        }
        this.camera.translate(v.x*deltaTime, v.y*deltaTime, v.z*deltaTime);
        this.camera.update();
    }

    render(){
        this.wallmeshes.forEach(mesh =>{
            mesh.render(this.gl,this.shaderprogram,this.camera.projectionMatrix, this.camera.viewMatrix, this.wallTexture);
        });
        this.roofMeshes.forEach(mesh =>{
            mesh.render(this.gl,this.shaderprogram,this.camera.projectionMatrix, this.camera.viewMatrix,this.roofTexture);
        });
        this.floorMeshes.forEach(mesh =>{
            mesh.render(this.gl,this.shaderprogram,this.camera.projectionMatrix, this.camera.viewMatrix,this.floorTexture);
        });
    }
}

export default Level