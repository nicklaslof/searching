
import UI from "../ui/ui.js";
import Game from "../game.js";
class IntroScreen{
    constructor(uic) {
        this.ui = new UI(uic);
    }

    tick(deltaTime, game){
        this.ui.tick(deltaTime);
        if (Game.inputHandler.isKeyDown(49)) Game.startRoguelike();
        if (Game.inputHandler.isKeyDown(50)) Game.startCheckpoints();
    }

    render(){
       this.ui.renderIntro();
    }
}
export default IntroScreen
