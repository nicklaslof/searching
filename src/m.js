import Game from "./game.js";
window.onload = function () {
    document.getElementById("s").addEventListener("click", (e) => { 
        e.target.style.display = "none";
        let g = new Game();
        requestAnimationFrame(mainloop);
        function mainloop(t){
           requestAnimationFrame(mainloop);
           g.mainloop(t);
       }
    });
};