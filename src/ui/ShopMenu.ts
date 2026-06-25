import Phaser from 'phaser';

// Phase 4 — modal overlay listing shop_items.json; buy + equip
export class ShopMenu extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    scene.add.existing(this);
    this.setVisible(false);
  }

  open() { this.setVisible(true); }
  close() { this.setVisible(false); }
}
