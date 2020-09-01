import ShaderProgram from "./gl/shaderprogram.js"
import GameScreen from "./screens/gamescreen.js"
import IntroScreen from "./screens/introscreen.js"
import InputHandler from "./inputhandler.js";
const width=640;
const height=480;
class Game{
    static inputHandler;
constructor() {
        this.supportsPerformance = (typeof performance === 'undefined' ? false : true);
        this.uc = document.getElementById("ui");
        this.c = document.getElementById("gl");
        this.setSize(this.c);
        this.setSize(this.uc);
        this.gl = this.c.getContext("webgl");
        Game.inputHandler = new InputHandler(document);
        this.shaderProgram = new ShaderProgram(this.gl,`precision lowp float;attribute vec4 vp;attribute vec4 col;attribute vec4 l;attribute vec2 aUV;uniform float d;uniform mat4 mvm;uniform mat4 pm;varying vec4 vc;varying vec2 uv;varying float zDist;varying vec4 li;void main(){gl_Position=pm*mvm*vp;vc=col;li=l;uv=aUV;zDist=gl_Position.z/d;}`,`precision lowp float;varying vec4 vc;varying vec2 uv;varying float zDist;varying vec4 li;uniform sampler2D s;void main(){vec4 col=texture2D(s,uv)*vc;float z=gl_FragCoord.z/gl_FragCoord.w;float fogFactor=exp2(-0.15*0.15*z*z*1.442695);fogFactor=clamp(fogFactor,0.0,1.0);vec4 c=vec4(col.rgb-zDist,col.a)+(col.rgba*(li*1.2));if(c.a<0.2) discard;gl_FragColor=mix(vec4(0.05,0.05,0.15,1),c,fogFactor);}`);
        this.gamescreen = new IntroScreen(this.uc.getContext("2d"));
    }
     mainloop(){
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.clearColor(0,0,0,1);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LESS);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.disable(this.gl.BLEND);

        this.now = this.supportsPerformance?performance.now():Date.now();
        let deltaTime = this.now - this.previousUpdate;
        this.previousUpdate = this.now;
        this.gamescreen.tick(deltaTime/1000,this);
        this.gamescreen.render();
    }

    setSize(c){
        c.width = this.width = width;
        c.height = this.height = height;
    }
    startRoguelike(){
        this.gamescreen = new GameScreen(this.gl, this.uc.getContext("2d"), this.shaderProgram,1);
    }
   // startCheckpoints(){
  //      this.gamescreen = new GameScreen(this.gl, this.uc.getContext("2d"), this.shaderProgram,2);
   // }
}

export default Game;