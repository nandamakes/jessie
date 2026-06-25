import Phaser from 'phaser';

// Phase 2 — timer, checkpoint tracking, finish-line reward calculation
export class ObbyManager {
  private scene: Phaser.Scene;
  private startTime = 0;
  currentCheckpoint = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    void this.scene;
  }

  startTimer() { this.startTime = Date.now(); }

  elapsedSec() { return (Date.now() - this.startTime) / 1000; }

  calcReward(baseAcorns: number, parTimeSec: number): number {
    return Math.max(10, baseAcorns + (parTimeSec - this.elapsedSec()));
  }
}
