
import Level from "../level/level.js"
import UI from "../ui/ui.js";
class GameScreen{
    constructor(gl, uicanvas, shaderprogram) {
        this.gl = gl;
        this.shaderprogram = shaderprogram;
        this.level = new Level(this.gl, this.shaderprogram,"level1");
        this.ui = new UI(uicanvas);
    }

    tick(deltaTime){
        this.level.tick(deltaTime);
        this.ui.tick(deltaTime);
    }

    render(){
       this.level.render();
       this.ui.render();

    }
}
export default GameScreen
