import Phaser from 'phaser';

// Phase 2 — flag respawn point; emits 'checkpoint_reached' on EventBus
export class Checkpoint extends Phaser.GameObjects.Zone {
  constructor(scene: Phaser.Scene, x: number, y: number, public readonly index: number) {
    super(scene, x, y, 16, 32);
    scene.add.existing(this);
  }
}
