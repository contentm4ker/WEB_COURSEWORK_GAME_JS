export default class EventsManager {
    constructor() {
        this.bind = []; // сопоставление клавиш действиям
        this.action = []; // действия
        this.isContinue = false;
    }

    setup(canvas) {
        this.bind[87] = 'up'; // w
        this.bind[65] = 'left'; // a
        this.bind[83] = 'down'; // s
        this.bind[68] = 'right'; // d

        //canvas.addEventListener('mousedown', this.onMouseDown);
        //canvas.addEventListener('mouseup', this.onMouseUp);

        document.body.addEventListener('keydown', e => this.onKeyDown(e));
        //document.body.addEventListener('keyup', e => this.onKeyUp(e));
    }

    onMouseDown(event) {

    }

    onMouseUp(event) {

    }

    onKeyDown(event) {

            this.action['up'] = false;
            this.action['left'] = false;
            this.action['down'] = false;
            this.action['right'] = false;

        const action = this.bind[event.keyCode];
        if (action) this.action[action] = true;
    }

    onKeyUp(event) {

        const action = this.bind[event.keyCode];
        if (action) this.action[action] = false;
        console.log(this, action);
    }
}
