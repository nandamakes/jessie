import Phaser from 'phaser';
import { VIEWPORT, COLORS } from '../constants';

// Phase 1 — Hub tilemap, Jessie spawn, 2 portals, Shop NPC
export class HubScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HubScene' });
  }

  create() {
    const cx = VIEWPORT.WIDTH / 2;
    const cy = VIEWPORT.HEIGHT / 2;

    // Ground placeholder
    this.add.rectangle(cx, VIEWPORT.HEIGHT - 8, VIEWPORT.WIDTH, 16, COLORS.DARK_BROWN);

    // Portal placeholders
    this.add.rectangle(80, cy, 24, 40, COLORS.MINT).setAlpha(0.8);
    this.add.text(80, cy - 28, 'OBBY', { fontSize: '5px', color: '#7CF4C5', fontFamily: 'monospace' }).setOrigin(0.5);

    this.add.rectangle(VIEWPORT.WIDTH - 80, cy, 24, 40, COLORS.LAVENDER).setAlpha(0.8);
    this.add.text(VIEWPORT.WIDTH - 80, cy - 28, 'TYCOON', { fontSize: '5px', color: '#C99CFF', fontFamily: 'monospace' }).setOrigin(0.5);

    // Jessie placeholder
    this.add.rectangle(cx, cy + 4, 12, 16, COLORS.RUST_ORANGE);
    this.add.rectangle(cx, cy - 10, 8, 8, COLORS.CREAM); // head

    this.add.text(cx, 10, "JESSIE'S BURROW HUB", {
      fontSize: '6px',
      color: '#FF6FB5',
      fontFamily: 'monospace',
    }).setOrigin(0.5, 0);

    this.add.text(cx, VIEWPORT.HEIGHT - 20, 'Phase 1 coming next', {
      fontSize: '5px',
      color: '#EEF1FF',
      fontFamily: 'monospace',
    }).setOrigin(0.5);
  }
}
