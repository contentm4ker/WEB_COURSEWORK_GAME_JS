export default class EventsManager {
    constructor() {
        this.bind = []; // сопоставление клавиш действиям
        this.action = []; // действия
    }

    setup(canvas) {
        this.bind[87] = 'up'; // w
        this.bind[65] = 'left'; // a
        this.bind[83] = 'down'; // s
        this.bind[68] = 'right'; // d

        document.body.addEventListener('keydown', e => this.onKeyDown(e));
    }

    onKeyDown(event) {
        const action = this.bind[event.keyCode];
        if (action) this.action[action] = true;
    }
}
