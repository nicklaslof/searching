
import UI from "../ui/ui.js";
import Game from "../game.js";
class IntroScreen{
    constructor(uic) {
        this.ui = new UI(uic);
    }

    tick(deltaTime, game){
        this.ui.tick(deltaTime);
        if (Game.inputHandler.wasKeyJustPressed(49)) game.startRoguelike();
        if (Game.inputHandler.wasKeyJustPressed(50)) game.startCheckpoints();
    }

    render(){
       this.ui.renderIntro();
    }
}
export default IntroScreen
