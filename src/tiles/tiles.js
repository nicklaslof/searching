import WallTile from "./walltile.js";
import AirTile from "./airtile.js";
import LevelRender from "../level/levelrender.js";
import Tile from "./tile.js";
class Tiles{
    static walltile;
    static airtile;
    static grassWallTile;
    static stoneWallTile;
    static light;
    static lava;
    static appareringFloor;
    constructor() {
        Tiles.walltile = new WallTile(LevelRender.bricks).setHeight(2);
        Tiles.stoneWallTile = new WallTile(LevelRender.stoneWall).setHeight(2);
        Tiles.grassyStoneWallTile = new WallTile(LevelRender.grassyStoneWall).setHeight(2);
        Tiles.airtile = new AirTile().setBlocksLight(false);
        Tiles.light = new AirTile();
        Tiles.lava = new Tile(LevelRender.lava).setHeight(1).setYOffset(-0.9);
        Tiles.appareringFloor = new Tile(LevelRender.lava).setHeight(1).setYOffset(-0.9).setBlocksLight(false);
    }
}
export default Tiles;