import WallTile from "./walltile.js";
import AirTile from "./airtile.js";
import LevelRender from "../level/levelrender.js";
import Tile from "./tile.js";
import LavaTile from "./lava.js";
import NoFloor from "./nofloor.js";
class Tiles{
    static walltile;
    static airtile;
    static grassWallTile;
    static stoneWallTile;
    static light;
    static lava;
    static appareringFloor;
    static noFloor;
    constructor() {
        Tiles.walltile = new WallTile(LevelRender.bricks).setHeight(3).setYOffset(-1);
        Tiles.stoneWallTile = new WallTile(LevelRender.stoneWall).setHeight(3).setYOffset(-1);
        Tiles.grassyStoneWallTile = new WallTile(LevelRender.grassyStoneWall).setHeight(3).setYOffset(-1);
        Tiles.airtile = new AirTile().setBlocksLight(false);
        Tiles.light = new AirTile();
        Tiles.lava = new LavaTile();
        Tiles.appareringFloor = new Tile(LevelRender.lava).setHeight(1).setYOffset(-0.9).setBlocksLight(false);
        Tiles.noFloor = new NoFloor();
    }
}
export default Tiles;