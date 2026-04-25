// Tank Unit Tests
const tankRunner = new TestRunner('Tank');

// Constructor tests
tankRunner.test('Tank constructor initializes with default position', (assert) => {
  const tank = new Tank();
  assert.assertCloseTo(tank.position.x, 100, 0.1, 'default x should be 100');
  assert.assertCloseTo(tank.position.y, 100, 0.1, 'default y should be 100');
});

tankRunner.test('Tank constructor accepts x and y parameters', (assert) => {
  const tank = new Tank(200, 300);
  assert.assertCloseTo(tank.position.x, 200, 0.1, 'x should be 200');
  assert.assertCloseTo(tank.position.y, 300, 0.1, 'y should be 300');
});

tankRunner.test('Tank initializes with zero rotation', (assert) => {
  const tank = new Tank(100, 100);
  assert.assertEqual(tank.rotation, 0, 'rotation should be 0');
});

// Properties tests
tankRunner.test('Tank has correct default properties', (assert) => {
  const tank = new Tank();
  assert.assertEqual(tank.maxSpeed, 200, 'maxSpeed should be 200');
  assert.assertEqual(tank.acceleration, 400, 'acceleration should be 400');
  assert.assertEqual(tank.deceleration, 600, 'deceleration should be 600');
  assert.assertEqual(tank.width, 40, 'width should be 40');
  assert.assertEqual(tank.height, 30, 'height should be 30');
});

// Bounds tests
tankRunner.test('getBounds() returns correct bounds', (assert) => {
  const tank = new Tank(100, 100);
  const bounds = tank.getBounds();
  assert.assertEqual(bounds.x, 80, 'bounds x should be 80 (100 - 40/2)');
  assert.assertEqual(bounds.y, 85, 'bounds y should be 85 (100 - 30/2)');
  assert.assertEqual(bounds.width, 40, 'bounds width should be 40');
  assert.assertEqual(bounds.height, 30, 'bounds height should be 30');
});

// Point containment tests
tankRunner.test('containsPoint() detects point inside bounds', (assert) => {
  const tank = new Tank(100, 100);
  assert.assert(tank.containsPoint(100, 100), 'center point should be inside');
  assert.assert(tank.containsPoint(90, 100), 'left point should be inside');
});

tankRunner.test('containsPoint() detects point outside bounds', (assert) => {
  const tank = new Tank(100, 100);
  assert.assert(!tank.containsPoint(50, 50), 'far away point should be outside');
});

// Fire tests
tankRunner.test('fire() creates a bullet', (assert) => {
  const tank = new Tank(100, 100);
  const bullet = tank.fire();
  assert.assert(bullet !== null, 'bullet should be created');
  assert.assertEqual(bullet.owner, 'player', 'bullet should have player owner');
  assert.assertEqual(bullet.damage, 1, 'bullet should have 1 damage');
});

tankRunner.test('fire() creates bullet at correct position', (assert) => {
  const tank = new Tank(100, 100);
  tank.rotation = 0; // Facing right
  const bullet = tank.fire();
  // Bullet should spawn ahead of tank
  assert.assert(bullet.position.x > tank.position.x, 'bullet x should be ahead');
});

// Speed and movement tests
tankRunner.test('Speed starts at zero', (assert) => {
  const tank = new Tank();
  assert.assertEqual(tank.speed, 0, 'initial speed should be 0');
});

// Rotation tests
tankRunner.test('Rotation is normalized to [0, 2π)', (assert) => {
  const tank = new Tank(100, 100, Math.PI * 2.5);
  // After normalization, should be around π/2
  assert.assert(tank.rotation >= 0 && tank.rotation < Math.PI * 2, 'rotation should be normalized');
});

// Run all tests
if (typeof window !== 'undefined') {
  tankRunner.run();
}
