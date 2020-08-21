class Vector3{

    constructor(x,y,z){
        this.setVector(x,y,z);
        this.setTransformedVector(x, y, z);
    }

    setVector(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    setTransformedVector(x,y,z){
        this.tx = x;
        this.ty = y;
        this.tz = z;
    }

    add(x,y,z){
        this.x += x;
        this.y += y;
        this.z += z;
    }
}

export default Vector3;