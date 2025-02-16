import type { Scene } from 'phaser';

export default class Enemy {
    private scene: Scene;
    private sprite: Phaser.GameObjects.Image;
    private name: string;
    private health: number;

    constructor(scene: Scene, name: string, texture: string, health: number, x: number, y: number) {
        this.scene = scene;
        this.name = name;
        this.health = health;
        this.sprite = this.scene.add.image(x, y, texture);
    }

    takeDamage(amount: number) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.sprite.setVisible(false);
        }
    }

    getHealth() {
        return this.health;
    }

    getName() {
        return this.name;
    }

    getSprite() {
        return this.sprite;
    }
}
