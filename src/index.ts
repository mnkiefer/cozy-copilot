import Phaser, { Game } from 'phaser';
import scenes from './scenes';

import type { Types } from 'phaser';

const config: Types.Core.GameConfig = {
    title: 'Cozy Copilot',
    version: '1.0.0',
    width: window.innerWidth * 1.5,
    height: window.innerHeight * 1.5,
    type: Phaser.AUTO,
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    disableContextMenu: process.env.NODE_ENV === 'production',
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'app',
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [...scenes],
};

export default new Game(config);
