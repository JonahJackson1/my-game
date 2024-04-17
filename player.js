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
        this.update(this.player);
        return true;
      },
    };

    this.player = new Proxy(this.playerObj, handler);
    this.draw(this.player);
  }

  listenToKeyUp(e) {
    this.keys.delete(e.key);
  }

  listenToKeyDown(e) {
    this.keys.add(e.key);
    this.createMovementEvent({ keyPressed: e.key });
  }

  listenToMovementEvent() {
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

  createMovementEvent(event) {
    const movementEvent = new CustomEvent("movement", { detail: event });
    window.dispatchEvent(movementEvent);
  }
}
