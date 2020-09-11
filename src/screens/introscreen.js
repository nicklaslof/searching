
import UI from "../ui/ui.js";
import Game from "../game.js";
import Level from "../level/level.js"
import LevelRender from "../level/levelrender.js"
class IntroScreen{
    constructor(gl, uic, shaderprogram) {
        this.level = new Level(gl, shaderprogram);
        this.ui = new UI(uic);
        this.introPos = {x:45,y:0.3,z:45};
    }

    tick(deltaTime, game){
        if (isNaN(deltaTime)) return;
        LevelRender.camera.rotate(0.15*deltaTime);
        LevelRender.camera.setPos(this.introPos);
        if (Game.inputHandler.isKeyDown(49)) Game.startRoguelike();
        if (Game.inputHandler.isKeyDown(50)) Game.startCheckpoints();
    }

    render(){
        this.level.render();
        this.ui.renderIntro();
    }
}
export default IntroScreen
