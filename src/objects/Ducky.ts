import Phaser from 'phaser';

import type { Scene } from 'phaser';

export default class Ducky extends Phaser.Physics.Arcade.Sprite {
    private nextMoveTime = 0;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'ducky');
        scene.physics.add.existing(this);
        scene.add.existing(this);
        this.setCollideWorldBounds(true);
        this.initAnimations(scene);
    }

    private initAnimations(scene: Scene) {
        const animations = [
            { key: 'duck-down', start: 0, end: 3 },
            { key: 'duck-up', start: 4, end: 7 },
            { key: 'duck-left', start: 8, end: 11 },
            { key: 'duck-right', start: 12, end: 15 }
        ];
        animations.forEach(anim => {
            scene.anims.create({
                key: anim.key,
                frames: scene.anims.generateFrameNames('ducky',
                    { prefix: 'ducky_', start: anim.start, end: anim.end }
                ),
                frameRate: 2,
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
        if (this.body && this.body.velocity.x < 0) this.anims.play('duck-left', true);
        else if (this.body && this.body.velocity.x > 0) this.anims.play('duck-right', true);
        else if (this.body && this.body.velocity.y < 0) this.anims.play('duck-up', true);
        else if (this.body && this.body.velocity.y > 0) this.anims.play('duck-down', true);

        // Restrict movement within the specified bounds
        this.x = Phaser.Math.Clamp(this.x, bounds.x, bounds.x + bounds.width);
        this.y = Phaser.Math.Clamp(this.y, bounds.y, bounds.y + bounds.height);
    }
}
