
class Tile{
    constructor(texture) {
       this.texture = texture;
       this.blocksLight = true;
       this.height = 2;
       this.YOffset = 0;
    }

    getUVs(){
        return this.texture.getUVs();
    }

    //Does this tile block this type of entity
    blocks(e){
       return true;
    }
    //Does this tile connects with this tile (used for optimizing so walls doesn't add non visible sides between eachother)
    connectsWith(tile){
        return false;
    }

    //These functions returns this allowing chaining of functions
    setHeight(h){
        this.height = h;
        return this;
    }
    setYOffset(o){
        this.YOffset = o;
        return this;
    }

    setBlocksLight(b){
        this.blocksLight = b;
        return this
    }
}
export default Tile