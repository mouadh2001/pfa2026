// Utility functions for creating platforms and floor
export function createFloor(scene, x, y, width, height) {
  const rect = scene.add.rectangle(x, y, width, height, 0x000000, 0);
  rect.setDepth(0);
  scene.platforms.add(rect);
}

export function createPlatform(scene, x, y, width, height, id) {
  const platform = scene.platforms.create(x, y, "platforme");
  platform.displayWidth = width;
  platform.displayHeight = height;
  platform.setDisplaySize(width, height);
  platform.refreshBody(); // VERY IMPORTANT
  platform.setDepth(1);
  platform.id = id;
  return platform;
}

export function createPlatformRelative(
  scene,
  x,
  heightAboveFloor,
  width,
  height,
  id,
) {
  const y = scene.floorY - heightAboveFloor;
  return createPlatform(scene, x, y, width, height, id);
}

export function findPlatform(scene, id) {
  if (!scene?.platforms) return null;
  return (
    scene.platforms.getChildren().find((platform) => platform.id === id) || null
  );
}

export function raisePlatform(scene, id, targetHeightAboveFloor, step = 30) {
  const platform = findPlatform(scene, id);
  if (!platform) return false;

  const targetY = scene.floorY - targetHeightAboveFloor;
  if (platform.y <= targetY) return false;

  platform.y = Math.max(platform.y - step, targetY);
  platform.refreshBody();
  return true;
}

export function configureElevatorPlatform(scene, platform, movementConfig) {
  platform.moveMode = "elevator";
  platform.elevator = {
    minY: scene.floorY - movementConfig.maxHeightAboveFloor,
    maxY: scene.floorY - movementConfig.minHeightAboveFloor,
    speed: movementConfig.speed ?? 40,
    direction: movementConfig.startDirection === "down" ? 1 : -1,
  };

  if (platform.body?.setImmovable) {
    platform.body.setImmovable(true);
  }
  if (platform.body?.setAllowGravity) {
    platform.body.setAllowGravity(false);
  }
}

export function createPlatformFromConfig(scene, platformConfig) {
  const platform = createPlatformRelative(
    scene,
    platformConfig.x,
    platformConfig.y,
    platformConfig.width,
    platformConfig.height,
    platformConfig.id,
  );

  if (platformConfig.movement?.type === "elevator") {
    configureElevatorPlatform(scene, platform, platformConfig.movement);
  }

  return platform;
}

export function updatePlatformMovement(scene, delta) {
  if (!scene?.platforms) return;

  scene.platforms.getChildren().forEach((platform) => {
    if (platform.moveMode !== "elevator" || !platform.elevator) return;

    const elevator = platform.elevator;
    const targetY =
      platform.y + ((elevator.speed * delta) / 1000) * elevator.direction;

    if (targetY <= elevator.minY) {
      platform.y = elevator.minY;
      elevator.direction = 1;
    } else if (targetY >= elevator.maxY) {
      platform.y = elevator.maxY;
      elevator.direction = -1;
    } else {
      platform.y = targetY;
    }

    if (typeof platform.refreshBody === "function") {
      platform.refreshBody();
    }
  });
}
