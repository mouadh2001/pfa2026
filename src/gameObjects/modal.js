// Responsible for all on‑screen popups and menus
export class ModalUI {
  constructor(scene) {
    this.scene = scene;
    this.tumorUI = null;
    this.tumorSolved = false;
    this.sfx = null;
    this.selectedCorrect = null;
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

    // Check if window is already open
    if (this.tumorWindow && !this.tumorWindow.closed) {
      this.tumorWindow.focus();
    } else {
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
    }

    // Completely freeze the game silently
    if (this.tumorWindow) {
      if (this.scene.StatsService) this.scene.StatsService.startObservationTimer();
      this.scene.popupOpen = true;
      this.scene.physics.pause();

      // Poll to see when the external window is closed
      const checkClosedTimer = setInterval(() => {
        if (this.tumorWindow.closed) {
          clearInterval(checkClosedTimer);
          if (this.scene.StatsService) this.scene.StatsService.stopObservationTimer();
          this.scene.physics.resume();
          this.scene.popupOpen = false;
        }
      }, 500); // Check every half-second
    }

    // 2. Handle Cooldown & Logic
    // We disable the scope temporarily so the player doesn't trigger it 60 times a second
    if (scope) {
      this.tumorCooldown = true;
      scope.setVisible(false); // Hide the loop completely

      // Disable physics body so they can walk past it
      scope.disableBody(true, false);

      // Re-enable after 3 seconds
      this.scene.time.delayedCall(3000, () => {
        this.tumorCooldown = false;
        scope.setVisible(true);
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

  openQCM(id, data) {
    if (this.scene.StatsService) this.scene.StatsService.startQuestion(id);
    this.scene.popupOpen = true;
    if (this.scene.playerController?.sfx?.run?.isPlaying) {
      this.scene.playerController.sfx.run.stop();
    }
    this.scene.physics.pause();

    if (!this.sfx) {
      this.sfx = {
        correct: this.scene.sound.add("correctSfx", { volume: 0.5 }),
        wrong: this.scene.sound.add("wrongSfx", { volume: 0.5 }),
      };
    }
    this.selectedCorrect = new Set();
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
          this.scene.StatsService.addCorrectSelection(id);

          // ✅ CORRECT
          this.sfx.correct.play();

          b.classList.add("correct-choice");
          b.style.background = "#dcfce7";
          b.style.color = "#15803d";

          feedback.style.color = "#166534";

          this.selectedCorrect.add(i);

          // If ALL correct answers selected → success
          if (this.selectedCorrect.size === data.c.length) {
            const closeBtn = document.createElement("button");
            closeBtn.innerText = "Close";
            closeBtn.className = "answer-btn";
            closeBtn.style.background = "#3b82f6";
            closeBtn.style.color = "#ffffff";
            closeBtn.style.marginTop = "20px";
            closeBtn.onclick = () => {
              this.scene.events.emit("qcm_success", id);
              this.closeModal();
              feedbackImagesContainer.innerHTML = ""; // nothing to show
              this.selectedCorrect = null;
            };
            container.appendChild(closeBtn);
          } else {
            // allow user to continue selecting remaining answers
            buttons.forEach((btn) => (btn.style.pointerEvents = "auto"));
          }
        } else {
          this.scene.StatsService.addIncorrectSelection(id);

          // ❌ WRONG
          this.sfx.wrong.play();

          b.style.background = "#fee2e2";
          b.style.color = "#b91c1c";

          feedback.style.color = "#ed9f18";

          const closeBtn = document.createElement("button");
          closeBtn.innerText = "Close";
          closeBtn.className = "answer-btn";
          closeBtn.style.background = "#3b82f6";
          closeBtn.style.color = "#ffffff";
          closeBtn.style.marginTop = "20px";
          closeBtn.onclick = () => {
            this.closeModal();
            feedbackImagesContainer.innerHTML = ""; // nothing to show
            this.scene.events.emit("qcm_wrong", id);
          };
          container.appendChild(closeBtn);
        }
      };
      container.appendChild(b);
    });

    modal.style.display = "flex";
  }

  closeModal() {
    const modal = document.getElementById("modal");
    if (modal) {
      modal.style.display = "none";
    }
    this.scene.physics.resume();
    this.scene.popupOpen = false;
    this.selectedCorrect = null;
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
    </div>
  `;
    document.body.appendChild(modal);
  }
}
//checkpoint pp
