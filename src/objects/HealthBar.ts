import type { Scene } from 'phaser';

export default class HealthBar {
    private scene: Scene;
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private maxHealth: number;
    private currentHealth: number;
    private color: number;
    private healthBar: Phaser.GameObjects.Graphics;
    private nameText: Phaser.GameObjects.Text;
    private expText: Phaser.GameObjects.Text;

    constructor(scene: Scene, x: number, y: number, name: string, expLevel: string) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = 400; // increased width
        this.height = 20;
        this.maxHealth = 100;
        this.currentHealth = this.maxHealth;
        this.color = 0x00ff00;

        this.healthBar = this.scene.add.graphics();
        this.nameText = scene.add.text(x, y - 35, name, { fontSize: '30px', color: '#ffffff' }); // font size changed to 30px, color changed to white
        this.expText = scene.add.text(x + this.width - 50, y - 35, expLevel, { fontSize: '30px', color: '#ffffff' }); // exp level text, right-aligned
        this.draw();
    }

    private draw() {
        this.healthBar.clear();
        // Draw border
        this.healthBar.fillStyle(0x000000, 0.8); // increased opacity
        this.healthBar.fillRoundedRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4, 3);
        // Draw background
        this.healthBar.fillStyle(0x555555, 0.8); // increased opacity
        this.healthBar.fillRoundedRect(this.x, this.y, this.width, this.height, 3);
        // Draw health fill proportional to current health
        const fillWidth = (this.currentHealth / this.maxHealth) * this.width;
        this.healthBar.fillStyle(this.color, 0.8); // increased opacity
        this.healthBar.fillRoundedRect(this.x, this.y, fillWidth, this.height, 3);
        // Above health bar text
        this.nameText.x = this.x; // align with left of health bar
        this.nameText.y = this.y - 30; // adjust y position for larger font size
        this.expText.x = this.x + this.width - this.expText.width; // right-align exp level text
        this.expText.y = this.y - 30; // adjust y position for larger font size
    }

    public updateHealth(newHealth: number) {
        this.currentHealth = Phaser.Math.Clamp(newHealth, 0, this.maxHealth);
        this.draw();
    }
}
