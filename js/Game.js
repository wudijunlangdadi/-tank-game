// Simple game engine with requestAnimationFrame loop
class Game {
  static DT_CAP = 0.1; // 最大delta时间（秒）
  static ENEMY_SPEED = 1; // 敌人移动速度
  static ENEMY_COLOR = "green"; // 敌人颜色

  constructor(canvas) {
    if (!canvas || !canvas.getContext) {
      throw new Error('Game requires a valid canvas element');
    }
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.running = false;
    this.lastTime = 0;

    // Game state
    this.gameState = 'idle'; // 'idle' | 'playing' | 'paused' | 'gameOver' | 'levelComplete'
    this.score = 0;
    this.lives = 3;
    this.level = 1;

    this.input = new InputHandler();
    this.input.enable();
    this.input.setGameActive(false); // Game not active until start()

    this.tank = new window.Tank(
      canvas.width / 2,
      canvas.height / 2
    );

    this.bullets = [];

    this.enemies = [];
    this.spawnEnemies();

    // Audio manager (optional)
    this.audio = null;

    // Shooting cooldown
    this.lastShotTime = 0;
    this.shootCooldown = 0.2; // 最少间隔 0.2 秒

    this.gameLoop = this.gameLoop.bind(this);
  }

  /**
   * Set audio manager for this game instance
   * @param {AudioManager} audioManager
   */
  setAudioManager(audioManager) {
    this.audio = audioManager;
  }

  spawnEnemies() {
    // 清除现有敌人
    this.enemies = [];

    // 根据关卡难度调整敌人数量
    const baseEnemyCount = 5;
    const levelMultiplier = 1 + (this.level - 1) * 0.5; // 每关增加难度
    const enemyCount = Math.min(Math.floor(baseEnemyCount * levelMultiplier), 12);

    // 创建不同类型的敌人
    const enemyTypes = ['basic', 'heavy', 'fast'];

    // 根据关卡增加敌人类型多样性
    const positions = this.generateEnemyPositions(enemyCount);

    for (let i = 0; i < enemyCount; i++) {
      const type = enemyTypes[i % enemyTypes.length];
      const pos = positions[i];
      const enemy = new window.EnemyTank(pos.x, pos.y, type, Math.random() * Math.PI * 2);
      this.enemies.push(enemy);
    }
  }

  /**
   * Generate random positions for enemies
   * @param {number} count - Number of enemies to position
   * @returns {Array} Array of {x, y} positions
   */
  generateEnemyPositions(count) {
    const positions = [];
    const marginX = 100;
    const marginY = 100;
    const maxX = this.canvas.width - marginX;
    const maxY = this.canvas.height - marginY;

    for (let i = 0; i < count; i++) {
      let pos;
      let isValid = false;
      let attempts = 0;

      // 确保敌人不会生成在玩家附近
      while (!isValid && attempts < 10) {
        pos = {
          x: marginX + Math.random() * (maxX - marginX),
          y: marginY + Math.random() * (maxY - marginY)
        };

        // 检查与玩家的距离
        const dx = pos.x - this.tank.position.x;
        const dy = pos.y - this.tank.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 150) {
          isValid = true;
        }
        attempts++;
      }

      if (isValid) {
        positions.push(pos);
      }
    }

    // 如果生成失败，使用默认位置
    if (positions.length < count) {
      const defaultPositions = [
        { x: 100, y: 100 },
        { x: 300, y: 100 },
        { x: 500, y: 100 },
        { x: 700, y: 100 },
        { x: 100, y: 300 },
        { x: 300, y: 300 },
        { x: 500, y: 300 },
        { x: 700, y: 300 },
        { x: 100, y: 500 },
        { x: 300, y: 500 },
        { x: 500, y: 500 },
        { x: 700, y: 500 }
      ];

      while (positions.length < count && positions.length < defaultPositions.length) {
        positions.push(defaultPositions[positions.length]);
      }
    }

