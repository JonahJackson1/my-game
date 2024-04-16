export default class Game {
  inputRateLimitMs = 100;
  colors = {
    backgroundColor: "#1a1a1a",
  };

  constructor() {
    this.root = document.getElementById("root");
    this.canvas = document.createElement("canvas");
    this.root.appendChild(this.canvas);

    this.setGameCanvasSize();
    this.drawCanvas();
  }

  setGameCanvasSize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  drawCanvas() {
    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = this.colors.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  respondToViewportChanges() {
    this.setGameCanvasSize();
    this.drawCanvas();
  }
}
