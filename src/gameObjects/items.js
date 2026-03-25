// Handles creation of collectible items and collision logic
export class ItemManager {
  constructor(scene) {
    this.scene = scene;
    this.items = scene.physics.add.staticGroup();
  }

  addScope(x, y, questionId, locked) {
    let scope = this.items.create(x, y, "scope");
    scope.setScale(0.2);
    scope.setDepth(2);
    scope.refreshBody();
    // resize physics body
    scope.body.setSize(scope.width * 0.05, scope.height * 0.15);
    scope.questionId = questionId;
    scope.locked = locked;
    return scope;
  }

  addScopeLoop(x, y, questionId, locked) {
    let scope = this.items.create(x, y, "golden");
    scope.setScale(0.2);
    scope.setDepth(2);
    scope.refreshBody();
    scope.body.setSize(scope.width * 0.05, scope.height * 0.15);
    scope.questionId = questionId;
    scope.locked = locked;
    return scope;
  }

  addLoupe(x, y) {
    let loupe = this.items.create(x, y, "loupe");
    loupe.setScale(0.2);
    loupe.setDepth(2);
    loupe.refreshBody();
    loupe.body.setSize(loupe.width * 0.05, loupe.height * 0.15);
    loupe.isLoupe = true;
    return loupe;
  }

  addScopeRelative(x, heightAboveFloor, questionId, locked) {
    const y = this.scene.floorY - heightAboveFloor;
    return this.addScope(x, y, questionId, locked);
  }

  addScopeLoopRelative(x, heightAboveFloor, questionId, locked) {
    const y = this.scene.floorY - heightAboveFloor;
    return this.addScopeLoop(x, y, questionId, locked);
  }

  addLoupeRelative(x, heightAboveFloor) {
    const y = this.scene.floorY - heightAboveFloor;
    return this.addLoupe(x, y);
  }

  handleItemCollision(player, item) {
    if (item.isLoupe) {
      // 1. Trigger the link/menu
      this.scene.modal.openTumorMenu(item);

      // 2. Disable collision immediately
      // (disable physics, do NOT hide the sprite)
      item.disableBody(true, false);
      item.setAlpha(0.5);

      // 3. Force re-enable after 3 seconds
      // We use this.scene.time to ensure the game clock handles the timer
      this.scene.time.delayedCall(
        3000,
        () => {
          // Check if the item still exists to prevent console errors
          if (item && item.scene) {
            item.enableBody(false, item.x, item.y, true, true);
            item.setAlpha(1);

            // Optional: Add a little 'ping' or scale effect so player knows it's back
            this.scene.tweens.add({
              targets: item,
              scale: 0.65,
              duration: 100,
              yoyo: true,
              onComplete: () => item.setScale(0.2),
            });
          }
        },
        [],
        this,
      ); // Pass 'this' as the callback context

      return;
    }

    // Logic: Standard Scopes
    this.scene.currentScope = item;
    this.scene.modal.openQCM(item.questionId);
  }
}
