# 🎮 Tank Battle Arena

A classic tank battle game built with **HTML5 Canvas** and **JavaScript**.

## 🚀 Play Online

**[Play the game here!](https://wudijunlangdadi.github.io/tank-game/)**

## 📋 Game Description

Tank Battle Arena is an engaging combat game where you control a tank and battle against AI-controlled enemy tanks. Destroy all enemies to complete each level and face increasingly difficult challenges.

### Core Features

- **Player Control** — WASD or Arrow keys to move, Space to shoot
- **Enemy AI** — Multiple enemy types with distinct behaviors (patrol, chase, attack)
- **Progressive Difficulty** — Enemies increase with each level
- **Collision Detection** — Realistic bullet physics and impacts
- **Score & Lives System** — Track your performance
- **Multiple Enemy Types**:
  - 🔴 **Red Tank (Basic)** — 2 hits to destroy
  - 🔴 **Dark Red Tank (Heavy)** — 3 hits to destroy  
  - 🔵 **Blue Tank (Fast)** — 4 hits to destroy

## 🎮 How to Play

### Controls
| Key | Action |
|-----|--------|
| **W / ↑** | Move Up |
| **S / ↓** | Move Down |
| **A / ←** | Rotate Left |
| **D / →** | Rotate Right |
| **SPACE** | Fire Bullet |
| **P** | Pause Game |
| **ESC** | Pause/Resume |

### Objective
Destroy all enemy tanks in each level while avoiding their bullets. Complete levels to increase difficulty and earn more points.

### Strategy Tips
- Enemy types have different speeds and durability
- Blue tanks require more hits but move faster
- Position yourself to avoid enemy fire
- Complete levels to unlock harder challenges

## 🏗️ Project Structure

```
tank-game/
├── index.html              # Main game page
├── style.css               # Game styling
├── js/
│   ├── main.js            # Entry point and event handlers
│   ├── Game.js            # Core game engine
│   ├── InputHandler.js    # Keyboard input system
│   ├── AudioManager.js    # Audio management
│   ├── init.js            # Global class registration
│   ├── entities/
│   │   ├── Tank.js        # Player tank class
│   │   ├── EnemyTank.js   # Enemy tank with AI
│   │   └── Bullet.js      # Bullet physics
│   └── utils/
│       └── Vector2.js     # 2D vector math
└── tests/
    └── *.test.js          # 50+ unit tests
```

## 🛠️ Development

### Local Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/wudijunlangdadi/tank-game.git
   cd tank-game
   ```

2. Open `index.html` in a web browser, or use a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   ```

3. Navigate to `http://localhost:8000` and enjoy!

### Running Tests
Open `tests/index.html` in a web browser to run the full test suite (50+ unit tests).

## 🎯 Game Mechanics

### Game States
- **Idle** — Start menu
- **Playing** — Active gameplay
- **Paused** — Game paused by player
- **Level Complete** — All enemies defeated
- **Game Over** — Player lost all lives

### Enemy AI States
1. **Patrol** — Random movement when player not detected
2. **Chase** — Move toward player when detected
3. **Attack** — Stop and shoot at player when in range

### Difficulty Scaling
```
Level 1: 5 enemies
Level 2: ~7-8 enemies (50% more)
Level 3: ~10-11 enemies (50% more)
Level 4+: ~12 enemies (max)
```

## 📊 Game Balance

### Bullet Mechanics
- **Player Bullet** — Speed: 300 px/s, Damage: 1
- **Enemy Bullet** — Speed: 250 px/s, Damage: 1
- **Shooting Cooldown** — 0.2 seconds (controlled single shots)

### Enemy Types
| Type | Speed | Health | Accuracy | Shoot Interval |
|------|-------|--------|----------|----------------|
| Basic (Red) | 150 px/s | 2 HP | 70% | 2.0s |
| Heavy (Dark Red) | 100 px/s | 3 HP | 90% | 3.0s |
| Fast (Blue) | 250 px/s | 4 HP | 50% | 1.5s |

## 🧪 Testing

The project includes 50+ unit tests covering:
- Vector2 mathematics
- Tank movement and rotation
- Bullet physics
- Game state management
- Collision detection
- Enemy AI behavior

Run tests by opening `tests/index.html` in your browser.

## 📝 Documentation

- `QUICK-START.md` — Quick setup guide
- `ENEMY-BOUNDARY-FIX.md` — Details about enemy boundary constraints
- `GAMEPLAY-IMPROVEMENTS.md` — Gameplay balance improvements
- `TEST-RESULTS.md` — Test suite results

## 🎨 Technologies Used

- **HTML5** — Canvas API for rendering
- **JavaScript (ES6+)** — Game logic and mechanics
- **CSS3** — Responsive styling
- **Git** — Version control

## 📈 Future Improvements

- [ ] Sound effects and background music
- [ ] Particle effects for explosions
- [ ] Power-ups and special weapons
- [ ] Multiple game modes (Survival, etc.)
- [ ] Leaderboard system
- [ ] Mobile touch controls
- [ ] Environmental obstacles

## 📄 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Found a bug or have a suggestion? Feel free to open an issue or fork the repository!

## 👨‍💻 Author

**wudijunlangdadi** — GitHub

---

**Enjoy the game! 🎮** Destroy all enemy tanks and master the battlefield!
