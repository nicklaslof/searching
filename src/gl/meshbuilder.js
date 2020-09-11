 import Mesh from "../gl/mesh.js";
const baseSize = 0.5;
const white = [1,1,1,1];
class MeshBuilder{


    static start(gl,x,y,z){
        return {mesh:new Mesh(gl,x,y,z),verticies:[],colors:[],uvs:[],lights:[]};
    }

    static addColor(colors,color){
        if (color == null) color = white;
            colors.push(color,color,color,color);
    }

    static addLight(lights,light){
        let l = [light,light,light,1];
        lights.push(l,l,l,l);
    }
    
    static build(meshBuild){
        meshBuild.mesh.addVerticies(meshBuild.verticies, meshBuild.colors, meshBuild.uvs,meshBuild.lights);
        meshBuild.mesh.updateMesh();
        return meshBuild.mesh;
    }

    static left(uvs,render,x,y,z,light,height,yOffset,color){
        if (height == null) height = 1;
        if (yOffset!=null) y += yOffset;
        for(let h = 0; h < height; h++){
            MeshBuilder.addColor(render.colors,color);
            MeshBuilder.addLight(render.lights,light);
            uvs.forEach(uv => { render.uvs.push(uv); });
            render.verticies.push(
                x-baseSize,y+h-baseSize,z-baseSize,
                x-baseSize,y+h-baseSize,z+baseSize,
                x-baseSize,y+h+baseSize,z+baseSize,
                x-baseSize,y+h+baseSize,z-baseSize
            );
        }
       
    }
    static right(uvs,render,x,y,z,light,height,yOffset,color){
        if (height == null) height = 1;
        if (yOffset!=null) y += yOffset;
        for(let h = 0; h < height; h++){
            MeshBuilder.addColor(render.colors,color);
            MeshBuilder.addLight(render.lights,light);
            uvs.forEach(uv => { render.uvs.push(uv); });
            render.verticies.push(
                x+baseSize,y+h-baseSize,z-baseSize,
                x+baseSize,y+h+baseSize,z-baseSize,
                x+baseSize,y+h+baseSize,z+baseSize,
                x+baseSize,y+h-baseSize,z+baseSize
            );
        }
    }
    static front(uvs,render,x,y,z,light,height,yOffset,color){
        if (height == null) height = 1;
        if (yOffset!=null) y += yOffset;
        for(let h = 0; h < height; h++){
            MeshBuilder.addColor(render.colors,color);
            MeshBuilder.addLight(render.lights,light);
            uvs.forEach(uv => { render.uvs.push(uv); });
            render.verticies.push(
                x-baseSize,y+h-baseSize,z+baseSize,
                x+baseSize,y+h-baseSize,z+baseSize,
                x+baseSize,y+h+baseSize,z+baseSize,
                x-baseSize,y+h+baseSize,z+baseSize
            );
        }
    }
    static back(uvs,render,x,y,z,light,height,yOffset,color){
        if (height == null) height = 1;
        if (yOffset!=null) y += yOffset;
        for(let h = 0; h < height; h++){
            MeshBuilder.addColor(render.colors,color);
            MeshBuilder.addLight(render.lights,light);
            uvs.forEach(uv => { render.uvs.push(uv); });
            render.verticies.push(
                x-baseSize,y+h-baseSize,z-baseSize,
                x-baseSize,y+h+baseSize,z-baseSize,
                x+baseSize,y+h+baseSize,z-baseSize,
                x+baseSize,y+h-baseSize,z-baseSize
            );
        }
    }

    
    static top(uvs,render,x,y,z,light,yOffset, color){
        if (yOffset!=null) y += yOffset;
        MeshBuilder.addColor(render.colors,color);
        MeshBuilder.addLight(render.lights,light);
        uvs.forEach(uv => { render.uvs.push(uv); });
        render.verticies.push(
            x-baseSize,y-baseSize,z-baseSize,
            x+baseSize,y-baseSize,z-baseSize,
            x+baseSize,y-baseSize,z+baseSize,
            x-baseSize,y-baseSize,z+baseSize
        );
    }
    static bottom(uvs,render,x,y,z,light,yOffset, color){
        if (yOffset!=null) y += yOffset;
        MeshBuilder.addColor(render.colors,color);
        MeshBuilder.addLight(render.lights,light);
        uvs.forEach(uv => { render.uvs.push(uv); });
        render.verticies.push(
            x-baseSize,y+baseSize,z-baseSize,
            x-baseSize,y+baseSize,z+baseSize,
            x+baseSize,y+baseSize,z+baseSize,
            x+baseSize,y+baseSize,z-baseSize
        ); 
    }

}
export default MeshBuilder;