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

  openTumorMenu(scope) {
    // Prevent spamming if a window is already open or in cooldown
    if (this.tumorCooldown || this.scene.popupOpen) return;

    const width = 800;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    // 1. Open the Link immediately
    this.tumorWindow = window.open(
      "https://tumourclassification.iarc.who.int/Viewer/Index2?fid=23191",
      "TumorInfo",
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes`,
    );

    // 2. Handle Cooldown & Logic
    // We disable the scope temporarily so the player doesn't trigger it 60 times a second
    if (scope) {
      this.tumorCooldown = true;
      scope.setAlpha(0.3); // Visual feedback that it's "used"

      // Disable physics body so they can walk past it
      scope.disableBody(true, false);

      // Re-enable after 3 seconds
      this.scene.time.delayedCall(3000, () => {
        this.tumorCooldown = false;
        scope.setAlpha(1);
        scope.enableBody(false, scope.x, scope.y, true, true);
      });
    }
  }

  closeTumorMenu() {
    // Since there is no in-game UI anymore, this just cleans up the window
    if (this.tumorWindow && !this.tumorWindow.closed) {
      this.tumorWindow.close();
    }
  }

  openQCM(id) {
    this.scene.popupOpen = true;
    // Safe stop within the modal
    if (this.scene.playerController?.sfx?.run?.isPlaying) {
      this.scene.playerController.sfx.run.stop();
    }
    this.scene.physics.pause();
    // Use a unique name for modal sounds so they don't overwrite player sounds
    this.modalSfx = {
      correct: this.scene.sound.add("correctSfx", { volume: 0.5 }),
      wrong: this.scene.sound.add("wrongSfx", { volume: 0.5 }),
    };
    this.scene.popupOpen = true;
    if (this.scene.playerController.sfx.run.isPlaying)
      this.scene.playerController.sfx.run.stop();
    this.scene.physics.pause();
    this.sfx = {
      correct: this.scene.sound.add("correctSfx", { volume: 0.5 }),
      wrong: this.scene.sound.add("wrongSfx", { volume: 0.5 }),
    };
    const questions = {
      q1: {
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
            text: "Oups! It is not a myxoid tumor. A myxoid tumor is caracterised by a gelatinous material produced by soft tissue cells. It resembles epithelial mucin, but is not as thick (looks like watered-down mucin – it is not as blue or stringy). This is a myxoid pattern : ",
            imgs: ["../assets/tumeurs/q1ra.jpg"],
          },
          {
            text: "True! It is a fusiform tumor.Fusiform (spindle) cells are elongated and have tapered (pointed) ends. Usually both the nucleus and cytoplasm are elongated, but the term still applies for cells with spindle-shaped cytoplasmic outline but rounded (or only slightly oval) nucleus.“Fusiform” is derived from the Latin “fusus” meaning “spindle” ",
            imgs: ["../assets/tumeurs/q1rb.jpg"],
          },
          {
            text: "Oups! It is not a round cell tumorA round cell tumor is caracterised by round cells with often uniform round nuclei and increased nuclear-cytoplasmic ratio",
            imgs: [],
          },
          {
            text: "Oups! It is not a pleomorphic tumor A Pleomorphic tumor cells is caracterised by marked variation in size and shape, often including very large and bizarre forms. ",
            imgs: [],
          },
          {
            text: "Oups! It is not an epithélioid tumor An epithélioid tumor is caracterised by cells resemble epithelial cells with a rounded or polygonal appearance and at least moderate amounts of cytoplasm qnd and well-defined cell borders. ",
            imgs: [],
          },
        ],
      },

      q2: {
        q: "What is the architectural pattern of this tumor ?",
        a: ["Plexiform", "Fascicular", "Storiform", "Lobulated", "Whorled"],
        c: [1],
        feedbacks: [
          {
            text: "Oups! It is not a plexiform pattern A plexiform pattern is characterised by an  interwoven network. It resembles plexus or a network or even a bag of worms",
            imgs: [
              "../assets/tumeurs/q2ra1.jpg",
              "../assets/tumeurs/q2ra2.jpg",
            ],
          },
          {
            text: "True! It is a fascicular pattern. A fascicular pattern is characterised byspindled cells arranged in long fascicles ",
            imgs: [],
          },
          {
            text: "Oups! It is not a storiform patternshort fascicles of spindle cells that intersect or intertwine at various angles thereby resembling the weaving of a doormat or starburst. ",
            imgs: ["../assets/tumeurs/q2rc.jpg", "../assets/tumeurs/q2rc2.jpg"],
          },
          {
            text: "Oups! It is not a lobulated patternA lobuled pattern is referring to an anatomic unit (as in breast lobule). A lobulated tumor is characterised by clusters or nodules with smooth (non-infiltrative) contour, often separated by fibrous bands or stroma conforming to or resembling normal anatomic structures. Sometimes used synonymously with nodular. ",
            imgs: ["../assets/tumeurs/q2rd.jpg"],
          },
          {
            text: "Oups! It is not a whorled patternA whorled pattern is characterised by a wirled arrangement of cells. ",
            imgs: ["../assets/tumeurs/q2re.jpg"],
          },
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
        c: [4],
        feedbacks: [
          {
            text: "Oups! There is not a prominent inflammatory infiltrate in this tumor  ",
            imgs: [],
          },
          {
            text: "Oups! There is not a nuclear palissading in this tumornuclear palissading is characterised by nuclei lining up in parallel arrays; resembling a picket fence. Etymology: French palissade, a fence of stakes. ",
            imgs: [
              "../assets/tumeurs/q3rb1.jpg",
              "../assets/tumeurs/q3rb2.jpg",
            ],
          },
          {
            text: "Oups! There is not a Myxoïd stroma in this tumorA myxoid stroma is caracterised by a gelatinous material produced by soft tissue cells. It resembles epithelial mucin, but is not as thick (looks like watered-down mucin – it is not as blue or stringy). This is a myxoid stroma in a low grade fibromyxoid sarcoma.",
            imgs: ["../assets/tumeurs/q3rc.jpg"],
          },
          {
            text: "Oups! There is not a prominent or distinctive  blood vessels in this tumor  ",
            imgs: [],
          },
          { text: "True! The stroma is scant ", imgs: [] },
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
        c: [2, 3, 4],
        feedbacks: [
          { text: "No abrupt necrosis.", imgs: [] },
          { text: "Not hyaline type.", imgs: [] },
          { text: "Yes — single cell necrosis.", imgs: [] },
          { text: "Yes — mitoses present.", imgs: [] },
          { text: "Yes — atypia visible.", imgs: [] },
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
          { text: "Correct! Smooth muscle.", imgs: [] },
          { text: "No striations.", imgs: [] },
          { text: "No S100 pattern.", imgs: [] },
          { text: "No endothelial lining.", imgs: [] },
          { text: "Look again.", imgs: [] },
        ],
      },

      q6: {
        q: "Which immunohistochemical study (panel) would you propose?",
        a: ["pan-Cytokeratin", "Melan-A", "H-caldesmon", "Desmin", "Myogenin"],
        c: [2, 3],
        feedbacks: [
          { text: "CK is negative.", imgs: [] },
          { text: "Melan-A irrelevant.", imgs: [] },
          { text: "Correct! Smooth muscle marker.", imgs: [] },
          { text: "Correct! Muscle marker.", imgs: [] },
          { text: "Myogenin negative.", imgs: [] },
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
          { text: "Markers don’t match.", imgs: [] },
          { text: "Melan-A negative.", imgs: [] },
          { text: "Benign? No atypia says otherwise.", imgs: [] },
          {
            text: "Malignant smooth muscle tumor.",
            imgs: [],
          },
          { text: "Not SFT.", imgs: [] },
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

        const feedbackImagesContainer =
          document.getElementById("feedback-images");

        // 🖼️ Show feedback IMAGES
        feedbackImagesContainer.innerHTML = ""; // clear previous

        if (fb?.imgs && fb.imgs.length > 0) {
          fb.imgs.forEach((imgPath) => {
            const img = document.createElement("img");
            img.src = imgPath;
            img.style.display = "block";
            img.style.maxWidth = "200px"; // optional styling
            img.style.margin = "5px";
            feedbackImagesContainer.appendChild(img);
          });
        } else {
          feedbackImagesContainer.innerHTML = ""; // nothing to show
        }

        if (isCorrect) {
          // ✅ CORRECT
          this.sfx.correct.play();

          b.classList.add("correct-choice");
          b.style.background = "#dcfce7";
          b.style.color = "#15803d";

          feedback.style.color = "#166534";

          // 🔥 MULTIPLE ANSWERS SUPPORT
          if (!this.selectedCorrect) this.selectedCorrect = new Set();
          this.selectedCorrect.add(i);

          // If ALL correct answers selected → success
          if (this.selectedCorrect.size === data.c.length) {
            this.scene.time.delayedCall(15000, () => {
              this.handleSuccess(id);
              this.closeModal();
              feedbackImagesContainer.innerHTML = ""; // nothing to show

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

          this.scene.time.delayedCall(15000, () => {
            this.closeModal();
            feedbackImagesContainer.innerHTML = ""; // nothing to show

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
          this.scene.StatsService.addIncorrect();
        }
      };
      container.appendChild(b);
    });

    modal.style.display = "flex";
  }

  // Helper to handle the platform movements
  handleSuccess(id) {
    this.scene.StatsService.addCorrect();
    // Score update
    this.scene.correctcount += 20;
    this.scene.progressBar.width = this.scene.correctcount;
 
    const scope = this.scene.currentScope;

    // Default behavior → destroy scope
    if (scope) {
      scope.destroy();
      this.scene.currentScope = null; // 🔥 important
    }
    // ✅ Platform logic stays unchanged
    const passPlatform = this.scene.platforms
      .getChildren()
      .find((p) => p.id === "pass");
    if (passPlatform && passPlatform.y !== this.scene.floorY - 190) {
      passPlatform.y -= 30;
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
      <div id="feedback-images" style="display:flex; flex-wrap:no-wrap; justify-content:center;"></div>
      <div id="modal-answers"></div>
      <div id="modal-message"></div>
    </div>
  `;
    document.body.appendChild(modal);
  }
}
//checkpoint pp
