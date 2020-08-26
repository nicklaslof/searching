import LevelRender from "../level/levelrender.js";
import Item from "./item.js";
class Aquamarine extends Item{
    constructor(x,y,z,gl,onGroundScale) {
        super("aquamarine",x,y,z,LevelRender.aquamarine,gl);
        this.onGroundScale = onGroundScale;
    }
}
export default Aquamarine;