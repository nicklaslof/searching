import ShaderProgram from "./gl/shaderprogram.js"
import GameScreen from "./screens/gamescreen.js"
import * as matrix4 from "./gl/matrix4.js";
import InputHandler from "./inputhandler.js";

class Game{

constructor() {
        this.canvas = document.getElementById("webgl-canvas");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.gl = this.canvas.getContext("webgl");
        console.log(this.gl);
        this.inputHandler = new InputHandler(document);
        this.shaderProgram = new ShaderProgram(this.gl,
            `
            precision highp float;

            attribute vec4 vp;
            attribute vec4 col;
            attribute vec2 aUV;
            uniform mat4 mvm;
            uniform mat4 vm;
            uniform mat4 pm;
            varying vec4 vc;
            varying vec2 uv;
            varying float zDist;
        
            void main() {
                gl_Position = pm * vm * mvm * vp;
                vc = col;
                uv = aUV;
                zDist = gl_Position.z/110.0;
            }
          `,
          `
            precision highp float;
            varying vec4 vc;
            varying vec2 uv;
            varying float zDist;
            uniform sampler2D s;
            void main() {
                //gl_FragColor = texture2D(s, uv) * vc;
                vec4 col = texture2D(s, uv) * vc;
                gl_FragColor = vec4(col.rgb-(zDist*4.5),1.0);
            }
        `
        );

        this.gamescreen = new GameScreen(this.gl, this.shaderProgram);
    }
     mainloop(){
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.clearDepth(1);
        this.gl.clearColor(0,0,0,1);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.frontFace(this.gl.CCW);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.cullFace(this.gl.FRONT);

       // this.gl.depthFunc(this.gl.LEQUAL );
        this.gamescreen.tick(this.inputHandler);
        this.gamescreen.render();
    }
}

export default Game;