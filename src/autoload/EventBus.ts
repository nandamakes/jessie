import Phaser from 'phaser';

// Global signal bus — mirrors Godot EventBus autoload.
// Signals: acorns_changed(amount: number), item_equipped({type, id}), level_completed({id, time})
export const EventBus = new Phaser.Events.EventEmitter();
