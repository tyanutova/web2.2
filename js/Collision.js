export const Collision = {
  aabb(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  },

  resolveX(entity, platforms) {
    for (const platform of platforms) {
      if (!this.aabb(entity, platform)) continue;
      if (entity.vx > 0) {
        entity.x = platform.x - entity.width;
      } else if (entity.vx < 0) {
        entity.x = platform.x + platform.width;
      }
      entity.vx = 0;
    }
  },

  resolveY(entity, platforms) {
    entity.onGround = false;
    for (const platform of platforms) {
      if (!this.aabb(entity, platform)) continue;
      if (entity.vy > 0) {
        entity.y = platform.y - entity.height;
        entity.vy = 0;
        entity.onGround = true;
      } else if (entity.vy < 0) {
        entity.y = platform.y + platform.height;
        entity.vy = 0;
      }
    }
  }
};
