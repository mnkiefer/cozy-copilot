import { Scene } from 'phaser';
import Player from '../objects/Player';
import TextBox from '../objects/TextBox';

import type Phaser from 'phaser';

export class Game extends Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private player!: Player;
    private worldLayer!: Phaser.Tilemaps.TilemapLayer;
    private textBox!: TextBox;
    private debugText!: Phaser.GameObjects.Text;

    constructor() {
        super('Game');
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
        this.textBox.create(`🚨 SYSTEM ALERT! 🚨
"Dear Debugger,
The Land of Code is in danger! A glitch is causing the codelets to run amok. To help them recover, you must seek out the lost Debugging Companions and restore order before it is too late!"`);
        this.events.on('update', () => this.update());
    }

    private initMap() {
        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("code-land", "tiles")!;
        map.createLayer("Below Player", tileset, 0, 0);
        this.worldLayer = map.createLayer("World", tileset, 0, 0)!;
        const aboveLayer = map.createLayer("Above Player", tileset, 0, 0);
        aboveLayer?.setDepth(10);
        this.worldLayer.setCollisionByProperty({ collides: true });
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }

    private initPlayer() {
        this.player = new Player(this, 865, 780);
        this.physics.add.collider(this.player, this.worldLayer);
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
    }

    private initKeyboard() {
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
        }
    }

    update() {
        if (!this.player || !this.cursors) return;
        this.player.update(this.cursors, 300);

    }
}
