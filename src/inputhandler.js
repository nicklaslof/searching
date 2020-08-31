class InputHandler{

    constructor(d){
        this.kp = [];
        this.kjp = [];
        this.addElistner(d,"keydown", this.handleKeyboardDownEvent.bind(this));
        this.addElistner(d,"keyup", this.handleKeyboardUpEvent.bind(this));
    }

    addElistner(doc,n,b){
        doc.addEventListener(n, b);
    }

    handleKeyboardDownEvent(e){
        this.kp[e.keyCode] = true;
    }

    handleKeyboardUpEvent(e){
        if (this.kp[e.keyCode]){
            this.kjp[e.keyCode] = true;
        }
        this.kp[e.keyCode] = false;
    }

    isKeyDown(k){
        return this.kp[k];
    }

    wasKeyJustPressed(k){
        if (this.kjp[k]){
            this.kjp[k] = false;
            return true;
        }

        return false;
    }
}

export default InputHandler
