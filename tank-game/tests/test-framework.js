// Simple test framework for tank game
class TestRunner {
  constructor(name) {
    this.name = name;
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(description, fn) {
    this.tests.push({ description, fn });
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(`${message}: expected ${expected}, got ${actual}`);
    }
  }

  assertCloseTo(actual, expected, tolerance, message) {
    if (Math.abs(actual - expected) > tolerance) {
      throw new Error(`${message}: expected ~${expected}, got ${actual}`);
    }
  }

  run() {
    console.log(`\n🧪 Running tests for: ${this.name}`);
    console.log('='.repeat(50));

    for (const test of this.tests) {
      try {
        test.fn(this);
        console.log(`✅ ${test.description}`);
        this.passed++;
      } catch (error) {
        console.log(`❌ ${test.description}`);
        console.log(`   ${error.message}`);
        this.failed++;
      }
    }

    console.log('='.repeat(50));
    console.log(`Results: ${this.passed} passed, ${this.failed} failed`);
    console.log('');

    return this.failed === 0;
  }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TestRunner;
}
