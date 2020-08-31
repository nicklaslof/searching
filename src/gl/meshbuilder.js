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

    static ac(cc,c){
        if (c == null) c = white;
            cc.push(c,c,c,c);
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

    static left(uvs,render,x,y,z,light,h,yOffset,c){
        h = h == null?1:h;
        if (yOffset!=null) y += yOffset;
        for(let i = 0; i < h; i++){
            this.add(render,c,light,uvs);
            render.v.push(
                x-s,y+i-s,z-s,
                x-s,y+i-s,z+s,
                x-s,y+i+s,z+s,
                x-s,y+i+s,z-s
            );
        }
    }
    static right(uvs,render,x,y,z,light,h,yOffset,c){
        h = h == null?1:h;
        if (yOffset!=null) y += yOffset;
        for(let i = 0; i < h; i++){
            this.add(render,c,light,uvs);
            render.v.push(
                x+s,y+i-s,z-s,
                x+s,y+i+s,z-s,
                x+s,y+i+s,z+s,
                x+s,y+i-s,z+s
            );
        }
    }
    
    static front(uvs,render,x,y,z,light,h,yOffset,c){
        h = h == null?1:h;
        if (yOffset!=null) y += yOffset;
        for(let i = 0; i < h; i++){
            this.add(render,c,light,uvs);
            render.v.push(
                x-s,y+i-s,z+s,
                x+s,y+i-s,z+s,
                x+s,y+i+s,z+s,
                x-s,y+i+s,z+s
            );
        }
    }
    static back(uvs,render,x,y,z,light,h,yOffset,c){
        h = h == null?1:h;
        if (yOffset!=null) y += yOffset;
        for(let i = 0; i < h; i++){
            this.add(render,c,light,uvs);
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
        this.add(render,c,light,uvs);
        render.v.push(
            x-s,y-s,z-s,
            x+s,y-s,z-s,
            x+s,y-s,z+s,
            x-s,y-s,z+s
        );
    }
    static bottom(uvs,render,x,y,z,light,yOffset, c){
        if (yOffset!=null) y += yOffset;
        this.add(render,c,light,uvs);
        render.v.push(
            x-s,y+s,z-s,
            x-s,y+s,z+s,
            x+s,y+s,z+s,
            x+s,y+s,z-s
        ); 
    }

    static add(render,col,l,uvs){
        MeshBuilder.ac(render.c,col);
        MeshBuilder.al(render.l,l);
        uvs.forEach(uv => { render.u.push(uv); });
    }

}
export default MeshBuilder;