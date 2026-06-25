import saveDefault from '../data/save_default.json';
import { GameState, type SaveData } from './GameState';

const SAVE_KEY = 'floofblocks_save';

let _save: SaveData | null = null;

export const SaveSystem = {
  load(): SaveData {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        _save = JSON.parse(raw) as SaveData;
        GameState.loadFrom(_save);
        return _save;
      }
    } catch {
      // Corrupt save — fall through to default
    }
    _save = structuredClone(saveDefault) as unknown as SaveData;
    GameState.loadFrom(_save);
    return _save;
  },

  save() {
    if (!_save) return;
    _save.currency.acorns      = GameState.acorns;
    _save.player.level         = GameState.playerLevel;
    _save.player.xp            = GameState.playerXP;
    _save.player.equipped_skin = GameState.equippedSkin;
    _save.player.equipped_hat  = GameState.equippedHat;
    _save.player.equipped_tail = GameState.equippedTail;
    _save.player.abilities     = { ...GameState.abilities };
    _save.tycoon.last_saved_unix = Math.floor(Date.now() / 1000);
    localStorage.setItem(SAVE_KEY, JSON.stringify(_save));
  },

  getTycoonPlots() {
    return _save?.tycoon ?? null;
  },

  updateTycoonPlots(plots: SaveData['tycoon']['plots']) {
    if (_save) _save.tycoon.plots = plots;
  },

  reset() {
    _save = null;
    localStorage.removeItem(SAVE_KEY);
  },
};
