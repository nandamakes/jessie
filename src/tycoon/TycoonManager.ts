import { ECONOMY } from '../constants';
import { GameState } from '../autoload/GameState';
import { SaveSystem } from '../autoload/SaveSystem';

// Phase 3 — offline catch-up income, capped at ECONOMY.OFFLINE_CAP_HOURS
export class TycoonManager {
  applyOfflineIncome() {
    const tycoon = SaveSystem.getTycoonPlots();
    if (!tycoon || tycoon.last_saved_unix === 0) return;

    const nowSec    = Math.floor(Date.now() / 1000);
    const elapsedSec = Math.min(
      nowSec - tycoon.last_saved_unix,
      ECONOMY.OFFLINE_CAP_HOURS * 3600,
    );
    // Accumulate income from each generator in each plot
    // (generator rate data loaded from tycoon_items.json in Phase 3)
    void elapsedSec;
    void GameState;
  }
}
