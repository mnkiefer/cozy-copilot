import { Scene } from 'phaser';

import Player from '../objects/Player';
import TextBox from '../objects/TextBox';

import { GAME_SETTINGS, PLAYER_CONSTANTS } from '../constants';

import type { Tilemaps } from 'phaser';


export class World extends Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private player!: Player;
    private map!: Phaser.Tilemaps.Tilemap;
    private worldLayer!: Phaser.Tilemaps.TilemapLayer;
    private textBox!: TextBox;

    private battleZones!: Phaser.Tilemaps.TilemapLayer;
    public canEnterBattle: boolean = true;
    private lastBattleCheck: number = 0;
    private lastBattleTile: Phaser.Tilemaps.Tile | null = null;

    constructor() {
        super('World');
    }

    create() {
        this.initMap();
        this.initPlayer();
        this.initKeyboard();

        this.playBackgroundMusic();

        this.textBox = new TextBox(this);
        this.textBox.create("Be careful! There might be 🪲 bugs 🐛 lurking around here. Use the arrow keys to move around and explore.");

        this.events.on('update', () => this.update());
        this.events.on('resume', () => this.player.isTransitioning = false);
    }

    update() {
        if (!this.player || !this.cursors) return;

        this.player.update(this.cursors, PLAYER_CONSTANTS.MOVEMENT_SPEED);

        // Check for battle zone collision
        if (this.battleZones && this.canEnterBattle) {
            const playerTilePos = this.battleZones.worldToTileXY(this.player.x, this.player.y);
            const tile = this.battleZones.getTileAt(playerTilePos.x, playerTilePos.y);

            if (tile && (!this.lastBattleTile || this.lastBattleTile !== tile)) {
                this.lastBattleTile = tile;
                if (Math.random() < 0.2) { // 20% chance to trigger battle
                    this.startBattle();
                }
            } else if (!tile) {
                this.lastBattleTile = null;
            }
        }

        if (this.player.x > this.map.widthInPixels - 50) {
            this.exitGame();
        }
    }


    private initMap() {
        this.map = this.make.tilemap({ key: "map" });
        const tileset: Tilemaps.Tileset = this.map.addTilesetImage("code-land", "tiles")!;

        this.map.createLayer("Below Player", tileset, 0, 0);
        this.map.createLayer("Below Player 2", tileset, 0, 0);
        this.worldLayer = this.map.createLayer("World", tileset, 0, 0)!;
        const aboveLayer = this.map.createLayer("Above Player", tileset, 0, 0);
        aboveLayer?.setDepth(10);

        this.worldLayer.setCollisionByProperty({ collides: true });
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.battleZones = this.map.createLayer("Battle", tileset, 0, 0)!;
        this.battleZones.setVisible(false);
    }

    private initPlayer() {
        this.player = new Player(this, 500, 50, this.textBox);
        this.physics.add.collider(this.player, this.worldLayer);
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
    }

    private initKeyboard() {
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
        }
    }

    private playBackgroundMusic() {
        this.sound.play('music-opening', {
            loop: true,
            volume: 0.5
        });
    }

    private startBattle() {
        if (!this.canEnterBattle) return;
        this.canEnterBattle = false;
        this.player.isTransitioning = true;

        const currentMusic = this.sound.get('music-opening');
        const battleMusic = this.sound.add('battle', {
            volume: 0,
            loop: true,
            mute: GAME_SETTINGS.IS_MUTED
        });

        this.cameras.main.flash(200);

        // Fade out current music
        if (currentMusic && !GAME_SETTINGS.IS_MUTED) {
            this.tweens.add({
                targets: currentMusic,
                volume: 0,
                duration: 400
            });
        }

        // Fade in battle music
        if (!GAME_SETTINGS.IS_MUTED) {
            this.tweens.add({
                targets: battleMusic,
                volume: 0.5,
                duration: 400
            });
        }

        this.cameras.main.fadeOut(250, 0, 0, 0);

        this.time.delayedCall(250, () => {
            this.scene.launch('Battle', {
                battleMusic,
                onBattleEnd: () => {
                    this.scene.resume();
                    this.cameras.main.fadeIn(250);
                    this.time.delayedCall(2000, () => {
                        this.canEnterBattle = true;
                    });
                }
            });
            this.scene.pause();
        });
    }

    private exitGame() {
        this.player.isTransitioning = true;
        this.player.setVelocity(0, 0);  // Stop player movement
        this.player.anims.stop();  // Stop any running animation
        this.cursors.left.enabled = false;  // Disable input
        this.cursors.right.enabled = false;
        this.cursors.up.enabled = false;
        this.cursors.down.enabled = false;

        this.textBox.create("End of Demo - Thank you for playing!", () => {
            const currentMusic = this.sound.get('music-opening');
            if (currentMusic && !GAME_SETTINGS.IS_MUTED) {
                this.tweens.add({
                    targets: currentMusic,
                    volume: 0,
                    duration: 400
                });
            }
            this.cameras.main.fadeOut(250, 0, 0, 0);
            this.time.delayedCall(250, () => {
                this.scene.start('MainMenu');
            });
        });
    }

}