import Player from "./Player.js";
import Platform from "./Platform.js";
import { Collision } from "./Collision.js";

export default class Game {
  constructor(canvas, input, ui) {
    this.canvas = canvas;
    this.input = input;
    this.ui = ui;
    this.state = "menu";
    this.levelIndex = 0;
    this.score = 0;
    this.health = 3;
    this.time = 0;
    this.levels = this.buildLevels();
    this.config = {
      gravity: 1800,
      accel: 1600,
      maxSpeed: 320,
      jump: 620,
      friction: 0.85
    };

    this.player = new Player(this.levels[0].start);
    this.loadLevel(0);
  }

  buildLevels() {
    return [
      {
        start: { x: 80, y: 360 },
        platforms: [
          [0, 500, 960, 40],
          [120, 410, 180, 20],
          [360, 360, 140, 20],
          [560, 320, 160, 20],
          [760, 260, 160, 20]
        ],
        coins: [
          [170, 380],
          [410, 330],
          [600, 290],
          [820, 230]
        ],
        hazards: [
          [460, 480, 60, 20]
        ],
        goal: [900, 200, 30, 120]
      },
      {
        start: { x: 40, y: 360 },
        platforms: [
          [0, 500, 960, 40],
          [100, 430, 140, 20],
          [280, 380, 140, 20],
          [480, 320, 160, 20],
          [700, 260, 160, 20],
          [420, 220, 120, 20]
        ],
        coins: [
          [130, 400],
          [310, 350],
          [520, 290],
          [740, 230],
          [470, 190]
        ],
        hazards: [
          [250, 480, 80, 20],
          [620, 480, 80, 20]
        ],
        goal: [900, 170, 30, 150]
      }
    ];
  }

  loadLevel(index) {
    const level = this.levels[index];
    this.platforms = level.platforms.map((p) => new Platform(...p));
    this.coins = level.coins.map(([x, y]) => ({ x, y, radius: 10, collected: false }));
    this.hazards = level.hazards.map(([x, y, width, height]) => ({ x, y, width, height }));
    const [gx, gy, gw, gh] = level.goal;
    this.goal = { x: gx, y: gy, width: gw, height: gh };
    this.player.reset(level.start);
    this.time = 0;
  }

  start() {
    if (this.state === "menu" || this.state === "paused") {
      this.state = "running";
    }
  }

  togglePause() {
    if (this.state === "running") this.state = "paused";
    else if (this.state === "paused") this.state = "running";
  }

  restart() {
    this.score = 0;
    this.health = 3;
    this.levelIndex = 0;
    this.loadLevel(0);
    this.state = "running";
  }

  nextLevel() {
    if (this.levelIndex < this.levels.length - 1) {
      this.levelIndex += 1;
      this.loadLevel(this.levelIndex);
      this.state = "running";
    } else {
      this.state = "won";
    }
  }

  update(dt) {
    if (this.state !== "running") return;

    this.time += dt;
    this.player.applyInput(this.input, dt, this.config);
    this.player.step(dt, this.config);

    this.player.x += this.player.vx * dt;
    Collision.resolveX(this.player, this.platforms);
    this.player.y += this.player.vy * dt;
    Collision.resolveY(this.player, this.platforms);

    this.handleCoins();
    this.handleHazards();
    this.handleGoal();
    this.keepPlayerInBounds();
  }

  handleCoins() {
    for (const coin of this.coins) {
      if (coin.collected) continue;
      const hit = Collision.aabb(
        this.player,
        { x: coin.x - coin.radius, y: coin.y - coin.radius, width: coin.radius * 2, height: coin.radius * 2 }
      );
      if (hit) {
        coin.collected = true;
        this.score += 100;
      }
    }
  }

  handleHazards() {
    for (const hazard of this.hazards) {
      if (Collision.aabb(this.player, hazard)) {
        this.health -= 1;
        this.player.vy = -400;
        this.player.vx = -this.player.direction * 200;
        this.player.y -= 10;
        if (this.health <= 0) {
          this.state = "lost";
        }
        return;
      }
    }
  }

  handleGoal() {
    if (this.goal && Collision.aabb(this.player, this.goal)) {
      this.score += 250;
      this.nextLevel();
    }
  }

  keepPlayerInBounds() {
    const { player, canvas } = this;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y > canvas.height + 200) {
      this.health = 0;
      this.state = "lost";
    }
  }

  updateUI() {
    this.ui.score.textContent = this.score;
    this.ui.level.textContent = this.levelIndex + 1;
    const collected = this.coins.filter((c) => c.collected).length;
    this.ui.coins.textContent = `${collected}/${this.coins.length}`;
    this.ui.health.textContent = this.health;
    this.ui.time.textContent = this.time.toFixed(1);
  }
}
