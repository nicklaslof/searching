import ShaderProgram from "./gl/shaderprogram.js"
import GameScreen from "./screens/gamescreen.js"
import IntroScreen from "./screens/introscreen.js"
import InputHandler from "./inputhandler.js";
const width=640;
const height=480;
class Game{
    static inputHandler;
    static newGame;
    static respawn;
    constructor() {
        this.uc = document.getElementById("u");
        this.c = document.getElementById("g");
        this.setSize(this.c);
        this.setSize(this.uc);
        Game.newGame = false;
        Game.respawn = false;
        this.gl = this.c.getContext("webgl");
        Game.inputHandler = new InputHandler(document);
        this.shaderProgram = new ShaderProgram(this.gl,`precision lowp float;attribute vec4 p;attribute vec4 c;attribute vec4 l;attribute vec2 u;uniform mat4 mvm;uniform mat4 pm;varying vec4 vc;varying vec2 uv;varying float d;varying vec4 li;void main(){gl_Position=pm*mvm*p;vc=c;li=l;uv=u;d=gl_Position.z/27.0;}`,`precision lowp float;varying vec4 vc;varying vec2 uv;varying float d;varying vec4 li;uniform sampler2D s;uniform float h;void main(){vec4 col=texture2D(s,uv)*vc;float z=gl_FragCoord.z/gl_FragCoord.w;float fogFactor=exp2(-0.15*0.15*z*z*1.4);fogFactor=clamp(fogFactor,0.0,1.0);vec4 c=vec4(col.rgb-d,col.a)+(col.rgba*(li*1.2));if(c.a<0.2)discard;if(h>0.0)gl_FragColor=vec4(1,0,0,1);else gl_FragColor=mix(vec4(0.05,0.05,0.15,1),c,fogFactor);}`);
        this.gamescreen = new IntroScreen(this.gl,this.uc.getContext("2d"), this.shaderProgram,1);
    }
     mainloop(t){
         if (Game.newGame){
            this.gamescreen = new GameScreen(this.gl, this.uc.getContext("2d"), this.shaderProgram,1);
            Game.newGame = false;
         }

         if (Game.respawn){
            this.gamescreen.level.restart();
             Game.respawn = false;
         }

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.clearColor(0,0,0,1);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LESS);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.disable(this.gl.BLEND);

        let deltaTime = t - this.previousUpdate;
        this.previousUpdate = t;
        if (deltaTime > 32) deltaTime = 32;
        this.gamescreen.tick(deltaTime/1000,this);
        this.gamescreen.render();
    }

    setSize(c){
        c.width = this.width = width;
        c.height = this.height = height;
        c.addEventListener('click', (e) => { this.c.requestPointerLock(); this.startAudio();});
    }

    startAudio(){
        Game.a = new AudioContext();
    }

    static playAudio(f,l){
        if (Game.a == null) return;
        let o = Game.a.createOscillator();
        let g = Game.a.createGain();
        o.connect(g);
        g.connect(Game.a.destination);
        o.start();
        o.frequency.value = f;
        g.gain.linearRampToValueAtTime(
            g.gain.value, Game.a.currentTime
        );
        g.gain.exponentialRampToValueAtTime(
            0.00001, Game.a.currentTime + l+0.2
        );

        setTimeout(function(){
            o.disconnect();
            g.disconnect();
        },1000);
    }
    static playNoise(l){
        if (Game.a == null) return;
        
        var bufferSize = 2048;
        var lastOut = 0.0;

        let g2 = Game.a.createGain();
        g2.connect(Game.a.destination);
        let n = Game.a.createScriptProcessor(bufferSize, 1, 1);
        n.onaudioprocess = function(e) {
            var output = e.outputBuffer.getChannelData(0);
            for (var i = 0; i < bufferSize; i++) {
                var nn = Math.random() * 2 - 1;
                output[i] = (lastOut + (0.02 * nn)) / 1.02;
                lastOut = output[i];
                output[i] *= 3.5;
            }
        }
        
        g2.gain.linearRampToValueAtTime(
            g2.gain.value, Game.a.currentTime
        );

        n.connect(g2);

        g2.gain.exponentialRampToValueAtTime(
            0.00001, Game.a.currentTime + l+0.1
        );

        setTimeout(function(){
            n.disconnect();
            g2.disconnect();
        },1000);
    }

    static startRoguelike(){
        Game.newGame = true;
    }
    static startCheckpoints(){
        Game.checkpoints = true;
        Game.startRoguelike();
    }
    static restart(){
        if (!Game.checkpoints) window.location.reload(false);
        else Game.respawn = true;
    }
}

export default Game;