import Phaser from 'phaser';
import { JESSIE } from '../constants';

// Phase 1 — walk/run/jump, Phase 5 — dash/double-jump
export class JessieController {
  private sprite!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  get body() { return this.sprite; }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  init(_scene: Phaser.Scene) {
    // stub — wired up in Phase 1
    void JESSIE;
  }
}
