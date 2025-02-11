import { Scene } from 'phaser';


export class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        this.loadAssets();
    }

    private loadAssets() {
        // Load tilemaps
        this.load.setPath('assets');
        this.load.spritesheet("tiles", "tilesets/code-land.png", { frameWidth: 64 });
        this.load.tilemapTiledJSON("map", "tilemaps/player-home.json");

        // Load spritesheets
        this.load.atlas('player', 'spritesheets/player.png', 'spritesheets/player.json');

        // Load image files
        this.load.image('cartoon-player', 'avatars/cartoon-player.png');
        this.load.image('syntax-spider', 'avatars/syntax-spider.png');

        // Load audio files
        this.load.audio('world', 'audio/opening.wav');
        this.load.audio('battle', 'audio/battle.wav');
    }

    create() {
        this.scene.start('MainMenu');
    }
}
