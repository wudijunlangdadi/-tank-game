// Enemy Tank class - extends Tank with AI behavior
class EnemyTank extends Tank {
  /**
   * Create an enemy tank
   * @param {number} x - Initial x position
   * @param {number} y - Initial y position
   * @param {string} type - Enemy type: 'basic', 'heavy', 'fast'
   * @param {number} rotation - Initial rotation in radians
   */
  constructor(x = 100, y = 100, type = 'basic', rotation = 0) {
    super(x, y, rotation);

    // Enemy type configuration
    this.type = type;
    this.health = this.getHealthByType();
    this.maxHealth = this.health;

    // AI state
    this.aiState = 'patrol'; // patrol, chase, attack
    this.targetPosition = null;
    this.detectionRange = 300;
    this.attackRange = 200;
    this.patrolDirection = Math.random() * Math.PI * 2;
    this.patrolChangeCooldown = 0;

    // Shooting control
    this.shootCooldown = 0;
    this.shootInterval = this.getShootIntervalByType();
    this.shootAccuracy = this.getAccuracyByType();

    // Appearance - different colors for enemy types
    this.bodyColor = this.getColorByType();
    this.turretColor = this.darkenColor(this.bodyColor);
    this.trackColor = '#2c3e50';

    // Movement characteristics
    this.maxSpeed = this.getSpeedByType();
    this.rotationSpeed = 2.5;

    // Target rotation for smooth turning
    this.targetRotation = rotation;
  }

  /**
   * Update enemy AI
   * @param {number} dt - Delta time in seconds
   * @param {Vector2} playerPosition - Player tank position
   * @returns {Bullet|null} Bullet if fired, null otherwise
   */
  updateAI(dt, playerPosition) {
    // Update cooldowns
    if (this.shootCooldown > 0) {
      this.shootCooldown -= dt;
    }

    if (this.patrolChangeCooldown > 0) {
      this.patrolChangeCooldown -= dt;
    }

    // Calculate distance and direction to player
    const toPlayer = playerPosition.subtract(this.position);
    const distance = toPlayer.magnitude;
    const direction = toPlayer.normalized;

    // AI state machine
    if (distance < this.attackRange && this.hasLineOfSight(playerPosition)) {
      // Attack state: aim and shoot
      this.aiState = 'attack';
      this.targetRotation = toPlayer.angle;
      this.speed = 0; // Stop moving when attacking

      // Try to shoot
      if (this.shootCooldown <= 0 && Math.random() < this.shootAccuracy) {
        this.shootCooldown = this.shootInterval;
        return this.fire();
      }
    } else if (distance < this.detectionRange) {
      // Chase state: move toward player
      this.aiState = 'chase';
      this.targetRotation = toPlayer.angle;
      this.speed = this.maxSpeed;
    } else {
      // Patrol state: random movement
      this.aiState = 'patrol';
      this.patrolBehavior(dt);
    }

    // Apply rotation toward target
    this.applyRotation(dt);

    // Apply movement
    this.applyMovement(dt);

    return null; // No bullet fired
  }

