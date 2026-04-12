// Manages enemy creation and behavior
export class EnemyManager {
  constructor(scene) {
    this.scene = scene;
  }

  createEnemyRelative(x, heightAboveFloor, range, speed, name, type = "patrol", aggroRange = 300) {
    const { scene } = this;
    const y = scene.floorY - heightAboveFloor;
    const enemy = scene.enemies.create(x, y, "enemy");
    enemy.setScale(0.2).setDepth(3);
    enemy.name = name;
    // Resize physics body manually
    enemy.body.setSize(enemy.width * 0.3, enemy.height * 0.3);
    enemy.setCollideWorldBounds(false); // IMPORTANT
    enemy.setBounce(0);
    enemy.body.setAllowGravity(false);
    enemy.speed = speed;
    enemy.direction = 1;
    scene.physics.add.collider(enemy, scene.platforms);
    // ---- Patrol range (enemy platform width = 500)
    const patrolWidth = range;
    enemy.minX = x - patrolWidth / 2 + 30; // left edge limit
    enemy.maxX = x + patrolWidth / 2 - 30; // right edge limit
    enemy.type = type;
    enemy.aggroRange = aggroRange;
    return enemy;
  }
  // Increase speed of a specific enemy by name
  increaseEnemySpeedByName(name, amount = 20) {
    this.scene.enemies.children.iterate((enemy) => {
      if (!enemy) return;
      if (enemy.name === name) {
        enemy.speed += amount;
      }
    });
  }

  duplicateEnemyByName(originalName, newName) {
    const enemies = this.scene.enemies.getChildren();
    const original = enemies.find((e) => e.name === originalName);
    if (!original) return;

    const heightAboveFloor = this.scene.floorY - original.y;

    // Create enemy at same center position
    const newEnemy = this.createEnemyRelative(
      original.x, // use SAME center
      heightAboveFloor,
      original.maxX - original.minX,
      original.speed,
      newName,
    );

    // 🔥 Copy exact patrol limits
    newEnemy.minX = original.minX;
    newEnemy.maxX = original.maxX;

    // 🔥 Small visual offset ONLY on position (not range)
    newEnemy.x += 170;

    return newEnemy;
  }

  update() {
    this.scene.enemies.children.iterate((enemy) => {
      if (!enemy) return;

      if (enemy.type === "follower" && this.scene.player) {
        const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.scene.player.x, this.scene.player.y);
        if (dist < enemy.aggroRange) {
          const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.scene.player.x, this.scene.player.y);
          enemy.setVelocityX(Math.cos(angle) * enemy.speed);
          enemy.setVelocityY(Math.sin(angle) * enemy.speed);
          enemy.setFlipX(Math.cos(angle) < 0);
          return;
        }
      }

      enemy.setVelocityX(enemy.speed * enemy.direction);
      enemy.setVelocityY(0);
      
      // If a patrolling enemy hits a wall/another enemy, reverse immediately
      if (enemy.body.touching.left && enemy.direction === -1) {
        enemy.direction = 1;
      } else if (enemy.body.touching.right && enemy.direction === 1) {
        enemy.direction = -1;
      }

      // Flip sprite visually
      enemy.setFlipX(enemy.direction < 0);
      // Patrol logic
      if (enemy.x >= enemy.maxX) {
        enemy.direction = -1;
      }
      if (enemy.x <= enemy.minX) {
        enemy.direction = 1;
      }
    });
  }

  // New method to handle stomp logic
  checkStomp(player, enemy) {
    // 1. Check if player is falling (positive Y velocity)
    // 2. Check if player's bottom is roughly above the enemy's center
    const isFalling = player.body.velocity.y > 0;
    const isAbove = player.y < enemy.y - enemy.displayHeight / 2;

    if (isFalling && isAbove) {
      // --- STOMP SUCCESSFUL ---

      // Bounce the player up
      player.setVelocityY(-300);

      // Play a sound if you have one
      // this.scene.sound.play("stompSfx");

      // Remove the enemy
      enemy.destroy();

      return true; // Enemy was killed
    }

    return false; // Enemy was not killed
  }

  handleCollision(player, enemy) {
    // Check if the player successfully stomped the enemy first
    if (this.checkStomp(player, enemy)) {
      return; // Exit the function so the player doesn't die
    }

    this.triggerDeath("⚠️ You were caught by an enemy!");
  }

  triggerDeath(message = "⚠️ You died!") {
    // --- STANDARD DEATH LOGIC ---
    if (this.scene.popupOpen) return;

    if (this.scene.playerController.sfx.run.isPlaying) {
      this.scene.playerController.sfx.run.stop();
    }

    this.scene.sound.play("deathSfx", { volume: 0.6 });
    this.scene.popupOpen = true;
    this.scene.physics.pause();

    // Clear feedback and set message
    document.getElementById("modal-feedback").innerText = "";
    document.getElementById("modal-question").innerText = message;

    const container = document.getElementById("modal-answers");
    container.innerHTML = "";

    const okBtn = document.createElement("button");
    okBtn.innerText = "OK";
    okBtn.className = "answer-btn";
    okBtn.onclick = () => {
      this.scene.modal.closeModal();
      this.scene.playerController.loseLife();
      if (this.scene.StatsService) this.scene.StatsService.addLevelAttempt();
      this.scene.playerController.respawn();

      // Resume physics when the user clicks OK
      this.scene.physics.resume();
    };

    container.appendChild(okBtn);
    document.getElementById("modal").style.display = "flex";
  }
}
