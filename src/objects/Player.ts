import Phaser from 'phaser';
import type TextBox from './TextBox';

import type { Scene } from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    private textBox: TextBox;

    constructor(scene: Scene, x: number, y: number, textBox: TextBox) {
        super(scene, x, y, 'player');
        this.textBox = textBox;
        scene.physics.add.existing(this);
        scene.add.existing(this);
        this.setCollideWorldBounds(true);
        this.initAnimations(scene);
    }

    private initAnimations(scene: Scene) {
        const animations = [
            { key: 'walk-down', start: 0, end: 3 },
            { key: 'walk-up', start: 4, end: 7 },
            { key: 'walk-left', start: 8, end: 11 },
            { key: 'walk-right', start: 12, end: 15 }
        ];
        animations.forEach(anim => {
            scene.anims.create({
                key: anim.key,
                frames: scene.anims.generateFrameNames('player',
                    { prefix: 'player_', start: anim.start, end: anim.end }
                ),
                frameRate: 5,
                repeat: -1
            });
        });
    }

    public update(cursors: Phaser.Types.Input.Keyboard.CursorKeys, speed: number) {
        if (this.textBox.isActive) {
            this.setVelocity(0);
            this.anims.stop();
            return;
        }

        this.setVelocity(0);
        const direction = cursors.left?.isDown ? 'left' : cursors.right?.isDown
            ? 'right' : cursors.up?.isDown
                ? 'up' : cursors.down?.isDown ? 'down' : null;
        if (direction) {
            const velocity = direction === 'left' || direction === 'right' ? {
                x: direction === 'left'
                    ? -speed : speed, y: 0
            } : {
                x: 0, y: direction === 'up'
                    ? -speed : speed
            };
            this.setVelocity(velocity.x, velocity.y);
            this.anims.play(`walk-${direction}`, true);
        }
        if (this.body && this.body.velocity.length() === 0) this.anims.stop();
        if (this.body) this.body.velocity.normalize().scale(speed);
    }
}
