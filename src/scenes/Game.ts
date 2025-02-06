import { Scene } from 'phaser';
import Player from '../objects/Player';
import TextBox from '../objects/TextBox';

import Phaser from 'phaser';

export class Game extends Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private player!: Player;
    private worldLayer!: Phaser.Tilemaps.TilemapLayer;
    private textBox!: TextBox;
    private debugText!: Phaser.GameObjects.Text;
    private upButton!: Phaser.GameObjects.Shape;
    private downButton!: Phaser.GameObjects.Shape;
    private leftButton!: Phaser.GameObjects.Shape;
    private rightButton!: Phaser.GameObjects.Shape;

    constructor() {
        super('Game');
    }

    create() {
        this.initMap();
        this.initPlayer();
        this.initKeyboard();
        this.initMobileControls();

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
        // Zoom out camera to show more of the map
        //this.cameras.main.setZoom(0.5);
    }

    private initKeyboard() {
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
        }
    }

    private initMobileControls(): void {
        // Calculate dimensions based on screen size
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;
        const buttonSize = Math.min(screenWidth, screenHeight) * 0.15; // 15% of screen size
        const padding = buttonSize; // 100% of button size
        const alpha = 0.4;

        // Position controls in bottom left corner
        const baseX = padding + buttonSize;
        const baseY = screenHeight - padding - buttonSize * 2; // Move buttons up by one button size

        // Create directional buttons with relative positioning
        this.upButton = this.add.circle(baseX, baseY - buttonSize, buttonSize/2, 0x666666, alpha)
            .setScrollFactor(0)
            .setInteractive()
            .setDepth(1000); // Ensure buttons are always on top

        this.downButton = this.add.circle(baseX, baseY + buttonSize, buttonSize/2, 0x666666, alpha)
            .setScrollFactor(0)
            .setInteractive()
            .setDepth(1000);

        this.leftButton = this.add.circle(baseX - buttonSize, baseY, buttonSize/2, 0x666666, alpha)
            .setScrollFactor(0)
            .setInteractive()
            .setDepth(1000);

        this.rightButton = this.add.circle(baseX + buttonSize, baseY, buttonSize/2, 0x666666, alpha)
            .setScrollFactor(0)
            .setInteractive()
            .setDepth(1000);

        // Add larger hit areas for better touch response
        const hitArea = new Phaser.Geom.Circle(0, 0, buttonSize/1.5);
        [this.upButton, this.downButton, this.leftButton, this.rightButton].forEach(button => {
            button.setInteractive(hitArea, (shape, x, y) => Phaser.Geom.Circle.Contains(shape, x, y));
        });

        // Add touch handlers with improved touch response
        const addTouchHandlers = (button: Phaser.GameObjects.Shape, moveProperty: string) => {
            button.on('pointerdown', () => this[moveProperty] = true);
            button.on('pointerup', () => this[moveProperty] = false);
            button.on('pointerout', () => this[moveProperty] = false);
            // Add touch cancel handler for better mobile experience
            button.on('pointercancel', () => this[moveProperty] = false);
        };

        addTouchHandlers(this.leftButton, 'moveLeft');
        addTouchHandlers(this.rightButton, 'moveRight');
        addTouchHandlers(this.upButton, 'moveUp');
        addTouchHandlers(this.downButton, 'moveDown');

        // Make controls only visible on touch devices
        const isTouchDevice = this.sys.game.device.input.touch;
        [this.upButton, this.downButton, this.leftButton, this.rightButton].forEach(button => {
            button.setVisible(isTouchDevice);
        });

        // Ensure buttons are positioned relative to the camera view
        const camera = this.cameras.main;
        const baseXCamera = camera.scrollX + padding + buttonSize;
        const baseYCamera = camera.scrollY + screenHeight - padding - buttonSize * 2; // Move buttons up by one button size

        this.upButton.setPosition(baseXCamera, baseYCamera - buttonSize);
        this.downButton.setPosition(baseXCamera, baseYCamera + buttonSize);
        this.leftButton.setPosition(baseXCamera - buttonSize, baseYCamera);
        this.rightButton.setPosition(baseXCamera + buttonSize, baseYCamera);
    }

    update() {
        if (!this.player || !this.cursors) return;
        this.player.update(this.cursors, 300);
    }
}
