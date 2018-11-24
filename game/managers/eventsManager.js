import {eventsManager} from "../index";

export default class EventsManager {
    constructor() {
        this.bind = []; // сопоставление клавиш действиям
        this.action = []; // действия
        this.counter = 0;
        this.prev = '';
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
        const action = this.bind[event.keyCode];

        let isOpposite = false;
        if (action === 'up' && this.prev === 'down') isOpposite = true;
        else if (action === 'down' && this.prev === 'up') isOpposite = true;
        else if (action === 'left' && this.prev === 'right') isOpposite = true;
        else if (action === 'right' && this.prev === 'left') isOpposite = true;

        if (this.counter%32 === 0 || isOpposite) {
            eventsManager.action['up'] = false;
            eventsManager.action['down'] = false;
            eventsManager.action['left'] = false;
            eventsManager.action['right'] = false;
            if (action) this.action[action] = true;
        }
    }

    onKeyUp(event) {

        const action = this.bind[event.keyCode];
        if (action) this.action[action] = false;
        console.log(this, action);
    }
}
