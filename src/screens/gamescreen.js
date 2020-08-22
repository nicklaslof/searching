
import Level from "../level/level.js"
class GameScreen{
    constructor(gl, shaderprogram) {
        this.gl = gl;
        this.shaderprogram = shaderprogram;
        this.level = new Level(this.gl, this.shaderprogram,"level1");
    }

    tick(deltaTime){
        this.level.tick(deltaTime);
    }

    render(){
       this.level.render();
    }
}
export default GameScreen