import MeshBuilder from "../gl/meshbuilder.js";
import LevelRender from "../level/levelrender.js";
import Entity from "./entity.js"


class Box extends Entity{
    constructor(x,y,z,gl,triggerId) {
        super("box",x,y,z,0,triggerId);
        let r = MeshBuilder.start(gl, x,y,z);
        this.texture = LevelRender.dirt;
        let uvs = this.texture.getUVs();
        this.light = [0,0,0,1];
        MeshBuilder.left(uvs,r,0,0,0,1);
        MeshBuilder.right(uvs,r,0,0,0,1);
        MeshBuilder.back(uvs,r,0,0,0,1);
        MeshBuilder.front(uvs,r,0,0,0,1);
        MeshBuilder.top(uvs,r,0,0,0,1);
        MeshBuilder.bottom(uvs,r,0,0,0,1);
        this.mesh = MeshBuilder.build(r);
        this.mesh.setScale(0.7);
    }
    render(gl,shaderprogram,pm,darkness){
        this.mesh.setPosition(this.position.x, this.position.y-0.1, this.position.z);
        this.mesh.render(gl,shaderprogram,pm,this.texture.texture,darkness);    
    }
    knockback(x,z){
        this.knockBack.x = x;
        this.knockBack.z = z;
        this.normalize(this.knockBack);
    }

    collidedBy(entity, level){
        super.collidedBy(entity,level);
        if (entity.name == "player"){
            let dirX = entity.position.x - this.position.x;
            let dirZ = entity.position.z - this.position.z;
            let d = this.distanceToOtherEntity(entity);
            if(d < 1){
                //if (this.hitCounter>= 0.3){
               //     this.hitCounter = 0;
                    super.knockback(dirX/3, dirZ/3);
               // }
            }
        }
    }

}
export default Box;