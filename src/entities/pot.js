import Entity from "./entity.js";
import LevelRender from "../level/levelrender.js";
import Billboardsprite from "./billboardsprite.js";
class Pot extends Billboardsprite{
    constructor(x,y,z,gl, triggerId) {
        super("pot", x,y-0.2,z,LevelRender.pot,gl, 2, triggerId);
        this.mesh.setScale(0.6);
    }
}

export default Pot;