import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';

import { Game, Types } from 'phaser';

const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 768,
    height: 1024,
    backgroundColor: "#2d7c45",
    min: {
        width: 480,
        height: 720,
    },
    max: {
        width: 1024,
        height: 1280,
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    dom: {
        createContainer: true
    },
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame
    ]
};

export default new Game(config);
