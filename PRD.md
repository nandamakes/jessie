# PRD: Floofblocks — Jessie's World

**Owner:** Nanda (Paramanandana)
**Status:** Draft v1 — ready for Claude Code
**Date:** 26 June 2026
**Engine:** Godot 4.3+ (GDScript)
**Scope:** Single-player, fully local/offline, no accounts, no IAP

---

## 0. Assumptions (read first, flag anything wrong)

| # | Assumption | If wrong |
|---|---|---|
| 1 | "Roblox-style" = hub-and-portal structure (central hub → minigames: Obby + Tycoon + Shop), pixel-art 2D, not literal Roblox Studio/Luau | Say "actual Roblox" and I'll redo §8 for Luau + Rojo instead |
| 2 | Engine = Godot 4.3+, GDScript | Could swap to Phaser+Vite+TS (your other 2D stack) — same design doc, different §8/§9 |
| 3 | Jessie = player avatar, palette = real fox (rust orange / cream / white), not a Floof Pastel palette swap | Tell me and Jessie becomes bubblegum-pink instead, no judgement |
| 4 | Single-player, local save file, no networking, no real-money anything | — |
| 5 | Pixel scale: 32×32 tiles, internal render res 480×270, nearest-neighbour upscale (crisp, no blur) | — |
| 6 | Currency name: "Acorns" | Easy rename, it's one constant |

---

## 1. Vision

A cosy, low-pressure pixel hangout where **Jessie** (your fox) runs obby courses, builds up a burrow tycoon, and gets dressed up — structured like a Roblox hub game, but entirely offline, entirely yours, no engagement-farming nonsense.

## 2. Goals / Non-Goals

**Goals**
- Fun in 5-minute sessions, no save-anxiety
- Replayable obby courses + idle-ish tycoon progression
- Jessie feels like *your* Jessie — customisable but recognisably foxy

**Non-Goals (explicitly out)**
- No multiplayer/servers, no monetisation, no FOMO timers, no daily-streak guilt mechanics, no ads
- Not aiming for actual Roblox platform publishing in v1

## 3. Core Loop

```
Hub → enter Portal → play Obby or manage Tycoon → earn Acorns
  → spend Acorns in Shop (skins/hats/decor) → look cuter in Hub → repeat
```

## 4. Game Modes

### 4.1 Hub (top-down, walkable)
- Small tilemap room: spawn point, 2 portals (Obby, Tycoon), 1 Shop NPC/stall
- Free walk with WASD/arrows, no fail state

```
┌──────────────────────────────────────────┐
│              JESSIE'S BURROW HUB           │
│                                            │
│      [Shop Stall]                         │
│                                            │
│            (Jessie spawn)                  │
│                                            │
│   [Obby Portal]        [Tycoon Portal]     │
└──────────────────────────────────────────┘
```

### 4.2 Obby Run (side-scroll platformer, entered via portal)
- Checkpoint-based, instant respawn at last checkpoint (no lives, no punishment — just retry)
- Hazards (v1): spikes (instant respawn), moving platforms, disappearing tiles
- Finish line → reward = `base_acorns + time_bonus` (faster = more)

### 4.3 Burrow Tycoon (management, entered via portal)
- Grid of plots; place Generators (passive Acorn income) and Decorations (cosmetic only)
- Income accrues **even while you're in Obby mode or app is closed** — calculated via timestamp delta on load (classic offline-tycoon catch-up, capped at 12h to avoid silly numbers)

### 4.4 Shop / Wardrobe
- Spend Acorns on hats, skins (palette swaps), tail accessories, tycoon decorations
- Equipping changes Jessie's sprite in Hub + Obby + Tycoon instantly

## 5. Jessie — Character Spec

| Stat | Value |
|---|---|
| Walk speed | 140 px/s |
| Sprint speed (hold Shift) | 220 px/s |
| Jump velocity | -380 px/s |
| Gravity | 900 px/s² |
| Double jump | Unlocked at Player Level 3 |
| Fox Dash (300px burst, 0.6s cooldown) | Unlocked at Player Level 5 |

**Animation states:** idle, walk, run, jump, fall, land, dash (8 states, can start with idle/walk/jump as MVP, rest stubbed)

**Customisation slots:** skin (base palette), hat, tail accessory — each independently equippable, stored in save file.

