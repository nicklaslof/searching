
import Level from "../level/level.js"
import UI from "../ui/ui.js";
class GameScreen{
    constructor(gl, uic, shaderprogram) {
        this.level = new Level(gl, shaderprogram);
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
