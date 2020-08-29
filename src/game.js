import ShaderProgram from "./gl/shaderprogram.js"
import GameScreen from "./screens/gamescreen.js"
import InputHandler from "./inputhandler.js";

class Game{
    static inputHandler;
constructor() {
        this.supportsPerformance = (typeof performance === 'undefined' ? false : true);
        this.uc = document.getElementById("ui").getContext("2d");
        this.c = document.getElementById("gl");
        
        this.width = this.c.width;
        this.height = this.c.height;
        this.gl = this.c.getContext("webgl");
        Game.inputHandler = new InputHandler(document);
        this.shaderProgram = new ShaderProgram(this.gl,`precision lowp float;attribute vec4 vp;attribute vec4 col;attribute vec4 l;attribute vec2 aUV;uniform float d;uniform mat4 mvm;uniform mat4 pm;varying vec4 vc;varying vec2 uv;varying float zDist;varying vec4 li;void main() {gl_Position = pm * mvm * vp;vc = col;li=l;uv = aUV;zDist = gl_Position.z/d;}`,`precision lowp float;varying vec4 vc;varying vec2 uv;varying float zDist;varying vec4 li;uniform sampler2D s;void main() {vec4 col = texture2D(s, uv) * vc;gl_FragColor = vec4(col.rgb-zDist,col.a)+(col.rgba*(li*1.2));}`);
        this.gamescreen = new GameScreen(this.gl, this.uc, this.shaderProgram);
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
        let deltaTime = this.now - this.previousUpdate;
        this.previousUpdate = this.now;
        this.gamescreen.tick(deltaTime/1000);
        this.gamescreen.render();
    }
}

export default Game;