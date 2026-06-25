import Phaser from 'phaser';

// Phase 1 — trigger zone that transitions to ObbyScene or TycoonScene
export class Portal extends Phaser.GameObjects.Zone {
  constructor(scene: Phaser.Scene, x: number, y: number, public readonly target: string) {
    super(scene, x, y, 32, 48);
    scene.add.existing(this);
  }
}