    return positions;
  }

  gameLoop(currentTime) {
    if (!this.running) return;

    const dt = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    const cappedDt = Math.min(dt, Game.DT_CAP);

    this.update(cappedDt);
    this.render();

    requestAnimationFrame(this.gameLoop);
  }

  update(dt) {
    this.tank.update(dt, this.input);

    if (this.input.isShooting()) {
      // 检查是否可以射击（冷却时间已过）
      if (Date.now() - this.lastShotTime >= this.shootCooldown * 1000) {
        const bullet = this.tank.fire();
        this.bullets.push(bullet);
        this.lastShotTime = Date.now();
        if (this.audio) this.audio.play('shoot', 0.5);
      }
    }

    // Update bullets
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      bullet.update(dt);

      // Check collision with enemies (player bullets only)
      if (bullet.owner === 'player') {
        for (let j = this.enemies.length - 1; j >= 0; j--) {
          const enemy = this.enemies[j];
          const bulletBounds = bullet.getBounds();
          const enemyBounds = enemy.getBounds();

          if (this.checkCollision(bulletBounds, enemyBounds)) {
            // Enemy takes damage
            const destroyed = enemy.takeDamage(bullet.damage);
            bullet.destroy();

            if (destroyed) {
              this.enemies.splice(j, 1);
              // Update score
              this.score += 100;
              if (this.onScoreUpdate) this.onScoreUpdate(this.score);
              if (this.onEnemiesUpdate) this.onEnemiesUpdate(this.enemies.length);
              if (this.audio) this.audio.play('explosion', 0.6);
            }
            break; // Bullet can only hit one enemy
          }
        }
      }

      // Remove bullets that are out of bounds or destroyed
      const bounds = bullet.getBounds();
      if (
        !bullet.isAlive ||
        bounds.x + bounds.width < 0 ||
        bounds.x > this.canvas.width ||
        bounds.y + bounds.height < 0 ||
        bounds.y > this.canvas.height
      ) {
        this.bullets.splice(i, 1);
      }
    }

    // 👇新增：敌人AI更新逻辑
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];

      // 更新敌人AI，获取可能发射的子弹
      const bullet = enemy.updateAI(dt, this.tank.position);
      if (bullet) {
        this.bullets.push(bullet);
      }

      // 保持敌人在地图内
      this.constrainEnemyToBounds(enemy);
    }

    // 检查敌人子弹对玩家的伤害
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];

      // Check collision with player (enemy bullets only)
      if (bullet.owner === 'enemy') {
        const bulletBounds = bullet.getBounds();
        const playerBounds = this.tank.getBounds();

        if (this.checkCollision(bulletBounds, playerBounds)) {
          // Player takes damage
          this.lives -= bullet.damage;
          bullet.destroy();

          if (this.onLivesUpdate) this.onLivesUpdate(this.lives);

          // Check if game over
          if (this.lives <= 0) {
            this.gameState = 'gameOver';
            this.running = false;
            if (this.onGameOver) this.onGameOver(this.score);
          }
          break; // Bullet can only hit once
        }
      }
    }

    // Keep tank within canvas bounds
    this.constrainTankToBounds();

    // Check if all enemies are defeated
    if (this.enemies.length === 0 && this.gameState === 'playing') {
      this.gameState = 'levelComplete';
      this.running = false;
      if (this.onLevelComplete) this.onLevelComplete(this.score);
    }
  }


  /**
   * Keep tank within canvas boundaries
   */
  constrainTankToBounds() {
    const bounds = this.tank.getBounds();
    const canvas = this.canvas;

    if (bounds.x < 0) {
      this.tank.position.x = this.tank.width / 2;
    }
    if (bounds.x + bounds.width > canvas.width) {
      this.tank.position.x = canvas.width - this.tank.width / 2;
    }
    if (bounds.y < 0) {
      this.tank.position.y = this.tank.height / 2;
    }
    if (bounds.y + bounds.height > canvas.height) {
      this.tank.position.y = canvas.height - this.tank.height / 2;
    }
  }

  /**
   * Keep enemy within canvas boundaries
   * @param {EnemyTank} enemy - Enemy to constrain
   */
  constrainEnemyToBounds(enemy) {
    const bounds = enemy.getBounds();
    const canvas = this.canvas;

    if (bounds.x < 0) {
      enemy.position.x = enemy.width / 2;
      // 改变方向，避免一直往墙上撞
      enemy.patrolDirection = Math.random() * Math.PI * 2;
    }
    if (bounds.x + bounds.width > canvas.width) {
      enemy.position.x = canvas.width - enemy.width / 2;
      enemy.patrolDirection = Math.random() * Math.PI * 2;
    }
    if (bounds.y < 0) {
      enemy.position.y = enemy.height / 2;
      enemy.patrolDirection = Math.random() * Math.PI * 2;
    }
    if (bounds.y + bounds.height > canvas.height) {
      enemy.position.y = canvas.height - enemy.height / 2;
      enemy.patrolDirection = Math.random() * Math.PI * 2;
    }
  }

  checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }

  render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw tank
    this.tank.render(this.ctx);
    // Draw enemies
    for (const enemy of this.enemies) {
      enemy.render(this.ctx);
    }

    // Draw bullets
    for (const bullet of this.bullets) {
      bullet.render(this.ctx);
    }

    // Draw game info
    this.ctx.fillStyle = '#2c3e50';
    this.ctx.font = '14px monospace';
    this.ctx.textAlign = 'left';

    const pos = this.tank.position;
    this.ctx.fillText(`Tank: (${Math.floor(pos.x)}, ${Math.floor(pos.y)})`, 10, 20);

    const speed = this.tank.speed;
    this.ctx.fillText(`Speed: ${Math.floor(speed)}`, 10, 40);

    const rotationDeg = (this.tank.rotation * 180 / Math.PI).toFixed(1);
    this.ctx.fillText(`Rotation: ${rotationDeg}°`, 10, 60);

    this.ctx.fillText('Controls: WASD/Arrows to move, Space to shoot', 10, 80);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.gameState = 'playing';
    this.input.setGameActive(true);
    this.lastTime = performance.now();
    requestAnimationFrame(this.gameLoop);
  }

  pause() {
    this.running = false;
    this.gameState = 'paused';
    this.input.setGameActive(false); // Game inactive, but input still listened
  }

  resume() {
    if (this.running) return;
    this.running = true;
    this.gameState = 'playing';
    this.input.setGameActive(true);
    this.lastTime = performance.now();
    requestAnimationFrame(this.gameLoop);
  }

  togglePause() {
    if (this.running) this.pause();
    else this.resume();
  }

  destroy() {
    this.running = false;
    this.input.disable();
    // Clean up any resources if needed
  }

  restartLevel() {
    // Reset tank to center
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    this.tank = new window.Tank(centerX, centerY);
    this.bullets = [];

    // Keep same level and enemies
    this.enemies = [];
    this.spawnEnemies();

    // Reset game state
    this.gameState = 'idle';
    this.running = false;
    this.lastShotTime = 0;
  }

  nextLevel() {
    // Increment level
    this.level += 1;
    if (this.onLevelUpdate) this.onLevelUpdate(this.level);

    // Reset tank to center
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    this.tank = new window.Tank(centerX, centerY);
    this.bullets = [];

    // Spawn new enemies for next level
    this.enemies = [];
    this.spawnEnemies();

    // Reset game state
    this.gameState = 'idle';
    this.running = false;
    this.lastShotTime = 0;
  }

  // Event callbacks (will be set by main.js)
  onScoreUpdate(score) {}
  onLivesUpdate(lives) {}
  onLevelUpdate(level) {}
  onEnemiesUpdate(enemies) {}
  onGameOver(score) {}
  onLevelComplete(score) {}
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Game;
}
