import MeshBuilder from "../gl/meshbuilder.js";
import LevelRender from "../level/levelrender.js";
import Particle from "./particle.js"
import Entity from "./entity.js"
import Game from "../game.js";
const c = [0.5,0.5,0.7,1]

class Box extends Entity{
    constructor(x,y,z,gl,triggerId) {
        super("b",x,y-0.2,z,1,triggerId);
        let meshBuilder = MeshBuilder.start(gl, x,y,z);
        this.texture = LevelRender.dirt;
        MeshBuilder.left(this.texture.getUVs(),meshBuilder,0,0,0,1,1,c);
        MeshBuilder.right(this.texture.getUVs(),meshBuilder,0,0,0,1,1,c);
        MeshBuilder.back(this.texture.getUVs(),meshBuilder,0,0,0,1,1,c);
        MeshBuilder.front(this.texture.getUVs(),meshBuilder,0,0,0,1,1,c);
        MeshBuilder.top(this.texture.getUVs(),meshBuilder,0,0,0,1,0,c);
        MeshBuilder.bottom(this.texture.getUVs(),meshBuilder,0,0,0,1,0,c);
        this.mesh = MeshBuilder.build(meshBuilder);
        this.mesh.setS(0.5);
        this.raidus=-0.5;
    }
    removeThisEntity(level){
        this.removeFromCollision(level,this.currentTileX, this.currentTileZ);
        for (let i = 0; i < 20; i++){
            level.addEntity(new Particle(this.p.x-0.2+this.getRand()/3,-0.2,this.p.z-0.2+this.getRand()/3,LevelRender.lava,level.gl,this.getRand(),0,this.getRand(),0,this.getRand()/7,[0.25,0.25,0.35,1]));
        }
        this.reset();
        Game.playNoise(0.9);
        level.displayMessage("A new box appears","",3);
        
    }
    render(gl,shaderprogram,pm,playerHurt){
        this.mesh.setPos(this.p.x, this.p.y-0.1, this.p.z);
        this.mesh.render(gl,shaderprogram,pm,this.texture.texture,playerHurt);    
    }
    knockback(x,z,s){
        this.knockBack.x = x;
        this.knockBack.z = z;
        this.normalize(this.knockBack);
        this.knockBack.x *= s;
        this.knockBack.z *= s;
    }

    collidedBy(entity, level){
        super.collidedBy(entity,level);
        if (entity.n == "p"){
            if (this.hitCounter< 0.1) return;
            let dirX = entity.p.x - this.p.x;
            let dirZ = entity.p.z - this.p.z;
            if(this.distanceToOtherEntity(entity) < 0.8){
                //This will bug if the player stands on the box and the box can't move but I don't really know
                //how to solve this right now.
                Game.playNoise(0.2);
                this.knockback(Math.round(dirX), Math.round(dirZ),0.75);
                this.hitCounter = 0;

            }
        }
    }

}
export default Box;