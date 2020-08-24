class CollisionTile{
    constructor(x,z) {
        this.x = x;
        this.z = z;
        this.entities = []
    }
    
    addEntityToTile(entity){
        this.entities.push(entity);
    }

    removeEntityFromTile(entity){
        for(var i = this.entities.length - 1; i >= 0; i--) {
            if(this.entities[i] === entity) {
                this.entities.splice(i, 1);
            }
        }
    }

    getEntities(){
        return this.entities;
    }
}
export default CollisionTile