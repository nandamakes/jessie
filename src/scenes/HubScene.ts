import Phaser from 'phaser';
import { VIEWPORT, JESSIE, SCENES, COLORS } from '../constants';

const FLOOR_H   = 32;
const FLOOR_Y   = VIEWPORT.HEIGHT - FLOOR_H / 2; // centre of floor strip
const FLOOR_TOP = VIEWPORT.HEIGHT - FLOOR_H;     // surface Jessie stands on

export class HubScene extends Phaser.Scene {
  private jessie!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keyW!: Phaser.Input.Keyboard.Key;

  private touchLeft   = false;
  private touchRight  = false;
  private jumpQueued  = false; // consumed once per frame

  constructor() {
    super({ key: SCENES.HUB });
  }

  preload() {
    // Jessie animation strips (horizontal, equal-width frames per manifest)
    this.load.spritesheet('jessie_idle', 'assets/sprites/jessie/jessie_idle.png', { frameWidth: 32, frameHeight: 40 });
    this.load.spritesheet('jessie_walk', 'assets/sprites/jessie/jessie_walk.png', { frameWidth: 32, frameHeight: 40 });
    this.load.spritesheet('jessie_jump', 'assets/sprites/jessie/jessie_jump.png', { frameWidth: 32, frameHeight: 40 });

    // Hub set-dressing
    this.load.image('hub_floor',      'assets/tiles/hub_floor.png');
    this.load.image('portal_obby',    'assets/sprites/hub/portal_obby.png');
    this.load.image('portal_tycoon',  'assets/sprites/hub/portal_tycoon.png');
    this.load.image('shop_stall',     'assets/sprites/hub/shop_stall.png');
  }