  /**
   * Apply rotation toward target rotation
   * @param {number} dt - Delta time
   */
  applyRotation(dt) {
    const angleDiff = this.targetRotation - this.rotation;

    // Normalize angle difference to [-π, π]
    let normalizedDiff = ((angleDiff + Math.PI) % (Math.PI * 2)) - Math.PI;

    // Apply rotation
    if (Math.abs(normalizedDiff) > 0.1) {
      const rotationDirection = normalizedDiff > 0 ? 1 : -1;
      this.rotation += rotationDirection * this.rotationSpeed * dt;
    } else {
      this.rotation = this.targetRotation;
    }

    // Normalize rotation to [0, 2π)
    this.rotation = ((this.rotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  }

  /**
   * Apply movement based on current speed and rotation
   * @param {number} dt - Delta time
   */
  applyMovement(dt) {
    if (this.speed !== 0) {
      const direction = Vector2.fromAngle(this.rotation);
      const movement = direction.multiply(this.speed * dt);
      this.position = this.position.add(movement);
    }
  }

  /**
   * Patrol behavior: random direction changes
   * @param {number} dt - Delta time
   */
  patrolBehavior(dt) {
    // Randomly change direction
    if (this.patrolChangeCooldown <= 0 && Math.random() < 0.01) {
      this.patrolDirection += (Math.random() - 0.5) * Math.PI;
      this.patrolChangeCooldown = 2.0; // Cooldown before next change
    }

    this.targetRotation = this.patrolDirection;
    this.speed = this.maxSpeed * 0.5; // Patrol at half speed
  }

  /**
   * Check if enemy has line of sight to target
   * @param {Vector2} targetPosition - Target position
   * @returns {boolean} True if line of sight is clear
   */
  hasLineOfSight(targetPosition) {
    // Simplified line of sight - always true for now
    // TODO: Implement obstacle detection
    return true;
  }

  /**
   * Take damage
   * @param {number} amount - Damage amount
   * @returns {boolean} True if enemy is destroyed
   */
  takeDamage(amount) {
    this.health -= amount;
    return this.health <= 0;
  }

  /**
   * Fire a bullet (override to use enemy bullet color)
   * @returns {Bullet} New bullet instance
   */
  fire() {
    const turretEnd = this.getForwardDirection().multiply(this.turretLength);
    const spawnPos = this.position.add(turretEnd);

    return new Bullet(
      spawnPos.x,
      spawnPos.y,
      this.rotation,
      250, // Slightly slower than player bullets (降低到 250，之前是 400)
      '#e74c3c', // Red color for enemy bullets
      'enemy', // Owner identifier
      1 // Damage
    );
  }

  /**
   * Get health by enemy type
   * @returns {number} Health value
   */
  getHealthByType() {
    const types = { basic: 2, heavy: 3, fast: 4 };
    return types[this.type] || 2;
  }

  /**
   * Get speed by enemy type
   * @returns {number} Speed value
   */
  getSpeedByType() {
    const types = { basic: 150, heavy: 100, fast: 250 };
    return types[this.type] || 150;
  }

  /**
   * Get shoot interval by enemy type
   * @returns {number} Shoot interval in seconds
   */
  getShootIntervalByType() {
    const types = { basic: 2.0, heavy: 3.0, fast: 1.5 };
    return types[this.type] || 2.0;
  }

  /**
   * Get accuracy by enemy type
   * @returns {number} Accuracy (0-1)
   */
  getAccuracyByType() {
    const types = { basic: 0.7, heavy: 0.9, fast: 0.5 };
    return types[this.type] || 0.7;
  }

  /**
   * Get color by enemy type
   * @returns {string} Color hex code
   */
  getColorByType() {
    const types = {
      basic: '#e74c3c', // Red
      heavy: '#c0392b', // Dark red
      fast: '#3498db'  // Blue
    };
    return types[this.type] || '#e74c3c';
  }

  /**
   * Darken a color for turret
   * @param {string} color - Hex color
   * @returns {string} Darkened hex color
   */
  darkenColor(color) {
    // Simple darkening by reducing brightness
    if (color.startsWith('#')) {
      // Convert hex to RGB, darken, then back to hex
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

      const darken = 0.7;
      const dr = Math.floor(r * darken);
      const dg = Math.floor(g * darken);
      const db = Math.floor(b * darken);

      return `#${dr.toString(16).padStart(2, '0')}${dg.toString(16).padStart(2, '0')}${db.toString(16).padStart(2, '0')}`;
    }
    return color;
  }

  /**
   * Render enemy tank (override for health bar)
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  render(ctx) {
    // Call parent render first
    super.render(ctx);

    // Draw health bar above enemy
    if (this.health < this.maxHealth) {
      const bounds = this.getBounds();
      const barWidth = 40;
      const barHeight = 6;
      const barX = bounds.x + (bounds.width - barWidth) / 2;
      const barY = bounds.y - 15;

      // Background
      ctx.fillStyle = '#2c3e50';
      ctx.fillRect(barX, barY, barWidth, barHeight);

      // Health fill
      const healthPercent = this.health / this.maxHealth;
      ctx.fillStyle = healthPercent > 0.5 ? '#2ecc71' : healthPercent > 0.25 ? '#f39c12' : '#e74c3c';
      ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

      // Border
      ctx.strokeStyle = '#34495e';
      ctx.lineWidth = 1;
      ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EnemyTank };
}
