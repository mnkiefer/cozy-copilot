import { Scene } from 'phaser';
import { Player, handlePlayerMovement } from '../helpers/Player';
import { Copilot, handleCopilotMovement } from '../helpers/Copilot';
import { createEnvironment } from '../helpers/environment';

export class Game extends Scene
{
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private player: Player;
    private copilot: Copilot;

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
    }

    update (): void
    {
        handlePlayerMovement(this.player, this.cursors);
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
}
