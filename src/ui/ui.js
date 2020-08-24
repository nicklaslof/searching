class UI{
    constructor(canvas) {
        this.canvas = canvas;
        this.canvas.imageSmoothingEnabled = false;
        this.centerX = this.canvas.canvas.width/2;
        this.image = new Image();
        this.image.onload  = () =>{
        };
        this.image.src="./assets/font.png";

        this.characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!+:";
        this.fontWidth = 6;
        this.fontHeight = 8;
    }

    tick(deltatime){

    }

    render(level){
        this.canvas.clearRect(0, 0, this.canvas.canvas.width, this.canvas.canvas.height);
        this.drawText(level.getUIText(),150);
    }

    drawText(text,y){
        this.drawTextAt(text,this.centerX - (text.length * 8)+this.fontWidth,y);
    }

    drawTextAt(text,x,y){
        this.canvas.globalAlpha = 0.7;
        for (let i = 0; i < text.length; i++) {
            this.canvas.drawImage(this.image,this.characters.indexOf(text[i].toUpperCase())*this.fontWidth,0,this.fontWidth,this.fontHeight,x,y,10,10);
            x += 16;
        }
        this.canvas.globalAlpha = 1;
    }
}

export default UI;