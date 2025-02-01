import { Scene } from 'phaser';

export default class TextBox {
    private scene: Scene;
    private textBox!: Phaser.GameObjects.Text;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    create(message: string) {
        const textBoxBackground = this.scene.add.graphics();
        textBoxBackground.fillStyle(0x333333, 0.9);
        textBoxBackground.fillRoundedRect(0, this.scene.cameras.main.height - this.scene.cameras.main.height * 0.2, this.scene.cameras.main.width, this.scene.cameras.main.height * 0.2, 20); // Adjusted height
        textBoxBackground.lineStyle(2, 0xffffff, 1);
        textBoxBackground.strokeRoundedRect(0, this.scene.cameras.main.height - this.scene.cameras.main.height * 0.2, this.scene.cameras.main.width, this.scene.cameras.main.height * 0.2, 20); // Adjusted height
        textBoxBackground.setDepth(20);

        const innerFrame = this.scene.add.graphics();
        innerFrame.lineStyle(2, 0xffffff, 1);
        innerFrame.strokeRoundedRect(10, this.scene.cameras.main.height - this.scene.cameras.main.height * 0.2 + 10, this.scene.cameras.main.width - 20, this.scene.cameras.main.height * 0.2 - 20, 15); // Adjusted height
        innerFrame.setDepth(20);

        this.textBox = this.scene.add.text(30, this.scene.cameras.main.height - this.scene.cameras.main.height * 0.2 + 30, '', { fontSize: '48px', color: '#ffffff', wordWrap: { width: this.scene.cameras.main.width - 60 }, padding: { left: 20, right: 20, top: 20, bottom: 20 }, backgroundColor: '#444444' });
        this.textBox.setDepth(20);

        const button = this.scene.add.text(this.scene.cameras.main.width - 180, this.scene.cameras.main.height - this.scene.cameras.main.height * 0.2 + this.scene.cameras.main.height * 0.2 - 100, 'OK', { fontSize: '48px', color: '#ffffff', backgroundColor: '#555555', padding: { left: 20, right: 20, top: 10, bottom: 10 } }) // Moved higher
            .setInteractive()
            .on('pointerdown', () => {
                this.textBox.setText('');
                textBoxBackground.clear();
                textBoxBackground.destroy();
                innerFrame.clear();
                innerFrame.destroy();
                button.destroy();
                this.textBox.destroy(); // Added line to destroy the textBox
            });
        button.setDepth(20);

        let index = 0;
        this.scene.time.addEvent({
            delay: 50,
            callback: () => {
                if (index < message.length) {
                    this.textBox.text += message[index];
                    index++;
                }
            },
            repeat: message.length - 1
        });
    }
}
