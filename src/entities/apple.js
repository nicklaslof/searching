import Item from "./item.js";
import LevelRender from "../level/levelrender.js";
class Apple extends Item{
    constructor(x,y,z,gl,onGroundScale) {
        super("apple",x,y,z,LevelRender.apple,gl);
        this.onGroundScale = onGroundScale;
        this.respawn = false;
    }
    use(level, entity){
        entity.heal(1);
        entity.removeCurrentItem(level);
    }
}
export default Apple