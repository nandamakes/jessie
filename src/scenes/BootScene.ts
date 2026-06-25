import Phaser from 'phaser';
import { SaveSystem } from '../autoload/SaveSystem';
import { VIEWPORT, SCENES } from '../constants';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create() {
    SaveSystem.load();

    const cx = VIEWPORT.WIDTH / 2;
    const cy = VIEWPORT.HEIGHT / 2;

    this.add.text(cx, cy - 24, 'FLOOFBLOCKS', {
      fontSize: '16px',
      color: '#FF6FB5',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.add.text(cx, cy - 4, "Jessie's World", {
      fontSize: '8px',
      color: '#7BC6FF',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    const prompt = this.add.text(cx, cy + 20, 'TAP TO START', {
      fontSize: '7px',
      color: '#FFE075',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Pulse the prompt
    this.tweens.add({
      targets: prompt,
      alpha: 0,
      duration: 600,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });

    // Tap or click anywhere to proceed
    this.input.once('pointerdown', () => {
      this.scene.start(SCENES.HUB);
    });
  }
}
