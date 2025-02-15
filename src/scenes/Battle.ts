import { Scene } from 'phaser';
import BattleTextBox from '../objects/BattleTextBox';
import HealthBar from '../objects/HealthBar';

import type { World } from './World';

export class Battle extends Scene {
    private textBox!: BattleTextBox;
    private battleMusic!: Phaser.Sound.BaseSound;
    private onBattleEnd!: () => void;

    // Remove old health bar properties
    private enemyHealthBar!: HealthBar;
    private playerHealthBar!: HealthBar;

    constructor() {
        super('Battle');
    }

    create(data: { battleMusic: Phaser.Sound.BaseSound, onBattleEnd: () => void }) {
        this.battleMusic = data.battleMusic;
        this.onBattleEnd = data.onBattleEnd;

        this.battleMusic.play();
        this.tweens.add({
            targets: this.battleMusic,
            volume: 0.5,
            duration: 1000
        });

        this.cameras.main.fadeIn(500);
        this.textBox = new BattleTextBox(this, () => this.exitBattle());
        this.startBattle();
        this.createHealthBars('PLAYER', 'SYNTAX SPIDER');
    }

    private startBattle() {
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000)
            .setOrigin(0, 0)
            .setAlpha(0.8);
        const spriteSize = Math.min(this.cameras.main.width, this.cameras.main.height) * 0.5;

        // Enemy sprite: starting off-screen left then tween to final position
        const enemyFinalX = this.cameras.main.width * 0.75;
        const enemyFinalY = this.cameras.main.height * 0.3;
        const enemySprite = this.add.image(enemyFinalX, enemyFinalY, 'syntax-spider');
        enemySprite.setScale(spriteSize / Math.max(enemySprite.width, enemySprite.height));
        enemySprite.x = -enemySprite.width; // start off-screen left
        this.tweens.add({
            targets: enemySprite,
            x: enemyFinalX,
            duration: 1000,
            ease: 'Power2'
        });

        // Player sprite: starting off-screen right then tween to final position
        const playerFinalX = this.cameras.main.width * 0.25;
        const playerFinalY = this.cameras.main.height * 0.48;
        const playerSprite = this.add.image(playerFinalX, playerFinalY, 'cartoon-player');
        playerSprite.setScale(spriteSize / Math.max(playerSprite.width, playerSprite.height));
        playerSprite.x = this.cameras.main.width + playerSprite.width; // start off-screen right
        this.tweens.add({
            targets: playerSprite,
            x: playerFinalX,
            duration: 1000,
            ease: 'Power2'
        });

        this.textBox.create('A wild Bug appeared...\n\n\nWhat will you do?');
    }

    // New method to create health bars
    private createHealthBars(playerName: string, enemyName: string) {
        // Enemy health bar with name and experience level
        this.enemyHealthBar = new HealthBar(this, this.cameras.main.originX, 50, enemyName, 'Lv. 5'); // width changed to 400, color changed to green

        // Player health bar with name and experience level
        this.playerHealthBar = new HealthBar(this, this.cameras.main.width - 500, this.cameras.main.height - 400, playerName, 'Lv. 10'); // width changed to 400, color changed to green
    }

    private exitBattle() {
        this.battleMusic.stop();

        this.cameras.main.fadeOut(400, 0, 0, 0, (camera: Phaser.Cameras.Scene2D.Camera, progress: number) => {
            if (progress === 1) {
                const gameScene = this.scene.get('World') as World;
                this.scene.resume('World');
                gameScene.cameras.main.resetFX();
                gameScene.cameras.main.fadeIn(400);

                // Do not reenter battle right away
                gameScene.time.delayedCall(2000, () => {
                    gameScene.canEnterBattle = true;
                });

                this.scene.stop('Battle');
                this.onBattleEnd();
            }
        });
    }
}
