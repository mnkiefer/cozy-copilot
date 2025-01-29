import { Scene } from 'phaser';
import { Player, handlePlayerMovement } from '../helpers/Player';
import { Copilot, handleCopilotMovement } from '../helpers/Copilot';
import { createEnvironment } from '../helpers/environment';

export class Game extends Scene
{
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private player: Player;
    private copilot: Copilot;
    private moveLeft: boolean = false;
    private moveRight: boolean = false;
    private moveUp: boolean = false;
    private moveDown: boolean = false;

    constructor ()
    {
        super('Game');
    }

    preload (): void {
        this.loadAssets();
    }

    create (): void
    {
        createEnvironment(this);
        this.player = new Player(this, 300, 300);
        this.copilot = new Copilot(this, 350, 300);
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.setupCollisions();
        this.player.setDepth(this.player.y);
        this.copilot.setDepth(this.copilot.y);
        this.createMobileControls();
    }

    update (): void
    {
        this.handleMovement();
        handleCopilotMovement(this.player, this.copilot);
        this.player.setDepth(this.player.y);
        this.copilot.setDepth(this.copilot.y);
    }

    private loadAssets(): void {
        this.load.spritesheet('player', 'assets/player.png', {
            frameWidth: 64,
            frameHeight: 80,
            startFrame: 0,
            endFrame: 15
        });
        this.load.spritesheet('water', 'assets/spritesheet.png', {
            frameWidth: 64,
            frameHeight: 128,
            startFrame: 12,
            endFrame: 20
        });
        this.load.spritesheet('grass', 'assets/spritesheet.png', {
            frameWidth: 64,
            frameHeight: 128,
            startFrame: 21,
            endFrame: 22
        });
        this.load.spritesheet('bush', 'assets/spritesheet.png', {
            frameWidth: 64,
            frameHeight: 64,
            startFrame: 184,
            endFrame: 184
        });
        this.load.spritesheet('flowers', 'assets/spritesheet.png', {
            frameWidth: 64,
            frameHeight: 64,
            startFrame: 165,
            endFrame: 165
        });
        this.load.spritesheet('copilot', 'assets/copilot.png', {
            frameWidth: 64,
            frameHeight: 80,
            startFrame: 0,
            endFrame: 15
        });
    }

    private setupCollisions(): void {
        this.physics.add.collider(this.player, this.copilot, () => {
            this.player.setImmovable(true);
            this.copilot.setImmovable(true);
        });
    }

    private createMobileControls(): void {
        // Calculate dimensions based on screen size
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;
        const buttonSize = Math.min(screenWidth, screenHeight) * 0.15; // 15% of screen size
        const padding = buttonSize; // 100% of button size
        const alpha = 0.4;

        // Position controls in bottom left corner
        const baseX = padding + buttonSize;
        const baseY = screenHeight - padding - buttonSize;

        // Create directional buttons with relative positioning
        const upButton = this.add.circle(baseX, baseY - buttonSize, buttonSize/2, 0x666666, alpha)
            .setScrollFactor(0)
            .setInteractive()
            .setDepth(1000); // Ensure buttons are always on top

        const downButton = this.add.circle(baseX, baseY + buttonSize, buttonSize/2, 0x666666, alpha)
            .setScrollFactor(0)
            .setInteractive()
            .setDepth(1000);

        const leftButton = this.add.circle(baseX - buttonSize, baseY, buttonSize/2, 0x666666, alpha)
            .setScrollFactor(0)
            .setInteractive()
            .setDepth(1000);

        const rightButton = this.add.circle(baseX + buttonSize, baseY, buttonSize/2, 0x666666, alpha)
            .setScrollFactor(0)
            .setInteractive()
            .setDepth(1000);

        // Add larger hit areas for better touch response
        const hitArea = new Phaser.Geom.Circle(0, 0, buttonSize/1.5);
        [upButton, downButton, leftButton, rightButton].forEach(button => {
            button.setInteractive(hitArea, Phaser.Geom.Circle.Contains);
        });

        // Add touch handlers with improved touch response
        const addTouchHandlers = (button: Phaser.GameObjects.Shape, moveProperty: string) => {
            button.on('pointerdown', () => this[moveProperty] = true);
            button.on('pointerup', () => this[moveProperty] = false);
            button.on('pointerout', () => this[moveProperty] = false);
            // Add touch cancel handler for better mobile experience
            button.on('pointercancel', () => this[moveProperty] = false);
        };

        addTouchHandlers(leftButton, 'moveLeft');
        addTouchHandlers(rightButton, 'moveRight');
        addTouchHandlers(upButton, 'moveUp');
        addTouchHandlers(downButton, 'moveDown');

        // Make controls only visible on touch devices
        const isTouchDevice = this.sys.game.device.input.touch;
        [upButton, downButton, leftButton, rightButton].forEach(button => {
            button.setVisible(isTouchDevice);
        });
    }

    private handleMovement(): void {
        const controls: MovementControls = {
            left: this.cursors.left?.isDown || this.moveLeft,
            right: this.cursors.right?.isDown || this.moveRight,
            up: this.cursors.up?.isDown || this.moveUp,
            down: this.cursors.down?.isDown || this.moveDown
        };

        const velocity = this.calculateVelocity(controls);
        this.player.setVelocity(velocity.x, velocity.y);
        this.updatePlayerAnimation(controls, velocity);
    }

    private calculateVelocity(controls: MovementControls): { x: number; y: number } {
        const speed = 160;
        return {
            x: (controls.left ? -speed : 0) + (controls.right ? speed : 0),
            y: (controls.up ? -speed : 0) + (controls.down ? speed : 0)
        };
    }

    private updatePlayerAnimation(controls: MovementControls, velocity: { x: number; y: number }): void {
        if (velocity.x === 0 && velocity.y === 0) {
            this.player.anims.stop();
            return;
        }

        if (Math.abs(velocity.x) > Math.abs(velocity.y)) {
            this.player.direction = velocity.x > 0 ? 'right' : 'left';
            this.player.anims.play(`walk_${this.player.direction}`, true);
        } else {
            this.player.direction = velocity.y > 0 ? 'down' : 'up';
            this.player.anims.play(`walk_${this.player.direction}`, true);
        }
    }
}

interface MovementControls {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
}
