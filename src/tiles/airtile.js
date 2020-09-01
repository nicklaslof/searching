import Tile from "./tile.js"
class AirTile extends Tile{
    constructor() {
        super();
    }

    blocks(e){
        return false;
    }
    
}
export default AirTile;