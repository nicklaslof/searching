import Tile from "./tile.js"
class AirTile extends Tile{
    constructor() {
        super();
    }

    b(entity){
        return false;
    }
    
}
export default AirTile;