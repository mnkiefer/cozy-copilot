import { Scene } from 'phaser';

export class Boot extends Scene {

    constructor() {
        super('Boot');
    }

    preload() {
        this.load.setPath('assets');

        this.load.image("tiles", "tilesets/code-land.png");
        this.load.atlas('player', 'spritesheets/player.png', 'spritesheets/player.json');
        this.load.tilemapTiledJSON("map", "tilemaps/player-home.json");
        this.load.audio('music-opening', 'audio/opening.wav');
    }

    create() {
        this.scene.start('Main');
    }
}
