import type { Scene } from 'phaser';

export function applyTweenEffect(scene: Scene, target: Phaser.GameObjects.Image, effect: string) {
    switch (effect) {
        case 'Rotate Full Circle':
            scene.tweens.add({
                targets: target,
                angle: 360,
                duration: 1000,
                ease: 'Power2',
                onComplete: () => console.log('Rotate Full Circle effect completed on target')
            });
            break;
        case 'Fade Out and In':
            scene.tweens.add({
                targets: target,
                alpha: 0,
                duration: 500,
                yoyo: true,
                repeat: 1,
                onComplete: () => console.log('Fade Out and In effect completed on target')
            });
            break;
        case 'Shrink and Expand':
            scene.tweens.add({
                targets: target,
                scaleX: 0.5,
                scaleY: 0.5,
                duration: 500,
                yoyo: true,
                onComplete: () => console.log('Shrink and Expand effect completed on target')
            });
            break;
        case 'Glow':
            scene.tweens.add({
                targets: target,
                alpha: { from: 1, to: 0.5 },
                duration: 100,
                yoyo: true,
                repeat: 5,
                onComplete: () => console.log('Glow effect completed on target')
            });
            break;
        default:
            // Default effect: Blink red
            scene.tweens.add({
                targets: target,
                tint: { from: 0xffffff, to: 0xff0000 },
                duration: 100,
                yoyo: true,
                repeat: 3,
                onComplete: () => console.log('Blink Red effect completed on target')
            });
            break;
    }
}
