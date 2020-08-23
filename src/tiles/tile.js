
class Tile{
    constructor(texture) {
       if (texture != null){
           this.texture = texture;
       }
    }

    getUVs(){
        return this.texture.getUVs();
    }

    b(entity){
       return true;
    }
    c(tile){
        return false;
    }
}
export default Tile