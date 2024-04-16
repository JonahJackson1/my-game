import Entity from "./entity.js";

export default class Player extends Entity {
  colors = {
    backgroundColor: "#3ca4be",
  };
  keys = new Set();

  constructor(game) {
    super(game.canvas);
    this.canvas = game.canvas;
    this.playerObj = {
      name: "Jonah",
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
      width: 50,
      height: 50,
      color: this.colors.backgroundColor,
      dx: 1,
      dy: 1,
      speed: 5,
    };

    // Handler object with trap functions fo
    const handler = {
      get: (player, property, receiver) => {
        return Reflect.get(player, property, receiver);
      },
      set: (player, property, value, receiver) => {
        Reflect.set(player, property, value, receiver);
        this.updatePlayerEntity();
        return true; // Indicate success
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
  }

  createUserEvent(event) {
    const userEvent = new CustomEvent("user", { detail: event });
    window.dispatchEvent(userEvent);
  }

  updatePlayerEntity() {
    this.clearEntity(this.player);
    this.drawEntity(this.player);
  }
}
