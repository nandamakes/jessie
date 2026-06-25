import Phaser from 'phaser';
import { EventBus } from '../autoload/EventBus';
import { GameState } from '../autoload/GameState';

// Phase 1 — persistent overlay scene showing Acorn count, player level
export class HUD extends Phaser.Scene {
  private acornText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'HUDScene', active: false });
  }

  create() {
    this.acornText = this.add.text(4, 4, `Acorns: ${GameState.acorns}`, {
      fontSize: '6px',
      color: '#FFE075',
      fontFamily: 'monospace',
    });

    EventBus.on('acorns_changed', (amount: number) => {
      this.acornText.setText(`Acorns: ${amount}`);
    });
  }
}
