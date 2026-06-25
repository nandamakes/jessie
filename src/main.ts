import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { HubScene } from './scenes/HubScene';
import { ObbyScene } from './scenes/ObbyScene';
import { TycoonScene } from './scenes/TycoonScene';
import { VIEWPORT, JESSIE } from './constants';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  // pixelArt: true sets antialias=false + roundPixels=true for crisp sprites.
  // CSS image-rendering: pixelated in index.html handles the browser upscale.
  pixelArt: true,
  backgroundColor: '#0B0E14',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: VIEWPORT.WIDTH,
    height: VIEWPORT.HEIGHT,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: JESSIE.GRAVITY },
      debug: false,
    },
  },
  scene: [BootScene, HubScene, ObbyScene, TycoonScene],
};

new Phaser.Game(config);
