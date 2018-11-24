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
                    lifetime, move_x, move_y, speed,
                    direction, color}) {
        super(pos_x, pos_y, size_x, size_y);
        this.lifetime = lifetime;
        this.move_x = move_x;
        this.move_y = move_y;
        this.speed = speed;
        this.direction = direction;
        this.color = color;
    }

    draw(ctx) {
        spriteManager.drawSprite(
            ctx,
            `ghost_${this.direction}`,
            this.pos_x,
            this.pos_y
        );
    }
}

export class Pacman extends Entity {
    constructor({pos_x, pos_y, size_x, size_y,
                    lifetime, move_x, move_y, speed, direction}) {
        super(pos_x, pos_y, size_x, size_y);
        this.lifetime = lifetime;
        this.move_x = move_x;
        this.move_y = move_y;
        this.speed = speed;
        this.direction = direction;
    }


    draw(ctx) {
        spriteManager.drawSprite(
            ctx,
            `pac_man_1`,
            this.pos_x,
            this.pos_y,
            this.direction,
        );
    }


    update() {
        if (this.move_x === 1) this.direction = 'right';
        if (this.move_x === -1) this.direction = 'left';
        if (this.move_y === -1) this.direction = 'up';
        if (this.move_y === 1) this.direction = 'down';


        let ph = PhysicManager.update(this);
        //while (PhysicManager.update(this) === 'move') {}
        console.log('actTT: ', ph);

        //PhysicManager.update(this);
    }


    onTouchEntity(obj) {

    }


    kill() {
        gameManager.kill(this);
    }
}

export class Bonus extends  Entity {
    constructor({pos_x, pos_y, size_x, size_y}) {
        super(pos_x, pos_y, size_x, size_y);
    }


    draw(ctx) {

    }


    kill() {

    }
}

export class Coin extends  Entity {
    constructor({pos_x, pos_y, size_x, size_y}) {
        super(pos_x, pos_y, size_x, size_y);
    }


    draw(ctx) {

    }


    kill() {

    }
}
