import LabScene from "./labScene.js";
import PreloaderScene from "./loadingScene.js";
import {
  createFloor,
  createPlatformFromConfig,
  raisePlatform,
  updatePlatformMovement,
} from "../gameObjects/platforms.js";
import { EnemyManager } from "../gameObjects/enemies.js";
import { ItemManager } from "../gameObjects/items.js";
import { ModalUI } from "../gameObjects/modal.js";
import { PlayerController } from "../gameObjects/player.js";
import { StatsService } from "../../statsService.js";
import { LEVELS } from "../data/levelConfigs.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  create() {
    this.onScaleResize = this.resize.bind(this);
    this.onOrientationChange = (orientation) => {
      console.log(`📱 Orientation Changed: ${orientation}`);
    };
    this.scale.on("resize", this.onScaleResize);
    this.scale.on("orientationchange", this.onOrientationChange);
    this.StatsService = new StatsService();

    // shared globals
    this.popupOpen = false;
    this.hasLoupe = false;
    this.canShowWarning = true;
    this.correctcount = 0;
    this.incorrectcount = 0;

    // Set level data from the selected config
    this.levelKey = this.scene.settings.data?.levelKey || "level1";
    this.StatsService.levelKey = this.levelKey;
    if (!this.isLevelUnlocked(this.levelKey)) {
      console.warn(
        `Level ${this.levelKey} is locked. Returning to level select.`,
      );
      this.scene.start("LabScene");
      return;
    }

    this.levelPreviouslyCompleted = this.getCompletedLevels().includes(
      this.levelKey,
    );

    this.levelConfig = LEVELS[this.levelKey] || LEVELS.level1;
    this.levelData = this.levelConfig.questionData;
    this.questionSequence = this.levelConfig.sequence;

    // Register event listeners for modal interactions
    this.events.on("qcm_success", this.handleQCMSuccess, this);
    this.events.on("qcm_wrong", this.handleQCMWrong, this);

    this.physics.world.gravity.y = 1300;
    const worldWidth = 1320;
    // Keep world height consistent across devices (uses configured game height)
    const worldHeight = this.sys.game.config.height;
    //progressbar
    this.progressBar = this.add.rectangle(
      380,
      30,
      this.correctcount,
      20,
      0x00ff00,
    );

    // 3. Set origin to the LEFT-CENTER.
    // This anchors the left side at X=400.
    this.progressBar.setScrollFactor(0);
    this.progressBar.setOrigin(0, 0.5);
    this.progressBar.setDepth(2000);
    //Savois acquis
    this.savois = this.add
      .text(150, 20, "|  Savoir acquis:", {
        fontSize: "22px",
        fill: "#ffffff",
        fontStyle: "bold",
      })
      .setScrollFactor(0)
      .setDepth(2000);
    this.scoreText = this.add
      .text(540, 20, "| Score: " + this.StatsService.getScore(), {
        fontSize: "22px",
        fill: "#ffffff",
        fontStyle: "bold",
      })
      .setScrollFactor(0)
      .setDepth(2000);

    // 1. Background
    const bgKey = this.levelConfig.backgroundKey || "bg";
    let bg = this.add.image(0, 0, bgKey).setOrigin(0, 0);
    bg.setDepth(0);
    let scale = Math.max(
      this.cameras.main.width / bg.width,
      this.cameras.main.height / bg.height,
    );
    bg.setScale(scale).setScrollFactor(0);
    const floorOffsetFromBottom = 310;
    this.floorY = bg.displayHeight - floorOffsetFromBottom * scale;

    // 2. Platforms
    this.platforms = this.physics.add.staticGroup();
    createFloor(this, worldWidth / 2, this.floorY, worldWidth, 40);
    this.levelConfig.platforms.forEach((platform) => {
      createPlatformFromConfig(this, platform);
    });

    // 3. Player
    this.playerController = new PlayerController(this, this.levelConfig.spawn);
    this.playerController.create();

    // 4. Camera & World
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // ===== KEYBOARD INPUT =====
    this.cursors = this.input.keyboard.createCursorKeys();

    // ===== TOUCH INPUT INITIALIZATION =====
    this.touchInput = {
      left: false,
      right: false,
      jump: false,
    };

    // ===== SETUP HTML BUTTON CONTROLS =====
    this.setupButtonControls();

    // 5. Items & Flags
    this.itemManager = new ItemManager(this);
    this.levelConfig.items.forEach((itemConfig) => {
      if (itemConfig.type === "scope") {
        this.itemManager.addScopeRelative(
          itemConfig.x,
          itemConfig.y,
          itemConfig.questionId,
          itemConfig.locked ?? false,
        );
      } else if (itemConfig.type === "scopeLoop") {
        this.itemManager.addScopeLoopRelative(
          itemConfig.x,
          itemConfig.y,
          itemConfig.questionId,
          itemConfig.locked ?? false,
        );
      } else if (itemConfig.type === "loupe") {
        this.itemManager.addLoupeRelative(itemConfig.x, itemConfig.y);
      }
    });

    const firstQuestionId = this.questionSequence[0];
    this.itemManager.items.getChildren().forEach((item) => {
      if (!item.isLoupe && item.questionId !== firstQuestionId) {
        item.disableBody(true, true);
      }
    });

    // 6. Enemies
    this.enemies = this.physics.add.group();
    this.enemyManager = new EnemyManager(this);
    this.levelConfig.enemies.forEach((enemyConfig) => {
      this.enemyManager.createEnemyRelative(
        enemyConfig.x,
        enemyConfig.y,
        enemyConfig.range,
        enemyConfig.speed,
        enemyConfig.name,
      );
    });

    // overlaps
    this.physics.add.overlap(
      this.player,
      this.itemManager.items,
      this.itemManager.handleItemCollision,
      null,
      this.itemManager,
    );
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.enemyManager.handleCollision,
      null,
      this.enemyManager,
    );

    // modal/UI helper
    this.modal = new ModalUI(this);
    this.modal.createHTMLModal();

    // 7. Audio
    this.bgMusic = this.sound.add("bgMusic", { loop: true, volume: 0.3 });
    this.bgMusic.play();
  }

  update(time, delta) {
    if (this.popupOpen) return;

    // ===== COMBINE KEYBOARD + TOUCH INPUT =====
    const activeCursors = {
      left: { isDown: this.cursors.left.isDown || this.touchInput.left },
      right: { isDown: this.cursors.right.isDown || this.touchInput.right },
      up: { isDown: this.cursors.up.isDown || this.touchInput.jump },
      down: { isDown: this.cursors.down.isDown || this.touchInput.down },
    };

    this.playerController.update(activeCursors);
    this.enemyManager.update();
    updatePlatformMovement(this, delta);
  }

  // ===== SETUP HTML BUTTON CONTROLS =====
  setupButtonControls() {
    const self = this;

    // Show the controls panel
    const controlsPanel = document.getElementById("controls-panel");
    if (controlsPanel) {
      controlsPanel.style.display = "flex";
      console.log("✓ Control buttons displayed");
    }

    // Create global GameControls object
    window.GameControls = {
      pressLeft: () => {
        self.touchInput.left = true;
        console.log("← Button: LEFT pressed");
      },
      releaseLeft: () => {
        self.touchInput.left = false;
        console.log("← Button: LEFT released");
      },
      pressRight: () => {
        self.touchInput.right = true;
        console.log("→ Button: RIGHT pressed");
      },
      releaseRight: () => {
        self.touchInput.right = false;
        console.log("→ Button: RIGHT released");
      },
      pressJump: () => {
        self.touchInput.jump = true;
        console.log("⬆️ Button: JUMP pressed");
      },
      releaseJump: () => {
        self.touchInput.jump = false;
        console.log("⬆️ Button: JUMP released");
      },
    };

    // Optional: Hide buttons on game over and cleanup scene resources
    this.events.on("shutdown", () => {
      const controlsPanel = document.getElementById("controls-panel");
      if (controlsPanel) {
        controlsPanel.style.display = "none";
      }
      if (this.bgMusic) {
        this.bgMusic.stop();
      }
      if (this.onScaleResize) {
        this.scale.off("resize", this.onScaleResize);
      }
      if (this.onOrientationChange) {
        this.scale.off("orientationchange", this.onOrientationChange);
      }
      this.events.off("qcm_success", this.handleQCMSuccess, this);
      this.events.off("qcm_wrong", this.handleQCMWrong, this);
    });
  }

  // ===== LEVEL SPECIFIC DOMAIN LOGIC =====
  async handleQCMSuccess(id) {
    this.StatsService.addCorrect(id);
    if (this.scoreText) {
      this.scoreText.setText("| Score: " + this.StatsService.getScore());
    }
    // Score update
    this.correctcount += 20;
    this.progressBar.width = this.correctcount;

    // Sequence for questions
    const sequence = this.questionSequence;
    const currentIndex = sequence.indexOf(id);
    if (currentIndex !== -1 && currentIndex < sequence.length - 1) {
      const nextId = sequence[currentIndex + 1];
      const nextScope = this.itemManager.items
        .getChildren()
        .find((item) => item.questionId === nextId);
      if (nextScope) {
        nextScope.enableBody(false, nextScope.x, nextScope.y, true, true);
        this.tweens.add({
          targets: nextScope,
          scale: 0.3,
          duration: 300,
          yoyo: true,
          onComplete: () => nextScope.setScale(0.2),
        });
      }
    } else if (id === sequence[sequence.length - 1]) {
      // Level completed! Save progress, push stats, then go to next level.
      this.saveCompletedLevel(this.levelKey);
      console.log("🎉 Level Complete!");

      console.log("🎉 Pushing stats for this level...");
      await this.StatsService.pushStats();

      const nextLevelKey = this.getNextLevelKey(this.levelKey);
      if (nextLevelKey) {
        this.modal.showInfoMessage(
          "🎉 Level Complete! Loading next level...",
          false,
          0,
        );
        this.time.delayedCall(
          2500,
          () => {
            this.modal.closeModal();
            this.scene.restart({ levelKey: nextLevelKey });
          },
          [],
        );
      } else {
        this.modal.showInfoMessage(
          "🎉 All levels complete! Well done.",
          true,
          3000,
        );
      }
    }

    const scope = this.currentScope;

    // Default behavior → destroy scope
    if (scope) {
      scope.destroy();
      this.currentScope = null; // 🔥 important
    }
    // ✅ Platform logic stays unchanged
    const passPlatformConfig = this.levelConfig.platforms.find(
      (p) => p.id === "pass",
    );
    if (passPlatformConfig?.movement?.type === "raise") {
      raisePlatform(
        this,
        "pass",
        passPlatformConfig.movement.targetHeightAboveFloor,
        passPlatformConfig.movement.step,
      );
    }
    if (id === "q5") {
      const voidPlatform = this.platforms
        .getChildren()
        .find((p) => p.id === "void");
      if (voidPlatform) voidPlatform.destroy();
    }
  }

  handleQCMWrong(id) {
    this.playerController.respawn();
    this.incorrectcount++;

    if (this.incorrectcount == 1) {
      this.enemyManager.increaseEnemySpeedByName("E1", 50);
      this.enemyManager.increaseEnemySpeedByName("E5", 50);
    } else if (this.incorrectcount == 2) {
      this.enemyManager.duplicateEnemyByName("E1", "E5");
    } else if (this.incorrectcount == 3) {
      this.enemyManager.increaseEnemySpeedByName("E3", 50);
    } else if (this.incorrectcount == 4) {
      this.enemyManager.increaseEnemySpeedByName("E4", 50);
    }

    this.StatsService.addIncorrect(id);
    if (this.scoreText) {
      this.scoreText.setText("| Score: " + this.StatsService.getScore());
    }
  }

  resize(gameSize) {
    const width = gameSize?.width || this.scale.width;
    const height = gameSize?.height || this.scale.height;
    console.log(`📐 Canvas Resized: ${width}x${height}`);
    // TODO: update UI and layout when needed for responsive scaling.
  }

  getCompletedLevels() {
    try {
      return JSON.parse(localStorage.getItem("completedLevels") || "[]");
    } catch (err) {
      console.warn("Failed to parse completedLevels", err);
      return [];
    }
  }

  saveCompletedLevel(levelKey) {
    const completed = new Set(this.getCompletedLevels());
    if (!completed.has(levelKey)) {
      completed.add(levelKey);
      localStorage.setItem(
        "completedLevels",
        JSON.stringify(Array.from(completed)),
      );
    }
  }

  getNextLevelKey(levelKey) {
    const levels = Object.values(LEVELS);
    const index = levels.findIndex((level) => level.key === levelKey);
    if (index === -1 || index >= levels.length - 1) return null;
    return levels[index + 1].key;
  }

  isLevelUnlocked(levelKey) {
    const levels = Object.values(LEVELS);
    const index = levels.findIndex((level) => level.key === levelKey);
    if (index <= 0) return index === 0;
    const previousLevelKey = levels[index - 1].key;
    return this.getCompletedLevels().includes(previousLevelKey);
  }
}

