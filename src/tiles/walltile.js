import Tile from "./tile.js"
class WallTile extends Tile{
    constructor() {
        super();
    }
    c(tile){
        return true;
    }
}
export default WallTile;