## 6. Art & Audio Direction

- **Jessie + world creatures:** natural fox palette — rust orange `#C75D32`, cream `#F4E3C1`, white `#FFFFFF`, dark brown `#3D2418` for outlines/shadow
- **UI chrome / hub décor:** your Floof Pastel set — Bubblegum Pink `#FF6FB5`, Sky `#7BC6FF`, Mint `#7CF4C5`, Lemon `#FFE075`, Lavender `#C99CFF`, Ink `#EEF1FF`, Night `#0B0E14`
- **Audio:** lo-fi/chill loop in Hub, slightly more energetic loop in Obby, soft ambient in Tycoon. SFX: jump, land, coin-pickup, checkpoint-ding, purchase-chime. (Stretch phase — stub silence is fine for MVP.)

## 7. Economy

| Item | Type | Cost (Acorns) | Unlock Level |
|---|---|---|---|
| Red Bandana | Hat | 50 | 1 |
| Floof Bow (tail) | Accessory | 150 | 2 |
| Snow Fox | Skin | 500 | 4 |
| Paper Lantern | Decor | 80 | 1 |
| Acorn Sprout (Gen T1) | Generator | 100 | 1 — rate 1/s |
| Acorn Bush (Gen T2) | Generator | 400 | 3 — rate 4/s |
| Acorn Grove (Gen T3) | Generator | 1500 | 6 — rate 15/s |

Obby reward formula: `reward = max(10, base_acorns + (par_time_sec - actual_time_sec))`, floor 10.

## 8. Technical Architecture

```
floofblocks/
├── project.godot
├── icon.svg
├── README.md
├── assets/
│   ├── sprites/
│   │   ├── jessie/
│   │   │   ├── jessie_idle.png
│   │   │   ├── jessie_walk.png
│   │   │   ├── jessie_jump.png
│   │   │   └── skins/
│   │   │       ├── skin_default.png
│   │   │       └── skin_snow.png
│   │   ├── npcs/
│   │   │   └── shop_npc.png
│   │   ├── tiles/
│   │   │   ├── hub_tileset.png
│   │   │   └── obby_tileset.png
│   │   └── ui/
│   │       └── icons.png
│   ├── audio/
│   │   ├── sfx/
│   │   └── music/
│   └── fonts/
│       └── pixel_font.ttf
├── scenes/
│   ├── Main.tscn
│   ├── player/
│   │   └── Jessie.tscn
│   ├── hub/
│   │   ├── Hub.tscn
│   │   ├── Portal.tscn
│   │   └── ShopNPC.tscn
│   ├── obby/
│   │   ├── ObbyLevel.tscn
│   │   ├── Checkpoint.tscn
│   │   └── Hazard.tscn
│   ├── tycoon/
│   │   ├── Tycoon.tscn
│   │   ├── Plot.tscn
│   │   └── Generator.tscn
│   └── ui/
│       ├── HUD.tscn
│       ├── ShopMenu.tscn
│       └── PauseMenu.tscn
├── scripts/
│   ├── autoload/
│   │   ├── GameState.gd
│   │   ├── SaveSystem.gd
│   │   └── EventBus.gd
│   ├── player/
│   │   └── JessieController.gd
│   ├── hub/
│   │   └── PortalScript.gd
│   ├── obby/
│   │   ├── ObbyManager.gd
│   │   └── CheckpointScript.gd
│   ├── tycoon/
│   │   ├── TycoonManager.gd
│   │   └── GeneratorScript.gd
│   └── ui/
│       ├── ShopScript.gd
│       └── HUDScript.gd
└── data/
    ├── obby_levels.json
    ├── shop_items.json
    ├── tycoon_items.json
    └── save_default.json
```

**Autoloads:** `GameState` (currency/level/equipped items, in-memory source of truth), `SaveSystem` (load/save JSON to `user://save.json`), `EventBus` (signals: `acorns_changed`, `item_equipped`, `level_completed`).

**Viewport settings (Phase 0):** `project.godot` → Window → Viewport Width/Height = 480×270, Stretch Mode = `viewport`, Stretch Aspect = `keep`, Texture Filter = `Nearest` globally.

## 9. Data Schemas

