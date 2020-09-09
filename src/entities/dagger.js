import LevelRender from "../level/levelrender.js";
import Item from "./item.js";

class Dagger extends Item{
    constructor(x,y,z,gl,onGroundScale,level) {
        super("dagger",x,y,z,LevelRender.dagger,gl,onGroundScale,level);
        
        this.modifier = (level == 1?1:2);
    }

   
}
export default Dagger;