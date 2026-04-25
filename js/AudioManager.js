// Audio Manager for Tank Battle Game
class AudioManager {
  constructor() {
    this.sounds = new Map();
    this.enabled = true;
    this.masterVolume = 1.0;
  }

  /**
   * Load and cache an audio file
   * @param {string} name - Sound name identifier
   * @param {string} path - Path to audio file
   */
  loadSound(name, path) {
    try {
      const audio = new Audio(path);
      audio.volume = this.masterVolume;
      this.sounds.set(name, audio);
    } catch (error) {
      console.warn(`Failed to load sound: ${name}`, error);
    }
  }

  /**
   * Play a sound effect
   * @param {string} name - Sound name to play
   * @param {number} volume - Optional volume override (0-1)
   */
  play(name, volume = this.masterVolume) {
    if (!this.enabled) return;

    const audio = this.sounds.get(name);
    if (!audio) {
      console.warn(`Sound not found: ${name}`);
      return;
    }

    try {
      // Clone audio to allow multiple simultaneous plays
      const clone = audio.cloneNode();
      clone.volume = volume * this.masterVolume;
      clone.play().catch(error => {
        console.warn(`Failed to play sound: ${name}`, error);
      });
    } catch (error) {
      console.warn(`Error playing sound: ${name}`, error);
    }
  }

  /**
   * Stop a sound
   * @param {string} name - Sound name to stop
   */
  stop(name) {
    const audio = this.sounds.get(name);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  /**
   * Toggle all sounds on/off
   * @param {boolean} enabled - Whether sounds should be enabled
   */
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  /**
   * Set master volume
   * @param {number} volume - Volume level (0-1)
   */
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    for (const audio of this.sounds.values()) {
      audio.volume = this.masterVolume;
    }
  }

  /**
   * Check if sounds are enabled
   * @returns {boolean}
   */
  isEnabled() {
    return this.enabled;
  }

  /**
   * Get all loaded sound names
   * @returns {string[]}
   */
  getLoadedSounds() {
    return Array.from(this.sounds.keys());
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AudioManager;
}
