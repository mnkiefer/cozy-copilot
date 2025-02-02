import Phaser, { Game } from 'phaser';
import scenes from './scenes';

import type { Types } from 'phaser';

const config: Types.Core.GameConfig = {
    title: 'Cozy Copilot',
    version: '1.0.0',
    width: 1024,
    height: 768,
    type: Phaser.AUTO,
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    disableContextMenu: process.env.NODE_ENV === 'production',
    scale: {
        parent: 'app',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
            width: 800,
            height: 600
        },
        max: {
            width: 1600,
            height: 1200
        },
        zoom: 0.5
    },
    scene: [...scenes]
};

export default new Game(config);
