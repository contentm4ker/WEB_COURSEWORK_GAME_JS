import {mapManager, eventsManager, gameManager, spriteManager, soundManager} from '../index';
import {Pacman} from "../gameObjects";

export default class GameManager {
    constructor() {
        this.factory = {}; // фабрика объектов на карте
        this.entities = []; // объекты на карте (не убитые)
        this.player = null;
        this.laterKill = [];
        this.score = 0;
        this.finalScore = 0;
        this.numOfTries = 3;
        this.isGhostsAfraid = false;
        this.isBlink = false;
        this.doRespawn = false;
        this.gameOver = false;
        this.currentLevel = 1;
        this.onlyOnce = true; // для блока условия при прохождении карты
        this.maxLevelsNum = 2;
    }


    initPlayer(obj) {
        this.player = obj;
    }


    kill(obj) {
        this.laterKill.push(obj);
    }


    update(ctx) {
        if (this.doRespawn && this.numOfTries > 0) {
            this.numOfTries--;
            this.doRespawn = false;
            let pacman = new Pacman({
                pos_x: 32,
                pos_y: 32,
                size_x: 32,
                size_y: 32,
                move_x: 0,
                move_y: 0,
                speed: 8,
                direction: 'right'
            });
            this.entities.push(pacman);
            this.initPlayer(pacman);
            soundManager.play('/sounds/pacman_death.wav');
        }else if (this.doRespawn && this.numOfTries === 0)  {
            this.gameOver = true;
        }

        if (this.player === null && !this.gameOver) return;

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
        let isVictory = true;
        this.entities.forEach(e => {
            if (e.name === 'pill') {
                isVictory = false;
            }
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

        mapManager.draw(ctx);
        ctx.strokeStyle = '#FFFF00';
        ctx.font = 'bold 32px sans-serif';
        ctx.strokeText(gameManager.numOfTries, 32, 28);
        spriteManager.drawSprite(ctx, 'spr_lifecounter_0', 8, 8);
        if (this.gameOver) {
            this.updateLocalStorage();
            ctx.font = 'bold 100px sans-serif';
            ctx.strokeText('GAME OVER', 100, 430);
        } else if (isVictory) {
            if (this.onlyOnce) {
                if (this.currentLevel < this.maxLevelsNum)
                {
                    document.getElementById('nextlvl-btn').disabled = false;
                    this.currentLevel++;
                }
                soundManager.play('/sounds/pacman_death.wav');
            }
            this.onlyOnce = false;
            this.player.isInvulnerable = true;
            this.updateLocalStorage();
            ctx.font = 'bold 100px sans-serif';
            ctx.strokeText('VICTORY', 180, 400);
        }
        this.draw(ctx);
    }

    draw(ctx) {
        for (let e = 0; e < this.entities.length; e++)
            this.entities[e].draw(ctx, this.player);
    }

    clearManager() {
        clearInterval(this.playInterval);
        this.finalScore = this.score;
        this.entities = []; // объекты на карте (не убитые)
        this.player = null;
        this.laterKill = [];
        this.score = 0;
        this.numOfTries = 3;
        this.isGhostsAfraid = false;
        this.isBlink = false;
        this.doRespawn = false;
        this.gameOver = false;
    }

    play(ctx) {
        document.getElementById('player').innerText = localStorage['pacman.username'] + ': ';
        this.playInterval = setInterval(() => gameManager.update(ctx), 30);
    }


    updateLocalStorage() {
        if (localStorage.hasOwnProperty(localStorage['pacman.username'])) {
            if (localStorage[localStorage['pacman.username']] < this.score + this.finalScore)
                localStorage[localStorage['pacman.username']] = this.score + this.finalScore;
        } else {
            localStorage[localStorage['pacman.username']] = this.score + this.finalScore;
        }
    }
}
