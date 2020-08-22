import WallTile from "./walltile.js";
import AirTile from "./airtile.js";
class Tiles{
    static walltile;
    static airtile;
    constructor() {
        Tiles.walltile = new WallTile();
        Tiles.airtile = new AirTile();
    }
}
export default Tiles;