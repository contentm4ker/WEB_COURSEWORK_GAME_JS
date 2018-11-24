import MapManager from './managers/mapManager';
import SpriteManager from './managers/spriteManager';
import GameManager from './managers/gameManager';
import EventsManager from './managers/eventsManager';
import map1 from './maps/map1.json';

import { Ghost, Pacman, Bonus, Coin } from './gameObjects';

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
        lifetime: 100,
        move_x: 0,
        move_y: 0,
        speed: 8,
        direction: 'right',
    });

mapManager.parseMap(map1);
spriteManager.loadAtlas();
mapManager.parseEntities();
eventsManager.setup(canvas);

gameManager.play(ctx);
mapManager.draw(ctx);

