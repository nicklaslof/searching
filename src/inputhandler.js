class InputHandler{

    constructor(document){
        this.kp = [];
        this.kjp = [];
        document.addEventListener("keydown", this.handleKeyboardDownEvent.bind(this));
        document.addEventListener("keyup", this.handleKeyboardUpEvent.bind(this));
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
