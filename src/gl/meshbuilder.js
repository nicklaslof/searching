import Mesh from "../gl/mesh.js";
const s = 0.5;
const white = [1,1,1,1];
class MeshBuilder{


    static start(gl,x,y,z){
        let m = new Mesh(gl,x,y,z);
        let v = [];
        let c = [];
        let u = [];
        let l = [];
        return {m,v,c,u,l};
    }

    static ac(colors,c){
        if (c == null) c = white;
            colors.push(c,c,c,c);
    }

    static al(lights,light){
        let l = [light,light,light,1];
        lights.push(l,l,l,l);
    }


    static build(r){
        r.m.addVerticies(r.v, r.c, r.u,r.l);
        r.m.updateMesh();
        return r.m;
    }

    static left(uvs,render,x,y,z,light,height,yOffset,c){
        if (height == null) height = 1;
        if (yOffset!=null) y += yOffset;
        //render.u.push([0,1],[1,1],[1,0],[0,0]);
        //render.u.push(tile.getUVs());

        
        //console.log(tile.getUVs());
        for(let i = 0; i < height; i++){
            MeshBuilder.ac(render.c,c);
            MeshBuilder.al(render.l,light);
            uvs.forEach(uv => { render.u.push(uv); });
            render.v.push(
                x-s,y+i-s,z-s,
                x-s,y+i-s,z+s,
                x-s,y+i+s,z+s,
                x-s,y+i+s,z-s
            );
        }
       
    }
    static right(uvs,render,x,y,z,light,height,yOffset,c){
        if (height == null) height = 1;
        if (yOffset!=null) y += yOffset;
        for(let i = 0; i < height; i++){
            MeshBuilder.ac(render.c,c);
            MeshBuilder.al(render.l,light);
            //render.u.push([1,1],[1,0],[0,0],[0,1]);
            //render.u.push(tile.getUVs());
            uvs.forEach(uv => { render.u.push(uv); });
            render.v.push(
                x+s,y+i-s,z-s,
                x+s,y+i+s,z-s,
                x+s,y+i+s,z+s,
                x+s,y+i-s,z+s
            );
        }
    }
    static front(uvs,render,x,y,z,light,height,yOffset,c){
        if (height == null) height = 1;
        if (yOffset!=null) y += yOffset;
        for(let i = 0; i < height; i++){
            MeshBuilder.ac(render.c,c);
            MeshBuilder.al(render.l,light);
            //render.u.push([1,1],[0,1],[0,0],[1,0]);
            //render.u.push(tile.getUVs());
            uvs.forEach(uv => { render.u.push(uv); });
            render.v.push(
                x-s,y+i-s,z+s,
                x+s,y+i-s,z+s,
                x+s,y+i+s,z+s,
                x-s,y+i+s,z+s
            );
        }
    }
    static back(uvs,render,x,y,z,light,height,yOffset,c){
        if (height == null) height = 1;
        if (yOffset!=null) y += yOffset;
        for(let i = 0; i < height; i++){
            MeshBuilder.ac(render.c,c);
            MeshBuilder.al(render.l,light);
            //render.u.push([1,1],[1,0],[0,0],[0,1]);
            //render.u.push(tile.getUVs());
            uvs.forEach(uv => { render.u.push(uv); });
            render.v.push(
                x-s,y+i-s,z-s,
                x-s,y+i+s,z-s,
                x+s,y+i+s,z-s,
                x+s,y+i-s,z-s
            );
        }
    }

    
    static top(uvs,render,x,y,z,light,yOffset, c){
        if (yOffset!=null) y += yOffset;
        MeshBuilder.ac(render.c,c);
        MeshBuilder.al(render.l,light);
        //render.u.push([0,0],[1,0],[1,1],[0,1]);
        uvs.forEach(uv => { render.u.push(uv); });
        render.v.push(
            x-s,y-s,z-s,
            x+s,y-s,z-s,
            x+s,y-s,z+s,
            x-s,y-s,z+s
        );
    }
    static bottom(uvs,render,x,y,z,light,yOffset, c){
        if (yOffset!=null) y += yOffset;
        MeshBuilder.ac(render.c,c);
        MeshBuilder.al(render.l,light);
        //render.u.push([1,0],[0,0],[0,1],[1,1]);
        uvs.forEach(uv => { render.u.push(uv); });
        render.v.push(
            x-s,y+s,z-s,
            x-s,y+s,z+s,
            x+s,y+s,z+s,
            x+s,y+s,z-s
        ); 
    }

}
export default MeshBuilder;