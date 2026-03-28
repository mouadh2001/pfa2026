import { LEVELS } from "../data/levelConfigs.js";

export default class LabScene extends Phaser.Scene {
  constructor() {
    super({ key: "LabScene" });
  }

  preload() {
    this.load.image("lab", "../assets/background/scene1.png");
  }

  create() {
    this.bg = this.add.image(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      "lab",
    );

    this.levelButtons = [];
    const levels = Object.values(LEVELS);
    const completedLevels = this.getCompletedLevels();

    levels.forEach((level, index) => {
      const isUnlocked =
        index === 0 || completedLevels.includes(levels[index - 1].key);
      const titleText = isUnlocked ? level.title : `${level.title} 🔒`;
      const button = this.add
        .text(this.cameras.main.centerX, 180 + index * 90, titleText, {
          fontSize: "32px",
          color: isUnlocked ? "#ffffff" : "#aaaaaa",
          backgroundColor: isUnlocked ? "#00000099" : "#22222299",
          padding: { x: 18, y: 12 },
          align: "center",
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: isUnlocked })
        .on("pointerover", () => {
          if (isUnlocked) button.setStyle({ fill: "#00ff00" });
        })
        .on("pointerout", () => {
          button.setStyle({ fill: isUnlocked ? "#ffffff" : "#aaaaaa" });
        })
        .on("pointerdown", () => {
          if (!isUnlocked) {
            this.showLockedLevelMessage();
            return;
          }
          this.scene.start("GameScene", { levelKey: level.key });
        });

      this.levelButtons.push(button);
    });

    this.levelInstructions = this.add
      .text(this.cameras.main.centerX, 90, "Choose a level to start", {
        fontSize: "28px",
        color: "#ffffff",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);

    this.scale.on("resize", this.resize, this);
    this.resize({ width: this.scale.width, height: this.scale.height });
  }

  resize(gameSize) {
    if (!this.bg) return;

    const width = this.scale.width;
    const height = this.scale.height;

    // Center background
    this.bg.setPosition(width / 2, height / 2);

    // Scale background to fit screen
    const scale = Math.min(width / this.bg.width, height / this.bg.height);
    this.bg.setScale(scale);

    if (this.levelInstructions) {
      this.levelInstructions.setPosition(width / 2, 90);
    }

    if (this.levelButtons) {
      this.levelButtons.forEach((button, index) => {
        button.setPosition(width / 2, 180 + index * 90);
      });
    }
  }

  getCompletedLevels() {
    try {
      return JSON.parse(localStorage.getItem("completedLevels") || "[]");
    } catch (err) {
      console.warn("Failed to parse completedLevels", err);
      return [];
    }
  }

  showLockedLevelMessage() {
    if (!this.levelInstructions) return;
    const previousText = this.levelInstructions.text;
    this.levelInstructions.setText(
      "Complete the previous level to unlock this one.",
    );
    this.time.delayedCall(
      2000,
      () => {
        if (this.levelInstructions) {
          this.levelInstructions.setText(previousText);
        }
      },
      [],
    );
  }
}
