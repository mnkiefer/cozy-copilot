import type { Scene } from 'phaser';

const actions = ['DEBUG', 'COMPANIONS', 'ITEMS', 'RUN'];

interface BattleTextBoxConfig {
    width?: number;
    height?: number;
    fontSize?: number;
    padding?: number;
    borderRadius?: number;
    textSpeed?: number;
}

export default class TextBoxBattle {
    private static readonly DEFAULT_CONFIG: BattleTextBoxConfig = {
        width: 0.8,
        height: 0.2,
        fontSize: 32,
        padding: 20,
        borderRadius: 20,
        textSpeed: 40
    };
    private scene: Scene;
    private textBox!: Phaser.GameObjects.Text;
    private textBoxBackground!: Phaser.GameObjects.Graphics;
    private innerFrame!: Phaser.GameObjects.Graphics;
    private actionTexts: Phaser.GameObjects.Text[] = [];
    private subMenuTexts: Phaser.GameObjects.Text[] = [];
    private selectedIndex: number = 0;
    private arrow!: Phaser.GameObjects.Text;
    private exitCallback: () => void;
    private isSubMenuActive: boolean = false;

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
            wordWrap: { width: textBoxWidth - 60 },
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

        this.actionTexts = [];
        actions.forEach((action, index) => {
            const actionText = this.scene.add.text(
                actionBoxX + actionBoxWidth / 2,
                textBoxY + 50 + index * 40,
                action,
                {
                    fontSize: '35px',
                    color: 'white',
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
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        if (this.scene.input.keyboard) {
            this.scene.input.keyboard.on('keydown-UP', () => this.moveSelectionUp());
            this.scene.input.keyboard.on('keydown-DOWN', () => this.moveSelectionDown());
            this.scene.input.keyboard.on('keydown-ENTER', () => this.selectAction());
            this.scene.input.keyboard.on('keydown-ESC', () => this.closeSubMenu());
        }

        this.updateText(message);
        }

    private createSubMenu(actions: string[], color: string) {
        // Add "BACK" option to the submenu
        actions.push('BACK');

        const camera = this.scene.cameras.main;
        const textBoxWidth = camera.width * 0.5;
        const textBoxHeight = camera.height * 0.25;
        const textBoxX = camera.scrollX + (camera.width - textBoxWidth * 1.8) / 2;
        const textBoxY = camera.scrollY + camera.height - textBoxHeight - (camera.height * 0.05);
        const textBoxDepth = 30;

        const subMenuX = textBoxX + textBoxWidth + 20;
        const subMenuWidth = textBoxWidth * 0.7;
        const subMenuHeight = textBoxHeight;

        const subMenuBackground = this.scene.add.graphics();
        subMenuBackground.fillStyle(0x333333, 0.9);
        subMenuBackground.fillRoundedRect(subMenuX, textBoxY, subMenuWidth, subMenuHeight, 20);
        subMenuBackground.lineStyle(2, 0xffffff, 1);
        subMenuBackground.strokeRoundedRect(subMenuX, textBoxY, subMenuWidth, subMenuHeight, 20);
        subMenuBackground.setDepth(textBoxDepth);
        subMenuBackground.setName('subMenuBackground');

        const subMenuFrame = this.scene.add.graphics();
        subMenuFrame.lineStyle(2, 0xffffff, 1);
        subMenuFrame.strokeRoundedRect(subMenuX + 10, textBoxY + 10, subMenuWidth - 20, subMenuHeight - 20, 15);
        subMenuFrame.setDepth(textBoxDepth);
        subMenuFrame.setName('subMenuFrame');

        this.subMenuTexts = [];
        actions.forEach((action, index) => {
            const actionText = this.scene.add.text(
                subMenuX + subMenuWidth / 2,
                textBoxY + 50 + index * 40,
                action,
                {
                    fontSize: '35px',
                    color: action === 'BACK' ? '#ffffff' : color,
                    padding: { left: 10, right: 10, top: 10, bottom: 10 }
                }
            ).setOrigin(0.5)
             .setInteractive();
            actionText.setDepth(textBoxDepth);
            this.subMenuTexts.push(actionText);
        });

        this.isSubMenuActive = true;
        this.selectedIndex = 0;
        this.updateArrowPosition();
    }

    private closeSubMenu() {
        if (this.isSubMenuActive) {
            this.subMenuTexts.forEach(text => text.destroy());
            this.subMenuTexts = [];
            this.isSubMenuActive = false;
            this.selectedIndex = 0;
            this.updateArrowPosition();

            // Hide submenu background and frame
            this.scene.children.getByName('subMenuBackground')?.destroy();
            this.scene.children.getByName('subMenuFrame')?.destroy();
        }
    }

    private moveSelectionUp() {
        this.selectedIndex = (this.selectedIndex - 1 + (this.isSubMenuActive ? this.subMenuTexts.length : this.actionTexts.length)) % (this.isSubMenuActive ? this.subMenuTexts.length : this.actionTexts.length);
        this.updateArrowPosition();
    }

    private moveSelectionDown() {
        this.selectedIndex = (this.selectedIndex + 1) % (this.isSubMenuActive ? this.subMenuTexts.length : this.actionTexts.length);
        this.updateArrowPosition();
    }

    private selectAction() {
        if (this.isSubMenuActive) {
            const selectedSubAction = this.subMenuTexts[this.selectedIndex].text;
            if (selectedSubAction === 'BACK') {
                this.closeSubMenu();
            } else {
                this.applyActionEffect(selectedSubAction);
                this.closeSubMenu();
            }
        } else {
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
                let subActions: string[] = [];
                const actionColor = 'white';
                switch (selectedAction) {
                    case 'DEBUG':
                        subActions = ['Console Log', 'Use Debugger', 'Run Profiler'];
                        break;
                    case 'COMPANIONS':
                        subActions = ['Copilot'];
                        break;
                    case 'ITEMS':
                        subActions = ['☕️ Coffee'];
                        break;
                    default:
                        subActions = [];
                        break;
                }
                this.createSubMenu(subActions, actionColor as string);
            }
        }
    }

    private applyActionEffect(subAction: string) {
        const damage = 10; // Example damage value

        // Play effect of the same color as the action
        const effectColor = this.actionTexts[this.selectedIndex].style.color as string;
        const effect = this.scene.add.graphics();
        effect.fillStyle(parseInt(effectColor.replace('#', '0x')), 1);
        this.scene.tweens.add({
            targets: effect,
            alpha: 0,
            duration: 500,
            onComplete: () => effect.destroy()
        });

        this.updateText(`Used ${subAction}!\nEnemy took ${damage} damage!`);
    }

    private updateArrowPosition() {
        const selectedText = this.isSubMenuActive ? this.subMenuTexts[this.selectedIndex] : this.actionTexts[this.selectedIndex];
        const offset = 2;
        // Position arrow to the left of the selected text without overlapping it
        this.arrow.setX(selectedText.x - selectedText.width / 2 - this.arrow.width - offset);
        this.arrow.setY(selectedText.y);

        this.arrow.setColor('white');

        // Remove glow effect from the selected text
        const texts = this.isSubMenuActive ? this.subMenuTexts : this.actionTexts;
        texts.forEach((text, index) => {
            if (index === this.selectedIndex) {
                text.setStyle({ fontSize: '40px', fontStyle: 'bold' });
            } else {
                text.setStyle({ fontSize: '35px', fontStyle: 'normal' });
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
