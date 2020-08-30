import Tile from "./tile.js"
class NoFloor extends Tile{
    constructor() {
        super();
    }

    b(entity){
        if (entity.n == "projectile") return false;
        return true;
    }

}
export default NoFloor;