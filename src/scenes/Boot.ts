import { Scene } from 'phaser';

export class Boot extends Scene {

    constructor() {
        super('Boot');
    }

    preload() {
        this.load.image("tiles", "assets/tilesets/code-land.png");
        this.load.atlas('player', 'assets/spritesheets/player.png', 'assets/spritesheets/player.json');
        this.load.tilemapTiledJSON("map", "assets/tilemaps/player-home.json");
        this.load.audio('music-opening', 'assets/audio/opening.wav');
    }

    create() {
        this.scene.start('Main');
    }
}
