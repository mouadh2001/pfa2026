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
        title: "Bienvenue dans Patho Quest",
        text: "Dans ce laboratoire, vous devez analyser des échantillons.\n\nUtilisez les flèches directionnelles de votre clavier pour vous déplacer.\n\n⌨️ GAUCHE / DROITE pour marcher.\n⌨️ HAUT pour sauter.",
        image: "" // Assuming character 'walk' image was preloaded in loadingScene
      },
      {
        title: "Les Échantillons",
        text: "Pour avancer, vous devez répondre à des QCM.\n\nApprochez-vous d'un microscope en jeu, et touchez-le pour ouvrir la question.\n\nRépondez correctement (du 1er coup) pour accumuler le maximum de points !",
        image: ""
      },
      {
        title: "Les Dangers",
        text: "Attention au vide et aux ennemis bio-organiques !\n\nSi vous tombez ou touchez un ennemi, vous perdrez un essai.\n\nAstuce : Cherchez la loupe cachée pour obtenir des indices cruciaux.",
        image: ""
      }
    ];

    this.currentPageIndex = 0;

    // UI Elements
    this.titleText = this.add.text(width / 2, height / 2 - 180, "", {
      fontSize: "36px",
      fontStyle: "bold",
      fill: "#00ffcc",
      align: "center"
    }).setOrigin(0.5);

    this.contentText = this.add.text(width / 2, height / 2 + 20, "", {
      fontSize: "22px",
      fill: "#ffffff",
      align: "center",
      wordWrap: { width: 800 }
    }).setOrigin(0.5);

    this.imageSprite = this.add.image(width / 2, height / 2 - 80, "").setOrigin(0.5);

    // Indicator (Page 1/3)
    this.indicatorText = this.add.text(width / 2, height - 120, "", {
      fontSize: "18px",
      fill: "#888888"
    }).setOrigin(0.5);

    // Buttons
    this.prevButton = this.createButton(width / 2 - 150, height - 60, "Précédent", () => this.prevPage());
    this.nextButton = this.createButton(width / 2 + 150, height - 60, "Suivant", () => this.nextPage());
    
    // Skip Button (Top Right)
    this.skipButton = this.createButton(width - 120, 60, "Passer", () => this.finishTutorial(), "#555555", "#888888");

    this.renderPage();
  }

  createButton(x, y, text, callback, bgColor = "#0066aa", hoverColor = "#0099ff") {
    const btn = this.add.text(x, y, text, {
      fontSize: "24px",
      fill: "#ffffff",
      backgroundColor: bgColor,
      padding: { x: 20, y: 10 },
      align: "center",
      borderRadius: 5
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerover', () => btn.setStyle({ backgroundColor: hoverColor }))
    .on('pointerout', () => btn.setStyle({ backgroundColor: bgColor }))
    .on('pointerdown', callback);

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

    this.indicatorText.setText(`Page ${this.currentPageIndex + 1} / ${this.pages.length}`);

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
