import { Scene } from 'phaser';
import BattleTextBox from '../objects/TextBoxBattle';

import { GAME_SETTINGS } from '../constants';

import type { World } from './World';

export class Battle extends Scene {
    private textBox!: BattleTextBox;
    private battleMusic!: Phaser.Sound.BaseSound;
    private onBattleEnd!: () => void;

    constructor() {
        super('Battle');
    }

    create(data: { battleMusic: Phaser.Sound.BaseSound, onBattleEnd: () => void }) {
        this.battleMusic = data.battleMusic;
        this.onBattleEnd = data.onBattleEnd;

        // Start the battle music immediately
        if (!GAME_SETTINGS.IS_MUTED) {
            this.battleMusic.play();
        }

        this.cameras.main.fadeIn(500);
        this.textBox = new BattleTextBox(this, () => this.exitBattle());
        this.startBattle();
    }

    private startBattle() {
        // Add semi-transparent black background
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000)
            .setOrigin(0, 0)
            .setAlpha(0.8);

        // Position sprites
        const spriteSize = Math.min(this.cameras.main.width, this.cameras.main.height) * 0.3;

        // Enemy sprite (top right)
        const enemySprite = this.add.image(
            this.cameras.main.width * 0.75,
            this.cameras.main.height * 0.3,
            'syntax-spider'
        );
        enemySprite.setScale(spriteSize / Math.max(enemySprite.width, enemySprite.height));

        // Player sprite (bottom left)
        const playerSprite = this.add.image(
            this.cameras.main.width * 0.25,
            this.cameras.main.height * 0.6,
            'cartoon-player'
        );
        playerSprite.setScale(spriteSize / Math.max(playerSprite.width, playerSprite.height));

        // Initialize battle text
        this.textBox.create('A wild Bug appeared!\n\nWhat will you do?');
    }

    private exitBattle() {
        // Fade out battle music
        if (!GAME_SETTINGS.IS_MUTED) {
            this.tweens.add({
                targets: this.battleMusic,
                volume: 0,
                duration: 400,
                onComplete: () => {
                    this.battleMusic.destroy();
                }
            });
        } else {
            this.battleMusic.destroy();
        }

        // Fade to black
        this.cameras.main.fadeOut(400, 0, 0, 0, (camera: any, progress: number) => {
            if (progress === 1) {
                // Resume game scene and fade back in
                const gameScene = this.scene.get('World') as World;
                this.scene.resume('World');
                gameScene.cameras.main.fadeIn(400);

                // Do not reenter battle right away
                gameScene.time.delayedCall(2000, () => {
                    gameScene.canEnterBattle = true;
                });

                // Restore world music
                const worldMusic = gameScene.sound.get('music-opening');
                if (worldMusic && !GAME_SETTINGS.IS_MUTED) {
                    this.tweens.add({
                        targets: worldMusic,
                        volume: 0.5,
                        duration: 400
                    });
                }

                // Clean up and stop battle scene
                this.scene.stop('Battle');
                this.onBattleEnd();
            }
        });
    }
}
