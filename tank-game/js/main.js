// Tank Battle Game - Main Entry Point

document.addEventListener('DOMContentLoaded', () => {
    console.log('Tank Battle Game Initializing...');

    // Initialize audio manager (optional)
    let audioManager = null;
    if (typeof AudioManager !== 'undefined') {
        audioManager = new AudioManager();
        // Note: Load your sound files here
        // audioManager.loadSound('shoot', 'assets/sounds/shoot.mp3');
        // audioManager.loadSound('explosion', 'assets/sounds/explosion.mp3');
        // audioManager.loadSound('hit', 'assets/sounds/hit.mp3');
        console.log('Audio system ready (no sounds loaded)');
    }

    // Debug: Check global classes
    console.log('Checking global classes...');
    console.log('Vector2:', typeof Vector2);
    console.log('Tank:', typeof window.Tank);
    console.log('Bullet:', typeof window.Bullet);
    console.log('InputHandler:', typeof InputHandler);
    console.log('Game:', typeof Game);
    console.log('AudioManager:', typeof AudioManager);

    // Game Elements
    const canvas = document.getElementById('gameCanvas');
    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseBtn');
    const resumeButton = document.getElementById('resumeButton');
    const restartButton = document.getElementById('restartButton');
    const retryButton = document.getElementById('retryButton');
    const nextLevelButton = document.getElementById('nextLevelButton');
    const soundButton = document.getElementById('soundBtn');
    const helpButton = document.getElementById('helpBtn');

    // UI Elements
    const scoreElement = document.getElementById('score');
    const livesElement = document.getElementById('lives');
    const levelElement = document.getElementById('level');
    const enemiesElement = document.getElementById('enemies');
    const finalScoreElement = document.getElementById('finalScore');
    const levelScoreElement = document.getElementById('levelScore');
    const levelDisplay = document.getElementById('levelDisplay');
    const remainingEnemies = document.getElementById('remainingEnemies');
    const totalScore = document.getElementById('totalScore');

    // Menu Overlays
    const startMenu = document.getElementById('startMenu');
    const pauseMenu = document.getElementById('pauseMenu');
    const gameOverMenu = document.getElementById('gameOverMenu');
    const levelCompleteMenu = document.getElementById('levelCompleteMenu');

    // Game Instance
    let game = null;

    // Initialize Game
    function initGame() {
        if (game) {
            game.destroy();
        }

        game = new Game(canvas);

        // Attach audio manager if available
        if (audioManager) {
            game.setAudioManager(audioManager);
        }

        // Set up game event listeners
        game.onScoreUpdate = (score) => {
            scoreElement.textContent = score;
            totalScore.textContent = score;
        };

        game.onLivesUpdate = (lives) => {
            livesElement.textContent = lives;
        };

        game.onLevelUpdate = (level) => {
            levelElement.textContent = level;
            levelDisplay.textContent = level;
        };

        game.onEnemiesUpdate = (enemies) => {
            enemiesElement.textContent = enemies;
            remainingEnemies.textContent = enemies;
        };

        game.onEnemiesUpdate = (enemies) => {
            enemiesElement.textContent = enemies;
        };

        game.onGameOver = (score) => {
            finalScoreElement.textContent = score;
            gameOverMenu.classList.remove('hidden');
        };

        game.onLevelComplete = (score) => {
            levelScoreElement.textContent = score;
            // 也显示完成的关卡数
            document.getElementById('completedLevel').textContent = game.level;
            levelCompleteMenu.classList.remove('hidden');
        };

        console.log('Game initialized successfully');
    }

    // Event Listeners
    startButton.addEventListener('click', () => {
        startMenu.classList.add('hidden');
        initGame();
        game.start();
    });

    pauseButton.addEventListener('click', () => {
        if (game && game.gameState === 'playing') {
            game.pause();
            pauseMenu.classList.remove('hidden');
        }
    });

    resumeButton.addEventListener('click', () => {
        if (game) {
            game.resume();
            pauseMenu.classList.add('hidden');
        }
    });

    restartButton.addEventListener('click', () => {
        if (game) {
            game.restartLevel();
            pauseMenu.classList.add('hidden');
            game.start();
        }
    });

    retryButton.addEventListener('click', () => {
        gameOverMenu.classList.add('hidden');
        initGame();
        game.start();
    });

    nextLevelButton.addEventListener('click', () => {
        levelCompleteMenu.classList.add('hidden');
        if (game) {
            game.nextLevel();
            game.start();
        }
    });

    soundButton.addEventListener('click', () => {
        if (!audioManager) {
            console.warn('Audio system not available');
            return;
        }

        const soundOn = audioManager.isEnabled();
        if (soundOn) {
            audioManager.setEnabled(false);
            soundButton.innerHTML = '<i class="fas fa-volume-mute"></i> SOUND OFF';
            console.log('Sound disabled');
        } else {
            audioManager.setEnabled(true);
            soundButton.innerHTML = '<i class="fas fa-volume-up"></i> SOUND ON';
            console.log('Sound enabled');
        }
    });

    helpButton.addEventListener('click', () => {
        alert('TANK BATTLE GAME CONTROLS:\n\n' +
              'W / ↑ - Move Up\n' +
              'S / ↓ - Move Down\n' +
              'A / ← - Move Left\n' +
              'D / → - Move Right\n' +
              'SPACE - Fire Bullet\n' +
              'P - Pause Game\n\n' +
              'OBJECTIVE:\n' +
              'Destroy all enemy tanks in each level while avoiding their bullets.');
    });

    // Keyboard shortcuts for menus
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (game && game.gameState === 'playing') {
                game.pause();
                pauseMenu.classList.remove('hidden');
            } else if (game && game.gameState === 'paused') {
                game.resume();
                pauseMenu.classList.add('hidden');
            }
        }
    });

    // Initialize UI with default values
    scoreElement.textContent = '0';
    livesElement.textContent = '3';
    levelElement.textContent = '1';
    enemiesElement.textContent = '5';

    console.log('Tank Battle Game UI initialized');
});