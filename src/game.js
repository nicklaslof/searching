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
        this.uiCancas = document.getElementById("u");
        this.gameCanvas = document.getElementById("g");
        this.setSize(this.gameCanvas);
        this.setSize(this.uiCancas);
        Game.newGame = false;
        Game.respawn = false;
        this.gl = this.gameCanvas.getContext("webgl");
        Game.inputHandler = new InputHandler(document);
        this.shaderProgram = new ShaderProgram(this.gl,`precision lowp float;attribute vec4 p;attribute vec4 c;attribute vec4 l;attribute vec2 u;uniform mat4 mvm;uniform mat4 pm;varying vec4 vc;varying vec2 uv;varying float d;varying vec4 li;void main(){gl_Position=pm*mvm*p;vc=c;li=l;uv=u;d=gl_Position.z/27.0;}`,`precision lowp float;varying vec4 vc;varying vec2 uv;varying float d;varying vec4 li;uniform sampler2D s;uniform float h;void main(){vec4 col=texture2D(s,uv)*vc;float z=gl_FragCoord.z/gl_FragCoord.w;float fogFactor=exp2(-0.15*0.15*z*z*1.4);fogFactor=clamp(fogFactor,0.0,1.0);vec4 c=vec4(col.rgb-d,col.a)+(col.rgba*(li*1.2));if(c.a<0.2)discard;if(h>0.0)gl_FragColor=vec4(1,0,0,1);else gl_FragColor=mix(vec4(0.05,0.05,0.15,1),c,fogFactor);}`);
        //Vertex shader
        //precision lowp float;
        //attribute vec4 p; //Position of the vertex
        //attribute vec4 c; //Color of the vertex
        //attribute vec4 l; //Light of the vertex
        //attribute vec2 u; //UV of the vertex
        //uniform mat4 mvm; //ModelViewMatrix of the vertex (Position in world space)
        //uniform mat4 pm; //PerspeciveMatrix (position of the camera)
        //varying vec4 vc; //Vertexcolor sent to the Fragment shader
        //varying vec2 uv; //UV sent to the Fragment shader
        //varying float d; //Depth of the vertex. (Used to fade away the scene to make it darker the further away from the camera a vertex is placed)
        //varying vec4 li; //Light sent to the Fragment shader
        //void main(){
        //  gl_Position=pm*mvm*p;   //The position is the vertex position multiplied with the perspecivematrix and modelviewmatrix
        //  vc=c;
        //  li=l;
        //  uv=u;
        //  d=gl_Position.z/27.0;   //Calculate the depth. Increase the float to increase the range visible of the fading
        //}
        
        //Fragment shader
        //precision lowp float;
        //varying vec4 vc;  //Vertexcolor sent from the Vertex shader
        //varying vec2 uv;  //Vertex UVs sent from the Vertex shader
        //varying float d;  //Depth sent from the Vertex shader
        //varying vec4 li;  //Light sent from the Vertex shader
        //uniform sampler2D s;  //The texture
        //uniform float h;  //If player is hurt
        //void main(){
        //  vec4 col=texture2D(s,uv)*vc; //Get the color to draw based on the texture color and the vertex color (allows tinting)
        //  float z=gl_FragCoord.z/gl_FragCoord.w; // Fog in the distance. See https://www.geeks3d.com/20100228/fog-in-glsl-webgl/
        //  float fogFactor=exp2(-0.15*0.15*z*z*1.4);// Fog in the distance. See https://www.geeks3d.com/20100228/fog-in-glsl-webgl/
        //  fogFactor=clamp(fogFactor,0.0,1.0);// Fog in the distance. See https://www.geeks3d.com/20100228/fog-in-glsl-webgl/
        //  vec4 c=vec4(col.rgb-d,col.a)+(col.rgba*(li*1.2)); // Calculate the color substracting the depth to fade out in the disance added with the light of the tile
        //  if(c.a<0.2)discard;  // If alpha value is low don't draw anything to avoid issues with blending, tinting and lights
        //  if(h>0.0)gl_FragColor=vec4(1,0,0,1); // If player is hurt fill the screen with red color
        //  else gl_FragColor=mix(vec4(0.05,0.05,0.15,1),c,fogFactor);  //Otherwise mix the final color with the fogcolor
        //  }

        this.gamescreen = new IntroScreen(this.gl,this.uiCancas.getContext("2d"), this.shaderProgram);
    }

    mainloop(time){
        //Mainloop of the game. Executed 60 times every second.
        if (Game.newGame){
            this.gamescreen = new GameScreen(this.gl, this.uiCancas.getContext("2d"), this.shaderProgram);
            Game.newGame = false;
        }

        if (Game.respawn){
            this.gamescreen.level.restart();
            Game.respawn = false;
        }
        // Clear the WebGL screen and enable depthtest (z buffering so walls blocks the view from what is behind) and enable culling to only draw the sides of the mesh facing the user
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.clearColor(0,0,0,1);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LESS);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.disable(this.gl.BLEND);

        //Calculate deltatime based on time passed since last loop
        let deltaTime = time - this.previousUpdate;
        this.previousUpdate = time;
        //Probably stupid way but don't let deltatime grow too big... should probably be a higher value... 
        if (deltaTime > 32) deltaTime = 32;
        this.gamescreen.tick(deltaTime/1000,this);
        this.gamescreen.render();
    }

    setSize(canvas){
        canvas.width = this.width = width;
        canvas.height = this.height = height;
        canvas.addEventListener('click', (e) => { this.gameCanvas.requestPointerLock(); this.startAudio();});
    }

    //Start an audiocontext if it hasn't already been started. Also starts a brownian noise scriptprocessor. https://noisehack.com/generate-noise-web-audio-api/
    startAudio(){
        if (Game.audio != null) return;
        Game.audio = new AudioContext();
        var bufferSize = 512;
        var lastOut = 0.0;

        Game.noiseGain = Game.audio.createGain();
        Game.noiseGain.connect(Game.audio.destination);
        let noise = Game.audio.createScriptProcessor(bufferSize, 1, 1);
        noise.onaudioprocess = function(e) {
            var output = e.outputBuffer.getChannelData(0);
            for (var i = 0; i < bufferSize; i++) {
                var nn = Math.random() * 2 - 1;
                output[i] = (lastOut + (0.02 * nn)) / 1.02;
                lastOut = output[i];
                output[i] *= 3.5;
            }
            return true;
        }
        noise.connect(Game.noiseGain);
        Game.noiseGain.gain.value = 0;
    }

    //Play a short bleep sound with the specified frequency and length
    static playAudio(frequency,length){
        if (Game.audio == null) return;
        let oscillator = Game.audio.createOscillator();
        let gain = Game.audio.createGain();
        oscillator.connect(gain);
        gain.connect(Game.audio.destination);
        oscillator.start();
        oscillator.frequency.value = frequency;
        gain.gain.linearRampToValueAtTime( gain.gain.value, Game.audio.currentTime); //Needed to make Firefox behave (or maybe it's Chrome missbehaving for not needing this)
        gain.gain.exponentialRampToValueAtTime(0.00001, Game.audio.currentTime + length+0.2);
        oscillator.stop(Game.audio.currentTime + length+0.2);
    }

    //Play noise for the specifed time. It will just open up the gain to the noise script processor. Also cancel any ongoing ramps so we can play "multiple" noises
    static playNoise(length){
        if (Game.audio == null) return;
        Game.noiseGain.gain.cancelScheduledValues(Game.audio.currentTime);
        Game.noiseGain.gain.linearRampToValueAtTime(1, Game.audio.currentTime);
        Game.noiseGain.gain.exponentialRampToValueAtTime(0.00001, Game.audio.currentTime + length+0.1);
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