import type { Scene } from 'phaser';

export default class TextBoxBattle {
    private scene: Scene;
    private textBox!: Phaser.GameObjects.Text;
    private textBoxBackground!: Phaser.GameObjects.Graphics;
    private innerFrame!: Phaser.GameObjects.Graphics;
    private buttonBoxBackground!: Phaser.GameObjects.Graphics;
    private buttonBoxInnerFrame!: Phaser.GameObjects.Graphics;
    private button?: Phaser.GameObjects.Text;
    private actionButtons: Phaser.GameObjects.Container[] = [];
    private exitCallback: () => void;

    constructor(scene: Scene, exitCallback: () => void) {
        this.scene = scene;
        this.exitCallback = exitCallback;
    }

    create(message: string) {
        const camera = this.scene.cameras.main;

        const textBoxWidth = camera.width * 0.6;
        const textBoxHeight = camera.height * 0.3; // Increased height slightly
        const textBoxX = camera.scrollX + (camera.width - textBoxWidth * 2) / 3; // Adjusted position for side-by-side
        const textBoxY = camera.scrollY + camera.height - textBoxHeight - (camera.height * 0.01); // Adjusted position

        // Set depth to ensure the text box is in front of the player
        const textBoxDepth = 30;

        // Text box styles
        this.textBoxBackground = this.scene.add.graphics();
        this.textBoxBackground.fillStyle(0x333333, 0.9);
        this.textBoxBackground.fillRoundedRect(textBoxX, textBoxY, textBoxWidth, textBoxHeight, 20);
        this.textBoxBackground.lineStyle(2, 0xffffff, 1);
        this.textBoxBackground.strokeRoundedRect(textBoxX, textBoxY, textBoxWidth, textBoxHeight, 20);
        this.textBoxBackground.setDepth(textBoxDepth);

        this.innerFrame = this.scene.add.graphics();
        this.innerFrame.lineStyle(2, 0xffffff, 1);
        this.innerFrame.strokeRoundedRect(textBoxX + 10, textBoxY + 10, textBoxWidth - 20, textBoxHeight - 20, 15);
        this.innerFrame.setDepth(textBoxDepth);

        this.textBox = this.scene.add.text(textBoxX + 30, textBoxY + 30, '', {
            fontSize: '32px',
            color: '#ffffff',
            wordWrap: { width: textBoxWidth - 60 },
            padding: { left: 20, right: 20, top: 20, bottom: 20 }
        });
        this.textBox.setDepth(textBoxDepth);

        // Create button box
        const buttonBoxWidth = camera.width * 0.4;
        const buttonBoxHeight = camera.height * 0.3; // Match height with text box
        const buttonBoxX = textBoxX + textBoxWidth + (camera.width * 0.1); // Positioned next to text box
        const buttonBoxY = textBoxY; // Same Y position as text box

        this.buttonBoxBackground = this.scene.add.graphics();
        this.buttonBoxBackground.fillStyle(0x333333, 0.9);
        this.buttonBoxBackground.fillRoundedRect(buttonBoxX, buttonBoxY, buttonBoxWidth, buttonBoxHeight, 20);
        this.buttonBoxBackground.lineStyle(2, 0xffffff, 1);
        this.buttonBoxBackground.strokeRoundedRect(buttonBoxX, buttonBoxY, buttonBoxWidth, buttonBoxHeight, 20);
        this.buttonBoxBackground.setDepth(textBoxDepth);

        this.buttonBoxInnerFrame = this.scene.add.graphics();
        this.buttonBoxInnerFrame.lineStyle(2, 0xffffff, 1);
        this.buttonBoxInnerFrame.strokeRoundedRect(buttonBoxX + 10, buttonBoxY + 10, buttonBoxWidth - 20, buttonBoxHeight - 20, 15);
        this.buttonBoxInnerFrame.setDepth(textBoxDepth);

        // Add action buttons to the button box
        this.addActionButton(buttonBoxX + 20, buttonBoxY + 20, 'Fight', 0xff0000);
        this.addActionButton(buttonBoxX + 200, buttonBoxY + 20, 'Assistants', 0x00ff00);
        this.addActionButton(buttonBoxX + 200, buttonBoxY + 80, 'Tools/Items', 0xffff00);
        this.addActionButton(buttonBoxX + 20, buttonBoxY + 80, 'Run', 0x0000ff);

        let index = 0;
        let isWaitingForConsent = false;

        const createButton = (text: string) => {
            if (this.button) {
                this.button.setText(text);
                this.button.setVisible(true);
            } else {
                this.button = this.scene.add.text(textBoxX + textBoxWidth - 120, textBoxY + textBoxHeight - 100, text, {
                    fontSize: '28px',
                    color: '#ffffff',
                    backgroundColor: '#555555',
                    padding: { left: 20, right: 20, top: 10, bottom: 10 }
                })
                    .setInteractive({ useHandCursor: true }) // Ensure the button is interactive
                    .on('pointerdown', () => {
                        if (isWaitingForConsent) {
                            isWaitingForConsent = false;
                            this.textBox.setText('');
                            this.button?.setVisible(false);
                            this.scene.time.addEvent({
                                delay: 50,
                                callback: addText,
                                repeat: message.length - index - 1
                            });
                        } else {
                            this.closeTextBox();
                        }
                    });
                this.button.setDepth(textBoxDepth);
            }
        };

        const addText = () => {
            if (index < message.length && !isWaitingForConsent) {
                this.textBox.text += message[index];
                index++;
                if (this.textBox.height > textBoxHeight - 60) {
                    isWaitingForConsent = true;
                    createButton('↓');
                }
            }
        };

        this.scene.time.addEvent({
            delay: 50,
            callback: addText,
            repeat: message.length - 1
        });
    }

