import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload (): void
    {
        this.load.image('clouds', 'assets/clouds.png');
    }

    create (): void
    {
        this.scene.start('Preloader');
    }
}
