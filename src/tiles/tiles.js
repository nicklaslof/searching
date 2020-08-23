import WallTile from "./walltile.js";
import AirTile from "./airtile.js";
import LevelRender from "../level/levelrender.js";
class Tiles{
    static walltile;
    static airtile;
    constructor() {
        Tiles.walltile = new WallTile(LevelRender.stoneWall);
        Tiles.airtile = new AirTile();
    }
}
export default Tiles;