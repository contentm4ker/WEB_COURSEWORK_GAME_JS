import MapManager from './managers/mapManager';
import SpriteManager from './managers/spriteManager';
import GameManager from './managers/gameManager';
import EventsManager from './managers/eventsManager';
import map1 from './maps/map1.json';

import { Ghost, Pacman, Bonus, Pill } from './gameObjects';

const canvas = document.querySelector('canvas');
canvas.width = 25 * 32;
canvas.height = 25 * 32;
const ctx = canvas.getContext('2d');
ctx.scale(0.8, 0.8);

export const spriteManager = new SpriteManager();
export let gameManager = new GameManager();
export let mapManager = new MapManager();
export const eventsManager = new EventsManager();


ctx.clearRect(0, 0, canvas.width, canvas.height);

gameManager.factory['Pacman'] = () =>
    new Pacman({
        pos_x: 32,
        pos_y: 32,
        size_x: 32,
        size_y: 32,
        move_x: 0,
        move_y: 0,
        speed: 8,
        direction: 'right'
    });


mapManager.parseMap(map1);
spriteManager.loadAtlas();
mapManager.parseEntities();


placePillsInMap();
placeGhostsInMap();
placeBonusesInMap();


eventsManager.setup(canvas);

gameManager.play(ctx);
mapManager.draw(ctx);

function placePillsInMap() {
    if (mapManager.tLayer === null) {
        for (let id = 0; id < mapManager.mapData.layers.length; id++) {
            const layer = mapManager.mapData.layers[id];
            if (layer.type === 'tilelayer') { // слой блоков карты
                for (let i = 0; i < layer.data.length; i++) {
                    if (layer.data[i] !== 0) {
                        let pX = (i % mapManager.xCount) * mapManager.tSize.x;
                        let pY = Math.floor(i / mapManager.xCount) * mapManager.tSize.y;
                        if (layer.data[i] === 35) {
                            gameManager.entities.push(new Pill({
                                pos_x: pX + 12,
                                pos_y: pY + 12,
                                size_x: 16,
                                size_y: 16
                            }));
                        }
                    }
                }
            }
        }
    }
}

function placeGhostsInMap() {
    gameManager.entities.push(new Ghost({
        pos_x: 736,
        pos_y: 32,
        size_x: 32,
        size_y: 32,
        move_x: -1,
        move_y: 0,
        speed: 4,
        direction: 'left',
        color: 'blue'
    }));
    gameManager.entities.push(new Ghost({
        pos_x: 736,
        pos_y: 736,
        size_x: 32,
        size_y: 32,
        move_x: -1,
        move_y: 0,
        speed: 4,
        direction: 'left',
        color: 'orange'
    }));
    gameManager.entities.push(new Ghost({
        pos_x: 32,
        pos_y: 736,
        size_x: 32,
        size_y: 32,
        move_x: 1,
        move_y: 0,
        speed: 4,
        direction: 'right',
        color: 'pink'
    }));
    gameManager.entities.push(new Ghost({
        pos_x: 384,
        pos_y: 384,
        size_x: 32,
        size_y: 32,
        move_x: -1,
        move_y: 0,
        speed: 4,
        direction: 'left',
        color: 'red'
    }));
}


function placeBonusesInMap() {
    gameManager.entities.push(new Bonus({
        pos_x: 384,
        pos_y: 256,
        size_x: 32,
        size_y: 32
    }));
    gameManager.entities.push(new Bonus({
        pos_x: 384,
        pos_y: 704,
        size_x: 32,
        size_y: 32
    }));
    gameManager.entities.push(new Bonus({
        pos_x: 736,
        pos_y: 512,
        size_x: 32,
        size_y: 32
    }));
    gameManager.entities.push(new Bonus({
        pos_x: 32,
        pos_y: 512,
        size_x: 32,
        size_y: 32
    }));
}