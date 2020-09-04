
import Level from "../level/level.js"
import UI from "../ui/ui.js";
class GameScreen{
    constructor(gl, uic, shaderprogram,type) {
        this.gl = gl;
        this.shaderprogram = shaderprogram;
        this.level = new Level(this.gl, this.shaderprogram,type);
        this.ui = new UI(uic);
    }

    tick(deltaTime){
        this.level.tick(deltaTime);
    }

    render(){
       this.level.render();
       this.ui.render(this.level);
    }
}
export default GameScreen
