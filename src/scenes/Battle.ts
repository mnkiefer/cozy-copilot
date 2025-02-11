import { Scene } from 'phaser';
import BattleTextBox from '../objects/TextBoxBattle';

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

        this.battleMusic.play();
        this.tweens.add({
            targets: this.battleMusic,
            volume: 0.5,
            duration: 1000
        });

        this.cameras.main.fadeIn(500);
        this.textBox = new BattleTextBox(this, () => this.exitBattle());
        this.startBattle();
    }

    private startBattle() {
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000)
            .setOrigin(0, 0)
            .setAlpha(0.8);
        const spriteSize = Math.min(this.cameras.main.width, this.cameras.main.height) * 0.5;

        const enemySprite = this.add.image(
            this.cameras.main.width * 0.75,
            this.cameras.main.height * 0.3,
            'syntax-spider'
        );
        enemySprite.setScale(spriteSize / Math.max(enemySprite.width, enemySprite.height));

        const playerSprite = this.add.image(
            this.cameras.main.width * 0.25,
            this.cameras.main.height * 0.48,
            'cartoon-player'
        );
        playerSprite.setScale(spriteSize / Math.max(playerSprite.width, playerSprite.height));

        this.textBox.create('A wild Bug appeared!\n\nWhat will you do?');
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
