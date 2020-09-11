
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

    blocks(e){
       return true;
    }
    connectsWith(tile){
        return false;
    }

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