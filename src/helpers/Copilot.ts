import { Scene } from 'phaser';
import { Player } from './Player';

export class Copilot extends Phaser.Physics.Arcade.Sprite {
    direction: 'left' | 'right' | 'up' | 'down';

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'copilot', 0);
        this.direction = 'down'; // Initialize direction

        // Add the copilot to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Create animations
        scene.anims.create({
            key: 'copilot_walk_down',
            frames: scene.anims.generateFrameNumbers('copilot', { start: 0, end: 3 }),
            frameRate: 3,
            repeat: -1
        });
        scene.anims.create({
            key: 'copilot_walk_up',
            frames: scene.anims.generateFrameNumbers('copilot', { start: 4, end: 7 }),
            frameRate: 3,
            repeat: -1
        });
        scene.anims.create({
            key: 'copilot_walk_left',
            frames: scene.anims.generateFrameNumbers('copilot', { start: 8, end: 11 }),
            frameRate: 3,
            repeat: -1
        });
        scene.anims.create({
            key: 'copilot_walk_right',
            frames: scene.anims.generateFrameNumbers('copilot', { start: 12, end: 15 }),
            frameRate: 3,
            repeat: -1
        });
    }
}

interface CopilotConfig {
    stoppingDistance: number;
    springForce: number;
    damping: number;
    minMovementSpeed: number;
}

const DEFAULT_CONFIG: CopilotConfig = {
    stoppingDistance: 50,
    springForce: 0.5,
    damping: 0.9,
    minMovementSpeed: 10
};

export function handleCopilotMovement(
    player: Player,
    copilot: Copilot,
    config: Partial<CopilotConfig> = {}
): void {
    const { stoppingDistance, springForce, damping, minMovementSpeed } = { ...DEFAULT_CONFIG, ...config };

    const targetPosition = calculateTargetPosition(player, stoppingDistance);
    const distance = Phaser.Math.Distance.Between(copilot.x, copilot.y, targetPosition.x, targetPosition.y);

    if (distance > stoppingDistance) {
        applyMovementForces(copilot, targetPosition, distance, stoppingDistance, springForce, damping);
    } else {
        copilot.setVelocity(0);
    }

    updateAnimation(copilot, minMovementSpeed);
}

function calculateTargetPosition(player: Player, offset: number): { x: number; y: number } {
    const position = { x: player.x, y: player.y };

    switch (player.direction) {
        case 'left': position.x += offset; break;
        case 'right': position.x -= offset; break;
        case 'up': position.y += offset; break;
        case 'down': position.y -= offset; break;
    }

    return position;
}

function applyMovementForces(
    copilot: Copilot,
    target: { x: number; y: number },
    distance: number,
    stoppingDistance: number,
    springForce: number,
    damping: number
): void {
    const angle = Phaser.Math.Angle.Between(copilot.x, copilot.y, target.x, target.y);
    const forceX = Math.cos(angle) * (distance - stoppingDistance) * springForce;
    const forceY = Math.sin(angle) * (distance - stoppingDistance) * springForce;

    if (copilot.body) {
        copilot.setVelocity(
            copilot.body.velocity.x * damping + forceX,
            copilot.body.velocity.y * damping + forceY
        );
    }
}

function updateAnimation(copilot: Copilot, minSpeed: number): void {
    if (copilot.body) {
        const copilotVelocity = new Phaser.Math.Vector2(copilot.body.velocity.x, copilot.body.velocity.y);
        if (copilotVelocity.length() > minSpeed) {
            if (Math.abs(copilotVelocity.x) > Math.abs(copilotVelocity.y)) {
                if (copilotVelocity.x > 0) {
                    copilot.anims.play('copilot_walk_right', true);
                } else if (copilotVelocity.x < 0) {
                    copilot.anims.play('copilot_walk_left', true);
                }
            } else {
                if (copilotVelocity.y > 0) {
                    copilot.anims.play('copilot_walk_down', true);
                } else if (copilotVelocity.y < 0) {
                    copilot.anims.play('copilot_walk_up', true);
                }
            }
        } else {
            if (copilotVelocity.length() === 0) {
                copilot.anims.stop();
            }
        }
    }
}
