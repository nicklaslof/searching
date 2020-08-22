class Texture {
    constructor(gl, file) {
        this.tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.tex);

        let level = 0;
        let internalFormat = gl.RGBA;
        let width = 1;
        let height = 1;
        let border = 0;
        let srcFormat = gl.RGBA;
        let srcType = gl.UNSIGNED_BYTE;
        let pixel = new Uint8Array([255, 255, 255, 255]);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
        let image = new Image();
        image.onload  = () =>{
            gl.bindTexture(gl.TEXTURE_2D, this.tex);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        };

        image.src = file;
    }
}

export default Texture;