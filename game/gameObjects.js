import { spriteManager, gameManager, mapManager} from './index';
import PhysicManager from './managers/physicManager';

class Entity {
    constructor(pos_x, pos_y, size_x, size_y) {
        // позиция
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        // размеры
        this.size_x = size_x;
        this.size_y = size_y;
    }
}

export class Ghost extends Entity {
    constructor({pos_x, pos_y, size_x, size_y,
                    move_x, move_y, speed,
                    direction, color}) {
        super(pos_x, pos_y, size_x, size_y);
        this.name = 'ghost';
        this.move_x = move_x;
        this.move_y = move_y;
        this.speed = speed;
        this.direction = direction;
        this.color = color;
        this.switchAfraid = true;
        this.isEaten = false;
    }

    draw(ctx) {
        let name;

        if (gameManager.isGhostsAfraid) {
            let num = 0;
            if (gameManager.isBlink) {
                num = this.switchAfraid ? 0 : 1;
                this.switchAfraid = !this.switchAfraid;
            }
            name = `spr_afraid_${num}`;
        } else name = `spr_ghost_${this.color}`;
        spriteManager.drawSprite(
            ctx,
            name,
            this.pos_x,
            this.pos_y
        );
    }


    update() {
        if (!gameManager.isGhostsAfraid) {
            this.isEaten = false;
        }
        if (this.move_x === 1) this.direction = 'right';
        if (this.move_x === -1) this.direction = 'left';
        if (this.move_y === -1) this.direction = 'up';
        if (this.move_y === 1) this.direction = 'down';

        PhysicManager.update(this);
    }

    onTouchEntity(obj) {
        if (obj.name === 'pacman' && !gameManager.isGhostsAfraid && !obj.isInvulnerable) {
            obj.kill();
        }
    }

    kill() {
        gameManager.kill(this);
    }
}

export class Pacman extends Entity {
    constructor({pos_x, pos_y, size_x, size_y,
                    lifetime, move_x, move_y, speed, direction}) {
        super(pos_x, pos_y, size_x, size_y);
        this.name = 'pacman';
        this.move_x = move_x;
        this.move_y = move_y;
        this.speed = speed;
        this.direction = direction;
        this.state = 0;
        this.counterForState = 0;
        this.isInvulnerable = false;
    }


    draw(ctx) {
        if (this.counterForState++ > 5) {
            this.counterForState = 0;
            this.state++;
        }
        if (this.state > 3) this.state = 0;
        spriteManager.drawSprite(ctx, `pac_man_${this.direction}_${this.state}`, this.pos_x, this.pos_y);

    }


    update() {
        if (this.move_x === 1) this.direction = 'right';
        if (this.move_x === -1) this.direction = 'left';
        if (this.move_y === -1) this.direction = 'up';
        if (this.move_y === 1) this.direction = 'down';

        PhysicManager.update(this);
    }


    onTouchEntity(obj) {
        if (!this.isInvulnerable) {
            if (obj.name === 'pill') {
                gameManager.score += 10;
                obj.kill();
            }
            if (obj.name === 'ghost' && !gameManager.isGhostsAfraid) {
                this.kill();
            } else if (obj.name === 'ghost' && gameManager.isGhostsAfraid) {
                if (!obj.isEaten) {
                    obj.isEaten = true;
                    gameManager.score += 200;
                }
            }
            if (obj.name === 'cherry') {
                gameManager.score += 200;
                obj.kill();
            }

            document.getElementById('score').innerText = gameManager.score;
        }
    }


    kill() {
        gameManager.doRespawn = true;
        gameManager.kill(this);
    }
}

export class Bonus extends  Entity {
    constructor({pos_x, pos_y, size_x, size_y}) {
        super(pos_x, pos_y, size_x, size_y);
        this.name = 'cherry';
    }


    draw(ctx) {
        spriteManager.drawSprite(ctx, 'spr_cherry', this.pos_x, this.pos_y);
    }


    kill() {
        gameManager.isGhostsAfraid = true;
        setTimeout(() => gameManager.isBlink = true, 4000);
        gameManager.kill(this);
        setTimeout(function() {
            gameManager.isGhostsAfraid = false;
            gameManager.isBlink = false;
        }, 6000
        );
    }
}

export class Pill extends  Entity {
    constructor({pos_x, pos_y, size_x, size_y}) {
        super(pos_x, pos_y, size_x, size_y);
        this.name = 'pill';
    }


    draw(ctx) {
        spriteManager.drawSprite(ctx, 'spr_pill_0', this.pos_x, this.pos_y)
    }


    kill() {
        gameManager.kill(this);
    }
}
