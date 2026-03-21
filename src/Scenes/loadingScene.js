export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super({"key": "PreloaderScene"});
  }

  preload() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 🖤 Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a0a);

    // 🧠 Title
    const title = this.add
      .text(width / 2, height / 2 - 120, "LOADING", {
        fontSize: "28px",
        fill: "#ffffff",
        fontStyle: "bold",
        letterSpacing: "4px",
      })
      .setOrigin(0.5);

    // ✨ Loading text
    const loadingText = this.add
      .text(width / 2, height / 2 - 50, "Initializing...", {
        fontSize: "18px",
        fill: "#aaaaaa",
      })
      .setOrigin(0.5);

    // 🔢 Percentage text
    const percentText = this.add
      .text(width / 2, height / 2 + 30, "0%", {
        fontSize: "20px",
        fill: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // ⬛ Progress box (background)
    const progressBox = this.add
      .rectangle(width / 2, height / 2, 320, 30, 0x222222)
      .setOrigin(0.5);

    // 🟩 Progress bar
    const progressBar = this.add
      .rectangle(width / 2 - 150, height / 2, 0, 20, 0x00ffcc)
      .setOrigin(0, 0.5);

    // 🎬 Smooth animation (title pulse)
    this.tweens.add({
      targets: title,
      alpha: 0.6,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // 📊 Progress update
    this.load.on("progress", (value) => {
      const percent = Math.floor(value * 100);

      progressBar.width = 300 * value;
      percentText.setText(percent + "%");

      // Change messages dynamically
      if (percent < 30) {
        loadingText.setText("Loading assets...");
      } else if (percent < 70) {
        loadingText.setText("Preparing environment...");
      } else if (percent < 100) {
        loadingText.setText("Almost ready...");
      }
    });

    // ✅ When complete
    this.load.on("complete", () => {
      loadingText.setText("Ready!");

      // Smooth transition
      this.tweens.add({
        targets: [progressBar, progressBox, loadingText, percentText, title],
        alpha: 0,
        duration: 500,
        onComplete: () => {
          this.scene.start("LabScene");
        },
      });
    });

    // 🔥 LOAD YOUR ASSETS BELOW (keep yours)
    this.load.image("bg", "../assets/background.png");

    this.load.image("idel", "../assets/idel1.png");
    this.load.image("walk", "../assets/walk1.png");
    this.load.image("jump", "../assets/jump1.png");
    this.load.image("jumpOut", "../assets/jump2.png");

    this.load.image("idel_m", "../assets/idel2.png");
    this.load.image("walk_m", "../assets/walk2.png");
    this.load.image("jump_m", "../assets/jump3.png");
    this.load.image("jumpOut_m", "../assets/jump4.png");

    this.load.image("scope", "../assets/scope.png");
    this.load.image("loupe", "../assets/loupe.png");
    this.load.image("tumor", "../assets/tumeur.jpg");
    this.load.image("platforme", "../assets/platforme.png");
    this.load.image("enemy", "../assets/enemy1.png");
    this.load.image("golden", "../assets/golden.png");

    this.load.audio("bgMusic", "../sounds/background.wav");
    this.load.audio("jumpSfx", "../sounds/jumpin.wav");
    this.load.audio("landSfx", "../sounds/runing.wav");
    this.load.audio("runSfx", "../sounds/runing.wav");
    this.load.audio("deathSfx", "../sounds/death.wav");
    this.load.audio("correctSfx", "../sounds/correct.wav");
    this.load.audio("wrongSfx", "../sounds/wrong.wav");
    this.load.audio("scopeSfx", "../sounds/scope.wav");
    this.load.audio("loupeSfx", "../sounds/loupe.mp3");
  }
}


