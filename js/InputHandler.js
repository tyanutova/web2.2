export default class InputHandler {
  constructor() {
    this.keys = new Set();

    window.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();
      this.keys.add(key);
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(event.key)) {
        event.preventDefault();
      }
    });

    window.addEventListener("keyup", (event) => {
      const key = event.key.toLowerCase();
      this.keys.delete(key);
    });
  }

  isDown(key) {
    return this.keys.has(key);
  }

  clear() {
    this.keys.clear();
  }
}
