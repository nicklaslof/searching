class UI{
    constructor(canvas) {
        this.canvas = canvas;
        this.canvas.imageSmoothingEnabled = false;
        this.centerX = this.canvas.canvas.width/2;
        this.font = new Image();
        this.font.onload  = () =>{
        };
        this.font.src="./assets/font.png";

        this.atlas = new Image();
        this.atlas.onload  = () =>{
        };
        this.atlas.src="./assets/atlas.png";

        this.characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!+:";
        this.fontWidth = 6;
        this.fontHeight = 8;
        this.numberOfSlots = 8;
        this.sizeOfSlot = 32;
    }

    tick(deltatime){

    }

    render(level){
        this.canvas.clearRect(0, 0, this.canvas.canvas.width, this.canvas.canvas.height);
        let text = level.getUIText();
        this.drawText(text[0],250);
        this.drawText(text[1],270);
        if (level.player != null){
            this.renderItemBar(level);
            this.renderHealth(level);
        }
    }

    renderItemBar(level){
        this.drawInventorySlots(level)
        this.renderItems(level);
    }

    renderHealth(level){
        this.drawTextAt("health: "+level.player.currentHealth+" of "+level.player.maxHealth,50,450);
    }

    drawInventorySlots(level){
        let selectedSlot = level.player.inventory.selectedSlot;
            

        for (let slot = 1; slot < this.numberOfSlots+1; slot++){
            if (slot == selectedSlot) this.canvas.strokeStyle ="#ffffff"; else this.canvas.strokeStyle ="#444444";
            this.drawBox(this.canvas,((this.sizeOfSlot*slot)+this.centerX-((this.numberOfSlots/2)+2)*this.sizeOfSlot)+(slot*5),10,this.sizeOfSlot);
        }

    }

    renderItems(level){
        for(let slot=0; slot < 9; slot++){
            let item = level.player.inventory.getItemInSlot(slot);
            if (item != null){
                let x = ((this.sizeOfSlot*slot)+this.centerX-((this.numberOfSlots/2)+2)*this.sizeOfSlot)+(slot*5);
                this.canvas.drawImage(this.atlas, item.texture.x, item.texture.y,item.texture.width,item.texture.height,x+4,8,item.texture.width*2, item.texture.height*2);
            }
        }
    }

    drawBox(canvas,x,y,size){
        this.canvas.beginPath();
        canvas.moveTo(x,y);
        canvas.lineTo(x+size,y);
        canvas.lineTo(x+size,y+size);
        canvas.lineTo(x,y+size);
        canvas.lineTo(x,y);
        
        this.canvas.closePath();
        this.canvas.stroke();
        this.canvas.fillStyle = "#22222299";
        this.canvas.fill();
    }

    drawText(text,y){
        this.drawTextAt(text,this.centerX - (text.length * 4)+this.fontWidth,y);
    }

    drawTextAt(text,x,y){
        this.canvas.globalAlpha = 0.9;
        for (let i = 0; i < text.length; i++) {
            this.canvas.drawImage(this.font,this.characters.indexOf(text[i].toUpperCase())*this.fontWidth,0,this.fontWidth,this.fontHeight,x,y,6,8);
            x += 8;
        }
        this.canvas.globalAlpha = 1;
    }
}

export default UI;