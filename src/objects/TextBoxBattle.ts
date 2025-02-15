import type { Scene } from 'phaser';

export default class TextBoxBattle {
    private scene: Scene;
    private textBox!: Phaser.GameObjects.Text;
    private textBoxBackground!: Phaser.GameObjects.Graphics;
    private innerFrame!: Phaser.GameObjects.Graphics;
    private actionTexts: Phaser.GameObjects.Text[] = [];
    private selectedIndex: number = 0;
    private arrow!: Phaser.GameObjects.Text;
    private exitCallback: () => void;

    constructor(scene: Scene, exitCallback: () => void) {
        this.scene = scene;
        this.exitCallback = exitCallback;
    }

    create(message: string) {
        const camera = this.scene.cameras.main;

        const textBoxWidth = camera.width * 0.5;
        const textBoxHeight = camera.height * 0.25;
        const textBoxX = camera.scrollX + (camera.width - textBoxWidth * 1.8) / 2;
        const textBoxY = camera.scrollY + camera.height - textBoxHeight - (camera.height * 0.05);
        const textBoxDepth = 30;

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
            wordWrap: { width: textBoxWidth },
            padding: { left: 20, right: 20, top: 20, bottom: 20 }
        });
        this.textBox.setDepth(textBoxDepth);

        const actionBoxX = textBoxX + textBoxWidth + 20;
        const actionBoxWidth = textBoxWidth * 0.7;
        const actionBoxHeight = textBoxHeight;

        const actionBoxBackground = this.scene.add.graphics();
        actionBoxBackground.fillStyle(0x333333, 0.9);
        actionBoxBackground.fillRoundedRect(actionBoxX, textBoxY, actionBoxWidth, actionBoxHeight, 20);
        actionBoxBackground.lineStyle(2, 0xffffff, 1);
        actionBoxBackground.strokeRoundedRect(actionBoxX, textBoxY, actionBoxWidth, actionBoxHeight, 20);
        actionBoxBackground.setDepth(textBoxDepth);

        const actionFrame = this.scene.add.graphics();
        actionFrame.lineStyle(2, 0xffffff, 1);
        actionFrame.strokeRoundedRect(actionBoxX + 10, textBoxY + 10, actionBoxWidth - 20, actionBoxHeight - 20, 15);
        actionFrame.setDepth(textBoxDepth);

        const actions = ['DEBUG', 'FRIENDS', 'DEVTOOLS', 'ITEMS', 'RUN'];
        const actionColors = ['#ff0000', '#00ff00', 'cyan', 'pink', '#ffff00'];
        this.actionTexts = [];
        actions.forEach((action, index) => {
            const actionText = this.scene.add.text(
                actionBoxX + actionBoxWidth / 2,
                textBoxY + 50 + index * 40,
                action,
                {
                    fontSize: '35px',
                    color: actionColors[index],
                    padding: { left: 10, right: 10, top: 10, bottom: 10 }
                }
            ).setOrigin(0.5)
             .setInteractive();
            actionText.setDepth(textBoxDepth);
            this.actionTexts.push(actionText);
        });

        this.arrow = this.scene.add.text(0, 0, '►', {
            fontSize: '28px',
            color: '#ffffff'
        }).setOrigin(0.5)
          .setDepth(textBoxDepth);
        this.updateArrowPosition();

        // Add arrow animation with pulsing effect
        this.scene.tweens.add({
            targets: this.arrow,
            scaleX: 1.2, // animate scale for emphasis
            scaleY: 1.2,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        if (this.scene.input.keyboard) {
            this.scene.input.keyboard.on('keydown-UP', () => this.moveSelectionUp());
            this.scene.input.keyboard.on('keydown-DOWN', () => this.moveSelectionDown());
            this.scene.input.keyboard.on('keydown-ENTER', () => this.selectAction());
        }

        this.updateText(message);
    }

    private moveSelectionUp() {
        this.selectedIndex = (this.selectedIndex - 1 + this.actionTexts.length) % this.actionTexts.length;
        this.updateArrowPosition();
    }

    private moveSelectionDown() {
        this.selectedIndex = (this.selectedIndex + 1) % this.actionTexts.length;
        this.updateArrowPosition();
    }

    private selectAction() {
        const selectedAction = this.actionTexts[this.selectedIndex].text;
        if (selectedAction === 'RUN') {
            this.updateText('Got away safely!');
            this.scene.time.addEvent({
                delay: 500,
                callback: () => {
                    this.closeTextBox();
                    this.exitCallback();
                }
            });
        } else {
            this.updateText(`Used ${selectedAction}!\nIt's super effective!`);
        }
    }

    private updateArrowPosition() {
        const selectedText = this.actionTexts[this.selectedIndex];
        const offset = 2;
        // Position arrow to the left of the selected text without overlapping it
        this.arrow.setX(selectedText.x - selectedText.width / 2 - this.arrow.width - offset);
        this.arrow.setY(selectedText.y);

        // Change arrow color based on selected action
        const actionColors = ['#ff0000', '#00ff00', 'cyan', 'pink', '#ffff00'];
        this.arrow.setColor(actionColors[this.selectedIndex]);

        // Add glow effect to the selected text
        this.actionTexts.forEach((text, index) => {
            if (index === this.selectedIndex) {
                text.setStyle({ fontSize: '40px', fontStyle: 'bold', shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 5, stroke: true, fill: true } });
            } else {
                text.setStyle({ fontSize: '35px', fontStyle: 'normal', shadow: { offsetX: 0, offsetY: 0, color: '#000', blur: 0, stroke: false, fill: false } });
            }
        });

        console.log(this.arrow.x, this.arrow.y);
    }

    closeTextBox() {
        this.textBox.setVisible(false);
        this.textBoxBackground.setVisible(false);
        this.innerFrame.setVisible(false);
        this.arrow.setVisible(false);
        this.actionTexts.forEach(text => text.setVisible(false));

        this.textBox.setText('');
        this.textBox.setDepth(0);
        this.textBoxBackground.clear();
        this.textBoxBackground.setDepth(20);
        this.innerFrame.clear();
        this.actionTexts = [];
    }

    updateText(newText: string) {
        this.textBox.setText(newText);
        this.textBox.setWordWrapWidth(this.textBox.width);
    }
}
