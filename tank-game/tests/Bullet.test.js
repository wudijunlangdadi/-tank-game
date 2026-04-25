// Bullet Unit Tests
const bulletRunner = new TestRunner('Bullet');

// Constructor tests
bulletRunner.test('Bullet constructor with required parameters', (assert) => {
  const bullet = new Bullet(100, 100, 0);
  assert.assertCloseTo(bullet.position.x, 100, 0.1, 'x should be 100');
  assert.assertCloseTo(bullet.position.y, 100, 0.1, 'y should be 100');
  assert.assertEqual(bullet.direction, 0, 'direction should be 0');
});

bulletRunner.test('Bullet constructor with all parameters', (assert) => {
  const bullet = new Bullet(100, 100, Math.PI / 2, 400, '#ff0000', 'enemy', 2);
  assert.assertEqual(bullet.speed, 400, 'speed should be 400');
  assert.assertEqual(bullet.color, '#ff0000', 'color should be correct');
  assert.assertEqual(bullet.owner, 'enemy', 'owner should be enemy');
  assert.assertEqual(bullet.damage, 2, 'damage should be 2');
});

// Default values tests
bulletRunner.test('Bullet has correct default values', (assert) => {
  const bullet = new Bullet(50, 50, 0);
  assert.assertEqual(bullet.speed, 300, 'default speed should be 300');
  assert.assertEqual(bullet.color, '#f1c40f', 'default color should be yellow');
  assert.assertEqual(bullet.owner, 'player', 'default owner should be player');
  assert.assertEqual(bullet.damage, 1, 'default damage should be 1');
});

// State tests
bulletRunner.test('Bullet starts as alive', (assert) => {
  const bullet = new Bullet(100, 100, 0);
  assert.assert(bullet.isAlive, 'bullet should be alive initially');
});

// Bounds tests
bulletRunner.test('getBounds() returns correct bounds', (assert) => {
  const bullet = new Bullet(100, 100, 0);
  const bounds = bullet.getBounds();
  assert.assertEqual(bounds.x, 96, 'bounds x should be 96 (100 - 4)');
  assert.assertEqual(bounds.y, 96, 'bounds y should be 96 (100 - 4)');
  assert.assertEqual(bounds.width, 8, 'bounds width should be 8 (4 * 2)');
  assert.assertEqual(bounds.height, 8, 'bounds height should be 8 (4 * 2)');
});

// Point containment tests
bulletRunner.test('containsPoint() detects point inside bullet', (assert) => {
  const bullet = new Bullet(100, 100, 0);
  assert.assert(bullet.containsPoint(100, 100), 'center should be inside');
  assert.assert(bullet.containsPoint(102, 102), 'nearby point should be inside');
});

bulletRunner.test('containsPoint() detects point outside bullet', (assert) => {
  const bullet = new Bullet(100, 100, 0);
  assert.assert(!bullet.containsPoint(200, 200), 'far point should be outside');
});

// Destroy tests
bulletRunner.test('destroy() marks bullet as dead', (assert) => {
  const bullet = new Bullet(100, 100, 0);
  bullet.destroy();
  assert.assert(!bullet.isAlive, 'bullet should be dead after destroy');
});

// Direction vector tests
bulletRunner.test('getDirectionVector() returns correct vector', (assert) => {
  const bullet = new Bullet(100, 100, 0);
  const dir = bullet.getDirectionVector();
  assert.assertCloseTo(dir.x, 1, 0.0001, 'direction x should be ~1 (facing right)');
  assert.assertCloseTo(dir.y, 0, 0.0001, 'direction y should be ~0');
});

bulletRunner.test('getDirectionVector() handles different angles', (assert) => {
  const bullet = new Bullet(100, 100, Math.PI / 2);
  const dir = bullet.getDirectionVector();
  assert.assertCloseTo(dir.x, 0, 0.0001, 'direction x should be ~0');
  assert.assertCloseTo(dir.y, 1, 0.0001, 'direction y should be ~1 (facing down)');
});

// Run all tests
if (typeof window !== 'undefined') {
  bulletRunner.run();
}
