import { Scene } from 'phaser';

import Player from '../objects/Player';
import Companion from '../objects/Companion';
import TextBox from '../objects/TextBox';

import { PLAYER_CONSTANTS } from '../constants';

import type { Tilemaps } from 'phaser';


export class World extends Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private player!: Player;
    private map!: Phaser.Tilemaps.Tilemap;
    private worldLayer!: Phaser.Tilemaps.TilemapLayer;
    private textBox!: TextBox;
    private companion!: Companion;

    private battleZones!: Phaser.Tilemaps.TilemapLayer;
    public canEnterBattle: boolean = true;
    private lastBattleTile: Phaser.Tilemaps.Tile | null = null;

    constructor() {
        super('World');
    }

    create() {
        this.initMap();
        this.initPlayer(500, 100);
        this.initCompanion('copilot', 450, 0);
        this.initKeyboard();

        this.playBackgroundMusic();

        this.textBox = new TextBox(this);
        this.textBox.create(`Be careful! There might be 🪲 bugs 🐛 lurking about. Use the ← ↑ → ↓ keys to move around and explore...`);

        this.events.on('update', () => this.update());
    }

    private initCompanion(companion: string, x: number, y: number, frameRate: number = 1) {
        this.companion = new Companion(companion, this, x, y, frameRate);
    }

    update() {
        if (!this.player || !this.cursors) return;

        if (!this.scene.isPaused()) {
            this.player.update(this.cursors, PLAYER_CONSTANTS.MOVEMENT_SPEED);
            this.sound.get('world')?.resume();
        }

        this.updateCompanion(this.companion, 100);
        this.updateDepths();

        // Enter battle if the player is in a battle zone
        if (this.battleZones && this.canEnterBattle) {
            const tile = this.battleZones.getTileAtWorldXY(this.player.x, this.player.y);
            if (tile && tile !== this.lastBattleTile) {
                this.lastBattleTile = tile;
                this.startBattle();
            } else if (!tile) {
                this.lastBattleTile = null;
            }
        }

        // Exit the game if the player reaches the end of the map
        if (this.player.x > this.map.widthInPixels - 50) {
            this.exitGame();
        }
    }

    private updateCompanion(companion: Phaser.Physics.Arcade.Sprite, springLength: number) {
        if (this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.down.isDown) {
            const dx = this.player.x - companion.x;
            const dy = this.player.y - companion.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const force = (distance - springLength) * 3;

            const angle = Math.atan2(dy, dx);
            const fx = Math.cos(angle) * force;
            const fy = Math.sin(angle) * force;

            companion.setVelocity(fx, fy);

            // Decide on one direction to avoid switching back and forth repeatedly
            if (companion.body) {
                const absVelocityX = Math.abs(companion.body.velocity.x);
                const absVelocityY = Math.abs(companion.body.velocity.y);

                if (absVelocityX > absVelocityY) {
                    if (companion.body.velocity.x < 0) companion.anims.play('move-left', true);
                    else if (companion.body.velocity.x > 0) companion.anims.play('move-right', true);
                } else {
                    if (companion.body.velocity.y < 0) companion.anims.play('move-up', true);
                    else if (companion.body.velocity.y > 0) companion.anims.play('move-down', true);
                }
            }
        } else {
            companion.setVelocity(0, 0);
        }
    }

    private updateDepths() {
        const sprites = [this.player, this.companion];
        sprites.sort((a, b) => a.y - b.y);
        sprites.forEach((sprite, index) => {
            sprite.setDepth(index);
        });
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

    private initPlayer(x: number = 0, y: number = 0) {
        this.player = new Player(this, x, y);
        this.physics.add.collider(this.player, this.worldLayer);
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
    }

    private initKeyboard() {
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
        }
    }

    private playBackgroundMusic() {
       this.sound.add('world', {
            loop: true,
            volume: 0.5
        });
        this.sound.play('world');
    }

    private startBattle() {
        if (!this.canEnterBattle) return;

        this.canEnterBattle = false;
        this.player.isInBattle = true;
        this.player.isTransitioning = true;
        this.player.setVelocity(0, 0);
        this.player.anims.stop();

        this.sound.pauseAll();

        const battleMusic = this.sound.add('battle', {
            volume: 0,
            loop: true
        });

        this.cameras.main.flash(400);

        this.tweens.add({
            targets: battleMusic,
            volume: 0.5,
            duration: 1000
        });

        this.cameras.main.fadeOut(800, 0, 0, 0);

        this.time.delayedCall(800, () => {
            this.scene.launch('Battle', {
                battleMusic,
                onBattleEnd: () => {
                    this.player.isInBattle = false;
                    this.player.isTransitioning = false;

                    this.sound.resumeAll();

                    this.scene.resume();
                    this.cameras.main.fadeIn(800);
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
        this.player.setVelocity(0, 0);
        this.player.anims.stop();
        this.cursors.left.enabled = false;
        this.cursors.right.enabled = false;
        this.cursors.up.enabled = false;
        this.cursors.down.enabled = false;

        this.textBox.create("End of Demo - Thank you for playing!", () => {
            this.sound.stopAll();

            this.cameras.main.fadeOut(250, 0, 0, 0);
            this.time.delayedCall(250, () => {
                this.scene.start('MainMenu');
            });
        });
    }

}