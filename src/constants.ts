export const VIEWPORT = { WIDTH: 480, HEIGHT: 270 } as const;

export const COLORS = {
  // Fox palette
  RUST_ORANGE: 0xC75D32,
  CREAM:       0xF4E3C1,
  WHITE:       0xFFFFFF,
  DARK_BROWN:  0x3D2418,
  // Floof Pastel UI
  BUBBLEGUM_PINK: 0xFF6FB5,
  SKY:            0x7BC6FF,
  MINT:           0x7CF4C5,
  LEMON:          0xFFE075,
  LAVENDER:       0xC99CFF,
  INK:            0xEEF1FF,
  NIGHT:          0x0B0E14,
} as const;

export const JESSIE = {
  WALK_SPEED:    140,
  SPRINT_SPEED:  220,
  JUMP_VELOCITY: -380,
  GRAVITY:       900,
} as const;

export const ECONOMY = {
  OFFLINE_CAP_HOURS: 12,
} as const;

export const SCENES = {
  BOOT:   'BootScene',
  HUB:    'HubScene',
  OBBY:   'ObbyScene',
  TYCOON: 'TycoonScene',
} as const;
