export default class Player {
  constructor(start) {
    this.width = 36;
    this.height = 48;
    this.reset(start);
  }

  reset(start) {
    this.x = start.x;
    this.y = start.y;
    this.vx = 0;
    this.vy = 0;
    this.onGround = false;
    this.direction = 1;
    this.walkTime = 0;
  }

  applyInput(input, dt, config) {
    const left = input.isDown("a") || input.isDown("arrowleft");
    const right = input.isDown("d") || input.isDown("arrowright");
    const jump = input.isDown("w") || input.isDown(" ");

    if (left) {
      this.vx -= config.accel * dt;
      this.direction = -1;
    }
    if (right) {
      this.vx += config.accel * dt;
      this.direction = 1;
    }

    if (!left && !right) {
      this.vx *= config.friction;
      if (Math.abs(this.vx) < 0.02) this.vx = 0;
    }

    if (jump && this.onGround) {
      this.vy = -config.jump;
      this.onGround = false;
    }
  }

  step(dt, config) {
    this.vy += config.gravity * dt;
    this.vx = Math.max(-config.maxSpeed, Math.min(config.maxSpeed, this.vx));
    this.walkTime += Math.abs(this.vx) * dt;
  }
}
