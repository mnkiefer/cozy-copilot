import { Scene } from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
    direction: 'left' | 'right' | 'up' | 'down';

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'player', 0);
        this.direction = 'down'; // Initialize direction

        // Add the player to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Create animations
        scene.anims.create({
            key: 'walk_down',
            frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 5,
            repeat: -1
        });
        scene.anims.create({
            key: 'walk_up',
            frames: scene.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
            frameRate: 5,
            repeat: -1
        });
        scene.anims.create({
            key: 'walk_left',
            frames: scene.anims.generateFrameNumbers('player', { start: 8, end: 11 }),
            frameRate: 5,
            repeat: -1
        });
        scene.anims.create({
            key: 'walk_right',
            frames: scene.anims.generateFrameNumbers('player', { start: 12, end: 15 }),
            frameRate: 5,
            repeat: -1
        });
    }
}

export function handlePlayerMovement(player: Player, cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
    if (cursors.left!.isDown) {
        player.setVelocityX(-160);
        player.anims.play('walk_left', true);
        player.direction = 'left';
    } else if (cursors.right!.isDown) {
        player.setVelocityX(160);
        player.anims.play('walk_right', true);
        player.direction = 'right';
    } else if (cursors.up!.isDown) {
        player.setVelocityY(-160);
        player.anims.play('walk_up', true);
        player.direction = 'up';
    } else if (cursors.down!.isDown) {
        player.setVelocityY(160);
        player.anims.play('walk_down', true);
        player.direction = 'down';
    } else {
        player.setVelocity(0);
        player.anims.stop();
    }
}
