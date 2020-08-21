import Game from "./game.js";
window.onload = function () {

    var g = new Game();
    requestAnimationFrame(mainloop);
    function mainloop(){
       requestAnimationFrame(mainloop);
       g.mainloop();
   }
};