import Tile from "./tile.js";
import LevelRender from "../level/levelrender.js";
class LavaTile extends Tile{
    constructor() {
        super(LevelRender.lava);
        this.setHeight(2);
        this.setYOffset(-0.9);
        this.setBlocksLight(false);
    }

    blocks(e){
        if (e.n == "projectile" || e.n == "bat") return false;
        return true;
    }
    
}
export default LavaTile;