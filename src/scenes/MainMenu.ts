import { Scene } from 'phaser';
import type { GameObjects } from 'phaser';

export class MainMenu extends Scene {
    background!: GameObjects.Image;
    land!: GameObjects.Graphics;
    logo!: GameObjects.Text;
    title!: GameObjects.Text;

    constructor() {
        super('MainMenu');
    }

    preload(): void {
        this.load.image('menu', 'assets/main-menu.png'); // Ensure the background image is preloaded
    }

    create(): void {
        // Add the clouds background
        this.background = this.add.image(0, 0, 'menu').setOrigin(0, 0);

        // Scale the background to fit the canvas
        this.background.displayWidth = this.sys.canvas.width;
        this.background.displayHeight = this.sys.canvas.height;

        // Center the logo text
        this.logo = this.add.text(this.sys.canvas.width / 2, this.sys.canvas.height / 3, 'DEMO', {
            fontFamily: 'Arial Black', fontSize: 50, color: '#ffffff', // Adjust font size if needed
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        // Center the title text
        this.title = this.add.text(this.sys.canvas.width / 2, this.sys.canvas.height / 2 + 50, 'Start Game', {
            fontFamily: 'Arial Black', fontSize: 30, color: '#ffcc99', // Change color to light pale orange
            stroke: '#000000', strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5);

        // Add interaction to start the game
        this.title.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.startGame());
    }

    startGame(): void {
        this.scene.start('Game');
    }
}
