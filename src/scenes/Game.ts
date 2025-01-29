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
        const buttonSize = 64;
        const padding = 20;
        const alpha = 0.5;

        // Create directional buttons
        const upButton = this.add.circle(padding + buttonSize * 1.5, this.cameras.main.height - padding - buttonSize * 2, buttonSize/2, 0x666666, alpha)
            .setScrollFactor(0)
            .setInteractive();
        const downButton = this.add.circle(padding + buttonSize * 1.5, this.cameras.main.height - padding, buttonSize/2, 0x666666, alpha)
            .setScrollFactor(0)
            .setInteractive();
        const leftButton = this.add.circle(padding + buttonSize * 0.5, this.cameras.main.height - padding - buttonSize, buttonSize/2, 0x666666, alpha)
            .setScrollFactor(0)
            .setInteractive();
        const rightButton = this.add.circle(padding + buttonSize * 2.5, this.cameras.main.height - padding - buttonSize, buttonSize/2, 0x666666, alpha)
            .setScrollFactor(0)
            .setInteractive();

        // Add touch handlers
        leftButton.on('pointerdown', () => this.moveLeft = true);
        leftButton.on('pointerup', () => this.moveLeft = false);
        leftButton.on('pointerout', () => this.moveLeft = false);

        rightButton.on('pointerdown', () => this.moveRight = true);
        rightButton.on('pointerup', () => this.moveRight = false);
        rightButton.on('pointerout', () => this.moveRight = false);

        upButton.on('pointerdown', () => this.moveUp = true);
        upButton.on('pointerup', () => this.moveUp = false);
        upButton.on('pointerout', () => this.moveUp = false);

        downButton.on('pointerdown', () => this.moveDown = true);
        downButton.on('pointerup', () => this.moveDown = false);
        downButton.on('pointerout', () => this.moveDown = false);
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
