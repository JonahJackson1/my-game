import Game from "./game.js";
import Player from "./player.js";

(function () {
  const game = new Game();
  const player = new Player(game);

  window.addEventListener("keyup", player.listenToKeyUp.bind(player));
  window.addEventListener("keydown", player.listenToKeyDown.bind(player));
  window.addEventListener(
    "movement",
    player.listenToMovementEvent.bind(player)
  );
})();