const config = {
  // ===== RENDERER OPTIMIZATION =====
  type: Phaser.WEBGL,
  render: {
    pixelArt: true,
    antialias: false,
    antialiasGL: false,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    roundPixels: true,
    clearBeforeRender: true,
    maxLights: 8, // Limit lights for mobile
  },

  // ===== FIXED GAME RESOLUTION (16:9 aspect ratio) =====
  width: 1280,
  height: 720,

  // ===== PHYSICS SETTINGS =====
  physics: {
    default: "arcade",
    arcade: {
      debug: false, // Disabled for production
      gravity: { y: 1300 },
      tileBias: 16,
      debugShowBody: false,
      debugShowStaticBody: false,
      debugShowVelocity: false,
      timeScale: 1,
    },
  },

  // ===== SCALE & RESPONSIVE (WITH FIXED ASPECT RATIO) =====
  scale: {
    parent: "game-container",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    orientation: Phaser.Scale.Orientation.LANDSCAPE,
    expandParent: false,
    aspectRatio: 16 / 9,
    min: {
      width: 480,
      height: 270, // Maintains 16:9 ratio
    },
    max: {
      width: 1920,
      height: 1080, // Maintains 16:9 ratio
    },
    fullscreenTarget: "game-container",
  },

  // ===== PERFORMANCE OPTIMIZATION =====
  dom: {
    createContainer: true,
  },

  // ===== SCENES =====
  scene: [PreloaderScene, LabScene, GameScene],

  // ===== AUDIO OPTIMIZATION =====
  audio: {
    disableWebAudio: false,
    noAudio: false,
  },

  // ===== INPUT OPTIMIZATION =====
  input: {
    touchGestureEnabled: false,
    keyboard: true,
  },
};
let game = null;
export function startGame() {
  if (!game) {
    game = new Phaser.Game(config);
  }
}

//checkpoint tt
