// Global initialization - ensures all classes are registered once
// This file should be loaded first, before any game code

// Register Vector2
if (typeof window !== 'undefined' && !window.Vector2) {
  window.Vector2 = Vector2;
}

// Register Tank
if (typeof window !== 'undefined' && !window.Tank) {
  window.Tank = Tank;
}

// Register Bullet
if (typeof window !== 'undefined' && !window.Bullet) {
  window.Bullet = Bullet;
}

// Register EnemyTank
if (typeof window !== 'undefined' && !window.EnemyTank) {
  window.EnemyTank = EnemyTank;
}

// Register InputHandler
if (typeof window !== 'undefined' && !window.InputHandler) {
  window.InputHandler = InputHandler;
}

// Register AudioManager
if (typeof window !== 'undefined' && !window.AudioManager) {
  window.AudioManager = AudioManager;
}

// Register Game
if (typeof window !== 'undefined' && !window.Game) {
  window.Game = Game;
}

console.log('✓ Global classes initialized');

