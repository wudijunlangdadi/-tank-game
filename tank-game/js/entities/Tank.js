
// Main Tank class
class Tank {
  /**
   * @param {number} x - Initial x position
   * @param {number} y - Initial y position
   * @param {number} rotation - Initial rotation in radians (0 = facing right)
   */
  constructor(x = 100, y = 100, rotation = 0) {
    this.position = new Vector2(x, y);
    this.rotation = rotation; // Radians (0 = facing right, Math.PI/2 = facing down)

    // Movement properties
    this.speed = 0;
    this.maxSpeed = 200; // Pixels per second
    this.acceleration = 400; // Pixels per second^2
    this.deceleration = 600; // Pixels per second^2

    // Rotation properties
    this.rotationSpeed = 3; // Radians per second
    this.targetRotation = rotation;

    // Tank dimensions
    this.width = 40;
    this.height = 30;
    this.turretLength = 25;

    // Colors
    this.bodyColor = '#2ecc71';
    this.turretColor = '#27ae60';
    this.trackColor = '#34495e';
  }

  /**
   * Update tank state based on input and time delta
   * @param {number} dt - Delta time in seconds
   * @param {Object} input - Input handler with isKeyPressed method
   */
  update(dt, input) {
    // Handle rotation (left/right)
    if (input.isKeyPressed('left')) {
      this.rotation -= this.rotationSpeed * dt;
    }
    if (input.isKeyPressed('right')) {
      this.rotation += this.rotationSpeed * dt;
    }

    // Normalize rotation to [0, 2π)
    this.rotation = ((this.rotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

    // Handle movement (forward/backward)
    let targetSpeed = 0;
    if (input.isKeyPressed('up')) {
      targetSpeed = this.maxSpeed;
    } else if (input.isKeyPressed('down')) {
      targetSpeed = -this.maxSpeed * 0.7; // Reverse slower
    }

    // Accelerate/decelerate to target speed
    if (targetSpeed > this.speed) {
      this.speed = Math.min(this.speed + this.acceleration * dt, targetSpeed);
    } else if (targetSpeed < this.speed) {
      this.speed = Math.max(this.speed - this.deceleration * dt, targetSpeed);
    } else {
      // Decelerate to 0 when no input
      if (this.speed > 0) {
        this.speed = Math.max(this.speed - this.deceleration * dt, 0);
      } else if (this.speed < 0) {
        this.speed = Math.min(this.speed + this.deceleration * dt, 0);
      }
    }

    // Move based on speed and rotation
    if (this.speed !== 0) {
      const direction = Vector2.fromAngle(this.rotation);
      const movement = direction.multiply(this.speed * dt);
      this.position = this.position.add(movement);
    }
  }

  /**
   * Render tank on canvas
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    // Save context state
    ctx.save();

    // Move coordinate system to tank position
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation);

    // Draw tracks (bottom layer)
    ctx.fillStyle = this.trackColor;
    ctx.fillRect(-this.width / 2 - 5, -this.height / 2 - 5, this.width + 10, this.height + 10);

    // Draw tank body
    ctx.fillStyle = this.bodyColor;
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

    // Draw turret (rotates separately in future)
    ctx.fillStyle = this.turretColor;
    ctx.fillRect(0, -5, this.turretLength, 10);

    // Draw tank details
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);

    // Draw front indicator
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(this.width / 2 - 8, -4, 8, 8);

    // Restore context
    ctx.restore();

    // Optional: Draw debug info
    if (window.debugMode) {
      ctx.save();
      ctx.fillStyle = '#2c3e50';
      ctx.font = '12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(
        `Tank: (${Math.floor(this.position.x)}, ${Math.floor(this.position.y)}) Speed: ${Math.floor(this.speed)}`,
        this.position.x + 30,
        this.position.y - 30
      );
      ctx.fillText(
        `Rotation: ${(this.rotation * 180 / Math.PI).toFixed(1)}°`,
        this.position.x + 30,
        this.position.y - 15
      );
      ctx.restore();
    }
  }

  /**
   * Get forward direction vector
   * @returns {Vector2}
   */
  getForwardDirection() {
    return Vector2.fromAngle(this.rotation);
  }

  /**
   * Get tank bounds for collision detection
   * @returns {{x: number, y: number, width: number, height: number}}
   */
  getBounds() {
    return {
      x: this.position.x - this.width / 2,
      y: this.position.y - this.height / 2,
      width: this.width,
      height: this.height
    };
  }

  /**
   * Check if point is inside tank bounds
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
   */
  containsPoint(x, y) {
    const bounds = this.getBounds();
    return (
      x >= bounds.x &&
      x <= bounds.x + bounds.width &&
      y >= bounds.y &&
      y <= bounds.y + bounds.height
    );
  }

  /**
   * Fire a bullet from tank's turret
   * @returns {Bullet} New bullet instance
   */
  fire() {
    // Calculate bullet spawn position (at end of turret)
    const turretEnd = this.getForwardDirection().multiply(this.turretLength);
    const spawnPos = this.position.add(turretEnd);

    // Create bullet with tank's rotation
    return new Bullet(
      spawnPos.x,
      spawnPos.y,
      this.rotation,
      300, // Speed (降低到 300，之前是 500)
      '#f1c40f', // Color
      'player', // Owner
      1 // Damage
    );
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Tank };
}

