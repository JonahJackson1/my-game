class Game {
  inputRateLimitMs = 100;
  entities = {};
  keys = new Set();
  colors = {
    canvas: {
      backgroundColor: "#1a1a1a",
    },
    player: {
      backgroundColor: "#3ca4be",
    },
  };

  constructor() {
    this.root = document.getElementById("root");
    this.canvas = document.createElement("canvas");
    this.root.appendChild(this.canvas);

    this.setGameCanvasSize();
    this.drawCanvas();

    this.playerObj = {
      name: "Jonah",
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
      width: 50,
      height: 50,
      color: this.colors.player.backgroundColor,
      dx: 1,
      dy: 1,
      speed: 5,
    };

    // Handler object with trap functions
    const handler = {
      get(player, property, receiver) {
        return Reflect.get(player, property, receiver);
      },
      set(player, property, value, receiver) {
        return Reflect.set(player, property, value, receiver);
      },
    };

    this.player = new Proxy(this.playerObj, handler);
    this.drawEntity(this.player);

    window.addEventListener("keyup", this.listenToKeyUp.bind(this));
    window.addEventListener("keydown", this.listenToKeyDown.bind(this));
    window.addEventListener("user", this.listenToUserEvent.bind(this));
  }

  listenToKeyUp(e) {
    this.keys.delete(e.key);
  }

  listenToKeyDown(e) {
    this.keys.add(e.key);
    this.createUserEvent({ keyPressed: e.key });
  }

  listenToUserEvent(e) {
    const player = this.player;
    const key = e.detail.keyPressed;

    switch (key) {
      case "ArrowUp":
        player.y -= player.speed;
        break;
      case "ArrowDown":
        player.y += player.speed;
        break;
      case "ArrowLeft":
        player.x -= player.speed;
        break;
      case "ArrowRight":
        player.x += player.speed;
        break;
    }

    this.updatePlayerEntity();
  }

  createUserEvent(event) {
    const userEvent = new CustomEvent("user", { detail: event });
    window.dispatchEvent(userEvent);
  }

  setGameCanvasSize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  drawCanvas() {
    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = this.colors.canvas.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawEntity(entity) {
    this.ctx.fillStyle = entity.color;
    this.ctx.fillRect(entity.x, entity.y, entity.width, entity.height);
  }

  clearEntity(entity) {
    const clearX = Math.floor(entity.x - entity.speed - 1);
    const clearY = Math.floor(entity.y - entity.speed - 1);
    const clearWidth = entity.width + entity.speed * 2 + 2;
    const clearHeight = entity.height + entity.speed * 2 + 2;
    this.ctx.clearRect(clearX, clearY, clearWidth, clearHeight);
  }

  updatePlayerEntity() {
    this.clearEntity(this.player);
    this.drawEntity(this.player);
  }

  respondToViewportChanges() {
    this.setGameCanvasSize();
    this.drawCanvas();
  }
}

const game = new Game();

function randomId() {
  return Math.trunc(Math.random() * 999999);
}
