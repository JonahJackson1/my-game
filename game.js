export default class Game {
  inputRateLimitMs = 100;
  colors = {
    backgroundColor: "#1a1a1a",
  };
  lastFrameTime = performance.now(); // Timestamp of the last frame
  frameInterval = 1000 / 60; // Target frame rate (60 FPS)
  entities = [];

  constructor() {
    this.root = document.getElementById("root");
    this.canvas = document.createElement("canvas");
    this.root.appendChild(this.canvas);

    this.setGameCanvasSize();
    this.drawCanvas();

    // Start the game loop
    this.gameLoop();
  }

  addEntity(entity) {
    this.entities.push(entity);
  }

  gameLoop() {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastFrameTime;

    // Only update and redraw entities if enough time has passed
    if (deltaTime >= this.frameInterval) {
      // Clear the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Update and redraw each entity
      this.entities.forEach((entity) => {
        entity.update(deltaTime);
        entity.draw(entity);
      });

      // Store the current time for the next frame
      this.lastFrameTime = currentTime;
    }

    // Request the next animation frame
    requestAnimationFrame(this.gameLoop.bind(this));
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
