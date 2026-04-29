export default class TutorialScene extends Phaser.Scene {
  constructor() {
    super({ key: "TutorialScene" });
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x111111);

    this.pages = [
      {
        title: "Welcome to PathQuest!",
        text: "This a educational game you will have to answers question during your juerny throught the game",
        image: "", // Assuming character 'walk' image was preloaded in loadingScene
      },
      {
        title: "Scopes",
        text: "In each level you will answer 7 questions\n\nThe question will pop up when you tutch the scope\n\nEach time you answer wrongly you will respown\n\nthe next scope apears only if you answer correctly",
        image: "",
      },
      {
        title: "Threats",
        text: "You will have 3 lives when you got 0 the level will be restarted\n\nThe threats are:\n\nDead cells don't let them tutch you!\n\nThe only way to kill them is by jumping over them",
        image: "",
      },
    ];

    this.currentPageIndex = 0;

    // UI Elements
    this.titleText = this.add
      .text(width / 2, height / 2 - 180, "", {
        fontSize: "36px",
        fontStyle: "bold",
        fill: "#00ffcc",
        align: "center",
      })
      .setOrigin(0.5);

    this.contentText = this.add
      .text(width / 2, height / 2 + 20, "", {
        fontSize: "22px",
        fill: "#ffffff",
        align: "center",
        wordWrap: { width: 800 },
      })
      .setOrigin(0.5);

    this.imageSprite = this.add
      .image(width / 2, height / 2 - 80, "")
      .setOrigin(0.5);

    // Indicator (Page 1/3)
    this.indicatorText = this.add
      .text(width / 2, height - 120, "", {
        fontSize: "18px",
        fill: "#888888",
      })
      .setOrigin(0.5);

    // Buttons
    this.prevButton = this.createButton(
      width / 2 - 150,
      height - 60,
      "Précédent",
      () => this.prevPage(),
    );
    this.nextButton = this.createButton(
      width / 2 + 150,
      height - 60,
      "Suivant",
      () => this.nextPage(),
    );

    // Skip Button (Top Right)
    this.skipButton = this.createButton(
      width - 120,
      60,
      "Passer",
      () => this.finishTutorial(),
      "#555555",
      "#888888",
    );

    this.renderPage();
  }

  createButton(
    x,
    y,
    text,
    callback,
    bgColor = "#0066aa",
    hoverColor = "#0099ff",
  ) {
    const btn = this.add
      .text(x, y, text, {
        fontSize: "24px",
        fill: "#ffffff",
        backgroundColor: bgColor,
        padding: { x: 20, y: 10 },
        align: "center",
        borderRadius: 5,
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => btn.setStyle({ backgroundColor: hoverColor }))
      .on("pointerout", () => btn.setStyle({ backgroundColor: bgColor }))
      .on("pointerdown", callback);

    return btn;
  }

  renderPage() {
    const page = this.pages[this.currentPageIndex];

    this.titleText.setText(page.title);
    this.contentText.setText(page.text);

    if (page.image) {
      this.imageSprite.setTexture(page.image);
      this.imageSprite.setVisible(true);
      this.imageSprite.setScale(2); // scale up items if needed
    } else {
      this.imageSprite.setVisible(false);
    }

    this.indicatorText.setText(
      `Page ${this.currentPageIndex + 1} / ${this.pages.length}`,
    );

    // Toggle button visibility
    this.prevButton.setVisible(this.currentPageIndex > 0);

    if (this.currentPageIndex === this.pages.length - 1) {
      this.nextButton.setText("Jouer !");
      this.nextButton.setStyle({ backgroundColor: "#00aa44" });
    } else {
      this.nextButton.setText("Suivant");
      this.nextButton.setStyle({ backgroundColor: "#0066aa" });
    }
  }

  nextPage() {
    if (this.currentPageIndex < this.pages.length - 1) {
      this.currentPageIndex++;
      this.renderPage();
    } else {
      this.finishTutorial();
    }
  }

  prevPage() {
    if (this.currentPageIndex > 0) {
      this.currentPageIndex--;
      this.renderPage();
    }
  }

  finishTutorial() {
    // Optionally: localStorage.setItem('tutorialSeen', 'true');
    this.scene.start("LabScene");
  }
}
