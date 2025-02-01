import { Scene } from 'phaser';

export class Boot extends Scene {

    constructor() {
        super('Boot');
    }

    preload() {
        this.load.image("tiles", "src/assets/tilesets/code-land.png");
        this.load.atlas('player', 'src/assets/spritesheets/player.png', 'src/assets/spritesheets/player.json');
        this.load.tilemapTiledJSON("map", "src/assets/tilemaps/player-home.json");
        this.load.audio('music-opening', 'src/assets/audio/opening.wav');
    }

    create() {
        this.scene.start('Main');
    }
}
