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
        this.renderItemBar();
    }

    renderItemBar(){
        this.canvas.beginPath();
        this.canvas.strokeStyle ="#444444";
        
        let number=8;
        let size=24;
        for (let x = 0; x < number; x+=1.1) {
            this.drawBox(this.canvas,(size*x)+this.centerX-(number/2)*size,10,size);
            
        }


        this.canvas.closePath();
        this.canvas.stroke();
        this.canvas.fillStyle = "#22222299";
        this.canvas.fill();
    }

    drawBox(canvas,x,y,size){
        canvas.moveTo(x,y);
        canvas.lineTo(x+size,y);
        canvas.lineTo(x+size,y+size);
        canvas.lineTo(x,y+size);
        canvas.lineTo(x,y);
        //this.drawLine(this.canvas,x+0,y+0,x+size,y+0);
        //this.drawLine(this.canvas,x+size,y+0,x+size,y+size);
       // this.drawLine(this.canvas,x+size,y+size,x+0,y+size);
        //this.drawLine(this.canvas,x+0,y+size,x+0,y+0);
    }

    //drawLine(canvas,mx,my,lx,ly){
    //    canvas.moveTo(mx,my);
   //     canvas.lineTo(lx,ly);
   // }

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