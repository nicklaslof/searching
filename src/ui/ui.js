class UI{
    constructor(c) {
        this.c = c;
        this.c.imageSmoothingEnabled = false;
        this.centerX = this.c.canvas.width/2;
        this.centerY = this.c.canvas.height/2;
    
        this.atlas = new Image();
        this.atlas.src="a.png";

        this.numberOfSlots = 3;
        this.sizeOfSlot = 32;
    }
    renderIntro(){
        this.drawText("Searching for 04",100,"30px monospace");
        this.drawText("A classic dungeon crawler",150);
        this.drawText("for JS13k 2020",175);
        this.drawText("by Nicklas Löf",200);
        this.drawText("Graphics by Nicklas Löf",240);
        this.drawText("and Elthen at patreon.com",260);
        this.drawText("Hit 1 to play roguelike",340);
        this.drawText("Hit 2 to play with checkpoints",360);
    }
    render(level){
        this.c.clearRect(0, 0, this.c.canvas.width, this.c.canvas.height);
        this.drawText(level.t,250);
        this.drawText(level.t2,270);
        if (level.player != null && level.player.currentHealth > 0){
            this.renderItemBar(level);
            this.renderHealth(level);
            this.renderCross(level);
        }
    }

    renderItemBar(level){
        this.drawInventorySlots(level)
        this.renderItems(level);
    }

    renderHealth(level){
        this.drawTextAt("Health "+level.player.currentHealth+" of "+level.player.maxHealth,70,450);
    }

    renderCross(level){
        if (level.player.i != null && level.player.i.n == "wand"){
            this.c.drawImage(this.atlas, 8, 27,3,3,this.centerX-6,this.centerY-6,9,9);
        }
    }

    drawInventorySlots(level){
        let selectedSlot = level.player.inventory.selectedSlot;
            

        for (let slot = 1; slot < this.numberOfSlots+1; slot++){
            if (slot == selectedSlot) this.c.strokeStyle ="#ffffff"; else this.c.strokeStyle ="#444444";
            this.drawBox(this.c,((this.sizeOfSlot*slot)+this.centerX-((this.numberOfSlots/2)+1.5)*this.sizeOfSlot)+(slot*5),10,this.sizeOfSlot);
        }

    }

    renderItems(level){
        for(let slot=0; slot < this.numberOfSlots+1; slot++){
            let i = level.player.inventory.getItemInSlot(slot);
            if (i != null){
                let x = ((this.sizeOfSlot*slot)+this.centerX-((this.numberOfSlots/2)+1.5)*this.sizeOfSlot)+(slot*5);
                this.c.drawImage(this.atlas, i.texture.x, i.texture.y,i.texture.width,i.texture.height,x+3,12,i.texture.width*2, i.texture.height*2);
                if (slot == 3){
                    this.drawTextAt(""+level.player.inventory.apples,340,38);
                } 
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

    drawText(text,y,font){
        if (text == null) return;
        this.drawTextAt(text,this.centerX,y,font);
    }

    drawTextAt(text,x,y,font){
        this.c.font=font==null?"14px monospace":font;
        this.c.fillStyle = "white";
        this.c.textAlign = "center";
        this.c.fillText(text,x,y);
    }
}

export default UI;