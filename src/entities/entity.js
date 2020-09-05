class Entity{
    constructor(n,x,y,z,health, triggerId) {
        this.n = n;
        this.orginalPos = {x,y,z};
        this.health = health;
        this.radius = 0.4;
        this.hitCounter = 0;
        this.triggerId = triggerId;
        this.respawn = true;
        this.reset();
    }
    reset(){
        this.p = {x:this.orginalPos.x,y:this.orginalPos.y,z:this.orginalPos.z};
        if (this.health == null || this.health == 0){
            this.invinsible = true;
        }else{
            this.currentHealth = this.health;
            this.maxHealth = this.health;
        }
        this.dispose = false;
        this.notAddedToCollider = true;
        this.knockBack = {x:0,z:0};
        this.tempVector = {x:0,y:0,z:0};
        this.currentTileX = Math.round(this.p.x);
        this.currentTileZ = Math.round(this.p.z);
    }

    heal(amount){
        this.currentHealth += amount;
    }
    hit(level, hitByEntity, amount){
            if (this.hitCounter>= 0.5){
                let dirX = hitByEntity.p.x - this.p.x;
                let dirZ = hitByEntity.p.z - this.p.z;
                this.hitCounter = 0;
                this.knockback(dirX, dirZ);
                this.currentHealth -= amount;
            }
    }

    removeThisEntity(level){
        this.dispose = true;
        this.removeFromCollision(level,this.currentTileX, this.currentTileZ);
        
        if (!this.respawn) level.removeEntity(this);
        else this.respawnTimer = 40 + (this.getRand()*40);
    }

    setNotRespawn(){
        this.respawn = false;
        return this;
    }
    

    tick(deltaTime,level){
        if (this.dispose){
            if (this.respawnTimer > 0.0){
                this.respawnTimer -= deltaTime;
            }else{
                this.respawnTimer = 0.0;
                this.reset();
            }
            return;
         }
        
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
            let knockX = this.p.x - this.knockBack.x * 5 * deltaTime;
            let knockZ = this.p.z - this.knockBack.z * 5 *deltaTime;
            if (this.canMove(level, knockX, this.p.z))this.p.x = knockX;
            if (this.canMove(level, this.p.x, knockZ))this.p.z = knockZ;
            this.knockBack.x /= 65*deltaTime;
            this.knockBack.z /= 65*deltaTime;
        }
        
        this.hitCounter +=deltaTime;
        let tileX = Math.round(this.p.x);
        let tileZ = Math.round(this.p.z);
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
    }
    untrigger(level, source){
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

    render(gl,shaderprogram,pm,darkess){
    }

    canMove(level,x,z){
        let x1 = Math.round(x + this.radius);
        let z1 = Math.round(z + this.radius);
		let x2 = Math.round(x - this.radius);
        let z2 = Math.round(z - this.radius);
        if (level.getTile(x1, z1).blocks(this)) return false;
        if (level.getTile(x2, z1).blocks(this)) return false;
        if (level.getTile(x1, z2).blocks(this)) return false;
        if (level.getTile(x2, z2).blocks(this)) return false;
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
        let myPos = {x:this.p.x,z:this.p.z}
        let ePos = {x:entity.p.x,z:entity.p.z}
        let d = this.distance(myPos, ePos);
        return d;
    }

    getRand(){
        return Math.random();
    }
    
}

export default Entity;