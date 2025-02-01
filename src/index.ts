import { Game, Types } from 'phaser';
import scenes from './scenes';

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

class MainScene extends Phaser.Scene {
    create() {
        // Add touch controls
        this.input.on('pointerdown', this.handleTouchStart, this);
        this.input.on('pointermove', this.handleTouchMove, this);
        this.input.on('pointerup', this.handleTouchEnd, this);

        // Add touch controls
        this.createTouchControls();
    }

    createTouchControls() {
        const touchControls = document.createElement('div');
        touchControls.className = 'touch-controls';

        const directions = ['up', 'left', 'down', 'right'];
        directions.forEach(direction => {
            const button = document.createElement('button');
            button.className = 'touch-button';
            button.innerText = direction.charAt(0).toUpperCase();
            button.addEventListener('touchstart', () => this.handleTouchButton(direction));
            button.addEventListener('touchend', () => this.handleTouchEnd());
            touchControls.appendChild(button);
        });

        document.body.appendChild(touchControls);
    }

    handleTouchButton(direction) {
        switch (direction) {
            case 'up':
                this.player.setVelocityY(-160);
                break;
            case 'down':
                this.player.setVelocityY(160);
                break;
            case 'left':
                this.player.setVelocityX(-160);
                break;
            case 'right':
                this.player.setVelocityX(160);
                break;
        }
    }

    handleTouchStart(pointer) {
        // Handle touch start
        this.touchStartX = pointer.x;
        this.touchStartY = pointer.y;
    }

    handleTouchMove(pointer) {
        // Handle touch move
        const deltaX = pointer.x - this.touchStartX;
        const deltaY = pointer.y - this.touchStartY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) {
                this.player.setVelocityX(160); // Move right
            } else {
                this.player.setVelocityX(-160); // Move left
            }
        } else {
            if (deltaY > 0) {
                this.player.setVelocityY(160); // Move down
            } else {
                this.player.setVelocityY(-160); // Move up
            }
        }
    }

    handleTouchEnd(pointer) {
        // Handle touch end
        this.player.setVelocity(0);
    }
}

export default new Game(config);
