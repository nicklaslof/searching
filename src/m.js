import Game from "./game.js";
window.onload = function () {

    let g = new Game();
    requestAnimationFrame(mainloop);
    function mainloop(){
       requestAnimationFrame(mainloop);
       g.mainloop();
   }
};