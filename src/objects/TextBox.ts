import type Phaser from 'phaser';
import type { Scene } from 'phaser';

export default class TextBox {
    private scene: Scene;
    private textBox!: Phaser.GameObjects.Text;
    public isActive: boolean = false;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    create(message: string) {
        this.isActive = true;
        const camera = this.scene.cameras.main;

        // Size and position of the text box
        const textBoxWidth = camera.width * 0.98;
        const textBoxHeight = camera.height * 0.28;
        const textBoxX = camera.scrollX + (camera.width - textBoxWidth) / 2;
        const textBoxY = camera.scrollY + camera.height - textBoxHeight - 10;

        // Text box styles
        const textBoxBackground = this.scene.add.graphics();
        textBoxBackground.fillStyle(0x333333, 0.9);
        textBoxBackground.fillRoundedRect(textBoxX, textBoxY, textBoxWidth, textBoxHeight, 20);
        textBoxBackground.lineStyle(2, 0xffffff, 1);
        textBoxBackground.strokeRoundedRect(textBoxX, textBoxY, textBoxWidth, textBoxHeight, 20);
        textBoxBackground.setDepth(20);
        const innerFrame = this.scene.add.graphics();
        innerFrame.lineStyle(2, 0xffffff, 1);
        innerFrame.strokeRoundedRect(textBoxX + 10, textBoxY + 10, textBoxWidth - 20, textBoxHeight - 20, 15);
        innerFrame.setDepth(20);
        this.textBox = this.scene.add.text(textBoxX + 30, textBoxY + 30, '', {
            fontSize: '32px',
            color: '#ffffff',
            wordWrap: { width: textBoxWidth - 60 },
            padding: { left: 20, right: 20, top: 20, bottom: 20 }
        });
        this.textBox.setDepth(20);

        let index = 0;
        let isWaitingForConsent = false;
        let button: Phaser.GameObjects.Text | undefined;

        const createButton = (text: string) => {
            if (button) {
                button.setText(text);
                button.setVisible(true);
            } else {
                button = this.scene.add.text(textBoxX + textBoxWidth - 120, textBoxY + textBoxHeight - 100, text, {
                    fontSize: '28px',
                    color: '#ffffff',
                    backgroundColor: '#555555',
                    padding: { left: 20, right: 20, top: 10, bottom: 10 }
                })
                    .setInteractive()
                    .on('pointerdown', () => {
                        if (isWaitingForConsent) {
                            isWaitingForConsent = false;
                            this.textBox.setText('');
                            button?.setVisible(false);
                            this.scene.time.addEvent({
                                delay: 50,
                                callback: addText,
                                repeat: message.length - index - 1
                            });
                        } else if (index >= message.length) {
                            this.textBox.setText('');
                            textBoxBackground.clear();
                            textBoxBackground.destroy();
                            innerFrame.clear();
                            innerFrame.destroy();
                            button?.destroy();
                            this.textBox.destroy();
                            this.isActive = false;
                        }
                    });
                button.setDepth(20);
            }
        };

        const addText = () => {
            if (index < message.length && !isWaitingForConsent) {
                this.textBox.text += message[index];
                index++;
                if (this.textBox.height > textBoxHeight - 60) {
                    isWaitingForConsent = true;
                    createButton('↓');
                } else if (index >= message.length) {
                    createButton('OK');
                }
            }
        };

        this.scene.time.addEvent({
            delay: 50,
            callback: addText,
            repeat: message.length - 1
        });
    }
}
