import LevelRender from "../level/levelrender.js";
import Item from "./item.js";
class Torch extends Item{
    constructor(x,y,z,gl,onGroundScale) {
        super("torch",x,y,z,LevelRender.torch,gl);
        this.onGroundScale = onGroundScale;
    }
}
export default Torch;