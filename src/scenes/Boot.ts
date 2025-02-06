import { Scene } from 'phaser';

export class Boot extends Scene {

    constructor() {
        super('Boot');
    }

    preload() {
        // Set the base path for all assets
        this.load.setPath('assets');

        // Load the world map
        this.load.image("tiles", "tilesets/code-land.png");
        this.load.tilemapTiledJSON("map", "tilemaps/player-home.json");

        // Load the player spritesheets
        this.load.atlas('player', 'spritesheets/player.png', 'spritesheets/player.json');

        // Load the music
        this.load.audio('music-opening', 'audio/opening.wav');
    }

    create() {
        this.scene.start('MainMenu');
    }
}
