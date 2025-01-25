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

export function handleCopilotMovement(player: Player, copilot: Copilot): void {
    const stoppingDistance = 50;
    let targetX = player.x;
    let targetY = player.y;
    if (player.direction === 'left') {
        targetX += stoppingDistance;
    } else if (player.direction === 'right') {
        targetX -= stoppingDistance;
    } else if (player.direction === 'up') {
        targetY += stoppingDistance;
    } else if (player.direction === 'down') {
        targetY -= stoppingDistance;
    }

    const distance = Phaser.Math.Distance.Between(copilot.x, copilot.y, targetX, targetY);
    const springForce = 0.5;
    const damping = 0.9;

    if (distance > stoppingDistance) {
        const angle = Phaser.Math.Angle.Between(copilot.x, copilot.y, targetX, targetY);
        const forceX = Math.cos(angle) * (distance - stoppingDistance) * springForce;
        const forceY = Math.sin(angle) * (distance - stoppingDistance) * springForce;

        if (copilot.body) {
            copilot.setVelocity(
                copilot.body.velocity.x * damping + forceX,
                copilot.body.velocity.y * damping + forceY
            );
        }
    } else {
        copilot.setVelocity(0);
    }

    if (copilot.body) {
        const copilotVelocity = new Phaser.Math.Vector2(copilot.body.velocity.x, copilot.body.velocity.y);
        if (copilotVelocity.length() > 10) {
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
