class Game {
  constructor() {
    this.root = document.getElementById("root");
    this.canvas = document.createElement("canvas");
    this.root.appendChild(this.canvas);

    this.setGameCanvasSize();
    this.drawCanvas();

    this.createPlayerEntity();
    this.drawPlayer();

    this.createEntities();
    this.drawEntities();

    window.addEventListener("keyup", this.listenToKeyUp.bind(this));
    window.addEventListener("keydown", this.listenToKeyDown.bind(this));
    window.addEventListener("user", this.listenToUserEvent.bind(this));
  }

  listenToKeyUp(e) {
    this.keys.delete(e.key);
  }

  listenToKeyDown(e) {
    if (this.keys.has(e.key)) return console.log("pressed this key already");
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
    this.drawPlayer();
  }

  createUserEvent(event) {
    const userEvent = new CustomEvent("user", { detail: event });
    window.dispatchEvent(userEvent);
  }

  inputRateLimitMs = 100;
  entities = {};
  keys = new Set();
  colors = {
    backgroundColor: "#1a1a1a",
    playerColor: "#3ca4be",
  };

  setGameCanvasSize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  drawCanvas() {
    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = this.colors.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  createEntities() {}

  drawEntities() {
    Object.keys(this.entities).forEach((entityId) => {
      this.drawEntity(entityId);
    });
  }

  updateEntityPos(entity) {
    const clearX = Math.floor(entity.x - speed - 1);
    const clearY = Math.floor(entity.y - speed - 1);
    const clearWidth = entity.width + speed * 2 + 2;
    const clearHeight = entity.height + speed * 2 + 2;
    this.ctx.clearRect(clearX, clearY, clearWidth, clearHeight);
  }

  drawEntity(entityId) {
    const entity = this.entities[entityId];
    this.ctx.fillStyle = entity.color;
    this.ctx.fillRect(entity.x, entity.y, entity.width, entity.height);
  }

  createPlayerEntity() {
    this.player = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
      width: 50,
      height: 50,
      color: this.colors.playerColor,
      dx: 1,
      dy: 1,
      speed: 5,
    };
  }

  drawPlayer() {
    const player = this.player;
    this.ctx.fillStyle = player.color;
    this.ctx.fillRect(player.x, player.y, player.width, player.height);
  }

  updatePlayerEntity() {
    const player = this.player;
    const clearX = Math.floor(player.x - player.speed - 1);
    const clearY = Math.floor(player.y - player.speed - 1);
    const clearWidth = player.width + player.speed * 2 + 2;
    const clearHeight = player.height + player.speed * 2 + 2;
    this.ctx.clearRect(clearX, clearY, clearWidth, clearHeight);
    this.drawPlayer();
  }

  respondToUserKeyPress(e) {
    const player = this.player;

    switch (e.key) {
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
    this.drawPlayer();
  }

  respondToViewportChanges() {
    this.setGameCanvasSize();
    this.drawCanvas();
    this.drawEntities();
  }
}

const game = new Game();

function randomId() {
  return Math.trunc(Math.random() * 999999);
}

/* 
 <script>
  // Target object
  const target = {
    name: "Alice",
    age: 30,
  };

  // Handler object with trap functions
  const handler = {
    get(target, property, receiver) {
      console.log(`Getting ${property}`);
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      console.log(`Setting ${property} to ${value}`);
      return Reflect.set(target, property, value, receiver);
    },
  };

  // Create a reactive proxy
  const proxy = new Proxy(target, handler);

  // Accessing a property triggers the "get" trap function
  console.log(proxy.name); // Output: Getting name

  // Modifying a property triggers the "set" trap function
  proxy.age = 35; // Output: Setting age to 35
</script>

*/
