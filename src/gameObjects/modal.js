// Responsible for all on‑screen popups and menus
export class ModalUI {
  constructor(scene) {
    this.scene = scene;
    this.tumorUI = null;
    this.tumorSolved = false;
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

    // Standard behavior: Pause game and block scope
    this.scene.popupOpen = true;
    this.scene.physics.pause();

    const cam = this.scene.cameras.main;
    this.tumorUI = this.scene.add
      .container(cam.width / 2, cam.height / 2)
      .setDepth(1000);

    // 1. Dark Background Overlay (keeps scope disabled)
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

    // 2. Open the Link immediately
    const width = 800;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    this.tumorWindow = window.open(
      "https://histologielv.umontpellier.fr/index.php?module=detail&vue=6&itm=199&lame=451&g=1&d=2",
      "TumorInfo",
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes`,
    );

    // 3. Prepare Button - Content depends on status
    const isSolved = this.tumorSolved; // Check your flag
    const label = isSolved ? "CLOSE VIEW" : "START DIAGNOSIS";
    const btnColor = isSolved ? 0x4caf50 : 0x1e90ff; // Green if solved, Blue if not

    this.diagnoseButton = this.scene.add
      .rectangle(0, 0, 220, 60, btnColor)
      .setInteractive({ useHandCursor: true });

    const btnText = this.scene.add
      .text(0, 0, label, {
        fontSize: "22px",
        fill: "#fff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // 4. Button Logic
    this.diagnoseButton.on("pointerdown", () => {
      this.closeTumorMenu();
      const scope = this.scene.currentScope;
      if (scope) {
        // Disable physics + interaction
        scope.disableBody(true, true);
        // Optional: visual feedback (fade out)
        scope.setAlpha(0.3);
        // Re-enable after 3 seconds
        this.scene.time.delayedCall(3000, () => {
          scope.enableBody(false, scope.x, scope.y, true, true);
          scope.setAlpha(1);
        });
      }

      // Only open QCM if it hasn't been solved yet
      if (!isSolved) {
        this.openQCM("q_tumor");
      }
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
      q_tumor: {
        q: "What is the pattern of this tumor ?",
        a: [
          "Myxoid",
          "Spindle cell",
          "Round cell",
          "Pleomorphic",
          "Epithelioid",
        ],
        c: [1],
        feedbacks: [
          {
            text: "Too loose stroma.",
            img: "../assets/tumeur.jpg",
          },
          {
            text: "Elongated cells = spindle.",
            img: "../assets/tumeur.jpg",
          },
          { text: "Round cells absent." },
          { text: "No marked pleomorphism." },
          { text: "No polygonal cells." },
        ],
      },

      q2: {
        q: "What is the architectural pattern of this tumor ?",
        a: ["Plexiform", "Fascicular", "Storiform", "Lobulated", "Whorled"],
        c: [1],
        feedbacks: [
          { text: "No network-like growth." },
          { text: "Bundles of cells." },
          { text: "No cartwheel pattern." },
          { text: "Not lobulated." },
          { text: "No circular arrangement." },
        ],
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
        c: [3], // you can change to [3,4] if needed
        feedbacks: [
          { text: "Cells dominate here." },
          { text: "Not schwannian." },
          { text: "Matrix not gelatinous." },
          { text: "Notice vessels." },
          { text: "Look again." },
        ],
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
        c: [2, 3, 4], // 🔥 MULTIPLE correct answers
        feedbacks: [
          { text: "No abrupt necrosis." },
          { text: "Not hyaline type." },
          { text: "Yes — single cell necrosis." },
          { text: "Yes — mitoses present." },
          { text: "Yes — atypia visible." },
        ],
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
        c: [0],
        feedbacks: [
          { text: "Correct! Smooth muscle.", img: "../assets/tumeur.jpg" },
          { text: "No striations." },
          { text: "No S100 pattern." },
          { text: "No endothelial lining." },
          { text: "Look again." },
        ],
      },

      q6: {
        q: "Which immunohistochemical study (panel) would you propose?",
        a: ["pan-Cytokeratin", "Melan-A", "H-caldesmon", "Desmin", "Myogenin"],
        c: [2, 3], // 🔥 MULTIPLE answers
        feedbacks: [
          { text: "CK is negative." },
          { text: "Melan-A irrelevant." },
          { text: "Correct! Smooth muscle marker." },
          { text: "Correct! Muscle marker." },
          { text: "Myogenin negative." },
        ],
      },

      q7: {
        q: "The immunohistochemical study showed positivity for desmin and H-caldesmon. Melan-A and myogenin are negative. What diagnosis do you retain?",
        a: [
          "Fibrosarcoma",
          "Melanoma",
          "Leiomyoma",
          "Leiomyosarcoma",
          "Solitary fibrous tumor",
        ],
        c: [3],
        feedbacks: [
          { text: "Markers don’t match." },
          { text: "Melan-A negative." },
          { text: "Benign? No atypia says otherwise." },
          {
            text: "Malignant smooth muscle tumor.",
            img: "../assets/tumeur.jpg",
          },
          { text: "Not SFT." },
        ],
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
        // Disable all buttons immediately
        const buttons = container.querySelectorAll("button");
        buttons.forEach((btn) => (btn.style.pointerEvents = "none"));

        const isCorrect = Array.isArray(data.c)
          ? data.c.includes(i)
          : i === data.c;

        const fb = data.feedbacks ? data.feedbacks[i] : null;

        const feedbackImg = document.getElementById("modal-image");

        // 🧠 Show feedback TEXT
        feedback.innerText =
          fb?.text || (isCorrect ? "Correct!" : "Incorrect!");

        // 🖼️ Show feedback IMAGE (if exists)
        if (fb?.img) {
          feedbackImg.src = fb.img;
          feedbackImg.style.display = "block";
        } else {
          feedbackImg.style.display = "none";
        }

        if (isCorrect) {
          // ✅ CORRECT
          this.sfx.correct.play();

          b.classList.add("correct-choice");
          b.style.background = "#dcfce7";
          b.style.color = "#15803d";

          feedback.style.color = "#166534";

          // Score update
          this.scene.correctcount += 20;
          this.scene.progressBar.width = this.scene.correctcount;

          // 🔥 MULTIPLE ANSWERS SUPPORT
          if (!this.selectedCorrect) this.selectedCorrect = new Set();
          this.selectedCorrect.add(i);

          // If ALL correct answers selected → success
          if (this.selectedCorrect.size === data.c.length) {
            this.scene.time.delayedCall(2500, () => {
              this.handleSuccess(id);
              this.closeModal();
              this.selectedCorrect = null;
            });
          } else {
            // allow user to continue selecting remaining answers
            buttons.forEach((btn) => (btn.style.pointerEvents = "auto"));
          }
        } else {
          // ❌ WRONG
          this.sfx.wrong.play();

          b.style.background = "#fee2e2";
          b.style.color = "#b91c1c";

          feedback.style.color = "#ed9f18";

          this.scene.time.delayedCall(2500, () => {
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
    const scope = this.scene.currentScope;
    if (id === "q_tumor") {
      this.tumorSolved = true; // Set tumor solved flag
    }
    // 🎯 Special case: tumor_v
    if (id === "q_tumor") {
      if (scope) {
        // Disable physics + interaction
        scope.disableBody(true, true);
        // Optional: visual feedback (fade out)
        scope.setAlpha(0.3);
        // Re-enable after 3 seconds
        this.scene.time.delayedCall(3000, () => {
          scope.enableBody(false, scope.x, scope.y, true, true);
          scope.setAlpha(1);
        });
      }
    } else {
      // Default behavior → destroy scope
      if (scope) scope.destroy();
    }
    // ✅ Platform logic stays unchanged
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
      <img id="modal-image" style="max-width:200px; margin:10px auto; display:none;" />
      <div id="modal-answers"></div>
      <div id="modal-message"></div>
    </div>
  `;
    document.body.appendChild(modal);
  }
}
//checkpoint pp
