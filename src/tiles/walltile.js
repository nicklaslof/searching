import Tile from "./tile.js"
class WallTile extends Tile{
    constructor(texture) {
        super(texture);
    }
    c(tile){
        return true;
    }
}
export default WallTile;