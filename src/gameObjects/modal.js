// Responsible for all on‑screen popups and menus
export class ModalUI {
  constructor(scene) {
    this.scene = scene;
    this.tumorUI = null;
  }

  showInfoMessage(message, autoClose = true, delay = 1500) {
    this.scene.popupOpen = true;
    this.scene.physics.pause();
    document.getElementById("modal-question").innerText = message;
    const container = document.getElementById("modal-answers");
    container.innerHTML = ""; // Optional OK button
    const okBtn = document.createElement("button");
    okBtn.innerText = "OK";
    okBtn.className = "answer-btn";
    okBtn.onclick = () => {
      this.closeModal();
    };
    container.appendChild(okBtn);
    document.getElementById("modal").style.display = "flex";
    if (autoClose) {
      this.scene.time.delayedCall(delay, () => {
        if (this.scene.popupOpen) this.closeModal();
      });
    }
  }

  openTumorMenu() {
    if (this.tumorCooldown || this.scene.popupOpen) return;
    this.scene.popupOpen = true;
    this.scene.physics.pause();

    const cam = this.scene.cameras.main;
    this.tumorUI = this.scene.add
      .container(cam.width / 2, cam.height / 2)
      .setDepth(1000);

    // 1. Dark Background Overlay
    const overlay = this.scene.add
      .rectangle(
        -cam.width / 2,
        -cam.height / 2,
        cam.width,
        cam.height,
        0x000000,
        0.7,
      )
      .setOrigin(0);

    // 2. Open the Link in a new window immediately
    const width = 800;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    this.tumorWindow = window.open(
      "https://histologielv.umontpellier.fr/index.php?module=detail&vue=6&itm=199&lame=451&g=1&d=2",
      "TumorInfo",
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes`,
    );

    // 3. The Diagnose Button (This is the only thing visible)
    this.diagnoseButton = this.scene.add
      .rectangle(0, 0, 220, 60, 0x1e90ff)
      .setInteractive({ useHandCursor: true });

    const btnText = this.scene.add
      .text(0, 0, "START DIAGNOSIS", {
        fontSize: "22px",
        fill: "#fff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.diagnoseButton.on("pointerdown", () => {
      this.closeTumorMenu();
      this.openQCM("q_tumor"); // Trigger the questions
    });

    this.tumorUI.add([overlay, this.diagnoseButton, btnText]);
  }
  closeTumorMenu() {
    if (!this.tumorUI) return;

    // Start 3-second cooldown to prevent getting "stuck"
    this.tumorCooldown = true;
    this.scene.time.delayedCall(3000, () => {
      this.tumorCooldown = false;
    });

    // Close the external link window if it's still open
    if (this.tumorWindow && !this.tumorWindow.closed) {
      this.tumorWindow.close();
    }

    this.tumorUI.destroy();
    this.tumorUI = null;
    this.scene.physics.resume();
    this.scene.popupOpen = false;
  }

  openQCM(id) {
    this.scene.popupOpen = true;
    this.scene.physics.pause();
    this.sfx = {
      correct: this.scene.sound.add("correctSfx", { volume: 0.5 }),
      wrong: this.scene.sound.add("wrongSfx", { volume: 0.5 }),
    };
    const questions = {
      // ... (your existing questions object)
      q1: {
        q: "What is the pattern of this tumor ?",
        a: [
          "Myxoid",
          "Spindle cell",
          "Round cell",
          "Pleomorphic",
          "Epithelioid",
        ],
        c: 1,
        fbc: "Exact. L’architecture tumorale décrit la façon dont les cellules sont organisées entre elles.",
        fbw: "Incorrect. L’architecture tumorale concerne l’organisation spatiale, pas la taille ou le grade.",
      },
      // ADD fbc and fbw to your other questions here so they show up!
      q2: {
        q: "What is the architectural pattern of this tumor ?",
        a: ["Plexiform", "Fascicular", "Storiform", "Lobulated", "Whorled"],
        c: 1,
        fbc: "Correct ! Le terme 'Nodulaire' vient de 'Nodule' (petit nœud/amas).",
        fbw: "Non. Rappelez-vous : amas arrondis = nodules.",
      },
      q3: {
        q: "Does this tumor present ?",
        a: [
          "Prominent inflammatory infiltrate",
          "Nuclear palisade",
          "Myxoid stroma",
          "Prominent or distinctive blood vessels",
          "Scant stroma",
        ],
        c: 4,
        fbc: "Exact. Les faisceaux cellulaires sont caractéristiques d’une architecture fasciculaire.",
        fbw: "Incorrect. Une organisation en faisceaux correspond à une architecture fasciculaire, et non nodulaire, infiltrante ou myxoïde.",
      },

      q4: {
        q: "Does this tumor present ?",
        a: [
          "Abrupt tumor necrosis",
          "Hyaline necrosis",
          "Individually necrotic cells",
          "Mitotic figures",
          "Nuclear atypia",
        ],
        c: 2,
        fbc: "Correct. Une tumeur infiltrante envahit progressivement les tissus voisins sans limites nettes.",
        fbw: "Incorrect. L’architecture infiltrante se définit par une invasion diffuse des tissus adjacents, et non par une organisation en faisceaux ou un stroma myxoïde.",
      },

      q5: {
        q: "What type of differentiation do you suggest ?",
        a: [
          "Smooth muscle differentiation",
          "Skeletal muscle (striated) differentiation",
          "Neural differentiation",
          "Vascular differentiation",
          "No obvious line of differentiation",
        ],
        c: 3,
        fbc: "Exact. Le terme myxoïde décrit un stroma abondant d’aspect gélatineux.",
        fbw: "Incorrect. Un stroma pâle, riche et gélatineux est typique d’une architecture myxoïde.",
      },
      q6: {
        q: "Which immunohistochemical study (panel) would you propose?",
        a: ["pan-Cytokeratin", "Melan-A", "H-caldesmon", "Desmin", "Myogenin"],
        c: 2,
        fbc: "Correct. Une tumeur infiltrante ne respecte pas les limites anatomiques normales.",
        fbw: "Faux. Une tumeur mal limitée qui envahit les tissus adjacents correspond à une architecture infiltrante.",
      },
      q_tumor: {
        q: "The immunohistochemical study showed positivity for desmin and H-caldesmon. Melan-A and myogenin are negative. What diagnosis do you retain?",
        a: [
          "Fibrosarcoma",
          "Melanoma",
          "Leiomyoma",
          "Leiomyosarcoma",
          "Solitary fibrous tumor",
        ],
        c: 1,
      },
    };
    const data = questions[id];
    const modal = document.getElementById("modal");
    const questionText = document.getElementById("modal-question");
    const container = document.getElementById("modal-answers");
    const feedback = document.getElementById("modal-feedback");

    // 1. Reset UI
    questionText.innerText = data.q;
    container.innerHTML = "";
    feedback.innerText = "";
    feedback.className = "feedback-area"; // For CSS styling

    // 2. Create Buttons
    data.a.forEach((ans, i) => {
      const b = document.createElement("button");
      b.innerText = ans;
      b.className = "answer-btn";

      b.onclick = () => {
        // Disable all buttons immediately so they can't click twice
        const buttons = container.querySelectorAll("button");
        buttons.forEach((btn) => (btn.style.pointerEvents = "none"));
        if (i === data.c) {
          // ✅ CORRECT LOGIC
          this.sfx.correct.play();
          this.scene.correctcount += 20; // Increment score
          this.scene.progressBar.width = this.scene.correctcount; // Update progress bar visually
          b.classList.add("correct-choice"); // Use CSS classes for cleaner code
          b.style.background = "#dcfce7";
          b.style.color = "#15803d";

          // Show Correct Feedback
          feedback.innerText = data.fbc || "Correct !";
          feedback.style.color = "#166534";

          this.scene.time.delayedCall(3000, () => {
            this.handleSuccess(id); // Move logic to a helper to keep it clean
            this.closeModal();
          });
        } else {
          // ❌ WRONG LOGIC
          this.sfx.wrong.play();
          b.style.background = "#fee2e2";
          b.style.color = "#b91c1c";

          // Show Wrong Feedback
          feedback.innerText = data.fbw || "Incorrect. Try again!";
          feedback.style.color = "#ed9f18";

          this.scene.time.delayedCall(3000, () => {
            this.closeModal();
            this.scene.playerController.respawn();
            this.scene.incorrectcount++;
            if (this.scene.incorrectcount == 1) {
              this.scene.enemyManager.increaseEnemySpeedByName("E1", 50);
              this.scene.enemyManager.increaseEnemySpeedByName("E5", 50);
            } else if (this.scene.incorrectcount == 2) {
              this.scene.enemyManager.duplicateEnemyByName("E1", "E5");
            } else if (this.scene.incorrectcount == 3) {
              this.scene.enemyManager.increaseEnemySpeedByName("E3", 50);
            } else if (this.scene.incorrectcount == 4) {
              this.scene.enemyManager.increaseEnemySpeedByName("E4", 50);
            }
          });
        }
      };
      container.appendChild(b);
    });

    modal.style.display = "flex";
  }

  // Helper to handle the platform movements
  handleSuccess(id) {
    if (this.scene.currentScope) this.scene.currentScope.destroy();

    const passPlatform = this.scene.platforms
      .getChildren()
      .find((p) => p.id === "pass");
    if (passPlatform && passPlatform.y !== this.scene.floorY - 190) {
      passPlatform.y -= 20;
      passPlatform.refreshBody();
    }

    if (id === "q6") {
      const voidPlatform = this.scene.platforms
        .getChildren()
        .find((p) => p.id === "void");
      if (voidPlatform) voidPlatform.destroy();
    }
  }

  closeModal() {
    document.getElementById("modal").style.display = "none";
    this.scene.physics.resume();
    this.scene.popupOpen = false;
  }

  createHTMLModal() {
    if (document.getElementById("modal")) return;
    const modal = document.createElement("div");
    modal.id = "modal";
    modal.innerHTML = `
    <div class="modal-content">
      <h2 id="modal-question"></h2>
      <div id="modal-feedback"></div>
      <div id="modal-answers"></div>
      <div id="modal-message"></div>
    </div>
  `;
    document.body.appendChild(modal);
  }
}
//checkpoint pp
