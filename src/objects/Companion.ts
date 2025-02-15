import type { Scene } from 'phaser';

export default class Companion extends Phaser.Physics.Arcade.Sprite {
    private nextMoveTime = 0;

    constructor(companion: string, scene: Scene, x: number, y: number, frameRate: number) {
        super(scene, x, y, companion);
        scene.physics.add.existing(this);
        scene.add.existing(this);
        this.setCollideWorldBounds(true);
        this.initAnimations(companion, scene, frameRate);
    }

    private initAnimations(companion: string, scene: Scene, frameRate: number) {
        const animations = [
            { key: 'move-down', start: 0, end: 3 },
            { key: 'move-up', start: 4, end: 7 },
            { key: 'move-left', start: 8, end: 11 },
            { key: 'move-right', start: 12, end: 15 }
        ];
        animations.forEach(anim => {
            scene.anims.create({
                key: anim.key,
                frames: scene.anims.generateFrameNames(companion,
                    { prefix: 'move-', start: anim.start, end: anim.end }
                ),
                frameRate,
                repeat: -1
            });
        });
    }

    public update(bounds: Phaser.Geom.Rectangle, speed: number) {
        if (this.scene.time.now > this.nextMoveTime) {
            this.nextMoveTime = this.scene.time.now + 1000;
            const direction = new Phaser.Math.Vector2(
              Phaser.Math.Between(-1, 1),
              Phaser.Math.Between(-1, 1)
            ).normalize();
            this.setVelocity(direction.x * speed, direction.y * speed);
        }
        // Play animation based on current velocity
        if (this.body && this.body.velocity.x < 0) this.anims.play('move-left', true);
        else if (this.body && this.body.velocity.x > 0) this.anims.play('move-right', true);
        else if (this.body && this.body.velocity.y < 0) this.anims.play('move-up', true);
        else if (this.body && this.body.velocity.y > 0) this.anims.play('move-down', true);

        // Restrict movement within the specified bounds
        this.x = Phaser.Math.Clamp(this.x, bounds.x, bounds.x + bounds.width);
        this.y = Phaser.Math.Clamp(this.y, bounds.y, bounds.y + bounds.height);
    }
}