class Entity{
    constructor(name,x,y,z,health, triggerId) {
        this.name = name;
        this.position = {x,y,z};
        this.tempVector = {x:0,y:0,z:0};
        this.movement = {x:0,y:0,z:0};
        this.knockBack = {x:0,z:0};
        this.radius = 0.4;
        this.currentTileX = Math.round(this.position.x);
        this.currentTileZ = Math.round(this.position.z);
        this.hitCounter = 0;
        this.notAddedToCollider = true;
        this.dispose = false;
        this.triggerId = triggerId;

        if (health == null || health == 0){
            this.invinsible = true;
        }else{
            this.currentHealth = health;
            this.maxHealth = health;
        }

    }

    hit(hitByEntity, amount){
            if (this.hitCounter>= 0.3){
                let dirX = hitByEntity.position.x - this.position.x;
                let dirZ = hitByEntity.position.z - this.position.z;
                this.hitCounter = 0;
                this.knockback(dirX, dirZ);
                this.currentHealth -= amount;
            }
    }

    getPosition(){
        return this.position;
    }

    removeThisEntity(level){
        this.dispose = true;
        this.removeFromCollision(level,this.currentTileX, this.currentTileZ);
        level.removeEntity(this);
    }

    tick(deltaTime,level){
        if (this.notAddedToCollider){
            this.addToCollision(level,this.currentTileX, this.currentTileZ);
            this.notAddedToCollider = false;
        }
        if (this.currentHealth <=0 && !this.invinsible){
           this.removeThisEntity(level);
        }

        if (this.knockBack.x > -0.2 && this.knockBack.x < 0.2) this.knockBack.x = 0;
        if (this.knockBack.z > -0.2 && this.knockBack.z < 0.2) this.knockBack.z = 0;
        if (this.knockBack.x !=0 || this.knockBack.z !=0){
            let knockX = this.position.x - this.knockBack.x * 15 * deltaTime;
            let knockZ = this.position.z - this.knockBack.z * 15 *deltaTime;
            if (this.canMove(level, knockX, this.position.z))this.position.x = knockX;
            if (this.canMove(level, this.position.x, knockZ))this.position.z = knockZ;
            this.knockBack.x /= 68*deltaTime;
            this.knockBack.z /= 68*deltaTime;
        }
        
        this.hitCounter +=deltaTime;
        let tileX = Math.round(this.position.x);
        let tileZ = Math.round(this.position.z);
        if (this.currentTileX != tileX){
            this.removeFromCollision(level,this.currentTileX, this.currentTileZ);
            this.currentTileX = tileX;
            this.addToCollision(level,this.currentTileX, this.currentTileZ);
        } 
        if (this.currentTileZ != tileZ){
            this.removeFromCollision(level,this.currentTileX, this.currentTileZ);
            this.currentTileZ = tileZ;
            this.addToCollision(level,this.currentTileX, this.currentTileZ);
        }

        for (let x = this.currentTileX-2; x < this.currentTileX+2; x++){
            for (let z = this.currentTileZ-2; z < this.currentTileZ+2; z++){
                let tile = level.getCollisionTile(x,z);
                if (tile!=null){
                    tile.getEntities().forEach(e => {
                        if (e == this)return;
                        e.collidedBy(this, level);
                    });
                }
            }
        }
    }

    collidedBy(entity, level){
    }

    trigger(level, source){
        if (source == this) return;
        console.log("Triggered! "+this);
    }
    untrigger(level, source){
        if (source == this) return;
        console.log("unTriggered! "+this);
    }

    addToCollision(level,x,z){
        level.getCollisionTile(x, z).addEntityToTile(this);
    }

    removeFromCollision(level,x,z){
        level.getCollisionTile(x, z).removeEntityFromTile(this);
    }

    knockback(x,z){
        if (this.knockBack.x !=0 || this.knockBack.z !=0) return;
        this.knockBack.x = x;
        this.knockBack.z = z;
        this.normalize(this.knockBack);
    }

    render(gl,shaderprogram,pm,vm){
        
    }

    canMove(level,x,z){
        var x1 = Math.round(x + this.radius);
        var z1 = Math.round(z + this.radius);
		var x2 = Math.round(x - this.radius);
        var z2 = Math.round(z - this.radius);
        if (level.getTile(x1, z1).b(this)) return false;
        if (level.getTile(x2, z1).b(this)) return false;
        if (level.getTile(x1, z2).b(this)) return false;
        if (level.getTile(x2, z2).b(this)) return false;
        return true;
    }

    normalize(v) {
        let len = v.x * v.x + v.z * v.z;
        if (len > 0) {
          len = 1 / Math.sqrt(len);
        }
        v.x *= len;
        v.z *= len;
    }
    distance(v1, v2) {
        let x = v1.x - v2.x
        let z = v1.z - v2.z;
        return Math.hypot(x, z);
      }

      distanceToOtherEntity(entity){
        let myPos = {x:this.position.x,z:this.position.z}
        let ePos = {x:entity.position.x,z:entity.position.z}
        let d = this.distance(myPos, ePos);
        return d;
      }
    
}

export default Entity;