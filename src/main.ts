import Phaser, { Game } from 'phaser';
import scenes from './scenes';

import { GAME_SETTINGS, VIEWPORT_CONSTANTS } from './constants';

import type { Types } from 'phaser';


const config: Types.Core.GameConfig = {
    title: GAME_SETTINGS.TITLE,
    version: GAME_SETTINGS.VERSION,
    width: VIEWPORT_CONSTANTS.MAX.WIDTH,
    height: VIEWPORT_CONSTANTS.MAX.HEIGHT,
    type: Phaser.AUTO,
    physics: {
        default: 'arcade',
        arcade: { debug: GAME_SETTINGS.IS_DEBUG }
    },
    disableContextMenu: GAME_SETTINGS.IS_CONTEXT_MENU_DISABLED,
    scale: {
        parent: 'app',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
            width: VIEWPORT_CONSTANTS.MIN.WIDTH,
            height: VIEWPORT_CONSTANTS.MIN.HEIGHT
        },
        max: {
            width: VIEWPORT_CONSTANTS.MAX.WIDTH,
            height: VIEWPORT_CONSTANTS.MAX.HEIGHT
        }
    },
    scene: [...scenes],
    zoom: VIEWPORT_CONSTANTS.ZOOM
};

export default new Game(config);
