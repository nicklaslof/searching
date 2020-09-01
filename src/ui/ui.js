class UI{
    constructor(c) {
        this.c = c;
        this.c.imageSmoothingEnabled = false;
        this.centerX = this.c.canvas.width/2;
        this.font = new Image();
        this.font.onload  = () =>{
        };
        this.font.src="f.png";

        this.atlas = new Image();
        this.atlas.onload  = () =>{
        };
        this.atlas.src="a.png";

        this.fontWidth = 5;
        this.fontHeight = 5;
        this.numberOfSlots = 8;
        this.sizeOfSlot = 32;
    }

    tick(deltatime){

    }
    renderIntro(){
        this.drawText("searching for 04",100);
        this.drawText("a classic dungeon crawler",150);
        this.drawText("created for JS13k 2020",175);
        this.drawText("by nicklas lof",200);
        this.drawText("graphics by nicklas lof",240);
        this.drawText("and Elthen www.patreon.com/elthen/",260);
        this.drawText("font by killedbyapixel",280);
        this.drawText("hit 1 to play roguelike",320);
        this.drawText("hit 2 to play with checkpoints",340);
        

    }
    render(level){
        this.c.clearRect(0, 0, this.c.canvas.width, this.c.canvas.height);
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
        this.drawTextAt("health "+level.player.currentHealth+" of "+level.player.maxHealth,50,450);
    }

    drawInventorySlots(level){
        let selectedSlot = level.player.inventory.selectedSlot;
            

        for (let slot = 1; slot < this.numberOfSlots+1; slot++){
            if (slot == selectedSlot) this.c.strokeStyle ="#ffffff"; else this.c.strokeStyle ="#444444";
            this.drawBox(this.c,((this.sizeOfSlot*slot)+this.centerX-((this.numberOfSlots/2)+2)*this.sizeOfSlot)+(slot*5),10,this.sizeOfSlot);
        }

    }

    renderItems(level){
        for(let slot=0; slot < 9; slot++){
            let i = level.player.inventory.getItemInSlot(slot);
            if (i != null){
                let x = ((this.sizeOfSlot*slot)+this.centerX-((this.numberOfSlots/2)+2)*this.sizeOfSlot)+(slot*5);
                this.c.drawImage(this.atlas, i.texture.x, i.texture.y,i.texture.width,i.texture.height,x+4,8,i.texture.width*2, i.texture.height*2);
            }
        }
    }

    drawBox(c,x,y,size){
        this.c.beginPath();
        c.moveTo(x,y);
        c.lineTo(x+size,y);
        c.lineTo(x+size,y+size);
        c.lineTo(x,y+size);
        c.lineTo(x,y);
        
        this.c.closePath();
        this.c.stroke();
        this.c.fillStyle = "#22222299";
        this.c.fill();
    }

    drawText(text,y){
        this.drawTextAt(text,this.centerX - (text.length * 4)+this.fontWidth,y);
    }

    drawTextAt(text,x,y){
        this.c.globalAlpha = 0.9;
        for (let i = 0; i < text.length; i++) {
            let cc = text.toUpperCase().charCodeAt(i);
            let index = cc - (cc < 64?48:55);
            this.c.drawImage(this.font,index*this.fontWidth,0,this.fontWidth,this.fontHeight,x,y,6,8);
            x += 8;
        }
        this.c.globalAlpha = 1;
    }
}

export default UI;