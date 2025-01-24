import { Scene } from 'phaser';

export function createEnvironment(scene: Scene): void {
    const canvasWidth = scene.sys.canvas.width + 64;
    const canvasHeight = scene.sys.canvas.height + 128;
    for (let x = 0; x <= canvasWidth; x += 64) { // Adjusted condition
        for (let y = 0; y <= canvasHeight; y += 128) { // Adjusted condition
            scene.add.sprite(x, y, 'grass');
            if (Math.random() > 0.9) {
                const bush = scene.add.sprite(x, y, 'bush');
                bush.setDepth(y);
            }
            if (Math.random() > 0.9) {
                const flowers = scene.add.sprite(x, y, 'flowers');
                flowers.setDepth(y);
            }
        }
    }
}