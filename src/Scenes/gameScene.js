import LabScene from "./labScene.js";
import PreloaderScene from "./loadingScene.js";
import {
  createFloor,
  createPlatformRelative,
} from "../gameObjects/platforms.js";
import { EnemyManager } from "../gameObjects/enemies.js";
import { ItemManager } from "../gameObjects/items.js";
import { ModalUI } from "../gameObjects/modal.js";
import { PlayerController } from "../gameObjects/player.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  create() {
    // ===== CANVAS SCALING MONITORING =====
    console.log("📐 Game Canvas Scaling:");
    console.log(`  Game Resolution: ${this.scale.width}x${this.scale.height}`);
    console.log(
      `  Display Size: ${this.cameras.main.displayWidth}x${this.cameras.main.displayHeight}`,
    );
    console.log(`  Device Pixel Ratio: ${window.devicePixelRatio}`);
    console.log(
      `  Canvas Size: ${this.game.canvas.width}x${this.game.canvas.height}`,
    );
    console.log(`  Viewport: ${window.innerWidth}x${window.innerHeight}`);

    // Listen for scale changes
    this.scale.on("resize", (gameSize) => {
      console.log(`📐 Canvas Resized: ${gameSize.width}x${gameSize.height}`);
    });

    this.scale.on("orientationchange", (orientation) => {
      console.log(`📱 Orientation Changed: ${orientation}`);
    });

    // shared globals
    this.popupOpen = false;
    this.hasLoupe = false;
    this.canShowWarning = true;
    this.correctcount = 0;
    this.incorrectcount = 0;
 

    this.physics.world.gravity.y = 1300;
    const worldWidth = 1320;
    // Keep world height consistent across devices (uses configured game height)
    const worldHeight = this.sys.game.config.height;
    //progressbar
    this.progressBar = this.add.rectangle(
      400,
      30,
      this.correctcount,
      20,
      0x00ff00,
    );
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

    // 1. Background
    let bg = this.add.image(0, 0, "bg").setOrigin(0, 0);
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
    createPlatformRelative(this, 400, 100, 150, 20, "q1"); //1st q platform
    createPlatformRelative(this, 700, 130, 150, 20, "q2"); //2nd q platform
    createPlatformRelative(this, 1200, 100, 150, 20, "q3"); //loupe q platform
    createPlatformRelative(this, 950, 300, 150, 20, "loupe"); //loupe platform
    createPlatformRelative(this, 150, 130, 150, 20, "pass"); //pass to enemy platform
    createPlatformRelative(this, 530, 300, 400, 20, "enemy"); //enemy platform
    createPlatformRelative(this, 200, 410, 400, 20, "q4"); //q4 enemy platform
    createPlatformRelative(this, 800, 410, 150, 20, "q5"); //q5 platform
    createPlatformRelative(this, 950, 410, 150, 20, "void"); //void platform
    createPlatformRelative(this, 1175, 410, 300, 20, "q7"); //q7 platform
    createPlatformRelative(this, 870, 155, 20, 310, "block"); //block platform

    // 3. Player
    this.playerController = new PlayerController(this);
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
    this.itemManager.addScopeRelative(950, 340, "q1", false);
    this.itemManager.addScopeRelative(550, 50, "q2", false);
    this.itemManager.addScopeRelative(700, 170, "q3", false);
    this.itemManager.addScopeRelative(100, 450, "q4", false);
    this.itemManager.addScopeRelative(1250, 450, "q6", false);
    this.itemManager.addScopeRelative(800, 450, "q5", false);
    this.itemManager.addScopeLoopRelative(1200, 140, "q7", true);
    this.itemManager.addLoupeRelative(400, 140);
    this.itemManager.addLoupeRelative(1200, 30);

    // 6. Enemies
    this.enemies = this.physics.add.group();
    this.enemyManager = new EnemyManager(this);
    this.enemyManager.createEnemyRelative(530, 330, 400, 100, "E1");
    this.enemyManager2 = new EnemyManager(this);
    this.enemyManager2.createEnemyRelative(500, 40, 700, 100, "E2");
    this.enemyManager3 = new EnemyManager(this);
    this.enemyManager3.createEnemyRelative(210, 440, 400, 100, "E3");
    this.enemyManager4 = new EnemyManager(this);
    this.enemyManager4.createEnemyRelative(1020, 440, 550, 100, "E4");
    this.enemyManager5 = new EnemyManager(this);
    this.enemyManager5.createEnemyRelative(1100, 40, 400, 100, "E5");

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

  update() {
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

    // Optional: Hide buttons on game over
    this.events.on("shutdown", () => {
      const controlsPanel = document.getElementById("controls-panel");
      if (controlsPanel) {
        controlsPanel.style.display = "none";
      }
    });
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
