// Vector2 Unit Tests
const runner = new TestRunner('Vector2');

// Constructor tests
runner.test('Constructor initializes with default values', (assert) => {
  const v = new Vector2();
  assert.assertEqual(v.x, 0, 'x should be 0');
  assert.assertEqual(v.y, 0, 'y should be 0');
});

runner.test('Constructor accepts x and y parameters', (assert) => {
  const v = new Vector2(3, 4);
  assert.assertEqual(v.x, 3, 'x should be 3');
  assert.assertEqual(v.y, 4, 'y should be 4');
});

// Addition tests
runner.test('add() returns correct result', (assert) => {
  const v1 = new Vector2(1, 2);
  const v2 = new Vector2(3, 4);
  const result = v1.add(v2);
  assert.assertEqual(result.x, 4, 'x should be 4');
  assert.assertEqual(result.y, 6, 'y should be 6');
});

// Subtraction tests
runner.test('subtract() returns correct result', (assert) => {
  const v1 = new Vector2(5, 7);
  const v2 = new Vector2(2, 3);
  const result = v1.subtract(v2);
  assert.assertEqual(result.x, 3, 'x should be 3');
  assert.assertEqual(result.y, 4, 'y should be 4');
});

// Multiplication tests
runner.test('multiply() scales vector correctly', (assert) => {
  const v = new Vector2(2, 3);
  const result = v.multiply(2);
  assert.assertEqual(result.x, 4, 'x should be 4');
  assert.assertEqual(result.y, 6, 'y should be 6');
});

// Magnitude tests
runner.test('magnitude calculates correctly', (assert) => {
  const v = new Vector2(3, 4);
  assert.assertEqual(v.magnitude, 5, 'magnitude should be 5');
});

runner.test('magnitude of zero vector is 0', (assert) => {
  const v = new Vector2(0, 0);
  assert.assertEqual(v.magnitude, 0, 'magnitude should be 0');
});

// Normalization tests
runner.test('normalized() returns unit vector', (assert) => {
  const v = new Vector2(3, 4);
  const normalized = v.normalized;
  assert.assertCloseTo(normalized.magnitude, 1, 0.0001, 'magnitude should be 1');
});

// Angle tests
runner.test('fromAngle() creates correct vector', (assert) => {
  const v = Vector2.fromAngle(0, 1); // 0 radians = right direction
  assert.assertCloseTo(v.x, 1, 0.0001, 'x should be ~1');
  assert.assertCloseTo(v.y, 0, 0.0001, 'y should be ~0');
});

runner.test('angle property returns correct value', (assert) => {
  const v = new Vector2(1, 0); // 0 radians
  assert.assertCloseTo(v.angle, 0, 0.0001, 'angle should be 0');
});

// Distance tests
runner.test('distanceTo() calculates correctly', (assert) => {
  const v1 = new Vector2(0, 0);
  const v2 = new Vector2(3, 4);
  assert.assertEqual(v1.distanceTo(v2), 5, 'distance should be 5');
});

// Copy tests
runner.test('copy() creates independent copy', (assert) => {
  const v1 = new Vector2(1, 2);
  const v2 = v1.copy();
  v2.x = 5;
  assert.assertEqual(v1.x, 1, 'original should not change');
  assert.assertEqual(v2.x, 5, 'copy should have new value');
});

// Dot product tests
runner.test('dot() calculates scalar product', (assert) => {
  const v1 = new Vector2(1, 2);
  const v2 = new Vector2(3, 4);
  const result = v1.dot(v2);
  assert.assertEqual(result, 11, 'dot product should be 11');
});

// Equality tests
runner.test('equals() compares vectors correctly', (assert) => {
  const v1 = new Vector2(1, 2);
  const v2 = new Vector2(1, 2);
  assert.assert(v1.equals(v2), 'vectors should be equal');
});

runner.test('equals() allows tolerance', (assert) => {
  const v1 = new Vector2(1, 2);
  const v2 = new Vector2(1.0001, 2.0001);
  assert.assert(v1.equals(v2, 0.001), 'vectors should be equal within tolerance');
});

// Run all tests
if (typeof window !== 'undefined') {
  runner.run();
}
