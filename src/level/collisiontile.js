class CollisionTile{
    constructor(x,z) {
      //  console.log("new");
        this.x = x;
        this.z = z;
        this.e = []
    }
    
    addEntityToTile(entity){
        this.e.push(entity);
    }

    removeEntityFromTile(entity){
        for(let i = this.e.length - 1; i >= 0; i--) {
            if(this.e[i] === entity) {
                this.e.splice(i, 1);
            }
        }
    }

    getEntities(){
        return this.e;
    }
}
export default CollisionTile