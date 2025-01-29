import { Scene } from 'phaser';

interface EnvironmentConfig {
    tileSize: number;
    decorationChance: number;
}

const DEFAULT_CONFIG: EnvironmentConfig = {
    tileSize: 64,
    decorationChance: 0.1
};

export function createEnvironment(scene: Scene, config: Partial<EnvironmentConfig> = {}): void {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    const { tileSize, decorationChance } = finalConfig;

    const width = Math.ceil(scene.sys.canvas.width / tileSize) + 1;
    const height = Math.ceil(scene.sys.canvas.height / tileSize) + 1;

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const posX = x * tileSize;
            const posY = y * tileSize;

            // Base tile
            scene.add.sprite(posX, posY, 'grass');

            // Decorations
            if (Math.random() < decorationChance) {
                const decoration = scene.add.sprite(posX, posY, Math.random() < 0.5 ? 'bush' : 'flowers');
                decoration.setDepth(posY);
            }
        }
    }
}