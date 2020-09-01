import LevelRender from "../level/levelrender.js";
import Item from "./item.js";

class Wand extends Item{
    constructor(x,y,z,gl,onGroundScale,level) {
        super("wand",x,y,z,LevelRender.wand,gl,level);
        this.onGroundScale = onGroundScale;
        this.modifier = (level == 1?2:4);
    }

   
}
export default Wand;