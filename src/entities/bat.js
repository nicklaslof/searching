import Billboardsprite from "./billboardsprite.js";
import LevelRender from "../level/levelrender.js";

class Bat extends Billboardsprite{
    constructor(x,y,z,gl){
        super(x,y,z,LevelRender.batTexture,gl);

    }
}
export default Bat;