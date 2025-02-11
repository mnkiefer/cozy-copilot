import { Scene } from 'phaser';

import type { GameObjects } from 'phaser';


export class MainMenu extends Scene {
    background!: GameObjects.Image;

    constructor() {
        super('MainMenu');
    }

    preload(): void {
        this.load.image('menu', 'assets/main-menu.png');
    }

    create(): void {
        const background = this.add.image(0, 0, 'menu').setOrigin(0, 0);
        background.displayWidth = this.sys.canvas.width;
        background.displayHeight = this.sys.canvas.height;

        this.add.text(this.sys.canvas.width / 2, this.sys.canvas.height / 3, 'DEMO', {
            fontFamily: 'Arial Black',
            fontSize: 80,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 12,
            align: 'center'
        }).setOrigin(0.5);

        const startText = this.add.text(this.sys.canvas.width / 2, this.sys.canvas.height / 2 + 50,
            'Click here to start', {
            fontFamily: 'Arial Black',
            fontSize: 50,
            color: '#ffcc99',
            stroke: '#000000', strokeThickness: 10,
            align: 'center'
        }).setOrigin(0.5);

        // Add interaction to start the game
        startText.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.startGame());
    }

    startGame(): void {
        this.scene.start('World');
    }
}
