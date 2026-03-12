import InputHandler from "./InputHandler.js";
import Game from "./Game.js";
import Renderer from "./Renderer.js";

const canvas = document.getElementById("game");
const ui = {
  score: document.getElementById("score"),
  level: document.getElementById("level"),
  coins: document.getElementById("coins"),
  health: document.getElementById("health"),
  time: document.getElementById("time")
};

const input = new InputHandler();
const game = new Game(canvas, input, ui);
const renderer = new Renderer(canvas);

let lastTime = performance.now();

function loop(now) {
  const dt = Math.min(0.032, (now - lastTime) / 1000);
  lastTime = now;

  game.update(dt);
  game.updateUI();
  renderer.draw(game);

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

const btnStart = document.getElementById("btnStart");
const btnPause = document.getElementById("btnPause");
const btnRestart = document.getElementById("btnRestart");

btnStart.addEventListener("click", () => game.start());
btnPause.addEventListener("click", () => game.togglePause());
btnRestart.addEventListener("click", () => game.restart());

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (key === "p") game.togglePause();
  if (key === "r") game.restart();
  if (key === "enter") game.start();
});
