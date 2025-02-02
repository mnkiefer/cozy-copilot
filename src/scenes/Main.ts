import { Scene } from 'phaser';
import Player from '../objects/Player';
import TextBox from '../objects/TextBox';

import type Phaser from 'phaser';

export class Main extends Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private player!: Player;
    private worldLayer!: Phaser.Tilemaps.TilemapLayer;
    private textBox!: TextBox;

    constructor() {
        super('Main');
    }

    create() {
        this.initMap();
        this.initPlayer();
        this.initKeyboard();

        this.sound.play('music-opening', {
            loop: true,
            volume: 0.5
        });

        this.textBox = new TextBox(this);
        this.textBox.create('Hello, Player!');
    }

    private initMap() {
        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("code-land", "tiles")!;
        map.createLayer("Below Player", tileset, 0, 0);
        this.worldLayer = map.createLayer("World", tileset, 0, 0)!;
        const aboveLayer = map.createLayer("Above Player", tileset, 0, 0);
        aboveLayer?.setDepth(10);
        this.worldLayer.setCollisionByProperty({ collides: true });

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }

    private initPlayer() {
        this.player = new Player(this, 800, 780);
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
        this.physics.add.collider(this.player, this.worldLayer);
    }

    private initKeyboard() {
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
        }
        this.events.on('update', () => this.update());
    }

    update() {
        if (!this.player || !this.cursors) return;
        this.player.update(this.cursors, 300);
    }
}
