import WallTile from "./walltile.js";
import AirTile from "./airtile.js";
import LevelRender from "../level/levelrender.js";
class Tiles{
    static walltile;
    static airtile;
    static grassWallTile;
    static stoneWallTile;
    static light;
    constructor() {
        Tiles.walltile = new WallTile(LevelRender.bricks);
        Tiles.stoneWallTile = new WallTile(LevelRender.stoneWall);
        Tiles.grassyStoneWallTile = new WallTile(LevelRender.grassyStoneWall);
        Tiles.airtile = new AirTile();
        Tiles.light = new AirTile();
    }
}
export default Tiles;