**`save_default.json`**
```json
{
  "version": 1,
  "currency": { "acorns": 0 },
  "player": {
    "level": 1,
    "xp": 0,
    "equipped_skin": "skin_default",
    "equipped_hat": null,
    "equipped_tail": null,
    "abilities": { "double_jump": false, "dash": false }
  },
  "obby": { "best_times": {}, "completed_levels": [] },
  "tycoon": {
    "last_saved_unix": 0,
    "plots": [ { "id": 0, "generator_id": null, "decorations": [] } ]
  },
  "settings": { "music_vol": 0.7, "sfx_vol": 0.8, "fullscreen": false }
}
```

**`obby_levels.json`**
```json
[
  { "id": "obby_01", "name": "Leafy Start", "difficulty": 1, "par_time_sec": 60, "base_acorns": 10, "unlock_level": 1 },
  { "id": "obby_02", "name": "Wobbly Logs", "difficulty": 2, "par_time_sec": 75, "base_acorns": 15, "unlock_level": 2 },
  { "id": "obby_03", "name": "Vanishing Trail", "difficulty": 3, "par_time_sec": 90, "base_acorns": 20, "unlock_level": 4 }
]
```

**`shop_items.json`**
```json
[
  { "id": "hat_bandana", "name": "Red Bandana", "type": "hat", "cost": 50, "unlock_level": 1 },
  { "id": "tail_bow", "name": "Floof Bow", "type": "tail", "cost": 150, "unlock_level": 2 },
  { "id": "skin_snow", "name": "Snow Fox", "type": "skin", "cost": 500, "unlock_level": 4 }
]
```

**`tycoon_items.json`**
```json
[
  { "id": "gen_t1", "name": "Acorn Sprout", "type": "generator", "cost": 100, "rate_per_sec": 1, "unlock_level": 1 },
  { "id": "gen_t2", "name": "Acorn Bush", "type": "generator", "cost": 400, "rate_per_sec": 4, "unlock_level": 3 },
  { "id": "gen_t3", "name": "Acorn Grove", "type": "generator", "cost": 1500, "rate_per_sec": 15, "unlock_level": 6 },
  { "id": "decor_lantern", "name": "Paper Lantern", "type": "decor", "cost": 80, "unlock_level": 1 }
]
```

## 10. Build Phases (one per Claude Code session — don't let it jump ahead)

| Phase | Deliverable | Acceptance Criteria |
|---|---|---|
| **0 — Setup** | Project init, folder structure, viewport/pixel settings, autoload stubs | Empty window runs at 480×270 internal res, crisp upscale, zero console errors |
| **1 — Hub + Movement** | Jessie placeholder sprite, `JessieController.gd` (walk/run/jump), Hub tilemap, 2 portal triggers (log only) | Can walk Jessie around, touching a portal logs "entering Obby/Tycoon" |
| **2 — Obby MVP** | One hand-built level, checkpoints, spike hazard, finish line | Can complete level, Acorns added to `GameState`, returns to Hub |
| **3 — Tycoon MVP** | One plot, one generator, offline catch-up income, save/load | Buy generator, income accrues, survives app close/reopen |
| **4 — Shop & Customisation** | Shop UI reads `shop_items.json`, equip changes sprite | Buy + equip an item, visual change persists across save/load |
| **5 — Content Pass** | Load `obby_levels.json` for 3 levels, 2 more hazard types, 2nd plot + gen tiers 2/3, real art swapped in | 3 obby levels playable, tycoon progression works, no placeholder rectangles |
| **6 — Polish/Stretch** | SFX/music, settings menu, local best-times leaderboard, juice (particles/squash-stretch) | Flag any stretch item to me before building it |

## 11. Out of Scope (v1)

Multiplayer/networking, mobile touch controls, real-money purchases, cross-device save sync, actual Roblox-platform publishing, voice chat.

## 12. Briefing Claude Code

Drop this file in the repo root as `PRD.md`, then open with something like:

> "Read PRD.md. Build Phase 0 only — Godot 4.3 project init per §8 file tree and §0 assumption 5 (480×270, nearest-neighbour). Stop and show me before moving to Phase 1."

Repeat per phase. Don't let it batch-build phases 0–3 in one go — you'll lose the ability to course-correct cheaply.

---
*Open questions for you, not blockers: final game title (placeholder "Floofblocks" used throughout), and whether Jessie needs a starting "lore" intro screen or just drops you straight into the Hub.*
