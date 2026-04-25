// Keyboard input handler for game controls
class InputHandler {
  /**
   * Create an input handler
   * @param {Object} [keyMap] - Custom key mapping (default: WASD + Arrows + Space)
   * @param {boolean} [gameActive=false] - Whether game is active (controls preventDefault)
   */
  constructor(keyMap = null, gameActive = false) {
    this.keys = new Set();
    this.keyMap = keyMap || {
      // Movement keys (WASD + Arrow keys)
      'KeyW': 'up', 'ArrowUp': 'up',
      'KeyS': 'down', 'ArrowDown': 'down',
      'KeyA': 'left', 'ArrowLeft': 'left',
      'KeyD': 'right', 'ArrowRight': 'right',
      // Action keys
      'Space': 'shoot',
      // Additional keys can be added here
    };
    this.gameActive = gameActive;
    this.enabled = false;

    // Bind event handlers
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  /**
   * Enable input listening
   */
  enable() {
    if (this.enabled) return;
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.handleBlur);
    this.enabled = true;
  }

  /**
   * Disable input listening
   */
  disable() {
    if (!this.enabled) return;
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.handleBlur);
    this.clear();
    this.enabled = false;
  }

  /**
   * Set game active state (controls whether preventDefault is called)
   * @param {boolean} active
   */
  setGameActive(active) {
    this.gameActive = active;
  }

  /**
   * Update key mapping
   * @param {Object} newKeyMap
   */
  setKeyMapping(newKeyMap) {
    this.keyMap = { ...this.keyMap, ...newKeyMap };
  }

  /**
   * Handle keydown event
   * @param {KeyboardEvent} e
   */
  handleKeyDown(e) {
    const action = this.keyMap[e.code];
    if (action) {
      this.keys.add(action);
      // Only prevent default when game is active
      if (this.gameActive) {
        e.preventDefault();
      }
    }
  }

  /**
   * Handle keyup event
   * @param {KeyboardEvent} e
   */
  handleKeyUp(e) {
    const action = this.keyMap[e.code];
    if (action) {
      this.keys.delete(action);
      // Only prevent default when game is active
      if (this.gameActive) {
        e.preventDefault();
      }
    }
  }

  /**
   * Handle window blur (clear all keys when window loses focus)
   */
  handleBlur() {
    // Debug log for focus loss
    if (this.keys.size > 0) {
      console.debug(`Window blurred, clearing ${this.keys.size} pressed keys`);
    }
    this.clear();
  }

  /**
   * Clear all pressed keys
   */
  clear() {
    this.keys.clear();
  }

  /**
   * Check if a key is currently pressed
   * @param {string} key - Action name: 'up', 'down', 'left', 'right', 'shoot'
   * @returns {boolean}
   */
  isKeyPressed(key) {
    return this.keys.has(key);
  }

  /**
   * Get current movement vector from pressed keys
   * @returns {{x: number, y: number}} Normalized vector
   */
  getMovementVector() {
    let x = 0, y = 0;

    if (this.isKeyPressed('up')) y -= 1;
    if (this.isKeyPressed('down')) y += 1;
    if (this.isKeyPressed('left')) x -= 1;
    if (this.isKeyPressed('right')) x += 1;

    // Normalize diagonal movement
    if (x !== 0 && y !== 0) {
      const len = Math.sqrt(x * x + y * y);
      x /= len;
      y /= len;
    }

    return { x, y };
  }

  /**
   * Check if shoot button is pressed
   * @returns {boolean}
   */
  isShooting() {
    return this.isKeyPressed('shoot');
  }

  /**
   * Get all currently pressed keys (for debugging)
   * @returns {string[]}
   */
  getPressedKeys() {
    return Array.from(this.keys);
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InputHandler;
}
