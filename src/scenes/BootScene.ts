import Phaser from 'phaser';
import { SaveSystem } from '../autoload/SaveSystem';
import { VIEWPORT } from '../constants';

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

    this.add.text(cx, VIEWPORT.HEIGHT - 12, '480×270  ·  Phase 0  ·  Phaser+Vite+TS', {
      fontSize: '6px',
      color: '#EEF1FF',
      fontFamily: 'monospace',
    }).setOrigin(0.5);
  }
}
