import ShaderProgram from "./gl/shaderprogram.js"
import GameScreen from "./screens/gamescreen.js"
import InputHandler from "./inputhandler.js";

class Game{
    static inputHandler;
constructor() {
        this.supportsPerformance = (typeof performance === 'undefined' ? false : true);
        this.uicanvas = document.getElementById("ui-canvas").getContext("2d");
        this.canvas = document.getElementById("webgl-canvas");
        
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.gl = this.canvas.getContext("webgl");
        console.log(this.gl);
        console.log(this.uicanvas);
        Game.inputHandler = new InputHandler(document);
        this.shaderProgram = new ShaderProgram(this.gl,`precision lowp float;attribute vec4 vp;attribute vec4 col;attribute vec4 l;attribute vec2 aUV;uniform mat4 mvm;uniform mat4 pm;varying vec4 vc;varying vec2 uv;varying float zDist;void main() {gl_Position = pm * mvm * vp;vc = col + l;uv = aUV;zDist = gl_Position.z;}`,`precision lowp float;varying vec4 vc;varying vec2 uv;varying float zDist;uniform sampler2D s;void main() {vec4 col = texture2D(s, uv) * vc;gl_FragColor = vec4(col.rgb-(zDist/25.0),col.a);}`);
        this.gamescreen = new GameScreen(this.gl, this.uicanvas, this.shaderProgram);
    }
     mainloop(){
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.clearColor(0,0,0,1);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LESS);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.disable(this.gl.BLEND);

        if (this.supportsPerformance){
            this.now = performance.now();
        }else{
            this.now = Date.now();
        }
        var deltaTime = this.now - this.previousUpdate;
        this.previousUpdate = this.now;
        this.gamescreen.tick(deltaTime/1000);
        this.gamescreen.render();
    }
}

export default Game;