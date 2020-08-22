class Entity{
    constructor(x,y,z) {
        this.position = {x,y,z};
        this.tempVector = {x:0,y:0,z:0};
        this.movement = {x:0,y:0,z:0};
        this.radius = 0.4;

    }

    getPosition(){
        return this.position;
    }

    tick(deltaTime,level){
        
    }

    render(){
        
    }

    canMove(level,x,z){
        var x1 = Math.floor(x + 0.5 + this.radius);
        var z1 = Math.floor(z + 0.5 + this.radius);
		var x2 = Math.floor(x + 0.5 - this.radius);
        var z2 = Math.floor(z + 0.5 - this.radius);
        if (level.getTile(x1, z1).b(this)) return false;
        if (level.getTile(x2, z1).b(this)) return false;
        if (level.getTile(x1, z2).b(this)) return false;
        if (level.getTile(x2, z2).b(this)) return false;
        return true;
    }
    
}

export default Entity;