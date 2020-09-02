class InputHandler{

    constructor(document){
        this.kp = this.kjp =[];
        this.mouseX = 0;
        document.addEventListener("keydown", this.handleKeyboardDownEvent.bind(this));
        document.addEventListener("keyup", this.handleKeyboardUpEvent.bind(this));
        document.addEventListener("mousemove", this.handleMouseMouseEvent.bind(this));
        document.addEventListener("mousedown", this.handleMouseMouseDownEvent.bind(this));
        document.addEventListener("mouseup", this.handleMouseMouseUpEvent.bind(this));
    }

    handleKeyboardDownEvent(e){
        this.kp[e.keyCode] = true;
    }

    handleKeyboardUpEvent(e){
        this.kp[e.keyCode] = false;
    }

    handleMouseMouseEvent(e){
        this.mouseX = -e.movementX;
    }
    handleMouseMouseDownEvent(e){
        this.clicked = e.button == 0;
    }
    handleMouseMouseUpEvent(e){
        this.clicked = false;
    }

    getClicked(){
        let v = this.clicked;
        this.clicked = false;
        return v;
    }

    getMouseX(){
        let m = this.mouseX;
        this.mouseX=0;
        return m;
    }

    isKeyDown(k){
        return this.kp[k];
    }
}

export default InputHandler
