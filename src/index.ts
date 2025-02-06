import Phaser, { Game } from 'phaser';
import scenes from './scenes';

import type { Types } from 'phaser';

const config: Types.Core.GameConfig = {
    title: 'Cozy Copilot',
    version: '1.0.0',
    width: 768,
    height: 1024,
    type: Phaser.AUTO,
    min: {
        width: 480,
        height: 720,
    },
    max: {
        width: 1024,
        height: 1280,
    },
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    disableContextMenu: process.env.NODE_ENV === 'production',
    scale: {
        parent: 'app',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [...scenes]
};

export default new Game(config);
