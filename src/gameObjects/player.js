export class PlayerController {
  constructor(scene, spawnPoint = {}) {
    this.scene = scene;
    this.spawnX = spawnPoint.x ?? 100;
    this.spawnY = spawnPoint.y ?? 500;
    this.lives = 3;
    this.playerState = "idel";
    this.wasInAir = false;

    // 1. Asset Mapping: Keys must match your preload() labels
    const characterAssets = {
      man: {
        images: {
          idel: "idel_m",
          walk: "walk_m",
          jump: "jump_m",
          jumpOut: "jumpOut_m",
        },
        sfx: { jump: "jumpSfx", land: "landSfx", run: "runSfx" },
      },
      woman: {
        images: {
          idel: "idel",
          walk: "walk",
          jump: "jump",
          jumpOut: "jumpOut",
        },
        sfx: { jump: "jumpSfx", land: "landSfx", run: "runSfx" },
      },
    };
    // Get the character selection from the DOM (Ensure this is available when the script runs)
    const character = localStorage.getItem("character") || "man";

    if (!localStorage.getItem("character")) {
      console.warn("No character selected, defaulting to man.");
    }

    // Pick the active set based on selection (defaults to man if invalid key)
    this.currentAssets = characterAssets[character] || characterAssets.man;
  }

  create() {
    const scene = this.scene;
    // Create physics-enabled player using the selected idle texture
    scene.player = scene.physics.add.image(
      this.spawnX,
      this.spawnY,
      this.currentAssets.images.idel,
    );
    scene.player.setDepth(2);
    scene.player.setScale(0.4).setCollideWorldBounds(true);
    scene.player.body.setSize(60, 160);
    scene.physics.add.collider(scene.player, scene.platforms);

    // Display lives
    scene.livesText = scene.add
      .text(20, 20, "Lives: " + this.lives, {
        fontSize: "22px",
        fill: "#ffffff",
        fontStyle: "bold",
      })
      .setScrollFactor(0)
      .setDepth(2000);

    // Initialize gender-specific sound objects
    this.sfx = {
      jump: scene.sound.add(this.currentAssets.sfx.jump, { volume: 0.4 }),
      land: scene.sound.add(this.currentAssets.sfx.land, { volume: 0.3 }),
      run: scene.sound.add(this.currentAssets.sfx.run, {
        volume: 0.2,
        loop: true,
      }),
    };
  }

  respawn() {
    this.scene.player.setPosition(this.spawnX, this.spawnY);
    this.scene.player.setVelocity(0, 0);
  }

  setSpawnPoint(spawnPoint = {}) {
    if (typeof spawnPoint !== "object" || spawnPoint === null) return;
    this.spawnX = spawnPoint.x ?? this.spawnX;
    this.spawnY = spawnPoint.y ?? this.spawnY;
  }

  isOnElevatorPlatform() {
    const player = this.scene.player;
    if (!player?.body || !this.scene?.platforms) return false;

    const playerBottom = player.body.bottom;
    const playerCenterX = player.x;

    return this.scene.platforms.getChildren().some((platform) => {
      if (platform.moveMode !== "elevator") return false;
      const platformTop =
        platform.body?.top ?? platform.y - platform.displayHeight / 2;
      const platformLeft =
        platform.body?.left ?? platform.x - platform.displayWidth / 2;
      const platformRight =
        platform.body?.right ?? platform.x + platform.displayWidth / 2;
      const isHorizontallyOver =
        playerCenterX >= platformLeft && playerCenterX <= platformRight;
      const isVerticallyNear = Math.abs(playerBottom - platformTop) <= 12;
      return isHorizontallyOver && isVerticallyNear;
    });
  }

  loseLife() {
    this.lives--;
    this.scene.livesText.setText("Lives: " + this.lives);
    if (this.lives <= 0) {
      this.gameOver();
    }
  }

  gameOver() {
    const scene = this.scene;
    scene.physics.pause();
    scene.popupOpen = true;

    document.getElementById("modal-feedback").innerText = "";
    document.getElementById("modal-question").innerText =
      "💀 Game Over! You lost all lives.";

    const container = document.getElementById("modal-answers");
    container.innerHTML = "";

    const restartBtn = document.createElement("button");
    restartBtn.innerText = "Restart";
    restartBtn.className = "answer-btn";
    restartBtn.onclick = () => {
      document.getElementById("modal").style.display = "none";
      scene.popupOpen = false;
      scene.scene.restart();
    };
    container.appendChild(restartBtn);
    document.getElementById("modal").style.display = "flex";
  }

  setPlayerState(stateKey) {
    if (this.playerState === stateKey) return;
    this.playerState = stateKey;

    // Use the lookup table to switch to the correct gendered image
    const textureToSet = this.currentAssets.images[stateKey];
    this.scene.player.setTexture(textureToSet);
  }

  update(cursors) {
    if (this.scene.popupOpen) {
      if (this.sfx.run.isPlaying) this.sfx.run.stop();
      return;
    }

    const player = this.scene.player;
    const onGround =
      player.body.touching.down ||
      player.body.blocked.down ||
      this.isOnElevatorPlatform();
    let velocityX = 0;

    // 1. Movement Logic
    if (cursors.left.isDown) {
      velocityX = -250;
      player.setFlipX(true);
    } else if (cursors.right.isDown) {
      velocityX = 250;
      player.setFlipX(false);
    }
    player.setVelocityX(velocityX);

    // 2. Sound & Animation Logic
    if (!onGround) {
      // In the air: determine if jumping up or falling down
      this.setPlayerState(player.body.velocity.y < 0 ? "jump" : "jumpOut");
      this.wasInAir = true;

      if (this.sfx.run.isPlaying) this.sfx.run.stop();
    } else {
      // On the ground
      if (this.wasInAir) {
        this.sfx.land.play();
        this.wasInAir = false;
      }

      if (velocityX !== 0) {
        this.setPlayerState("walk");
        if (!this.sfx.run.isPlaying) this.sfx.run.play();
      } else {
        this.setPlayerState("idel");
        if (this.sfx.run.isPlaying) this.sfx.run.stop();
      }

      // Check for JUMPING
      if (cursors.space.isDown) {
        player.setVelocityY(-550);
        this.sfx.jump.play();
        if (this.sfx.run.isPlaying) this.sfx.run.stop();
      }
    }
  }
}
