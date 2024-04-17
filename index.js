import Game from "./game.js";
import Player from "./player.js";

(function () {
  const game = new Game();
  const player = new Player();

  const playerObj = {
    name: "Jonah",
    x: game.canvas.width / 2,
    y: game.canvas.height / 2,
    width: 50,
    height: 50,
    color: player.colors.backgroundColor,
    speed: 5,
  };

  const playerHandler = {
    get: (target, property, receiver) => {
      return Reflect.get(target, property, receiver);
    },
    set: (target, property, value, receiver) => {
      Reflect.set(target, property, value, receiver);
      player.update(player.proxy);
      return true;
    },
  };

  player.proxy = new Proxy(playerObj, playerHandler);
  player.create({ entity: player.proxy, canvas: game.canvas });

  window.addEventListener("keyup", player.listenToKeyUp.bind(player));
  window.addEventListener("keydown", player.listenToKeyDown.bind(player));
  window.addEventListener(
    "movement",
    player.listenToMovementEvent.bind(player)
  );
})();
