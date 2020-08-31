import LevelRender from "../level/levelrender.js";
import Item from "./item.js";

class Dagger extends Item{
    constructor(x,y,z,gl,onGroundScale,level) {
        super("dagger",x,y,z,LevelRender.dagger,gl,level);
        this.onGroundScale = onGroundScale;
        this.modifier = (level == 1?1:2);
        console.log("modifier "+this.level +" "+this.modifier);
    }

   
}
export default Dagger;