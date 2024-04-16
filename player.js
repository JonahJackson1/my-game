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
      speed: 5,
    };

    const handler = {
      get: (player, property, receiver) => {
        return Reflect.get(player, property, receiver);
      },
      set: (player, property, value, receiver) => {
        Reflect.set(player, property, value, receiver);
        this.updatePlayerEntity();
        return true;
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

  listenToUserEvent() {
    const player = this.player;
    let dx = 0;
    let dy = 0;

    if (this.keys.has("ArrowUp")) dy -= player.speed;
    if (this.keys.has("ArrowDown")) dy += player.speed;
    if (this.keys.has("ArrowLeft")) dx -= player.speed;
    if (this.keys.has("ArrowRight")) dx += player.speed;

    player.x += dx;
    player.y += dy;
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
