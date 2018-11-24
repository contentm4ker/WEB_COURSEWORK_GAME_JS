import {mapManager, eventsManager, gameManager} from '../index';

export default class GameManager {
    constructor() {
        this.factory = {}; // фабрика объектов на карте
        this.entities = []; // объекты на карте (не убитые)
        this.player = null;
        this.laterKill = [];
        this.laterAdd = [];
        this.score = 0;
        this.finalScore = 1;
    }


    initPlayer(obj) {
        this.player = obj;
    }


    kill(obj) {
        this.laterKill.push(obj);
    }


    update(ctx) {
        if (this.player === null) return;

        // скорости
        this.player.move_x = 0;
        this.player.move_y = 0;

        if (eventsManager.action['up']) {
            this.player.move_y = -1;
        }
        if (eventsManager.action['down']) {
            this.player.move_y = 1;
        }
        if (eventsManager.action['left']) {
            this.player.move_x = -1;
        }
        if (eventsManager.action['right']) {
            this.player.move_x = 1;
        }

        // обновление информации по всем объектам на карте
        this.entities.forEach(e => {
            try {
                e.update();
            } catch (ex) {}
        });

        // удаление накопившихся объектов для удаления
        for (let i = 0; i < this.laterKill.length; i++) {
            const idx = this.entities.indexOf(this.laterKill[i]);
            if (idx > -1) {
                this.entities.splice(idx, 1);
            }
        }

        // очистка массива
        if (this.laterKill.length) this.laterKill.length = 0;

        /*
        if (this.entities.indexOf(this.player) === -1) {
            soundManager.play('./sound/loose.mp3');
            savePlayer();
            endGame();
            return;
        }

        const score = document.querySelector('.score');
        score.innerHTML = this.score;
        // if (+score.innerHTML === this.finalScore){
        //   nextLevel();
        //   return;
        // }
        */
        mapManager.draw(ctx);

        this.draw(ctx);
    }


    draw(ctx) {
        for (let e = 0; e < this.entities.length; e++)
            this.entities[e].draw(ctx, this.player);
    }


    clear() {
        console.log(this.entities);
        this.entities.forEach(item => clearInterval(item.timer));
    }


    play(ctx) {
        setInterval(() => gameManager.update(ctx), 50);
    }
}
