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

function createTouchControls() {
    const leftControls = document.createElement('div');
    leftControls.className = 'touch-controls left';

    // Create the d-pad buttons
    const upButton = document.createElement('button');
    upButton.className = 'touch-button';
    upButton.id = 'up';
    upButton.innerHTML = '⬆';

    const leftButton = document.createElement('button');
    leftButton.className = 'touch-button';
    leftButton.id = 'left';
    leftButton.innerHTML = '⬅';

    const downButton = document.createElement('button');
    downButton.className = 'touch-button';
    downButton.id = 'down';
    downButton.innerHTML = '⬇';

    const rightButton = document.createElement('button');
    rightButton.className = 'touch-button';
    rightButton.id = 'right';
    rightButton.innerHTML = '➡';

    // Add buttons to the d-pad container
    leftControls.appendChild(upButton);
    leftControls.appendChild(leftButton);
    leftControls.appendChild(downButton);
    leftControls.appendChild(rightButton);

    // Add container to app
    document.getElementById('app')?.appendChild(leftControls);

    return { leftControls };
}

function setupTouchControls(scene: Phaser.Scene) {
    const touchControls = createTouchControls();

    const keys = {
        up: scene.input.keyboard?.addKey('W'),
        left: scene.input.keyboard?.addKey('A'),
        down: scene.input.keyboard?.addKey('S'),
        right: scene.input.keyboard?.addKey('D')
    };

    touchControls.leftControls.addEventListener('touchstart', (event) => {
        const target = event.target as HTMLElement;
        if (target.classList.contains('touch-button')) {
            event.preventDefault();
            const direction = target.id;
            switch (direction) {
                case 'up':
                    if (keys.up) keys.up.isDown = true;
                    break;
                case 'left':
                    if (keys.left) keys.left.isDown = true;
                    break;
                case 'down':
                    if (keys.down) keys.down.isDown = true;
                    break;
                case 'right':
                    if (keys.right) keys.right.isDown = true;
                    break;
            }
        }
    });

    touchControls.leftControls.addEventListener('touchend', (event) => {
        const target = event.target as HTMLElement;
        if (target.classList.contains('touch-button')) {
            const direction = target.id;
            switch (direction) {
                case 'up':
                    if (keys.up) keys.up.isDown = false;
                    break;
                case 'left':
                    if (keys.left) keys.left.isDown = false;
                    break;
                case 'down':
                    if (keys.down) keys.down.isDown = false;
                    break;
                case 'right':
                    if (keys.right) keys.right.isDown = false;
                    break;
            }
        }
    });
}

const game = new Game(config);
game.events.on('ready', () => {
    if (GAME_SETTINGS.IS_MOBILE) {
        setupTouchControls(game.scene.scenes[0]);
    }
});

export default game;
