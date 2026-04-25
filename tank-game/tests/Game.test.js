// Game Unit Tests
const gameRunner = new TestRunner('Game');

// Setup mock canvas
function createMockCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  return canvas;
}

// Constructor tests
gameRunner.test('Game constructor initializes with valid canvas', (assert) => {
  const canvas = createMockCanvas();
  const game = new Game(canvas);
  assert.assert(game.canvas === canvas, 'canvas should be stored');
  assert.assert(game.ctx !== null, 'context should be created');
});

gameRunner.test('Game throws error with invalid canvas', (assert) => {
  try {
    new Game(null);
    assert.assert(false, 'should throw error');
  } catch (e) {
    assert.assert(true, 'error thrown as expected');
  }
});

// Initial state tests
gameRunner.test('Game initializes with correct state', (assert) => {
  const canvas = createMockCanvas();
  const game = new Game(canvas);
  assert.assertEqual(game.running, false, 'running should be false initially');
  assert.assertEqual(game.gameState, 'idle', 'gameState should be idle');
  assert.assertEqual(game.score, 0, 'score should be 0');
  assert.assertEqual(game.lives, 3, 'lives should be 3');
  assert.assertEqual(game.level, 1, 'level should be 1');
});

// Tank initialization
gameRunner.test('Game creates player tank at center', (assert) => {
  const canvas = createMockCanvas();
  const game = new Game(canvas);
  assert.assertCloseTo(game.tank.position.x, canvas.width / 2, 0.1, 'tank x should be centered');
  assert.assertCloseTo(game.tank.position.y, canvas.height / 2, 0.1, 'tank y should be centered');
});

// Enemy spawning
gameRunner.test('Game spawns enemies', (assert) => {
  const canvas = createMockCanvas();
  const game = new Game(canvas);
  assert.assert(game.enemies.length > 0, 'should spawn enemies');
});

// Collision detection
gameRunner.test('checkCollision() detects overlapping rectangles', (assert) => {
  const canvas = createMockCanvas();
  const game = new Game(canvas);

  const rect1 = { x: 0, y: 0, width: 10, height: 10 };
  const rect2 = { x: 5, y: 5, width: 10, height: 10 };

  assert.assert(game.checkCollision(rect1, rect2), 'overlapping rects should collide');
});

gameRunner.test('checkCollision() detects non-overlapping rectangles', (assert) => {
  const canvas = createMockCanvas();
  const game = new Game(canvas);

  const rect1 = { x: 0, y: 0, width: 10, height: 10 };
  const rect2 = { x: 20, y: 20, width: 10, height: 10 };

  assert.assert(!game.checkCollision(rect1, rect2), 'non-overlapping rects should not collide');
});

// Bounds constraint
gameRunner.test('constrainTankToBounds() keeps tank in canvas', (assert) => {
  const canvas = createMockCanvas();
  const game = new Game(canvas);

  // Move tank outside bounds
  game.tank.position.x = -100;
  game.tank.position.y = -100;

  game.constrainTankToBounds();

  const bounds = game.tank.getBounds();
  assert.assert(bounds.x >= 0, 'tank should not go left of canvas');
  assert.assert(bounds.y >= 0, 'tank should not go above canvas');
});

// Game state transitions
gameRunner.test('start() sets running and gameState', (assert) => {
  const canvas = createMockCanvas();
  const game = new Game(canvas);
  game.start();

  assert.assert(game.running, 'running should be true');
  assert.assertEqual(game.gameState, 'playing', 'gameState should be playing');
});

gameRunner.test('pause() stops game', (assert) => {
  const canvas = createMockCanvas();
  const game = new Game(canvas);
  game.start();
  game.pause();

  assert.assert(!game.running, 'running should be false');
  assert.assertEqual(game.gameState, 'paused', 'gameState should be paused');
});

gameRunner.test('resume() continues game', (assert) => {
  const canvas = createMockCanvas();
  const game = new Game(canvas);
  game.start();
  game.pause();
  game.resume();

  assert.assert(game.running, 'running should be true');
  assert.assertEqual(game.gameState, 'playing', 'gameState should be playing');
});

// Cleanup
gameRunner.test('destroy() stops and cleans up', (assert) => {
  const canvas = createMockCanvas();
  const game = new Game(canvas);
  game.start();
  game.destroy();

  assert.assert(!game.running, 'running should be false');
});

// Run all tests
if (typeof window !== 'undefined') {
  gameRunner.run();
}
