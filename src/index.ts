import Phaser, { Game } from 'phaser';
import scenes from './scenes';

import type { Types } from 'phaser';

const config: Types.Core.GameConfig = {
    title: 'Cozy Copilot',
    version: '1.0.0',
    width: 1920, //640
    height: 1080, // 360
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
            width: 320,
            height: 180
        },
        max: {
            width: 1920,
            height: 1080
        }
    },
    scene: [...scenes]
};

export default new Game(config);
