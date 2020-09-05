
import UI from "../ui/ui.js";
import Game from "../game.js";
import Level from "../level/level.js"
import LevelRender from "../level/levelrender.js"
class IntroScreen{
    constructor(gl, uic, shaderprogram,type) {
        this.level = new Level(gl, shaderprogram,type);
        this.ui = new UI(uic);
    }

    tick(deltaTime, game){
        if (isNaN(deltaTime)) return;
        LevelRender.camera.rotate(0.15*deltaTime);
        LevelRender.camera.setPos(45, 0.3, 45);
        if (Game.inputHandler.isKeyDown(49)) Game.startRoguelike();
        if (Game.inputHandler.isKeyDown(50)) Game.startCheckpoints();
    }

    render(){
        this.level.render();
        this.ui.renderIntro();
    }
}
export default IntroScreen
