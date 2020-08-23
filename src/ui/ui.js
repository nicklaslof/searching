class UI{
    constructor(canvas) {
        this.canvas = canvas;
        this.canvas.imageSmoothingEnabled = false;
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

    render(){
        //this.canvas.font = '50px serif';
//this.canvas.fillStyle = "#ffffff"
//this.canvas.fillText("Big smile!", 10, 90);

        //console.log(this.characters.indexOf("0"));
        this.canvas.clearRect(0, 0, this.canvas.canvas.width, this.canvas.canvas.height);
        this.drawText("DARKNESS! IT IS SO DARK IN HERE",50,50);


    }


    drawText(text,x,y){
        for (let i = 0; i < text.length; i++) {
            //console.log(text[i]);
            let index = this.characters.indexOf(text[i]);
            this.canvas.drawImage(this.image,index*this.fontWidth,0,this.fontWidth,this.fontHeight,x,y,10,10);
            x += 16;

          }
    }

}

export default UI;