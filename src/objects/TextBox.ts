import type Phaser from 'phaser';
import type { Scene } from 'phaser';

interface TextBoxConfig {
    width?: number;
    height?: number;
    fontSize?: number;
    padding?: number;
    borderRadius?: number;
    textSpeed?: number;
}

export default class TextBox {
    private static readonly DEFAULT_CONFIG: TextBoxConfig = {
        width: 0.8,
        height: 0.2,
        fontSize: 35,
        padding: 20,
        borderRadius: 20,
        textSpeed: 70
    };

    private scene: Scene;
    private textBox!: Phaser.GameObjects.Text;
    public isActive: boolean = false;
    private textBoxBackground!: Phaser.GameObjects.Graphics;
    private innerFrame!: Phaser.GameObjects.Graphics;
    private button?: Phaser.GameObjects.Text;
    private depth: number = 1000;
    private config: TextBoxConfig;
    private dimensions: { width: number; height: number; x: number; y: number; };
    private isInCooldown: boolean = false;
    private static readonly COOLDOWN_DURATION: number = 500; // milliseconds
    private messageQueue: Array<{text: string, callback?: () => void}> = [];
    private isProcessingQueue: boolean = false;
    private textBoxCounter: number = 0; // Add a counter to track the number of text boxes displayed

    constructor(scene: Scene, config: Partial<TextBoxConfig> = {}) {
        this.scene = scene;
        this.config = { ...TextBox.DEFAULT_CONFIG, ...config };
        this.dimensions = this.calculateDimensions();
    }

    setDepth(depth: number) {
        this.depth = depth;
        // Update depth of existing elements if they exist
        if (this.textBox) this.textBox.setDepth(depth);
        if (this.textBoxBackground) this.textBoxBackground.setDepth(depth);
        if (this.innerFrame) this.innerFrame.setDepth(depth);
        if (this.button) this.button.setDepth(depth);
    }

    create(message: string, onComplete?: () => void, shouldCloseScene: boolean = false) {
        if (this.isActive) {
            this.messageQueue.push({text: message, callback: onComplete});
            return;
        }
        
        this.isActive = true;
        this.createBackgrounds();
        this.createTextElement();
        this.animateText(message, () => {
            this.isProcessingQueue = false;
            onComplete?.();
            if (shouldCloseScene) {
                this.closeScene();
            }
            this.processNextMessage();
        });
    }

    private processNextMessage() {
        if (this.messageQueue.length === 0 || this.isProcessingQueue) {
            return;
        }

        const nextMessage = this.messageQueue.shift();
        if (nextMessage) {
            this.isProcessingQueue = true;
            this.closeTextBox();
            this.create(nextMessage.text, nextMessage.callback);
        }
    }

    private calculateDimensions() {
        const camera = this.scene.cameras.main;
        const width = this.config.width! * camera.width;
        const height = this.config.height! * camera.height;
        const x = (camera.width - width) / 2;
        const y = camera.height - height - (camera.height * 0.1);

        return { width, height, x, y };
    }

    private createBackgrounds() {
        const { x, y, width, height } = this.dimensions;
        const { borderRadius, padding } = this.config;

        // Main background
        this.textBoxBackground = this.createGraphics()
            .fillStyle(0x333333, 0.9)
            .fillRoundedRect(x, y, width, height, borderRadius)
            .lineStyle(2, 0xffffff, 1)
            .strokeRoundedRect(x, y, width, height, borderRadius);

        // Inner frame
        this.innerFrame = this.createGraphics()
            .lineStyle(2, 0xffffff, 1)
            .strokeRoundedRect(x + padding!, y + padding!, width - padding! * 2, height - padding! * 2, borderRadius! - 5);
    }

    private createTextElement() {
        const { x, y, width } = this.dimensions;
        const { padding, fontSize } = this.config;

        this.textBox = this.scene.add.text(x + padding! * 1.5, y + padding! * 1.5, '', {
            fontSize: `${fontSize}px`,
            color: '#ffffff',
            wordWrap: { width: width - padding! * 3 },
            padding: { left: padding, right: padding, top: padding, bottom: padding }
        })
        .setDepth(this.depth)
        .setScrollFactor(0);
    }

    private createButton(text: string, onClick: () => void) {
        const { x, y, width, height } = this.dimensions;
        const buttonX = x + width - 120;
        const buttonY = y + height - 100;

        return this.scene.add.text(buttonX, buttonY, text, {
            fontSize: '28px',
            color: '#ffffff',
            backgroundColor: '#555555',
            padding: { left: 20, right: 20, top: 10, bottom: 10 }
        })
        .setScrollFactor(0)
        .setDepth(this.depth + 1)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', onClick);
    }

    private createGraphics() {
        return this.scene.add.graphics()
            .setDepth(this.depth)
            .setScrollFactor(0);
    }

    private animateText(message: string, onComplete?: () => void) {
        let index = 0;
        let isWaitingForConsent = false;

        const addText = () => {
            if (index < message.length && !isWaitingForConsent) {
                this.textBox.text += message[index];
                index++;

                if (this.textBox.height > this.dimensions.height - this.config.padding! * 3) {
                    isWaitingForConsent = true;
                    this.button = this.createButton('↓', () => {
                        isWaitingForConsent = false;
                        this.textBox.setText('');
                        this.button?.destroy();
                        this.button = undefined;
                        this.continueAnimation(message, index, addText);
                    });
                } else if (index >= message.length) {
                    this.button = this.createButton('OK', () => {
                        this.closeTextBox();
                        onComplete?.();
                    });
                }
            }
        };

        this.continueAnimation(message, 0, addText);
    }

    private continueAnimation(message: string, startIndex: number, callback: () => void) {
        this.scene.time.addEvent({
            delay: this.config.textSpeed,
            callback,
            repeat: message.length - startIndex - 1
        });
    }

    updateText(newMessage: string) {
        if (this.textBox) {
            this.textBox.setText('');
            let index = 0;

            const addText = () => {
                if (index < newMessage.length) {
                    this.textBox.text += newMessage[index];
                    index++;
                }
            };

            this.scene.time.addEvent({
                delay: 50,
                callback: addText,
                repeat: newMessage.length - 1
            });
        }
    }

    private closeTextBox() {
        this.isActive = false;
        if (this.textBox) this.textBox.destroy();
        if (this.textBoxBackground) this.textBoxBackground.destroy();
        if (this.innerFrame) this.innerFrame.destroy();
        if (this.button) {
            this.button.destroy();
            this.button = undefined;
        }
    }

    private closeScene() {
        this.scene.scene.stop(); // Stop the current scene
        // Optionally, you can start another scene or perform other actions here
    }
}
