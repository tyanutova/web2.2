export default class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
  }

  draw(game) {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.drawBackground(game);
    this.drawPlatforms(game);
    this.drawCoins(game);
    this.drawHazards(game);
    this.drawGoal(game);
    this.drawPlayer(game.player);

    if (game.state !== "running") {
      this.drawOverlay(game);
    }
  }

  drawBackground(game) {
    const { ctx, canvas } = this;
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, "#f6d7b0");
    grad.addColorStop(1, "#fef7ea");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    for (let i = 0; i < 6; i += 1) {
      const x = (i * 160 + (game.time * 20) % canvas.width) % canvas.width;
      ctx.beginPath();
      ctx.ellipse(x, 90 + i * 12, 90, 30, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawPlatforms(game) {
    const { ctx } = this;
    ctx.fillStyle = "#1f6f8b";
    for (const platform of game.platforms) {
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      ctx.fillStyle = "#f8e8d3";
      ctx.fillRect(platform.x, platform.y, platform.width, 6);
      ctx.fillStyle = "#1f6f8b";
    }
  }

  drawCoins(game) {
    const { ctx } = this;
    for (const coin of game.coins) {
      if (coin.collected) continue;
      ctx.beginPath();
      ctx.fillStyle = "#f4a261";
      ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#7a3e00";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  drawHazards(game) {
    const { ctx } = this;
    ctx.fillStyle = "#e63946";
    for (const hazard of game.hazards) {
      ctx.beginPath();
      ctx.moveTo(hazard.x, hazard.y + hazard.height);
      ctx.lineTo(hazard.x + hazard.width / 2, hazard.y);
      ctx.lineTo(hazard.x + hazard.width, hazard.y + hazard.height);
      ctx.closePath();
      ctx.fill();
    }
  }

  drawGoal(game) {
    const { ctx } = this;
    const goal = game.goal;
    if (!goal) return;
    ctx.fillStyle = "#2a9d8f";
    ctx.fillRect(goal.x, goal.y, goal.width, goal.height);
    ctx.fillStyle = "#264653";
    ctx.fillRect(goal.x, goal.y, 6, goal.height);
  }

  drawPlayer(player) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
    ctx.scale(player.direction, 1);

    ctx.fillStyle = "#264653";
    ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);

    ctx.fillStyle = "#f4f1de";
    ctx.fillRect(-player.width / 2 + 6, -player.height / 2 + 6, player.width - 12, player.height - 16);

    const step = Math.sin(player.walkTime * 6) * 6;
    ctx.strokeStyle = "#1d3557";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-10, player.height / 2 - 8);
    ctx.lineTo(-10 + step, player.height / 2 + 6);
    ctx.moveTo(10, player.height / 2 - 8);
    ctx.lineTo(10 - step, player.height / 2 + 6);
    ctx.stroke();

    ctx.restore();
  }

  drawOverlay(game) {
    const { ctx, canvas } = this;
    ctx.fillStyle = "rgba(29, 29, 29, 0.45)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.font = "600 30px 'Space Grotesk', sans-serif";

    if (game.state === "menu") ctx.fillText("Нажмите Старт", canvas.width / 2, canvas.height / 2);
    if (game.state === "paused") ctx.fillText("Пауза", canvas.width / 2, canvas.height / 2);
    if (game.state === "won") ctx.fillText("Уровень пройден!", canvas.width / 2, canvas.height / 2);
    if (game.state === "lost") ctx.fillText("Игра окончена", canvas.width / 2, canvas.height / 2);
  }
}
