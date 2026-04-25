// Bullet entity for tank game
class Bullet {
  /**
   * Create a bullet
   * @param {number} x - Initial x position
   * @param {number} y - Initial y position
   * @param {number} direction - Direction in radians (0 = facing right)
   * @param {number} [speed=300] - Speed in pixels per second
   * @param {string} [color='#f1c40f'] - Bullet color
   * @param {string} [owner='player'] - Bullet owner: 'player' or 'enemy'
   * @param {number} [damage=1] - Damage amount
   */
  constructor(x, y, direction, speed = 300, color = '#f1c40f', owner = 'player', damage = 1) {
    this.position = new Vector2(x, y);
    this.direction = direction; // Radians
    this.speed = speed; // Pixels per second
    this.color = color;
    this.owner = owner;
    this.damage = damage;

    // Bullet dimensions
    this.radius = 4;
    this.length = 10;

    // State
    this.isAlive = true;
  }

  /**
   * Update bullet position based on speed and time delta
   * @param {number} dt - Delta time in seconds
   */
  update(dt) {
    // Move forward in direction
    const directionVector = Vector2.fromAngle(this.direction);
    const movement = directionVector.multiply(this.speed * dt);
    this.position = this.position.add(movement);
  }

  /**
   * Render bullet on canvas
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.direction);

    // Draw bullet body (elongated circle)
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.radius, this.radius, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw bullet tip
    ctx.fillStyle = '#e67e22';
    ctx.beginPath();
    ctx.ellipse(this.length / 2, 0, this.radius / 2, this.radius / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Optional debug info
    if (window.debugMode) {
      ctx.save();
      ctx.fillStyle = '#2c3e50';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(
        `Bullet: (${Math.floor(this.position.x)}, ${Math.floor(this.position.y)})`,
        this.position.x,
        this.position.y - 15
      );
      ctx.restore();
    }
  }

  /**
   * Get forward direction vector
   * @returns {Vector2}
   */
  getDirectionVector() {
    return Vector2.fromAngle(this.direction);
  }

  /**
   * Get bullet bounds for collision detection
   * @returns {{x: number, y: number, width: number, height: number}}
   */
  getBounds() {
    // Approximate as circle bounding box
    return {
      x: this.position.x - this.radius,
      y: this.position.y - this.radius,
      width: this.radius * 2,
      height: this.radius * 2
    };
  }

  /**
   * Check if point is inside bullet bounds
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
   */
  containsPoint(x, y) {
    const dx = x - this.position.x;
    const dy = y - this.position.y;
    return dx * dx + dy * dy <= this.radius * this.radius;
  }

  /**
   * Mark bullet as dead (to be removed)
   */
  destroy() {
    this.isAlive = false;
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Bullet;
}
