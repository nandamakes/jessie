import Phaser from 'phaser';

// Phase 3 — visual tile + passive income rate for a placed generator
export class Generator extends Phaser.GameObjects.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    public readonly generatorId: string,
    public readonly ratePerSec: number,
  ) {
    super(scene, x, y, 'generator_placeholder');
    scene.add.existing(this);
  }
}
