//Stores entities in this tile. Used for checking collisions between entities without looping over all entities in the world all the time
class CollisionTile{
    constructor() {
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