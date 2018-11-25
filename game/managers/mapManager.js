import { gameManager } from '../index';
import {Pill} from "../gameObjects";

export default class MapManager {
    constructor() {
        this.mapData = null; // переменная для хранения карты
        this.tLayer = null; // для хранения ссылки на блоки карты
        this.xCount = 0; // количество блоков по горизонтали
        this.yCount = 0; // по вертикали
        this.tSize = {x: 64, y: 64}; // размер блока
        this.mapSize = {x: 64, y: 64}; // Размер карты в пикселях
        this.tilesets = []; // массив описаний блоков карты
        this.imgLoadCount = 0; // количество загруженных изображений
        this.imgLoaded = false; // все изображения загружены
        this.jsonLoaded = false; // json описание загружено
    }


    parseMap(tilesJSON) {
        console.log(tilesJSON);
        this.mapData = tilesJSON; // разобрать JSON
        this.xCount = this.mapData.width; // сохранение ширины
        this.yCount = this.mapData.height; // сохранение высоты
        this.tSize.x = this.mapData.tilewidth; // сохранение размера блока
        this.tSize.y = this.mapData.tileheight; // сохранение размера блока
        this.mapSize.x = this.xCount * this.tSize.x; // вычисления размера карты
        this.mapSize.y = this.yCount * this.tSize.y; // вычисление размера карты
        for (let i = 0; i < this.mapData.tilesets.length; i++) {
            const img = new Image();
            img.onload = () => {
                // при загрузке изображения
                this.imgLoadCount += 1;
                if (this.imgLoadCount === this.mapData.tilesets.length) {
                    this.imgLoaded = true;
                }
            };
            const t = this.mapData.tilesets[i];
            img.src = t.image;
            const ts = {
                // создаем свой объект tilesets
                firstgid: t.firstgid, // с него начинается нумерация в data
                image: img,
                name: t.name, // имя элемента рисунка
                //кол-во блоков по горизонтали
                xCount: Math.floor(t.imagewidth / this.tSize.x),
                //кол-во блоков по вертикали
                yCount: Math.floor(t.imageheight / this.tSize.y),
            };
            this.tilesets.push(ts);
        }
        this.jsonLoaded = true;
    }


    /*
    * получение блока по индексу
    */
    getTileset(tileIndex) {
        for (let i = this.tilesets.length - 1; i >= 0; i--)
            if (this.tilesets[i].firstgid <= tileIndex) {
                return this.tilesets[i];
            }
        return null;
    }

    getTile(tileIndex) { //индекс блока
        const tile = {
            img: null,
            px: 0, py: 0 // координаты блока в tileset
        };
        const tileset = this.getTileset(tileIndex);
        tile.img = tileset.image;

        /*
        * tileIndex - номер блока в общем массиве
        * tileset.firstgid - номер первого блока в отображаемом изображении
        */
        const id = tileIndex - tileset.firstgid; // индекс блока в tileset
        const x = id % tileset.xCount;
        const y = Math.floor(id / tileset.xCount);
        tile.px = x * this.tSize.x;
        tile.py = y * this.tSize.y;
        return tile;
    }


    /*
    * отрисовка карты в контексте
    */
    draw(ctx) {
        if (!this.imgLoaded || !this.jsonLoaded) {
            //если карта не была загружена, повторяем вызов
            setTimeout(() => this.draw(ctx), 100);
        } else {
            if (this.tLayer === null) { // при первом обращении к draw верно
                for (let id = 0; id < this.mapData.layers.length; id++) {
                    const layer = this.mapData.layers[id];
                    if (layer.type === 'tilelayer') { // слой блоков карты
                        this.tLayer = layer;
                        break;
                    }
                }
            }

            //цикл по всем данным, предназначенным для отображения на карте
            for (let i = 0; i < this.tLayer.data.length; i++) {
                if (this.tLayer.data[i] !== 0) {

                    /*по номеру блока получаем из масива tilesets объект блока и
                    * сохраняем его
                    * */
                    const tile = this.getTile(this.tLayer.data[i]);

                    /*xCount - кол-во элементов в строке (длина по x)
                    * pX, pY - координаты блока в пикселах
                    */
                    let pX = (i % this.xCount) * this.tSize.x;
                    let pY = Math.floor(i / this.xCount) * this.tSize.y;

                    ctx.drawImage(
                        tile.img,
                        // координаты блока в изображении
                        tile.px,
                        tile.py,
                        // ширина и высота блока в изображении
                        this.tSize.x,
                        this.tSize.y,
                        // координаты, где необходимо отобразить блок
                        pX,
                        pY,
                        /* размеры отображаемого блока
                        * (указываются т.к. данная функция поддерживает
                        *  изменение масштаба)
                        */
                        this.tSize.x,
                        this.tSize.y,
                    );
                }
            }
        }
    }

    /*
    * Если есть еще и objectgroup - слой, хранящий информацию о том,
    * какие объекты и где находятся на карте
    */
    parseEntities() { // разбор слоя типа objectgroup
        if (!this.imgLoaded || !this.jsonLoaded) {
            //если карта не была загружена, повторяем вызов
            setTimeout(() => this.parseEntities(), 100);
        } else {
            for (let j = 0; j < this.mapData.layers.length; j++) {
                if (this.mapData.layers[j].type === 'objectgroup') {
                    const entities = this.mapData.layers[j];
                    for (let i = 0; i < entities.objects.length; i++) {
                        const e = entities.objects[i];
                        try {
                            /*
                            * e.type - строковое название объекта, который
                            * необходимо разместить на карте.
                            * Значение type в визуальном интерфейсе
                            * вводится дизайнером игры
                            */
                            const obj = gameManager.factory[e.type]();
                            obj.name = e.name;
                            obj.pos_x = e.x;
                            obj.pos_y = e.y;
                            obj.size_x = e.width;
                            obj.size_y = e.height;
                            gameManager.entities.push(obj);
                            if (obj.name === 'pacman') gameManager.initPlayer(obj);
                        } catch (ex) { // если объект с типом e.type не описан разработчиком
                            console.log(`Error while creating: [${e.gid}] ${e.type}, ${ex}`);
                        }
                    }
                }
            }
        }
    }

    /*
    * Используя размеры блоков (tSize.x, tSize.y)
    * и количество блоков по горизонтали (xCount)
    * вычисляет индекс блока в массиве data(idx).
    * Возвращает блок из массива data с индексом idx
    */
    getTilesetIdx(x, y) { // получить блок по координатам на карте
        const wX = x;
        const wY = y;
        const idx =
            Math.floor(wY / this.tSize.y) * this.xCount +
            Math.floor(wX / this.tSize.x);
        return this.tLayer.data[idx];
    }

}