    addActionButton(x: number, y: number, text: string, color: number) {
        const width = 160; // Reduced button size
        const height = 45; // Reduced button size

        const button = this.scene.add.container(x, y);

        // Draw button background once and store it
        const buttonBackground = this.scene.add.graphics();
        buttonBackground.fillStyle(color, 1);
        buttonBackground.fillRoundedRect(-10, -10, width + 20, height + 20, 15);
        buttonBackground.lineStyle(2, 0xffffff, 1);
        buttonBackground.strokeRoundedRect(-10, -10, width + 20, height + 20, 15);
        buttonBackground.setDepth(30);

        const buttonText = this.scene.add.text(width / 2, height / 2, text, {
            fontFamily: 'Courier New',
            fontSize: '24px',
            color: '#ffffff',
            fontStyle: 'bold',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 4,
        }).setOrigin(0.5);

        button.add([buttonBackground, buttonText]);
        button.setSize(width, height);
        button.setDepth(30);

        // Simplified interactivity with just alpha and scale changes
        button.setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                button.setAlpha(0.8);
                button.setScale(1.05);
            })
            .on('pointerout', () => {
                button.setAlpha(1);
                button.setScale(1.0);
            })
            .on('pointerdown', () => {
                button.setScale(0.95);
                if (text === 'Run') {
                    this.updateText('Got away safely!');
                    this.scene.time.addEvent({
                        delay: 500,
                        callback: () => {
                            this.closeTextBox();
                            this.exitCallback();
                        }
                    });
                } else {
                    this.updateText(`Used ${text}!\nIt's super effective!`);
                }
            })
            .on('pointerup', () => {
                button.setScale(1.05);
            });
    }

    closeTextBox() {
        this.textBox.setVisible(false);
        this.textBoxBackground.setVisible(false);
        this.innerFrame.setVisible(false);
        if (this.button) {
            this.button.setVisible(false);
        }
        this.actionButtons.forEach(button => button.setVisible(false));
        this.buttonBoxBackground.setVisible(false);
        this.buttonBoxInnerFrame.setVisible(false);

        // Reset text box settings
        this.textBox.setText('');
        this.textBox.setDepth(0);
        this.textBoxBackground.clear();
        this.textBoxBackground.setDepth(20);
        this.innerFrame.clear();
        this.buttonBoxBackground.clear();
        this.buttonBoxInnerFrame.clear();
        this.actionButtons = [];
    }

    updateText(newText: string) {
        this.textBox.setText(newText);
    }
}
