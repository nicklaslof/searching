import MeshBuilder from "../gl/meshbuilder.js";
import LevelRender from "../level/levelrender.js";
import Particle from "./particle.js"
import Entity from "./entity.js"
const c = [0.5,0.5,0.7,1]

class Box extends Entity{
    constructor(x,y,z,gl,triggerId) {
        super("b",x,y-0.2,z,1,triggerId);
        let r = MeshBuilder.start(gl, x,y,z);
        this.texture = LevelRender.dirt;
        let uvs = this.texture.getUVs();
        MeshBuilder.left(uvs,r,0,0,0,1,1,0,c);
        MeshBuilder.right(uvs,r,0,0,0,1,1,0,c);
        MeshBuilder.back(uvs,r,0,0,0,1,1,0,c);
        MeshBuilder.front(uvs,r,0,0,0,1,1,0,c);
        MeshBuilder.top(uvs,r,0,0,0,1,0,c);
        MeshBuilder.bottom(uvs,r,0,0,0,1,0,c);
        this.mesh = MeshBuilder.build(r);
        this.mesh.setS(0.5);
        this.raidus=-0.5;
    }
    removeThisEntity(level){
        this.removeFromCollision(level,this.currentTileX, this.currentTileZ);
        for (let i = 0; i < 20; i++){
            level.addEntity(new Particle(this.p.x-0.2+this.getRand()/3,-0.2,this.p.z-0.2+this.getRand()/3,LevelRender.lava,level.gl,this.getRand(),0,this.getRand(),0,this.getRand()/7,[0.25,0.25,0.35,1]));
        }
        this.reset();
        level.displayMessage("A new box magically appears","",3);
        
    }
    render(gl,shaderprogram,pm,darkness){
        this.mesh.setPos(this.p.x, this.p.y-0.1, this.p.z);
        this.mesh.render(gl,shaderprogram,pm,this.texture.texture,darkness);    
    }
    knockback(x,z,s){
        this.knockBack.x = x;
        this.knockBack.z = z;
        this.normalize(this.knockBack);
        if (s != null){
            this.knockBack.x *= s;
            this.knockBack.z *= s;
        }
    }

    collidedBy(entity, level){
        super.collidedBy(entity,level);
        if (entity.n == "p"){
            if (this.hitCounter< 0.1) return;
            let dirX = entity.p.x - this.p.x;
            let dirZ = entity.p.z - this.p.z;
            let d = this.distanceToOtherEntity(entity);
            if(d < 0.6){
                this.knockback(Math.round(dirX), Math.round(dirZ),0.75);
                this.hitCounter = 0;

            }
        }
    }

}
export default Box;