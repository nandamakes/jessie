import { EventBus } from './EventBus';

export interface SaveData {
  version: number;
  currency: { acorns: number };
  player: {
    level: number;
    xp: number;
    equipped_skin: string;
    equipped_hat: string | null;
    equipped_tail: string | null;
    abilities: { double_jump: boolean; dash: boolean };
  };
  obby: { best_times: Record<string, number>; completed_levels: string[] };
  tycoon: {
    last_saved_unix: number;
    plots: Array<{ id: number; generator_id: string | null; decorations: string[] }>;
  };
  settings: { music_vol: number; sfx_vol: number; fullscreen: boolean };
}

class GameStateManager {
  acorns = 0;
  playerLevel = 1;
  playerXP = 0;
  equippedSkin = 'skin_default';
  equippedHat: string | null = null;
  equippedTail: string | null = null;
  abilities = { double_jump: false, dash: false };

  loadFrom(save: SaveData) {
    this.acorns        = save.currency.acorns;
    this.playerLevel   = save.player.level;
    this.playerXP      = save.player.xp;
    this.equippedSkin  = save.player.equipped_skin;
    this.equippedHat   = save.player.equipped_hat;
    this.equippedTail  = save.player.equipped_tail;
    this.abilities     = { ...save.player.abilities };
  }

  addAcorns(amount: number) {
    this.acorns += amount;
    EventBus.emit('acorns_changed', this.acorns);
  }

  spendAcorns(amount: number): boolean {
    if (this.acorns < amount) return false;
    this.acorns -= amount;
    EventBus.emit('acorns_changed', this.acorns);
    return true;
  }

  equipItem(type: 'skin' | 'hat' | 'tail', id: string | null) {
    if (type === 'skin') this.equippedSkin = id ?? 'skin_default';
    else if (type === 'hat') this.equippedHat = id;
    else this.equippedTail = id;
    EventBus.emit('item_equipped', { type, id });
  }
}

export const GameState = new GameStateManager();
