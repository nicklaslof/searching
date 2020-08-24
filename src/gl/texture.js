class Texture{
    constructor(texture, x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.texture = texture;
        this.dirty = false;
    }

    getUVs(){
        if (!this.textureWidth || this.dirty){
            this.textureWidth = 128;
            this.textureHeight = 128;
            let w = 1 / this.textureWidth;
            let h = 1 / this.textureHeight;

            let u = (this.x * w)%1;
            let v = (this.y * h)%1;
            let u2 = ((this.width) * w)+u;
            let v2 = ((this.height) * h)+v;

            this.uvs = [[u,v2,0.0],[u2,v2,0.0], [u2,v,0.0],[u,v,0.0]];
        }
        return this.uvs;
    }

}

export default Texture;