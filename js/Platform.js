export default class Platform {
  constructor(x, y, width, height, type = "solid") {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
  }
}