  create() {
    const W = VIEWPORT.WIDTH;
    const H = VIEWPORT.HEIGHT;

    // ── Floor ────────────────────────────────────────────────────────────────
    const floor = this.add.tileSprite(W / 2, FLOOR_Y, W, FLOOR_H, 'hub_floor');
    this.physics.add.existing(floor, true /* static */);

    // ── Props ─────────────────────────────────────────────────────────────────
    // Obby portal (left)
    this.add.image(68, FLOOR_TOP, 'portal_obby').setOrigin(0.5, 1);
    this.add.text(68, FLOOR_TOP - 70, 'OBBY', {
      fontSize: '5px', color: '#7CF4C5', fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Tycoon portal (right)
    this.add.image(W - 68, FLOOR_TOP, 'portal_tycoon').setOrigin(0.5, 1);
    this.add.text(W - 68, FLOOR_TOP - 70, 'TYCOON', {
      fontSize: '5px', color: '#C99CFF', fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Shop stall (upper left-of-centre)
    this.add.image(140, FLOOR_TOP, 'shop_stall').setOrigin(0.5, 1);
    this.add.text(140, FLOOR_TOP - 54, 'SHOP', {
      fontSize: '5px', color: '#FFE075', fontFamily: 'monospace',
    }).setOrigin(0.5);

    // ── Jessie ────────────────────────────────────────────────────────────────
    // Origin bottom-centre so her feet sit exactly on FLOOR_TOP.
    // Physics body: 20×32, offset 6px from left + 8px from top (head clearance).
    this.jessie = this.physics.add.sprite(W / 2, FLOOR_TOP, 'jessie_idle');
    this.jessie.setOrigin(0.5, 1);
    this.jessie.setCollideWorldBounds(true);
    (this.jessie.body as Phaser.Physics.Arcade.Body).setSize(20, 32).setOffset(6, 8);

    this.physics.add.collider(this.jessie, floor);

    // ── Animations ────────────────────────────────────────────────────────────
    this.anims.create({
      key: 'jessie_idle',
      frames: this.anims.generateFrameNumbers('jessie_idle', { start: 0, end: 3 }),
      frameRate: 4,
      repeat: -1,
    });
    this.anims.create({
      key: 'jessie_walk',
      frames: this.anims.generateFrameNumbers('jessie_walk', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'jessie_jump',
      frames: this.anims.generateFrameNumbers('jessie_jump', { start: 0, end: 1 }),
      frameRate: 6,
      repeat: 0,
    });

    this.jessie.anims.play('jessie_idle');

    // ── Keyboard ──────────────────────────────────────────────────────────────
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keyA = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyW = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    // ── Touch controls ────────────────────────────────────────────────────────
    this.buildTouchButtons(W, H);

    // ── HUD text ──────────────────────────────────────────────────────────────
    this.add.text(W / 2, 5, "JESSIE'S BURROW HUB", {
      fontSize: '6px', color: '#FF6FB5', fontFamily: 'monospace',
    }).setOrigin(0.5, 0);
  }

  update() {
    const body  = this.jessie.body as Phaser.Physics.Arcade.Body;
    const onFloor = body.blocked.down;

    // Directional input
    const goLeft  = this.cursors.left.isDown  || this.keyA.isDown || this.touchLeft;
    const goRight = this.cursors.right.isDown || this.keyD.isDown || this.touchRight;

    // Jump input (keyboard: JustDown; touch: queued flag consumed here)
    const doJump = (Phaser.Input.Keyboard.JustDown(this.cursors.up)
                 || Phaser.Input.Keyboard.JustDown(this.cursors.space)
                 || Phaser.Input.Keyboard.JustDown(this.keyW)
                 || this.jumpQueued)
                 && onFloor;
    this.jumpQueued = false;

    // ── Movement ──────────────────────────────────────────────────────────────
    if (goLeft) {
      this.jessie.setVelocityX(-JESSIE.WALK_SPEED);
      this.jessie.setFlipX(true);
    } else if (goRight) {
      this.jessie.setVelocityX(JESSIE.WALK_SPEED);
      this.jessie.setFlipX(false);
    } else {
      this.jessie.setVelocityX(0);
    }

    if (doJump) {
      this.jessie.setVelocityY(JESSIE.JUMP_VELOCITY);
    }

    // ── Animation state machine ───────────────────────────────────────────────
    if (!onFloor) {
      // In air: always jump anim; frame 0 = ascending, frame 1 = falling
      if (this.jessie.anims.getName() !== 'jessie_jump') {
        this.jessie.anims.play('jessie_jump');
      }
      const frameIdx = body.velocity.y < 0 ? 0 : 1;
      this.jessie.anims.setCurrentFrame(
        this.jessie.anims.currentAnim!.frames[frameIdx],
      );
    } else if (Math.abs(body.velocity.x) > 5) {
      this.jessie.anims.play('jessie_walk', true);
    } else {
      this.jessie.anims.play('jessie_idle', true);
    }
  }

  // ── Touch button builder ──────────────────────────────────────────────────
  private buildTouchButtons(W: number, H: number) {
    const btnY  = H - 16;
    const alpha = 0.45;

    const makeBtn = (x: number, w: number, h: number, color: number, label: string) => {
      const btn = this.add.rectangle(x, btnY, w, h, color, alpha)
        .setInteractive({ useHandCursor: false });
      this.add.text(x, btnY, label, {
        fontSize: '9px', color: '#EEF1FF', fontFamily: 'monospace',
      }).setOrigin(0.5);
      return btn;
    };

    // ◀ Left
    const btnL = makeBtn(22, 36, 28, COLORS.SKY, '◀');
    btnL.on('pointerdown', () => { this.touchLeft  = true;  });
    btnL.on('pointerup',   () => { this.touchLeft  = false; });
    btnL.on('pointerout',  () => { this.touchLeft  = false; });

    // ▶ Right
    const btnR = makeBtn(64, 36, 28, COLORS.SKY, '▶');
    btnR.on('pointerdown', () => { this.touchRight = true;  });
    btnR.on('pointerup',   () => { this.touchRight = false; });
    btnR.on('pointerout',  () => { this.touchRight = false; });

    // ▲ Jump
    const btnJ = makeBtn(W - 26, 44, 28, COLORS.BUBBLEGUM_PINK, '▲');
    btnJ.on('pointerdown', () => { this.jumpQueued = true; });
  }
}
