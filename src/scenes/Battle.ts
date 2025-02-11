import { Scene } from 'phaser';
import BattleTextBox from '../objects/TextBoxBattle';

import type { World } from './World';

export class Battle extends Scene {
    private textBox!: BattleTextBox;
    private battleMusic!: Phaser.Sound.BaseSound;
    private onBattleEnd!: () => void;

    // New properties for enemy health bar
    private enemyMaxHealth: number = 100;
    private enemyHealth: number = 100;
    private enemyHealthBar!: Phaser.GameObjects.Graphics;
    private enemyHealthBarInfo!: { x: number, y: number, width: number, height: number };

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

        // Debug: pressing "D" reduces enemy health by 10
        this.input.keyboard?.on('keydown-D', () => {
            this.enemyHealth = Math.max(0, this.enemyHealth - 10);
            this.updateEnemyHealthBar();
        });
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
        // Setup enemy health bar for debugging (health decreases as you press "D")
        {
            const barX = enemyFinalX - enemySprite.displayWidth / 2;
            const barY = enemyFinalY - enemySprite.displayHeight / 2 - 15;
            const barWidth = enemySprite.displayWidth;
            const barHeight = 10;
            this.enemyHealthBarInfo = { x: barX, y: barY, width: barWidth, height: barHeight };
            this.enemyHealthBar = this.add.graphics();
            this.enemyHealthBar.setAlpha(0.7);
            this.updateEnemyHealthBar();
        }
        // Add enemy health label "Mystery"
        this.add.text(enemyFinalX, enemyFinalY - enemySprite.displayHeight / 2 - 30, 'Mystery', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

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
        // Add fancy player health bar
        {
            const barGraphics = this.add.graphics();
            barGraphics.setAlpha(0.7); // healthbar semi-transparent
            const barX = playerFinalX - playerSprite.displayWidth / 2;
            const barY = playerFinalY - playerSprite.displayHeight / 2 - 15;
            const barWidth = playerSprite.displayWidth;
            const barHeight = 10;
            // Draw border
            barGraphics.fillStyle(0x000000);
            barGraphics.fillRoundedRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4, 3);
            // Draw new background color
            barGraphics.fillStyle(0x555555);
            barGraphics.fillRoundedRect(barX, barY, barWidth, barHeight, 3);
            // Draw new health fill color
            barGraphics.fillStyle(0x00ffcc);
            barGraphics.fillRoundedRect(barX, barY, barWidth, barHeight, 3);
        }
        // Add player health label "Patience"
        this.add.text(playerFinalX, playerFinalY - playerSprite.displayHeight / 2 - 30, 'Patience', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.textBox.create('A wild Bug appeared...\nIt\'s a SYNTAX SPIDER!\n\nWhat will you do?');
    }

    // New helper method to update enemy health bar
    private updateEnemyHealthBar() {
        const { x, y, width, height } = this.enemyHealthBarInfo;
        this.enemyHealthBar.clear();
        // Draw border
        this.enemyHealthBar.fillStyle(0x000000);
        this.enemyHealthBar.fillRoundedRect(x - 2, y - 2, width + 4, height + 4, 3);
        // Draw background
        this.enemyHealthBar.fillStyle(0x555555);
        this.enemyHealthBar.fillRoundedRect(x, y, width, height, 3);
        // Draw health fill proportional to current health
        const fillWidth = (this.enemyHealth / this.enemyMaxHealth) * width;
        this.enemyHealthBar.fillStyle(0x00ffcc);
        this.enemyHealthBar.fillRoundedRect(x, y, fillWidth, height, 3);
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
